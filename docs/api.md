# API

Base: `/api`

Produtos
- POST `/api/products` — criar product  
  Body (JSON):

```json
{
  "code": "PRD-001",
  "name": "Produto A",
  "price": 10.50
}
```

- GET `/api/products` — lista todos (retorna array de ProductDTO)  
- GET `/api/products/{id}` — obter product por id  
- PUT `/api/products/{id}` — atualizar (body: ProductDTO)  
- DELETE `/api/products/{id}` — deletar  
- GET `/api/products/producible` — lista produtos produzíveis com estoque atual (RF004)

Matérias-primas
- POST `/api/raw-materials` — criar matéria-prima  
  Body (JSON):

```json
{
  "code": "RM-001",
  "name": "Aço",
  "stockQuantity": 100.0000
}
```

- GET `/api/raw-materials` — listar  
- GET `/api/raw-materials/{id}` — obter  
- PUT `/api/raw-materials/{id}` — atualizar  
- DELETE `/api/raw-materials/{id}` — deletar

Associações produto ↔ matéria-prima
- POST `/api/products/{productId}/materials?rawMaterialId={id}&requiredQuantity={qty}` — associa matéria-prima ao produto  
- GET `/api/products/{productId}/materials` — lista matérias-primas associadas ao produto (exibe rawMaterialId, rawMaterialCode, rawMaterialName, requiredQuantity)  
- PUT `/api/products/{productId}/materials?rawMaterialId={id}&requiredQuantity={qty}` — atualiza quantidade requerida  
- DELETE `/api/products/{productId}/materials?rawMaterialId={id}` — remove associação

Erros
- Erros retornam payload padronizado (ErrorResponse): timestamp, message, details.

Swagger / OpenAPI
- A documentação interativa (Swagger UI) está disponível em `http://localhost:8080/swagger` (ou `/swagger/index.html` / `/swagger-ui.html`).
- O projeto inclui a dependência `springdoc-openapi-starter-webmvc-ui` para expor o OpenAPI automaticamente.
 - A documentação interativa (Swagger UI) está disponível em `http://localhost:8080/swagger` (ou `/swagger/index.html` / `/swagger-ui.html`).
 - O projeto usa Spring Boot 3 e `springdoc-openapi` para gerar o OpenAPI automaticamente.
 - Se você alterou a porta no `application.properties`, ajuste a URL conforme necessário.

