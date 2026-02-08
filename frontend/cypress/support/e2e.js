Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar erros não capturados que não afetam os testes
  return false;
});
