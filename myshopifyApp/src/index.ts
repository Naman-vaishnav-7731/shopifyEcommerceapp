const express = require("express");
const crypto = require("crypto");
const nonce = require("nonce");
const request = require("request-promise");
const dotenv = require("dotenv").config();
const querystring = require("querystring");
const cookie = require("cookie");
const bodyParser = require('body-parser');
require('../src/Models/index');
const cors = require('cors')
// initialize application
const app = express();
const Port = 3000;

var corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200,
  credentials:true
}

app.use(cors(corsOptions));

// parse the request body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Login page
app.get('/' , async (req:any , res:any) => {
    const fileName = __dirname + '/login/index.html';
    return res.sendFile(fileName);
});

// Common Shopify Auth Route
app.use('/shopify' , require('./Routes/SopifyAuthRoutes'));

//shop api
app.use('/shop' , require("./Routes/ShopRoutes"));

// Common Routes for Customer
app.use('/customer' , require('./Routes/CustomerRoutes'));

app.listen(Port, () => {
  console.log("App is Running on localhost", Port);
});
