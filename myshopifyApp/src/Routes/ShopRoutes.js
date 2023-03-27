const Express = require("express");
const Router = Express.Router();
const {getShop} = require("../Controllers/ShopControllers");

// Get all Product
Router.route('/').get(getShop);

// // Shop Login
// Router.route('/login').post(shopLogin);

module.exports = Router;

