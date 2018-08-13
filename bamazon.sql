DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NULL,
  department_name VARCHAR(200) NULL,
  price DECIMAL(12,2),
  stock_quantity INT NULL
);

INSERT INTO products VALUES (1,"Spider-Man", "Video Games", 59.99, 9999);

INSERT INTO products VALUES (2,"God of War", "Video Games", 59.99, 9999);

INSERT INTO products VALUES (3,"There Will Be Blood", "Movies", 19.99, 50);

INSERT INTO products VALUES (4,"Inglorious Basterds", "Movies", 19.99, 30);

INSERT INTO products VALUES (5,"10ft Canopy Beige", "Outdoor", 124.99, 10);

INSERT INTO products VALUES (6,"Jackson 8ft Single Person Kayak", "Outdoor", 304.99, 3);

INSERT INTO products VALUES (7, "Button Down", "Clothing", 34.99, 15);

INSERT INTO products VALUES (8,"Vans Eras Herringbone", "Clothing", 56.99, 10);

INSERT INTO products VALUES (9,"Levis 511 Jeans", "Clothing", 50.99, 8);

INSERT INTO products VALUES (10,"3ft USB-C to USB-A Cord", "Appliances", 999.99, 3);


SELECT * FROM products
