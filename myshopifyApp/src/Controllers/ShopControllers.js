const Shopify = require("shopify-api-node");
const DB = require("../Models/index");
const shop = DB.shop;
// Genrate The JWT Token
const genrateToken = require("../Util/genreteToken");

// @Route /shop/ | @DESC - Get Shop Data | @Access - Private
const getShop = async (req, res) => {
  // Get access Token from Databse
  try {
    // Find access Token
    const accesstoken = await accessToken.findOne({ where: { id: 1 } });
    const shopify = new Shopify({
      shopName: "shivshaktigrocerystore.myshopify.com",
      accessToken: accesstoken.AccessToken,
    });

    try {
      const response = await shopify.shop.get();
      if (response) {
        res.status(200).json({ Shop: response });
      }
    } catch (error) {
      res.status(500).json({ error });
      throw new Error("Some error is Found while Get The Shop Data");
    }
  } catch (error) {
    console.log(error);
  }
};

// // @Route - /shopify/login | @DESC - shop login | @Access - Private
// const shopLogin = async (req, res) => {
//   // Find Shop  | Shop is Exits or not
//   const shopExits = await shop.findOne({
//     where: { domain: req.body.shopName },
//   });
//   if (!shopExits) {
//     return res.status(404).json({ message: "Shop is Not Exits" });
//   }
//   console.log(shopExits.id);

//   // genrate token
//   const Token = genrateToken(shopExits.id);
//   res.status(200).json({
//     Token: Token,
//   });
// };

module.exports = { getShop };
