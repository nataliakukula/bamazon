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
    displayProducts();
});

// Display all of the items available for sale. 
const displayProducts = () => {
    console.log(`\nBamazon products available for sale:\n`);
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) {
            throw err
        };
        const data = res.map(res => [`id: ${res.item_id}`, res.product_name, `$ ${res.price}`]);
        console.log(table(data));
        // res.forEach(row => console.log(`id: ${row.item_id} - ${row.product_name} - $ ${row.price}`));
        inquire();
    });
};

// Prompt users and asks which product and how many they would like to buy:
const inquire = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "id",
                message: "Provide product id:"
            }, {
                type: "input",
                name: "units",
                message: "How many items would you like to purchase?"
            },
        ])
        .then(answers => {
            let query = `SELECT * FROM products WHERE item_id = ${answers.id}`;
            let upade = `UPDATE products SET stock_quantity = stock_quantity - ${answers.units} WHERE item_id = ${answers.id}`;
            //Display total cost to customer if in stock:
            connection.query(query, function (err, res) {
                if (err) {
                    throw err
                };

                if (res[0].stock_quantity >= answers.units) {

                    decreaseStock(upade);

                    const totalCost = answers.units * res[0].price;
                    const sales = `UPDATE products SET product_sales = product_sales + ${totalCost} WHERE item_id = ${answers.id}`;

                    console.log(`\nTotal cost: $ ${totalCost}\n`);

                    addSales(sales);

                } else {
                    console.log(`\nInsufficient quantity! Maximum purchase amount: ${res[0].stock_quantity}.\n`);
                };

                connection.end();

            });
        });
};

//Decrease stock of item in the database:
const decreaseStock = upade => {
    connection.query(upade, function (err, res) {
        if (err) {
            throw err
        };
        // console.log("Stock quantity updated!");
    });
};

// Add the sale to the product_sales column:
const addSales = sales => {
    connection.query(sales, function (err, res) {

        if (err) {
            throw err
        };
        // console.log("Product sales updated!");
    });
};