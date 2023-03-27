const crypto = require("crypto");
const request = require("request-promise");
const dotenv = require("dotenv").config();
const querystring = require("querystring");
const cookie = require("cookie");
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = "write_products write_customers";
const forwardingAddress =
  "https://0443-2401-4900-1f3f-214c-d90b-46e0-d712-e18a.in.ngrok.io";
const DB = require("../Models/index");
const Shopify = require("shopify-api-node");
const AccessToken = DB.accesstoken;
const Shop = DB.shop;
const genrateToken = require("../Util/genreteToken");
const {syncCustomers} = require('../Controllers/CustomerControllers');

// @DESC get Shopify shop and Genrate insatll link | @Route - /shopify/ | @Access - Public
const getShopify = async (req, res) => {
  // shop name
  const shopName = req.query.shop;
  if (shopName) {
    const shopState = "nonce";
    // shopify callback redirect
    const redirectURL = forwardingAddress + "/shopify/callback";

    // install url for app install
    const installUrl =
      "https://" +
      shopName +
      "/admin/oauth/authorize?client_id=" +
      apiKey +
      "&scope=" +
      scopes +
      "&redirect_uri=" +
      redirectURL +
      "&state=" +
      shopState;

    res.cookie("state", shopState);
    // redirect the user to the installUrl
    res.redirect(installUrl);
  } else {
    return res.status(400).send('Missing "Shop Name" parameter!!');
  }
};

// @DESC get Access Token | @Route - /shopify/callback | @Access - Public
const getShopifycallback = async (req, res) => {
  const { shop, hmac, code, shopState } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).shopState;

  if (shopState !== stateCookie) {
    return res.status(400).send("request origin cannot be found");
  }

  if (shop && hmac && code) {
    const Map = Object.assign({}, req.query);
    delete Map["hmac"];
    delete Map["signature"];

    const message = querystring.stringify(Map);
    const providedHmac = Buffer.from(hmac, "utf-8");
    const generatedHash = Buffer.from(
      crypto
        .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
        .update(message)
        .digest("hex"),
      "utf-8"
    );
    let hashEquals = false;
    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
    } catch (e) {
      hashEquals = false;
    }
    if (!hashEquals) {
      return res.status(400).send("HMAC validation failed");
    }
    const accessTokenRequestUrl =
      "https://" + shop + "/admin/oauth/access_token";
    const accessTokenPayload = {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    };
    request
      .post(accessTokenRequestUrl, { json: accessTokenPayload })

      .then(async (accessTokenResponse) => {
        const accessToken = accessTokenResponse.access_token;

        // Store Access Token in Schema
        try {
            // Fetch Shop Data
            const shopify = new Shopify({
              shopName: shop,
              accessToken: accessToken,
            });

            // get shop data
            const response = await shopify.shop.get();

            // if shop is already exits
            const shopExits = await Shop.findOne({ where: { id: response.id } });
            console.log(shopExits);
            if (shopExits) {
              const updatedShop = await Shop.update(
                {
                  AccessToken: accessToken,
                  name: response.name,
                  email: response.email,
                  domain: response.domain,
                  customer_email: response.customer_email,
                  myshopify_domain: response.myshopify_domain,
                },
                {
                  where: {
                    id: response.id,
                  },
                }
              );
            } else {
              const createShop = await Shop.create({
                id: response.id,
                AccessToken: accessToken,
                name: response.name,
                email: response.email,
                domain: response.domain,
                customer_email: response.customer_email,
                myshopify_domain: response.myshopify_domain,
              });
            } 

            // Sync sgop data
            syncCustomers(shop);
            
          // res.status(200).json({shop:response});
          const token = genrateToken(response.id);

          const ShopAuth = {
            Token:token,
            shop:shop
          }
          res.redirect(`http://localhost:3001/home?ShopAuth=${JSON.stringify(ShopAuth)}`);
      } catch (error) {
          res.status(500).send(error);
        }
      })
      .catch((error) => {
        res.status(500).send(error);  
      });
  } else {
    return res.status(400).send("required parameter missing");
  }
};

module.exports = { getShopify, getShopifycallback};
