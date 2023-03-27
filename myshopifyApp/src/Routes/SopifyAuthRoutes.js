const express = require('express');
const Router = express.Router();
const {getShopify , getShopifycallback} = require('../Controllers/ShopifyAuthController');

// Genrate Install link
Router.route('/').get(getShopify);

// Genrate Access Toke
Router.route('/callback').get(getShopifycallback);

module.exports = Router;
