# Arquitetura

Pacotes principais (backend Spring Boot):

- `com.projectFullStack.factory_inventory.model` — entidades JPA (Product, RawMaterial, ProductRawMaterial).
- `com.projectFullStack.factory_inventory.repository` — interfaces Spring Data JPA.
- `com.projectFullStack.factory_inventory.service` — regras de negócio e transações.
- `com.projectFullStack.factory_inventory.controller` — endpoints REST (controllers).
- `com.projectFullStack.factory_inventory.dto` — DTOs de entrada/saída.
- `com.projectFullStack.factory_inventory.exception` — tratamento global de erros.

- Spring Boot 3, Java 21.
- JPA / Hibernate com PostgreSQL.
- Flyway para migrações (não usar ddl-auto=create/update).
- Validações com Bean Validation (jakarta.validation).
- Services contêm regras de negócio; Controllers orquestram requisições.

