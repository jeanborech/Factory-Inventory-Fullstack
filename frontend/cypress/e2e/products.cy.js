describe('RF005 - Produtos', () => {
  const unique = () => `PRD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-page="products"]').click();
  });

  it('exibe a tela de produtos e permite criar um novo produto', () => {
    cy.contains('Cadastro de Produtos').should('be.visible');
    cy.get('#btn-new-product').click();
    cy.get('#modal-product').should('be.visible');
    cy.get('#modal-product-title').should('contain', 'Novo Produto');

    const code = unique();
    cy.get('#product-code').type(code);
    cy.get('#product-name').type('Produto Teste');
    cy.get('#product-price').type('15.99');
    cy.get('#form-product').submit();

    cy.get('#modal-product').should('not.be.visible');
    cy.contains(code).should('be.visible');
    cy.contains('Produto Teste').should('be.visible');
    cy.contains('R$').should('be.visible');
  });

  it('permite editar um produto existente', () => {
    cy.get('#btn-new-product').click();
    const code = unique();
    cy.get('#product-code').type(code);
    cy.get('#product-name').type('Produto Original');
    cy.get('#product-price').type('10');
    cy.get('#form-product').submit();

    cy.contains(code).parents('tr').find('button').first().click();
    cy.get('#modal-product').should('be.visible');
    cy.get('#modal-product-title').should('contain', 'Editar Produto');
    cy.get('#product-name').clear().type('Produto Editado');
    cy.get('#product-price').clear().type('25.50');
    cy.get('#form-product').submit();

    cy.contains('Produto Editado').should('be.visible');
    cy.contains('R$ 25,50').should('be.visible');
  });

  it('permite excluir um produto', () => {
    cy.get('#btn-new-product').click();
    const code = unique();
    cy.get('#product-code').type(code);
    cy.get('#product-name').type('Produto para Excluir');
    cy.get('#product-price').type('5');
    cy.get('#form-product').submit();

    cy.contains(code).should('be.visible');
    cy.on('window:confirm', () => true);
    cy.contains('Produto para Excluir').parents('tr').find('.btn-danger').click();
    cy.contains(code).should('not.exist');
  });

  it('exibe mensagem amigável ao tentar criar produto com código duplicado', () => {
    cy.get('#btn-new-product').click();
    const code = unique();
    cy.get('#product-code').type(code);
    cy.get('#product-name').type('Primeiro Produto');
    cy.get('#product-price').type('10');
    cy.get('#form-product').submit();

    cy.get('#modal-product').should('not.be.visible');

    cy.get('#btn-new-product').click();
    cy.get('#product-code').type(code);
    cy.get('#product-name').type('Produto Duplicado');
    cy.get('#product-price').type('20');
    cy.get('#form-product').submit();

    cy.get('.toast').should('be.visible').and('contain', 'Já existe um produto com este código');
  });

  it('exibe mensagem quando não há produtos cadastrados', () => {
    cy.get('table tbody').then(($tbody) => {
      if ($tbody.find('tr').length === 1 && $tbody.text().includes('Nenhum')) {
        cy.contains('Nenhum produto cadastrado').should('be.visible');
      }
    });
  });
});
