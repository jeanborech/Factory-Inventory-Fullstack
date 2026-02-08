describe('RF007 - Associação matérias-primas ao produto', () => {
  const uniqueProduct = () => `PRD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const uniqueRaw = () => `RM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const selectRawMaterialByCode = (rawCode) => {
    cy.get('#material-raw-select')
      .should('be.visible')
      .find('option')
      .contains(rawCode)
      .then(($opt) => {
        const rawId = $opt.val();
        expect(rawId, 'raw material option value (id)').to.not.be.empty;
        cy.get('#material-raw-select').select(rawId);
      });
  };

  it('permite associar matéria-prima ao produto ao editar', () => {
    cy.visit('/');

    // cria matéria-prima
    cy.get('[data-page="raw-materials"]').click();
    cy.get('#page-raw-materials').should('be.visible');

    cy.get('#btn-new-raw-material').click();
    const rawCode = uniqueRaw();

    cy.get('#form-raw-material').should('be.visible').within(() => {
      cy.get('#raw-material-code').type(rawCode);
      cy.get('#raw-material-name').type('Matéria para Produto');
      cy.get('#raw-material-stock').clear().type('500');
      cy.root().submit();
    });

    cy.contains('#page-raw-materials tr', rawCode, { timeout: 15000 }).should('be.visible');

    // cria produto
    cy.get('[data-page="products"]').click();
    cy.get('#page-products').should('be.visible');

    cy.get('#btn-new-product').click();
    const prodCode = uniqueProduct();

    cy.get('#form-product').should('be.visible').within(() => {
      cy.get('#product-code').type(prodCode);
      cy.get('#product-name').type('Produto com Matéria');
      cy.get('#product-price').clear().type('99.99');
      cy.root().submit();
    });

    cy.contains('#page-products tr', prodCode, { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        cy.get('button').first().click(); // abre editar (modal)
      });

    // garante seção de associação visível
    cy.get('#product-materials-section').should('be.visible');
    cy.get('#product-materials-list').should('be.visible');

    // intercepta chamada de add
    cy.intercept('POST', '**/api/products/*/materials*').as('addMaterial');

    // seleciona a matéria-prima certa (pelo rawCode) e adiciona
    cy.get('#material-raw-select option').should('have.length.at.least', 2);
    selectRawMaterialByCode(rawCode);

    cy.get('#material-qty').clear().type('10');
    cy.get('#btn-add-material').click();

    // espera backend confirmar
    cy.wait('@addMaterial').its('response.statusCode').should('be.oneOf', [200, 201, 204]);

    cy.get('#product-materials-section').should('be.visible').within(() => {
      cy.get('.material-item', { timeout: 15000 }).should('have.length.at.least', 1);
      cy.contains(rawCode).should('be.visible');
      cy.contains('Matéria para Produto').should('be.visible');
    });
  });

  it('permite remover associação de matéria-prima do produto', () => {
    cy.visit('/');

    // cria matéria-prima
    cy.get('[data-page="raw-materials"]').click();
    cy.get('#page-raw-materials').should('be.visible');

    cy.get('#btn-new-raw-material').click();
    const rawCode = uniqueRaw();

    cy.get('#form-raw-material').should('be.visible').within(() => {
      cy.get('#raw-material-code').type(rawCode);
      cy.get('#raw-material-name').type('Matéria para Remover');
      cy.get('#raw-material-stock').clear().type('100');
      cy.root().submit();
    });

    cy.contains('#page-raw-materials tr', rawCode, { timeout: 15000 }).should('be.visible');

    // cria produto
    cy.get('[data-page="products"]').click();
    cy.get('#page-products').should('be.visible');

    cy.get('#btn-new-product').click();
    const prodCode = uniqueProduct();

    cy.get('#form-product').should('be.visible').within(() => {
      cy.get('#product-code').type(prodCode);
      cy.get('#product-name').type('Produto com Matéria Removida');
      cy.get('#product-price').clear().type('50');
      cy.root().submit();
    });

    // abre editar (modal)
    cy.contains('#page-products tr', prodCode, { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        cy.get('button').first().click();
      });

    cy.get('#product-materials-section').should('be.visible');

    // adiciona associação primeiro
    cy.intercept('POST', '**/api/products/*/materials*').as('addMaterial');

    cy.get('#material-raw-select option').should('have.length.at.least', 2);
    selectRawMaterialByCode(rawCode);

    cy.get('#material-qty').clear().type('5');
    cy.get('#btn-add-material').click();

    cy.wait('@addMaterial').its('response.statusCode').should('be.oneOf', [200, 201, 204]);

    // remove associação
    cy.intercept('DELETE', '**/api/products/*/materials*').as('removeMaterial');
    cy.on('window:confirm', () => true);

    cy.get('#product-materials-section').should('be.visible').within(() => {
      cy.get('.material-item', { timeout: 15000 }).should('have.length.at.least', 1);
      cy.get('.material-item-actions .btn-danger').first().click();
    });

    cy.wait('@removeMaterial').its('response.statusCode').should('be.oneOf', [200, 204]);

    // valida mensagem de vazio
    cy.get('#product-materials-section').should('be.visible').within(() => {
      cy.contains('Nenhuma matéria-prima associada').should('be.visible');
    });
  });
});
