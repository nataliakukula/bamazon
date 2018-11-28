-- Create a MySQL Database called bamazon.
DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;
-- Then create a Table inside of that database called products.
CREATE TABLE products
(
    item_id INT
    AUTO_INCREMENT NOT NULL PRIMARY KEY,
product_name VARCHAR
    (255) NULL,
department_name VARCHAR
    (255) NOT NULL,
price DECIMAL
    (10, 2) NULL, -- (cost to customer)
stock_quantity INT NULL, -- (how much of the product is available in stores)
product_sales DECIMAL
    (10, 2) DEFAULT 0
);
    -- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ("baking pan", "cookware", 29.99, 100),
        ("soucepan", "cookware", 49.99, 80),
        ("spatula", "cookware", 9.99, 150),
        ("cast iron pan", "cookware", 79.99, 50),
        ("dutch oven", "cookware", 150.00, 40)
    ;

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ("mascara", "cosmetics", 23.20, 90),
        ("lipstick", "cosmetics", 15.50, 85),
        ("foundation", "cosmetics", 32.00, 120),
        ("eyeliner", "cosmetics", 9.35, 35),
        ("eyeshadow", "cosmetics", 12.70, 55)
    ;

    -- Create a new MySQL table called departments.
    CREATE TABLE departments
    (
        department_id INT
        AUTO_INCREMENT NOT NULL PRIMARY KEY,
department_name VARCHAR
        (255) NOT NULL,
over_head_costs DECIMAL
        (10, 2) NULL -- (a dummy number you set for each department)
);

        INSERT INTO departments
            (department_name, over_head_costs)
        VALUES
            ("cookware", 200),
            ("cosmetics", 300)
;
