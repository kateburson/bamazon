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
    ]).then(function(inquirerResponse) {
        console.log(inquirerResponse.menu);
        if(inquirerResponse.menu === 'VIEW PRODUCTS FOR SALE'){
            viewProducts();
        } else if(inquirerResponse.menu === 'VIEW LOW INVENTORY'){
            lowInventory();
        } else if(inquirerResponse.menu === 'ADD TO INVENTORY'){
            addInventory();
        } else if(inquirerResponse.menu === 'ADD NEW PRODUCT'){
            addProduct();
        }
    });
});

function viewProducts() {
    new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM products', 
        function(err, res){
            if (err) reject(err);
            resolve(res);
            console.table(res);
        });
        connection.end();
    });
}

function lowInventory() {
    new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM products WHERE stock < 20',
        function(err, res){
            if (err) reject(err);
            resolve(res);
            console.table(res);
        });
        connection.end();
    });
}

function addInventory() {
    inquirer.prompt([
        {
            type: 'input',
            message: "ENTER THE PRODUCT ID TO UPDATE INVENTORY: ",
            name: 'id' 
        },
        {
            type: 'input',
            message: "HOW MUCH INVENTORY WOULD YOU LIKE TO ADD: ",
            name: 'add'
        }
    ]).then(function(inquirerResponse) {
        new Promise(function(resolve, reject) {
            var itemID = inquirerResponse.id;
            connection.query('SELECT * FROM products WHERE ?',
            {id: itemID},
            function(err, res) {
                if (err) reject(err);
                resolve(res);
                console.log(res);
                var stock = res[0].stock;
                console.log('Adding ' + inquirerResponse.add + ' units to ' + res[0].name + '...');
                stock = Number(stock) + Number(inquirerResponse.add);
                return updateStock(itemID, stock);
            });
        });  
    });
};

function updateStock(itemID, stock) {
    new Promise(function(resolve, reject) {
        connection.query('UPDATE products SET ? WHERE ?',
        [{stock: stock},
        {id: itemID}],
        function(err, res) {
            if (err) reject(err);
            console.log(res);
            resolve(res);
        });
        connection.end();
    });  
}

function addProduct() {
    inquirer.prompt([
        {
            type: 'input',
            message: "ENTER THE PRODUCT NAME: ",
            name: 'name' 
        },
        {
            type: 'input',
            message: 'ENTER THE PRODUCT DEPARTMENT: ',
            name: 'dept'
        },
        {
            type: 'input',
            message: "ENTER THE PRODUCT PRICE: ",
            name: 'price' 
        },
        {
            type: 'input',
            message: "ENTER THE NUMBER IN STOCK: ",
            name: 'stock' 
        },
    ]).then(function(inquirerResponse) {
        console.log('Adding ' + inquirerResponse.name + ' to product assortment...');
        new Promise(function(resolve, reject) {
            connection.query('INSERT INTO products',
            [{name: inquirerResponse.name}, {department: inquirerResponse.dept}, {price: inquirerResponse.price}, {stock: inquirerResponse.stock}],
            function(err, res) {
                if (err) reject(err);
                resolve(res);
                console.log(res);
            });
            connection.end();
        });  
    });
}