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
        connection.query('SELECT * FROM products', function(err, res) {
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
    // connection.end();
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
        new Promise(function(resolve, reject) {
            var itemId = inquirerResponse.id;
            var quantity = inquirerResponse.quantity;
            console.log('ITEM: ' , itemId);
            console.log('QUANTITY: ', quantity);
            connection.query('SELECT * FROM products WHERE ?', 
            {id: itemId},
            function(err, res) {
                if (err) reject(err);
                resolve(res);
                console.log('ITEM: ', res);
                var stock = res[0].stock;
                console.log('STOCK: ', stock);
                if (Number(stock) > Number(quantity)) {
                    console.log('YOU HAVE PURCHASED: ' + quantity + ' ' + res[0].name);
                    stock = stock - quantity;
                    return updateStock(itemId, stock);
                } else {
                    console.log('INSUFFICIENT QUANTITY IN STOCK');
                }
            });
        });
    });
}

// update inventory
function updateStock(itemId, stock){
    new Promise(function(resolve, reject){
        connection.query('UPDATE products SET stock = stock WHERE ?',
        [{id: itemId}]),
        function(err, res){
            if (err) reject(err);
            console.table(res);
            resolve(res);
        };
    });  
}
