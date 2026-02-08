# Regras do Cursor - Factory Inventory

## Objetivo
Manter o projeto bem documentado e consistente. Sempre que houver mudanças no código, banco, endpoints ou testes, atualizar a documentação automaticamente.

## Idioma e nomenclatura
- TODO o código (Java), API (URLs), banco (tabelas/colunas), variáveis, DTOs e comentários no código: **INGLÊS**.
- Documentação (README, docs, comentários em markdown): **Português (PT-BR)**.
- Evitar misturar idiomas no mesmo arquivo (exceção: trechos de código em inglês).

## Documentação obrigatória
Ao criar/alterar qualquer feature:
1) Atualizar `README.md`:
   - Como rodar o backend e o frontend
   - Variáveis de ambiente/config
   - Como rodar migrations
   - Como rodar testes
   - Link do Swagger
2) Atualizar `.cursor/rules/docs/architecture.md` (backend) e `docs/frontend.md` (frontend):
   - Estrutura de pacotes/arquivos
   - Principais decisões técnicas
3) Atualizar `.cursor/rules/docs/api.md`:
   - Endpoints, exemplos de request/response
   - Códigos de erro e validações
4) Atualizar `.cursor/rules/docs/database.md`:
   - Tabelas/colunas
   - Relacionamentos
   - Observações de constraints

## Padrões de implementação
- Usar Flyway para mudanças no banco. Não usar ddl-auto=create/update.
- Services devem conter regras de negócio; Controllers só orquestram.
- Validar entradas com Bean Validation.
- Retornar erros com payload consistente (padronizar um ErrorResponse).

## Testes
- Para cada regra de negócio em Service: criar unit test (Mockito).
- Para cada endpoint: criar teste de Controller (MockMvc).
- Sempre que um bug for corrigido: criar teste que falhava antes.

## Checklist automático ao final de cada alteração
- [ ] Compila
- [ ] `mvn test` passa
- [ ] Swagger atualizado
- [ ] README e docs atualizados
