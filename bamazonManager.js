// global variables
const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'impDU1234',
  database: 'bamazon'
});

connection.connect();
mainMenu();

// runs main menu portal
function mainMenu() {
  inquirer.prompt([
    {
      name: "mainmenu",
      type: "list",
      message: "------------------------------------------------------\nHello, welcome to the bAmazon Manager Portal. What would you like to do?\n------------------------------------------------------\n",
      choices: ["View Inventory", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
  ]).then(function (answer) {
    switch (answer.mainmenu) {

      case "View Inventory":
        viewInventory()
        break;

      case "View Low Inventory":
        viewLowInventory()
        break;

      case "Add to Inventory":
        selectProduct()
        break;

      case "Add New Product":
        addProduct()
        break;

      default:
      break;
    }
  });
}

// function that allows manager to view entire inventory
function viewInventory() {
  connection.query('SELECT * FROM products', function (error, res) {

    if (error) throw error;
    res.forEach(row => {
      console.log(`
        Id: ${row.item_id}
        Name: ${row.product_name}
        Price: ${row.price}
        Quantity: ${row.stock_quantity}`);
      console.log(`-------------------------------`);
    });

    additionalUpdates();
  })
}

// function that allows manager to view low inventory less than 5
function viewLowInventory() {
  connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (error, res) {
    if (error) throw error;

    res.forEach(row => {
      console.log(`
        Id: ${row.item_id}
        Name: ${row.product_name}
        Price: ${row.price}
        Quantity: ${row.stock_quantity}\n`);
      console.log(`-------------------------------`);
    });

    additionalUpdates()
  })
}

// function that allows me to select which specific product to add to inventory
function selectProduct(productId, productQty) {
  connection.query('SELECT * FROM products', function (error, res) {
    if (error) throw error;

    res.forEach(row => {
      console.log(`
        Id: ${row.item_id}
        Name: ${row.product_name}
        Price: ${row.price}
        Quantity: ${row.stock_quantity}\n`);
    });

    inquirer.prompt([
      {
        message: "Please type in the id of the product you would like to add inventory to.",
        type: "input",
        name: "productId"
      },
      {
        message: "How many items are being restocked in quantity?",
        type: "input",
        name: "productQty"
      }
    ]).then(function (answer) {

      connection.query('SELECT * FROM products', function (error, resp) {
        if (error) throw error;
        let product;

        for (let i = 0; i < resp.length; i++) {
          if (resp[i].item_id == answer.productId) {
            product = resp[i]
          }
        }
        console.log(`\n-------------------------------\n`);
        console.log(product, "Product quantity has been updated.");
        if (product !== undefined) {
          addToInventory(product, answer.productId, parseInt(answer.productQty))
          connection.end()
        } else {
          console.log(`-------------------------------\n\n`);
          console.log("ERROR: This item does cannot be found or may not exist.");
          connection.end()
        }
      });
    });
  });
};


// adds the updated quantity variable to the table
function addToInventory(prodObj, productId, productQty) {
  let updatedQty = prodObj.stock_quantity + productQty
  let query = "UPDATE products SET stock_quantity = ? WHERE ?";
  connection.query(query, [updatedQty, { item_id: productId }], function (error, res) {
    console.log(`-------------------------------\n\n`);
    additionalUpdates();
  })
}

// function that adds a product to the table
function addProduct(params) {
  inquirer.prompt([
    {
      name: "prodName",
      type: "input",
      message: "What is the name of this product?",
    },
    {
      name: "prodDept",
      type: "input",
      message: "What department does this product fall under?"
    },
    {
      name: "prodPrice",
      type: "input",
      message: "How much does the product cost?"
    },
    {
      name: "productQty",
      type: "input",
      message: "How many do we have in stock?",
    }
  ]).then(function (answer) {
    let query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VAlUES (?, ?, ?, ?)";
    console.log(answer)

    if (answer.prodName !== '' && answer.prodDept !== '' && answer.prodPrice !== '' && answer.productQty !== '') {
      connection.query(query, [answer.prodName, answer.prodDept, answer.prodPrice, answer.productQty], function (error, res) {
      })
      additionalUpdates();
    } else {
        console.log(`-------------------------------`);
        console.log("ERROR: Some product info is incomplete. Please fill all info out.");
        addProduct();
    }
  });
}

// function that asks the user if there are any more updates to be made
function additionalUpdates() {
  inquirer.prompt([
    {
  		name:"action",
  		type: "list",
  		message: "Are there any other actions you'd like to take?",
  		choices: ["Add to Inventory", "Add New Product", "View Low Inventory", "Exit"]
	  }
  ]).then(function(answers) {

    switch(answers.action){
			case 'Add to Inventory':
				selectProduct();
				break;

      case 'Add New Product':
				addProduct();
				break;

    	case 'View Low Inventory':
				viewLowInventory();
				break;

      case 'Exit':
        console.log(`-------------------------------\n\n`);
        console.log('You have successfully logged out of bAmazon Manager Portal.');
        console.log(`\n\n-------------------------------`);
        process.exit();
        break;
		}
	});
};
