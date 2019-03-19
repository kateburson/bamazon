var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'cacti4Life*',
    database: 'bamazon_DB'
});

connection.connect(function(err){
    // Throw error if it errors
    if (err) throw err;
    // inquirer
    inquirer.prompt([
        {
            type: 'list',
            choices: ['VIEW PRODUCTS FOR SALE', 'VIEW LOW INVENTORY', 'ADD TO INVENTORY', 'ADD NEW PRODUCT'],
            message: 'MENU?',
            name: 'menu'
        }
    ]).then(function(inquirerResponse){
        console.log(inquirerResponse.menu);
        if(inquirerResponse.choices === 'VIEW PRODUCTS FOR SALE'){
            viewProducts();
        } else if(inquirerResponse.choices === 'VIEW LOW INVENTORY'){
            lowInventory(res);
        } else if(inquirerResponse.choices === 'ADD TO INVENTORY'){
            addInventory(res);
        } else if(inquirerResponse.choices === 'ADD NEW PRODUCT'){
            addProduct(res);
        }
    });
});

function viewProducts(){
    new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM products', 
        function(err, res){
            if (err) reject(err);
            resolve(res);
            console.table(res);
        });
        // connection.end();
    });
}

function lowInventory(){
    connection.query('SELECT * FROM products WHERE ?',
    {stock: stock < 5},
    function(err, res){
        if (err) reject(err);
        console.log(res);
        resolve(res);
    });
}
