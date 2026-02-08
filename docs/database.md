# Banco de Dados

Migrations em `backend/src/main/resources/db/migration`.

Versão inicial (v1_init.sql) cria as tabelas:

- `product`:
  - `id` bigserial PK
  - `code` varchar(50) not null unique
  - `name` varchar(200) not null
  - `price` numeric(12,2) not null (>= 0)

- `raw_material`:
  - `id` bigserial PK
  - `code` varchar(50) not null unique
  - `name` varchar(200) not null
  - `stock_quantity` numeric(18,4) not null (>= 0)

- `product_raw_material` (associação N:N com quantidade requerida):
  - `product_id` bigint FK -> product(id) ON DELETE CASCADE
  - `raw_material_id` bigint FK -> raw_material(id)
  - `required_quantity` numeric(18,4) not null (> 0)
  - PK (product_id, raw_material_id)

Observações:
- Mudanças no esquema devem ser feitas via novas migrations Flyway.
- Antes de rodar o aplicativo, valide a versão do PostgreSQL com a versão do Flyway usada (configurada via `pom.xml`/starter).  

