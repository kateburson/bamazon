var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'cacti4Life*',
    database: 'bamazon_DB'
});

//initial connection to the mysql database
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
});

//function to enter the store
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

//function to make a purchase and deal with inventory
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
                return checkStock(itemId, quantity);
            });
        });
    connection.end();
    });
}

function checkStock(itemId, quantity) {
    var stock = res[itemId-1].stock;
    console.log(stock);
    if (Number(stock) > Number(quantity)) {
        console.log('YOU HAVE PURCHASED' + quantity + ' ' + res[itemId-1].name);
        updateStock();
    } else {
        console.log('INSUFFICIENT QUANTITY IN STOCK');
    }
}

function updateStock() {
    new Promise(function(resolve, reject){
        stock = Number(stock) - Number(quantity);
        connection.query('UPDATE products SET stock WHERE ?',
        [{id: itemId}]),
        function(err, res) {
            if (err) reject(err);
            resolve(res);
        };
    });  
}
