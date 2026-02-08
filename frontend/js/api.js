const API_BASE = 'http://localhost:8080/api';

async function request(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

    fetch('http://127.0.0.1:7242/ingest/51c24d0f-408a-4467-b234-11f06e9ffc5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:request',message:'API request',data:{url:fullUrl},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H4'})}).catch(()=>{});
    // #endregion
    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));

        fetch('http://127.0.0.1:7242/ingest/51c24d0f-408a-4467-b234-11f06e9ffc5f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:request:error',message:'API error response',data:{url:fullUrl,status:res.status,errMessage:err.message,errDetails:err.details},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H2,H4'})}).catch(()=>{});
        
        let msg = err.message || err.details || 'Erro na requisição';
        const detailsStr = (err.details || '').toLowerCase();
        if (/unique|duplicate|constraint|dataintegrityviolation/.test(detailsStr)) {
            msg = fullUrl.includes('/raw-materials')
                ? 'Já existe uma matéria-prima com este código.'
                : 'Já existe um produto com este código.';
        }
        throw new Error(msg);
    }
    const text = await res.text();
    if (res.status === 204 || !text) return null;
    return JSON.parse(text);
}

const api = {
    // Produtos
    products: {
        list: () => request('/products'),
        get: (id) => request(`/products/${id}`),
        create: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
        update: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
        delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
        producible: () => request('/products/producible'),
    },
    // Matérias-primas
    rawMaterials: {
        list: () => request('/raw-materials'),
        get: (id) => request(`/raw-materials/${id}`),
        create: (body) => request('/raw-materials', { method: 'POST', body: JSON.stringify(body) }),
        update: (id, body) => request(`/raw-materials/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
        delete: (id) => request(`/raw-materials/${id}`, { method: 'DELETE' }),
    },
    // Associações produto ↔ matéria-prima
    productMaterials: {
        list: (productId) => request(`/products/${productId}/materials`),
        add: (productId, rawMaterialId, requiredQuantity) =>
            request(`/products/${productId}/materials?rawMaterialId=${rawMaterialId}&requiredQuantity=${requiredQuantity}`, { method: 'POST' }),
        update: (productId, rawMaterialId, requiredQuantity) =>
            request(`/products/${productId}/materials?rawMaterialId=${rawMaterialId}&requiredQuantity=${requiredQuantity}`, { method: 'PUT' }),
        remove: (productId, rawMaterialId) =>
            request(`/products/${productId}/materials?rawMaterialId=${rawMaterialId}`, { method: 'DELETE' }),
    },
};
