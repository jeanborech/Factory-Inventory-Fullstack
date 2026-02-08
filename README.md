# Factory Inventory

Projeto de controle de produtos e matérias-primas — backend em Spring Boot, frontend em HTML/CSS/JavaScript.

## Como rodar o backend

Pré-requisitos:
- Java 21
- Maven (ou use o wrapper incluído)
- PostgreSQL

Configurar banco de dados PostgreSQL e variáveis em `backend/src/main/resources/application.properties` (ou via variáveis de ambiente):

- spring.datasource.url (ex: `jdbc:postgresql://localhost:5432/factory_inventory`)
- spring.datasource.username
- spring.datasource.password

Rodando:

Windows PowerShell:

```bash
cd backend
./mvnw spring-boot:run
```

ou

```bash
mvn -f backend/pom.xml spring-boot:run
```

O servidor por padrão roda em `http://localhost:8080`. Swagger UI disponível em `http://localhost:8080/swagger`.
Observação: dependendo da versão do SpringDoc a UI pode ficar em `/swagger/index.html`. Se `/swagger` não abrir, tente `http://localhost:8080/swagger/index.html` ou `http://localhost:8080/swagger-ui.html`.

## Como rodar o frontend

Pré-requisitos:
- Node.js
- Backend rodando em `http://localhost:8080`

```bash
cd frontend
npm install
npm start
```

O frontend será servido em `http://localhost:3000`. Ver `frontend/README.md` e `docs/frontend.md` para mais detalhes.

## Migrations
As migrations estão em `backend/src/main/resources/db/migration` e são gerenciadas pelo Flyway. Ao iniciar o aplicativo o Flyway aplicará as migrations automaticamente. 
Observação: o projeto usa Spring Boot 3 e Flyway. Certifique-se de que o PostgreSQL esteja numa versão compatível; se houver erro ao iniciar por incompatibilidade, consulte os logs e atualize a versão do driver ou do Flyway.

## Testes

**Backend (JUnit/Mock):**
```bash
cd backend
./mvnw test
```

**Frontend (Cypress):** Requer backend e frontend rodando.
```bash
cd frontend
npm test
```
Ver `frontend/README.md` para mais detalhes.

## Endpoints principais

Ver `docs/api.md` para documentação dos endpoints e exemplos de request/response.

## Estrutura do código

- Backend: `docs/architecture.md`
- Frontend: `docs/frontend.md`

## Checklist (conforme regras do projeto)

- [ ] Compila
- [ ] `mvn test` passa
- [ ] Swagger atualizado
- [ ] README e docs atualizados

