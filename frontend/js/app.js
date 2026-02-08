let currentProductId = null;

//Navegação
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`page-${page}`).classList.add('active');
        if (page === 'products') loadProducts();
        if (page === 'raw-materials') loadRawMaterials();
        if (page === 'producible') loadProducible();
    });
});

//Toast
function toast(msg, success = false) {
    const el = document.createElement('div');
    el.className = `toast ${success ? 'success' : ''}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// --- Produtos
async function loadProducts() {
    const tbody = document.getElementById('products-tbody');
    tbody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
    try {
        const list = await api.products.list();
        tbody.innerHTML = list.length === 0
            ? '<tr><td colspan="4">Nenhum produto cadastrado.</td></tr>'
            : list.map(p => `
                <tr>
                    <td>${escapeHtml(p.code)}</td>
                    <td>${escapeHtml(p.name)}</td>
                    <td>${formatPrice(p.price)}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="editProduct(${p.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id}, '${escapeHtml(p.name)}')">Excluir</button>
                    </td>
                </tr>
            `).join('');
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="4">Erro: ${e.message}</td></tr>`;
    }
}

function escapeHtml(s) {
    if (s == null) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
}

function formatPrice(n) {
    if (n == null) return '-';
    return Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatNumber(n) {
    if (n == null) return '-';
    return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

document.getElementById('btn-new-product').addEventListener('click', () => openProductModal());
document.getElementById('form-product').addEventListener('submit', saveProduct);

function openProductModal(product = null) {
    currentProductId = product?.id || null;
    document.getElementById('modal-product-title').textContent = product ? 'Editar Produto' : 'Novo Produto';
    document.getElementById('product-id').value = product?.id || '';
    document.getElementById('product-code').value = product?.code || '';
    document.getElementById('product-code').readOnly = !!product;
    document.getElementById('product-name').value = product?.name || '';
    document.getElementById('product-price').value = product?.price ?? '';
    document.getElementById('product-materials-section').style.display = product ? 'block' : 'none';
    if (product) loadProductMaterials(product.id);
    document.getElementById('modal-product').classList.add('active');
}

function editProduct(id) {
    api.products.get(id).then(openProductModal);
}

async function saveProduct(e) {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const body = {
        code: document.getElementById('product-code').value.trim(),
        name: document.getElementById('product-name').value.trim(),
        price: parseFloat(document.getElementById('product-price').value) || 0,
    };
    try {
        if (id) await api.products.update(id, body);
        else await api.products.create(body);
        toast('Produto salvo com sucesso!', true);
        closeModal('product');
        loadProducts();
    } catch (err) {
        toast(err.message);
    }
}

async function deleteProduct(id, name) {
    if (!confirm(`Excluir o produto "${name}"?`)) return;
    try {
        await api.products.delete(id);
        toast('Produto excluído.', true);
        loadProducts();
    } catch (err) {
        toast(err.message);
    }
}

// Matérias-primas associadas ao produto
async function loadProductMaterials(productId) {
    
    fetch('http://127.0.0.1:7242/ingest/51c24d0f-408a-4467-b234-11f06e9ffc5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:loadProductMaterials',message:'loadProductMaterials entry',data:{productId},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    const container = document.getElementById('product-materials-list');
    container.innerHTML = 'Carregando...';
    try {
        const materials = await api.productMaterials.list(productId);
        
        fetch('http://127.0.0.1:7242/ingest/51c24d0f-408a-4467-b234-11f06e9ffc5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:loadProductMaterials:success',message:'loadProductMaterials success',data:{productId,materialsCount:materials.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        container.innerHTML = materials.length === 0
            ? '<p class="empty-message">Nenhuma matéria-prima associada.</p>'
            : materials.map(m => `
                <div class="material-item" data-raw-id="${m.rawMaterialId}">
                    <div class="material-item-info">
                        <strong>${escapeHtml(m.rawMaterialCode)}</strong> - ${escapeHtml(m.rawMaterialName)}: ${formatNumber(m.requiredQuantity)}
                    </div>
                    <div class="material-item-actions">
                        <button class="btn btn-danger btn-sm" onclick="removeMaterial(${productId}, ${m.rawMaterialId})">Remover</button>
                    </div>
                </div>
            `).join('');
        fillRawMaterialSelect(productId, materials);
    } catch (err) {
    
        fetch('http://127.0.0.1:7242/ingest/51c24d0f-408a-4467-b234-11f06e9ffc5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:loadProductMaterials:catch',message:'loadProductMaterials error',data:{productId,errMessage:err.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});

        container.innerHTML = `<p class="empty-message">Erro: ${err.message}</p>`;
    }
}

function fillRawMaterialSelect(productId, currentMaterials) {
    const ids = new Set(currentMaterials.map(m => m.rawMaterialId));
    api.rawMaterials.list().then(list => {
        const select = document.getElementById('material-raw-select');
        select.innerHTML = '<option value="">Selecione...</option>' +
            list.filter(rm => !ids.has(rm.id)).map(rm =>
                `<option value="${rm.id}">${escapeHtml(rm.code)} - ${escapeHtml(rm.name)}</option>`
            ).join('');
    });
}

document.getElementById('btn-add-material').addEventListener('click', () => {
    const productId = currentProductId;
    if (!productId) return;
    const rawId = document.getElementById('material-raw-select').value;
    const qty = parseFloat(document.getElementById('material-qty').value);
    if (!rawId || !qty || qty <= 0) {
        toast('Selecione uma matéria-prima e informe a quantidade.');
        return;
    }
    api.productMaterials.add(productId, rawId, qty)
        .then(() => {
            toast('Matéria-prima associada.', true);
            loadProductMaterials(productId);
            document.getElementById('material-qty').value = '';
        })
        .catch(err => toast(err.message));
});

async function removeMaterial(productId, rawMaterialId) {
    if (!confirm('Remover esta associação?')) return;
    try {
        await api.productMaterials.remove(productId, rawMaterialId);
        toast('Associação removida.', true);
        loadProductMaterials(productId);
    } catch (err) {
        toast(err.message);
    }
}

// --- Matérias-primas (RF006) ---
async function loadRawMaterials() {
    const tbody = document.getElementById('raw-materials-tbody');
    tbody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
    try {
        const list = await api.rawMaterials.list();
        tbody.innerHTML = list.length === 0
            ? '<tr><td colspan="4">Nenhuma matéria-prima cadastrada.</td></tr>'
            : list.map(r => `
                <tr>
                    <td>${escapeHtml(r.code)}</td>
                    <td>${escapeHtml(r.name)}</td>
                    <td>${formatNumber(r.stockQuantity)}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="editRawMaterial(${r.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteRawMaterial(${r.id}, '${escapeHtml(r.name)}')">Excluir</button>
                    </td>
                </tr>
            `).join('');
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="4">Erro: ${e.message}</td></tr>`;
    }
}

document.getElementById('btn-new-raw-material').addEventListener('click', () => openRawMaterialModal());
document.getElementById('form-raw-material').addEventListener('submit', saveRawMaterial);

function openRawMaterialModal(raw = null) {
    document.getElementById('modal-raw-material-title').textContent = raw ? 'Editar Matéria-prima' : 'Nova Matéria-prima';
    document.getElementById('raw-material-id').value = raw?.id || '';
    document.getElementById('raw-material-code').value = raw?.code || '';
    document.getElementById('raw-material-name').value = raw?.name || '';
    document.getElementById('raw-material-stock').value = raw?.stockQuantity ?? '';
    document.getElementById('modal-raw-material').classList.add('active');
}

function editRawMaterial(id) {
    api.rawMaterials.get(id).then(openRawMaterialModal);
}

async function saveRawMaterial(e) {
    e.preventDefault();
    const id = document.getElementById('raw-material-id').value;
    const body = {
        code: document.getElementById('raw-material-code').value.trim(),
        name: document.getElementById('raw-material-name').value.trim(),
        stockQuantity: parseFloat(document.getElementById('raw-material-stock').value) || 0,
    };
    try {
        if (id) await api.rawMaterials.update(id, body);
        else await api.rawMaterials.create(body);
        toast('Matéria-prima salva com sucesso!', true);
        closeModal('raw-material');
        loadRawMaterials();
    } catch (err) {
        toast(err.message);
    }
}

async function deleteRawMaterial(id, name) {
    if (!confirm(`Excluir a matéria-prima "${name}"?`)) return;
    try {
        await api.rawMaterials.delete(id);
        toast('Matéria-prima excluída.', true);
        loadRawMaterials();
    } catch (err) {
        toast(err.message);
    }
}

// --- Produtos Produzíveis
async function loadProducible() {
   
    fetch('http://127.0.0.1:7242/ingest/51c24d0f-408a-4467-b234-11f06e9ffc5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:loadProducible',message:'loadProducible entry',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H3'})}).catch(()=>{});
    
    const tbody = document.getElementById('producible-tbody');
    const emptyEl = document.getElementById('producible-empty');
    tbody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
    emptyEl.style.display = 'none';
    try {
        const [producible, rawMaterials] = await Promise.all([
            api.products.producible(),
            api.rawMaterials.list(),
        ]);
        
        fetch('http://127.0.0.1:7242/ingest/51c24d0f-408a-4467-b234-11f06e9ffc5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:loadProducible:afterFetch',message:'loadProducible after producible+rawMaterials',data:{producibleCount:producible.length,rawCount:rawMaterials.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H3'})}).catch(()=>{});
        
        const stockMap = Object.fromEntries(rawMaterials.map(r => [r.id, Number(r.stockQuantity)]));

        const withQty = await Promise.all(producible.map(async (p) => {
            const materials = await api.productMaterials.list(p.id);
            if (materials.length === 0) return { ...p, maxQuantity: Infinity };
            const minQty = Math.min(...materials.map(m => {
                const stock = stockMap[m.rawMaterialId] || 0;
                const req = Number(m.requiredQuantity);
                return req > 0 ? Math.floor(stock / req) : Infinity;
            }));
            return { ...p, maxQuantity: minQty };
        }));

        tbody.innerHTML = withQty.length === 0
            ? ''
            : withQty.map(p => `
                <tr>
                    <td>${escapeHtml(p.code)}</td>
                    <td>${escapeHtml(p.name)}</td>
                    <td>${formatPrice(p.price)}</td>
                    <td>${p.maxQuantity === Infinity ? '-' : formatNumber(p.maxQuantity)}</td>
                </tr>
            `).join('');
        emptyEl.style.display = withQty.length === 0 ? 'block' : 'none';
    } catch (e) {
        
        fetch('http://127.0.0.1:7242/ingest/51c24d0f-408a-4467-b234-11f06e9ffc5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.js:loadProducible:catch',message:'loadProducible error',data:{errMessage:e.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H3'})}).catch(()=>{});
        // #endregion
        tbody.innerHTML = `<tr><td colspan="4">Erro: ${e.message}</td></tr>`;
    }
}

document.getElementById('btn-refresh-producible').addEventListener('click', loadProducible);

// Modais
function closeModal(name) {
    document.getElementById(`modal-${name}`).classList.remove('active');
    currentProductId = null;
}

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modal));
});
document.querySelectorAll('.modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) modal.classList.remove('active');
        currentProductId = null;
    });
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            currentProductId = null;
        }
    });
});

// Inicialização
loadProducts();
