const Express = require("express");
const Router = Express.Router();
// const {getShop} = require("../Controllers/ShopControllers");
const {getCustomers , addCustomers , getAllcustomers , addCustomer , deleteCustomer} = require('../Controllers/CustomerControllers');
const Protect = require('../middleware/Authmiddleware');

// Get All Customers
Router.route('/:shopName').get(getCustomers);

// Create and Update ALl Cutomers
Router.route('/:shopName').post(addCustomers);

// Get All Customers Data Through Local database
Router.route('/').get([Protect , getAllcustomers]);

// Add Customer
Router.route('/').post([Protect , addCustomer])

// Delete Customer
Router.route('/:id').put([Protect])

// Update Customer
Router.route('/:id').delete([Protect , deleteCustomer]);

module.exports = Router;

