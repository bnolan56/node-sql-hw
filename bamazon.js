// global variables
const inquirer  = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'impDU1234',
  database: 'bamazon'
});

connection.connect();
startbAmazon();

// start's bamazon function
function startbAmazon() {
  connection.query('SELECT * FROM products', function (error, res) {
    if (error) throw error;

    console.log('-------------------------------\n');
    console.log('Welcome to bAmazon  Marketplace\n');
    console.log('-------------------------------\n');
    console.log(`Here are all available items currently in stock.`);
    console.log('-------------------------------\n');
    res.forEach(row => {
      console.log(`
        Id: ${row.item_id}
        Name: ${row.product_name}
        Price: ${row.price}\n` );

      console.log('-------------------------------');
    });
    placeOrder();
  })
}

// place order function
function placeOrder() {
  inquirer.prompt([
    {
      name: "productId",
      type: "input",
      message: "Please type the ID number of the product that you would like to order."
    },
    {
      name: "productQty",
      type: "input",
      message: "How many of this item would you like to order?"
    }
  ]).then(function (answer) {
    let productId = answer.productId;
    let productQty = answer.productQty;

    checkInventory(productId, productQty);
  });
}

function checkInventory(productId, productQty) {
  connection.query('SELECT * FROM products', function (error, res) {
    if (error) throw error;

    let product;
    for(let i = 0; i < res.length; i++){
      if(res[i].item_id == productId){
        product = res[i]
      }
    }
    console.log(product, "Product in stock!");

    if(product.stock_quantity >= productQty){
      orderSummary(product, productId, productQty)
    } else {
        // console.log("sorry the order has been cancled, there was insuffecent stock of this purchase")
        console.log(`---------------\n\n`);
        console.log(`"Insufficient quantity of" ${product.product_name} in stock to fulfill this order!\n\n We currently have ${product.stock_quantity} units in stock.\n\nPlease try again.\n\n`);
        console.log(`-------------------------------\n\n`)
        additionalOrder()
    }
  });
};

// order summary function that displays all products
function orderSummary(productObj, productId, productQty) {

  console.log(`-------------------------------\n\n`)
  console.log('Order Complete!\n\n')
  console.log(`-------------------------------\n\n`)

  let updatedQty = productObj.stock_quantity - productQty;
  let productSales = productObj.price * productQty;
  let stockQuery = "UPDATE products SET stock_quantity = ? where ?";
  let salesQuery = "UPDATE products SET product_sales = ? where ?";

  connection.query(stockQuery,[updatedQty, {item_id: productId}], function (error, res) {
  });

  connection.query(salesQuery, [productSales, { item_id: productId }], function (error, res) {
  });

  additionalOrder();
}

// function that asks the user if there are any more updates to be made
function additionalOrder() {
  inquirer.prompt([
    {
  		name:"action",
  		type: "list",
  		message: "Are there any other orders you'd like to make?",
  		choices: ["Yes", "No, Thank you"]
	  }
  ]).then(function(answers) {

    switch(answers.action){
			case 'Yes':
				placeOrder();
				break;

      case 'No, Thank you':
        console.log(`-------------------------------\n\n`);
        console.log('Thank you for shopping with bAmazon! Enjoy your order.');
        console.log(`\n\n-------------------------------`);
        process.exit();
				break;
		}
	});
};
