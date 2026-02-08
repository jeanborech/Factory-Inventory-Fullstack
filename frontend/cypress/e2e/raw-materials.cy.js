describe('RF006 - Matérias-primas', () => {
  const unique = () => `RM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-page="raw-materials"]').click();
  });

  it('exibe a tela de matérias-primas e permite criar uma nova', () => {
    cy.contains('Cadastro de Matérias-primas').should('be.visible');
    cy.get('#btn-new-raw-material').click();
    cy.get('#modal-raw-material').should('be.visible');
    cy.get('#modal-raw-material-title').should('contain', 'Nova Matéria-prima');

    const code = unique();
    cy.get('#raw-material-code').type(code);
    cy.get('#raw-material-name').type('Aço Inox');
    cy.get('#raw-material-stock').type('100.5');
    cy.get('#form-raw-material').submit();

    cy.get('#modal-raw-material').should('not.be.visible');
    cy.contains(code).should('be.visible');
    cy.contains('Aço Inox').should('be.visible');
    cy.contains('100,50').should('be.visible');
  });

  it('permite editar uma matéria-prima existente', () => {
    cy.get('#btn-new-raw-material').click();
    const code = unique();
    cy.get('#raw-material-code').type(code);
    cy.get('#raw-material-name').type('Cobre Original');
    cy.get('#raw-material-stock').type('50');
    cy.get('#form-raw-material').submit();

    cy.contains(code).parents('tr').find('button').first().click();
    cy.get('#modal-raw-material').should('be.visible');
    cy.get('#modal-raw-material-title').should('contain', 'Editar Matéria-prima');
    cy.get('#raw-material-name').clear().type('Cobre Editado');
    cy.get('#raw-material-stock').clear().type('75.25');
    cy.get('#form-raw-material').submit();

    cy.contains('Cobre Editado').should('be.visible');
    cy.contains('75,25').should('be.visible');
  });

  it('permite excluir uma matéria-prima', () => {
    cy.get('#btn-new-raw-material').click();
    const code = unique();
    cy.get('#raw-material-code').type(code);
    cy.get('#raw-material-name').type('Matéria para Excluir');
    cy.get('#raw-material-stock').type('10');
    cy.get('#form-raw-material').submit();

    cy.contains(code).should('be.visible');
    cy.on('window:confirm', () => true);
    cy.contains('Matéria para Excluir').parents('tr').find('.btn-danger').click();
    cy.contains(code).should('not.exist');
  });

  it('exibe mensagem amigável ao tentar criar matéria-prima com código duplicado', () => {
    cy.get('#btn-new-raw-material').click();
    const code = unique();
    cy.get('#raw-material-code').type(code);
    cy.get('#raw-material-name').type('Primeira Matéria');
    cy.get('#raw-material-stock').type('100');
    cy.get('#form-raw-material').submit();

    cy.get('#modal-raw-material').should('not.be.visible');

    cy.get('#btn-new-raw-material').click();
    cy.get('#raw-material-code').type(code);
    cy.get('#raw-material-name').type('Matéria Duplicada');
    cy.get('#raw-material-stock').type('200');
    cy.get('#form-raw-material').submit();

    cy.get('.toast').should('be.visible').and('contain', 'Já existe uma matéria-prima com este código');
  });
});
