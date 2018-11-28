require('dotenv').config();
const mysql = require("mysql");
const table = require("table").table;
const inquirer = require("inquirer");
const database = require("./dbaccess").dbaccess;

// Connection data:
const connection = mysql.createConnection({
    host: database.host,
    port: 8889,
    user: database.username,
    password: database.passoword,
    database: "bamazonDB",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

//Connect to the database:
connection.connect(err => {
    if (err) {
        throw err;
    };
    // console.log(`Connected as id: ${connection.threadId}.`);
    menu();
});

// List a set of menu options:
const menu = () => {

    inquirer
        .prompt({

            name: "action",
            type: "list",
            message: "Menu:",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {

            switch (answer.action) {
                case "View Products for Sale":
                    viewProduct();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }
        });
};

// List every available item: 
const viewProduct = () => {

    console.log(`\n  Bamazon products available for sale:\n`);
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) {
            throw err
        };

        const data = res.map(res => [res.item_id, res.product_name, `$ ${res.price}`, `  ${res.stock_quantity}  `]);
        console.log(`  ID      PRODUCT       PRICE     STOCK\n${table(data)}`);

        connection.end();

    });
};

//List all items with an inventory count lower than five:
const viewLowInventory = () => {

    console.log(`\n  Low inventory:\n`);
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {

        if (err) {
            throw err
        };

        // console.log(res);

        const data = res.map(res => [res.item_id, res.product_name, res.stock_quantity]);

        if (res == "") {
            console.log("Nothing to display. Inventory up to par.\n");
        } else {
            console.log(` ID    PRODUCT   STOCK\n${table(data)}`);
        }
        connection.end();
    });
};
// Prompt that will let the manager "add more" of any item currently in the store:
const addToInventory = () => {

    connection.query("SELECT * FROM products", function (err, res) {

        if (err) {
            throw err
        };

        const choices = res.map(res => res.item_id + ". " + res.product_name);

        inquirer
            .prompt({

                name: "item",
                type: "list",
                message: "Add more:",
                choices: choices

            })
            .then(function (choice) {

                inquirer
                    .prompt({

                        name: "quantity",
                        type: "input",
                        message: "How much will be added to stock?"

                    }).then(function (answer) {

                        const upadate = `UPDATE products SET stock_quantity =
                        stock_quantity + ${answer.quantity}
                        WHERE item_id = ${parseFloat(choice.item)}`;

                        connection.query(upadate, function (err, res) {

                            if (err) {
                                throw err
                            };
                            console.log("\n   Items have been added to inventory!\n");
                            viewProduct();

                        });
                    });
            });
    });
};

// Allows the manager to add a completely new product to the store:
const addProduct = () => {

    connection.query("SELECT * FROM departments", function (err, res) {

        if (err) {
            throw err
        };
        //Take all the department names from all the objects from the result array
        const choices = res.map(res => res.department_name);

        inquirer
            .prompt({
                name: "department",
                type: "list",
                message: "Department:",
                choices: choices
            })
            .then(function (choice) {

                inquirer
                    .prompt([
                        {
                            name: "productName",
                            type: "input",
                            message: "Name of product",
                        },
                        {
                            name: "productPrice",
                            type: "input",
                            message: "Price of product",
                        },
                        {
                            name: "productQuantity",
                            type: "input",
                            message: "Quantity of product",

                        }]).then(function (item) {
                            connection.query(
                                "INSERT INTO products SET ?",
                                [{
                                    product_name: item.productName,
                                    department_name: choice.department,
                                    price: item.productPrice,
                                    stock_quantity: item.productQuantity
                                }],
                                function (err) {
                                    if (err) {
                                        throw err
                                    };
                                    console.log("\n  Your item has been added successfully!\n");
                                    viewProduct();

                                }
                            );
                        });
            });
    });
};



// EXTRA: 
// Take the first instance of the department name to avoid duplicates
//If department names were taken from PRODUCTS tables

// const findDuplicates = data => {

//     let result = [];

//     data.forEach(function (element, index) {

//         // Find if there is a duplicate or not
//         if (data.indexOf(element, index) > -1) {

//             // Find if the element is already in the result array or not
//             if (result.indexOf(element) === -1) {
//                 result.push(element);
//             }
//         }
//     });

//     return result;
// };

// console.log(findDuplicates(choices));
