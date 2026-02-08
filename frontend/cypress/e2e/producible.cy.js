describe('RF008 - Produtos Produzíveis', () => {
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

  beforeEach(() => {
    cy.visit('/');
  });

  it('exibe a tela de produtos produzíveis', () => {
    cy.get('[data-page="producible"]').click();
    cy.get('#page-producible').should('be.visible');
    cy.contains('#page-producible', 'Produtos Produzíveis com Estoque Atual').should('be.visible');
    cy.get('#producible-tbody').should('exist');
  });

  it('lista produtos produzíveis com estoque suficiente', () => {

    // cria matéria-prima
    cy.get('[data-page="raw-materials"]').click();
    cy.get('#page-raw-materials').should('be.visible');

    cy.get('#btn-new-raw-material').should('be.visible').click();
    const rawCode = uniqueRaw();

    cy.get('#form-raw-material').should('be.visible').within(() => {
      cy.get('#raw-material-code').should('be.visible').type(rawCode);
      cy.get('#raw-material-name').should('be.visible').type('Matéria com Estoque');
      cy.get('#raw-material-stock').should('be.visible').clear().type('1000');
      cy.root().submit();
    });

    cy.contains('#page-raw-materials tr', rawCode, { timeout: 15000 }).should('be.visible');

    // cria produto
    cy.get('[data-page="products"]').click();
    cy.get('#page-products').should('be.visible');

    cy.get('#btn-new-product').should('be.visible').click();
    const prodCode = uniqueProduct();

    cy.get('#form-product').should('be.visible').within(() => {
      cy.get('#product-code').should('be.visible').type(prodCode);
      cy.get('#product-name').should('be.visible').type('Produto Produzível');
      cy.get('#product-price').should('be.visible').clear().type('19.90');
      cy.root().submit();
    });

    // abre modal de editar pelo TR do produto recém criado
    cy.contains('#page-products tr', prodCode, { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        cy.get('button').first().click();
      });

    // associa matéria-prima no produto
    cy.intercept('POST', '**/api/products/*/materials*').as('addMaterial');

    cy.get('#modal-product').should('be.visible').within(() => {
      cy.get('#material-raw-select').should('be.visible');
      cy.get('#material-raw-select option').should('have.length.at.least', 2);

      // seleciona pela opção que contém o rawCode (value = rm.id)
      selectRawMaterialByCode(rawCode);

      cy.get('#material-qty').should('be.visible').clear().type('10');
      cy.get('#btn-add-material').should('be.visible').click();
    });

    // espera o backend confirmar a associação
    cy.wait('@addMaterial').its('response.statusCode').should('be.oneOf', [200, 201, 204]);

    // garante que a associação apareceu na UI (após reload interno)
    cy.get('#modal-product').should('be.visible').within(() => {
      cy.get('.material-item', { timeout: 15000 }).should('have.length.at.least', 1);
      cy.contains(rawCode).should('be.visible');
    });

    // fecha modal
    cy.get('#modal-product .modal-close').click();
    cy.get('#modal-product').should('not.be.visible');

    // vai para "produzíveis" e força refresh (esperando resposta)
    cy.intercept('GET', '**/api/products/producible').as('getProducible');

    cy.get('[data-page="producible"]').click();
    cy.get('#page-producible').should('be.visible');

    cy.get('#btn-refresh-producible').should('be.visible').click();
    cy.wait('@getProducible');

    // espera sair do estado de carregamento 
    cy.contains('#producible-tbody', 'Carregando...').should('not.exist');

    // valida que o produto aparece
    cy.contains('#page-producible', prodCode, { timeout: 15000 }).should('be.visible');
    cy.contains('#page-producible', 'Produto Produzível').should('be.visible');
    cy.get('#producible-tbody tr').should('have.length.at.least', 1);
  });

  it('botão Atualizar recarrega a lista', () => {
    cy.intercept('GET', '**/api/products/producible').as('getProducible');

    cy.get('[data-page="producible"]').click();
    cy.get('#page-producible').should('be.visible');

    cy.get('#btn-refresh-producible').should('be.visible').click();
    cy.wait('@getProducible');

    cy.get('#producible-tbody').should('exist');
    cy.contains('#producible-tbody', 'Carregando...').should('not.exist');
  });
});
