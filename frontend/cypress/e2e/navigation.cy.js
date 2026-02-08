describe('Navegação', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('exibe a página inicial com produtos', () => {
    cy.contains('Factory Inventory').should('be.visible');
    cy.contains('Cadastro de Produtos').should('be.visible');
    cy.get('#page-products').should('have.class', 'active');
    cy.get('[data-page="products"]').should('have.class', 'active');
  });

  it('navega para matérias-primas', () => {
    cy.get('[data-page="raw-materials"]').click();
    cy.contains('Cadastro de Matérias-primas').should('be.visible');
    cy.get('#page-raw-materials').should('have.class', 'active');
    cy.get('[data-page="raw-materials"]').should('have.class', 'active');
  });

  it('navega para produtos produzíveis', () => {
    cy.get('[data-page="producible"]').click();
    cy.contains('Produtos Produzíveis com Estoque Atual').should('be.visible');
    cy.get('#page-producible').should('have.class', 'active');
    cy.get('[data-page="producible"]').should('have.class', 'active');
  });

  it('retorna para produtos ao clicar em Produtos', () => {
    cy.get('[data-page="raw-materials"]').click();
    cy.get('[data-page="products"]').click();
    cy.contains('Cadastro de Produtos').should('be.visible');
    cy.get('#page-products').should('have.class', 'active');
  });
});
