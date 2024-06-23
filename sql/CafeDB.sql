CREATE TABLE `usuarios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(255),
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT (now()),
  `updatedAt` datetime DEFAULT (now())
);

CREATE TABLE `inventario` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre_producto` varchar(255),
  `cantidad` int,
  `categoria_id` int,
  `user_id` int,
  `observacion_general` varchar(255),
  `createdAt` datetime DEFAULT (now()),
  `updatedAt` datetime DEFAULT (now())
);

CREATE TABLE `categorias` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` ENUM ('cocina', 'sala'),
  `createdAt` datetime DEFAULT (now()),
  `updatedAt` datetime DEFAULT (now())
);

CREATE TABLE `roles_en_restaurante` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(255),
  `createdAt` datetime DEFAULT (now()),
  `updatedAt` datetime DEFAULT (now())
);

CREATE TABLE `movimientos` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `description` varchar(255),
  `user_id` id,
  `tipo_movimiento` ENUM ('entrada', 'salida','otros'),
  `createdAt` datetime DEFAULT (now()),
  `updatedAt` datetime DEFAULT (now())
);

ALTER TABLE `inventario` ADD FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);

ALTER TABLE `inventario` ADD FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`);

ALTER TABLE `movimientos` ADD FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`);
