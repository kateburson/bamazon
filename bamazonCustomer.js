var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'cacti4Life*',
    database: 'bamazon_DB'
});

// initial connection to the mysql database
connection.connect(function(err) {
    // Throw error if it errors
    if (err) throw err;
    // New promise that selects all data from the table
    new Promise(function(resolve, reject) {
        connection.query('SELECT id, name, price FROM products', function(err, res) {
            if (err) reject(err);
            resolve(res);
            console.log('Welcome to Bamazon!');
        });
    }).then(function(res) {
        console.table(res);
    }).then(function() {
        return enter();
    }).catch(function(err) {
        console.log(err);
    });
});

// enter the store
function enter() {
    inquirer.prompt([
        {
            type: 'list',
            choices: ['yes', 'no'],
            message: 'WOULD YOU LIKE TO SHOP?',
            name: 'shop'  
        }
    ]).then(function(inquirerResponse){
        if(inquirerResponse.shop === 'yes') {
            shop();
        } else {
            console.log('GOODBYE');
            connection.end();
        }
    })
}

// make a purchase
function shop() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'ENTER THE ID OF THE PRODUCT YOU WOULD LIKE TO PURCHASE:',
            name: 'id'
        },
        {
            type: 'input',
            message: 'HOW MANY WOULD YOU LIKE TO PURCHASE?',
            name: 'quantity'
        }
    ]).then(function(inquirerResponse) {
        checkStock(inquirerResponse);
    });
}

// check inventory
function checkStock(inquirerResponse) {
    new Promise(function(resolve, reject) {
        var itemID = inquirerResponse.id;
        var quantity = inquirerResponse.quantity;
        console.log('ITEM: ' , itemID);
        console.log('QUANTITY: ', quantity);
        connection.query('SELECT * FROM products WHERE ?', 
        {id: itemID},
        function(err, res) {
            if (err) reject(err);
            resolve(res);
            console.log(res);
            var stock = res[0].stock;
            console.log('STOCK: ', stock);
            if (Number(stock) > Number(quantity)) {
                console.log('YOU HAVE PURCHASED: ' + quantity + ' ' + res[0].name);
                stock = stock - quantity;
                return updateStock(itemID, stock);
            } else {
                console.log('INSUFFICIENT QUANTITY IN STOCK');
                connection.end();
            }
        });
    });
}

// update inventory
function updateStock(itemID, stock){
    new Promise(function(resolve, reject){
        connection.query('UPDATE products SET ? WHERE ?',
        [{stock: stock},
        {id: itemID}],
        function(err, res){
            if (err) reject(err);
            console.log(res);
            resolve(res);
        });
        connection.end();
    });  
}

