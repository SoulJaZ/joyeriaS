CREATE SCHEMA IF NOT EXISTS `joyeriaS` DEFAULT CHARACTER SET utf8 ;
USE `joyeriaS`;

CREATE TABLE roles(
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL UNIQUE,
descripcion VARCHAR(255)
);

CREATE TABLE users (
id INT auto_increment primary key,
nombre varchar(100) not null,
email varchar(100) not null unique,
password varchar(255) not null,
telefono varchar(20),
estado enum('activo','inactivo') default 'activo',
role_id int not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp,

foreign key (role_id) references roles(id)
);
-- Usuarios
CREATE INDEX idx_users_email ON users(email);

create table categories (
id int auto_increment primary key,
nombre varchar(255) not null,
descripcion varchar(255),
estado enum('activo', 'inactivo') default 'activo'
);
-- Productos
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_estado ON products(estado);

create table products (
id int auto_increment primary key,
nonbre varchar(150) not null,
descripcion text,
precio decimal(10,2) not null,
stock int not null,
material varchar(50),
tipo_gema varchar(50),
peso decimal(6,2),
certificado boolean default false,
estado enum('disponible', 'agotado') default 'disponible',
category_id int not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp,

foreign key (category_id) references categories(id)
);
-- Imágenes
CREATE INDEX idx_product_images_product ON product_images(product_id);
ALTER TABLE products
ADD CONSTRAINT chk_precio_producto
CHECK (precio >= 0);

create table product_images (
id int auto_increment primary key,
product_id int not null,
url_imagen varchar(255) not null,
es_principal boolean default false,

foreign key (product_id) references products(id)
);

create table carts (
id int auto_increment primary key,
user_id int not null,
estado enum('activo','cerrado') default 'activo',
created_at timestamp default current_timestamp,

foreign key (user_id) references users(id)
);
-- Carrito
CREATE INDEX idx_carts_user ON carts(user_id);
ALTER TABLE carts
ADD CONSTRAINT chk_cantidad_cart
CHECK (cantidad > 0);


create table orders (
id int auto_increment primary key,
user_id int not null,
fecha timestamp default current_timestamp,
total decimal(10,2) not null,
estado enum('pendiente','pagado','enviado','cancelado') default 'pendiente',

foreign key (user_id) references users(id)
);
-- Pedidos
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_estado ON orders(estado);

create table order_items (
id int auto_increment primary key,
order_id int not null,
product_id int not null,
cantidad int not null,
precio_unitario decimal(10,2) not null,
subtotal decimal(10,2) not null,

foreign key (order_id) references orders(id),
foreign key (product_id) references products(id)
);
ALTER TABLE order_items
ADD CONSTRAINT chk_cantidad_order
CHECK (cantidad > 0);

create table invoices (
id int auto_increment primary key,
order_id int not null unique,
numero_factura varchar(50) not null unique,
subtotal decimal(10,2) not null,
impuestos decimal(10,2) not null,
total decimal(10, 2) not null,
fecha_emision timestamp default current_timestamp,

foreign key(order_id) references orders(id)
);

create table payments (
id int auto_increment primary key,
order_id int not null,
metodo_pago varchar(50),
referencia varchar(100),
estado enum('pendiente', 'aprobado', 'rechazado'),
fecha_pago timestamp,
monto decimal(10,2),

foreign key (order_id) references orders(id)
);
-- Pagos
CREATE INDEX idx_payments_order ON payments(order_id);