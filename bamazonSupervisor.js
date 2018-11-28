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
    console.log(`Connected as id: ${connection.threadId}.`);
    // connection.end();
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
                "View Product Sales by Department",
                "Create New Department"
            ]
        })
        .then(function (answer) {

            switch (answer.action) {
                case "View Product Sales by Department":
                    viewDeptSales();
                    break;

                case "Create New Department":
                    newDept();
                    break;
            }
        });
};

// Display a summarized sales table:
const viewDeptSales = () => {
    console.log(`\n  Bamazon sales:\n`);
    const joined =
        `SELECT 
    dept.department_id,
    dept.department_name,
    dept.over_head_costs, 
    prod.product_sales,
    prod.product_sales - dept.over_head_costs AS total_profit
    FROM departments AS dept
    INNER JOIN (
    SELECT 
    SUM(product_sales) AS product_sales, 
    department_name  
    FROM products
    GROUP BY department_name
    ) AS prod 
    ON prod.department_name = dept.department_name`;

    connection.query(joined, function (err, res) {

        if (err) {
            throw err
        };

        const data = res.map(res => [`      ${res.department_id}      `, `   ${res.department_name}   `, `     $ ${res.over_head_costs}     `, `    $ ${res.product_sales}     `, `   $ ${res.total_profit}   `]);
        console.log(`  department_id   department_name   over_head_costs   product_sales   total_profit\n${table(data)}`);

        connection.end();
    });
};

// Create new department:
const newDept = () => {
    inquirer
        .prompt([
            {
                name: "departmentName",
                type: "input",
                message: "Enter department name",
            },
            {
                name: "overHeadCost",
                type: "input",
                message: "Enter over head cost",

            }]).then(function (answers) {
                connection.query(
                    "INSERT INTO departments SET ?",
                    [{
                        department_name: answers.departmentName,
                        over_head_costs: answers.overHeadCost
                    }],
                    function (err) {
                        if (err) {
                            throw err
                        };
                        console.log("\n  Your item has been added successfully!\n  The manager can add new products now!\n");

                        connection.query(
                            "INSERT INTO products SET ?",
                            [{
                                department_name: answers.departmentName
                            }],
                            function (err) {
                                if (err) {
                                    throw err
                                };
                                viewDeptSales();
                            }
                        );
                    }
                );
            });
};