# Frontend - Factory Inventory

Interface gráfica para controle de produtos e matérias-primas. Desenvolvida em HTML, CSS e JavaScript.

## Como rodar

Pré-requisitos:
- Node.js (para `npm` e `npx`)
- Backend rodando em `http://localhost:8080`

Instalação e execução:

```bash
cd frontend
npm install
npm start
```

O frontend roda em `http://localhost:3000`.

## Configuração

| Configuração | Local | Valor padrão |
|--------------|-------|--------------|
| URL da API   | `js/api.js` → `API_BASE` | `http://localhost:8080/api` |
| Porta       | `package.json` → script `start` | 3000 |

Se o backend estiver em outro host/porta, altere `API_BASE` em `js/api.js`.

## Scripts

| Script | Comando | Descrição |
|--------|---------|-----------|
| start | `npm start` | Inicia servidor estático na porta 3000 |
| test | `npm test` | Executa testes unitários (Jest) |
| test:e2e | `npm run test:e2e` | Executa testes de integração (Cypress) |
| test:e2e:open | `npm run test:e2e:open` | Abre Cypress UI |

## Testes unitários (Jest)

Os testes unitários validam regras de negócio isoladas do frontend,
sem dependência do backend ou do DOM.

Exemplo:
- Cálculo da quantidade máxima produzível baseada no estoque das matérias-primas.

Executar:

```bash
cd frontend
npm test

## Testes de integração (Cypress)

**Pré-requisito:** Backend em `http://localhost:8080` e frontend em `http://localhost:3000` rodando.

```bash
# Terminal 1: backend
cd backend && mvn spring-boot:run

# Terminal 2: frontend
cd frontend && npm start

# Terminal 3: testes
cd frontend && npm run test:e2e
```

Testes em modo interativo:
```bash
cd frontend && npm run test:e2e:open
```

Especificações em `cypress/e2e/`:
- `navigation.cy.js` — Navegação entre telas
- `products.cy.js` — RF005: CRUD Produtos
- `raw-materials.cy.js` — RF006: CRUD Matérias-primas
- `product-materials.cy.js` — RF007: Associação matérias-primas ↔ produtos
- `producible.cy.js` — RF008: Produtos produzíveis

## Documentação

Ver `docs/frontend.md` para:
- Estrutura do código
- Decisões técnicas
- Mapeamento RF005–RF008
- Tratamento de erros
