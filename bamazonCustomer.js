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
    if (err) throw err;
    connection.query('SELECT * FROM products',
        function(err, res) {
            if (err) throw err;
            if (res) {
                console.table(res)
            }
        }
    );
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
    ]).then(function(inquirerResponse){
        var id = inquirerResponse.id;
        var quantity = inquirerResponse.qty;
        
    })
    connection.end();
});

