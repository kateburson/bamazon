DROP DATABASE IF EXISTs bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
	id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL DEFAULT 'misc',
    price DECIMAL(10,2) DEFAULT 0 NOT NULL,
    stock INTEGER(10) DEFAULT 0 NOT NULL
);

INSERT INTO products(name, department, price, stock)
VALUES
('velour jumpsuit', 'clothing', 40, 10),
('house slippers', 'footwear', 10, 30),
('broken keyboard', 'musical instruments', 10, 5),
('knee board', 'sporting goods', 25, 20),
('velcros', 'footwear', 15, 25),
('plaid button up shirt', 'clothing', 5, 50),
('flannel zebra jammies', 'clothing', 10, 60),
('typewriter', 'household goods', 20, 10),
('blender', 'household goods', 7, 20),
('skateboard', 'sporting goods', 10, 100);





