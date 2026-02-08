# Frontend - Factory Inventory

Interface gráfica em HTML, CSS e JavaScript para controle de produtos e matérias-primas.

## Estrutura do código

```
frontend/
├── index.html           # Página principal, navegação e modais
├── css/
│   └── styles.css       # Estilos da aplicação
├── js/
│   ├── api.js           # Cliente HTTP da API
│   └── app.js           # Lógica da aplicação
├── cypress/
│   ├── e2e/             # Testes de integração
│   │   ├── navigation.cy.js
│   │   ├── products.cy.js
│   │   ├── raw-materials.cy.js
│   │   ├── product-materials.cy.js
│   │   └── producible.cy.js
│   └── support/
│       └── e2e.js       # Suporte Cypress
├── cypress.config.js    # Configuração Cypress
├── package.json
└── README.md
```

## Decisões técnicas principais

- **Stack**: HTML5, CSS3, JavaScript (sem frameworks).
- **Comunicação**: `fetch` para requisições REST; base URL configurável em `api.js`.
- **Servidor estático**: `serve` (via `npx serve`) para desenvolvimento local.
- **CORS**: Backend configurado para aceitar requisições de `http://localhost:*` e `http://127.0.0.1:*`.

## Mapeamento de requisitos funcionais

| RF  | Descrição | Implementação |
|-----|-----------|---------------|
| RF005 | CRUD Produtos | Tela "Produtos" — listar, criar, editar, excluir |
| RF006 | CRUD Matérias-primas | Tela "Matérias-primas" — listar, criar, editar, excluir |
| RF007 | Associação matérias-primas ↔ produtos | Modal de edição de produto — adicionar/remover matérias-primas e quantidades |
| RF008 | Produtos produzíveis com quantidades | Tela "Produtos Produzíveis" — listar produtos e quantidade máxima produzível com estoque atual |

## Componentes principais

### api.js
- `API_BASE`: URL base da API (`http://localhost:8080/api`).
- `request(url, options)`: Função genérica de requisição HTTP.
- `api`: Objeto com métodos para produtos, matérias-primas e associações.
- Tratamento de erros: mensagens amigáveis para violação de unicidade (código duplicado).

### app.js
- Navegação entre telas (Produtos, Matérias-primas, Produtos Produzíveis).
- CRUD de produtos e matérias-primas.
- Gerenciamento de matérias-primas associadas a produtos.
- Cálculo de quantidade máxima produzível por produto.

### index.html
- Header com navegação.
- Seções para cada tela.
- Modais para criar/editar produtos e matérias-primas.
- Seção de matérias-primas associadas integrada ao modal de produto.

## Tratamento de erros no frontend

- Erros da API exibidos via toast (`err.message` ou `err.details`).
- Erros de duplicidade de código mapeados para mensagens amigáveis:
  - Produtos: "Já existe um produto com este código."
  - Matérias-primas: "Já existe uma matéria-prima com este código."
- Detecção baseada em padrões no campo `details` da resposta de erro (unique, constraint, DataIntegrityViolation).

## Configuração

- **URL da API**: editar `API_BASE` em `frontend/js/api.js` se o backend estiver em outro host/porta.
- **Porta do frontend**: por padrão 3000 (`npm start` usa `serve -p 3000`).

## Testes de integração (Cypress)

- Configuração: `cypress.config.js`
- Suporte: `cypress/support/e2e.js`
- Especificações: `cypress/e2e/**/*.cy.js`

| Arquivo | RF | Descrição |
|---------|-----|-----------|
| navigation.cy.js | — | Navegação entre telas |
| products.cy.js | RF005 | CRUD Produtos |
| raw-materials.cy.js | RF006 | CRUD Matérias-primas |
| product-materials.cy.js | RF007 | Associação matérias-primas ↔ produtos |
| producible.cy.js | RF008 | Produtos produzíveis |

**Execução:** Backend e frontend devem estar rodando. `npm test` (headless) ou `npm run test:open` (UI).

## Referências

- API: `docs/api.md`
- Arquitetura backend: `docs/architecture.md`
