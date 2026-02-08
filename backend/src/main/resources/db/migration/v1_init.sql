create table product (
  id bigserial primary key,
  code varchar(50) not null unique,
  name varchar(200) not null,
  price numeric(12,2) not null check (price >= 0)
);

create table raw_material (
  id bigserial primary key,
  code varchar(50) not null unique,
  name varchar(200) not null,
  stock_quantity numeric(18,4) not null check (stock_quantity >= 0)
);

create table product_raw_material (
  product_id bigint not null references product(id) on delete cascade,
  raw_material_id bigint not null references raw_material(id),
  required_quantity numeric(18,4) not null check (required_quantity > 0),
  primary key (product_id, raw_material_id)
);
