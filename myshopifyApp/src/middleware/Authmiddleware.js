// Verify the token
const jwt = require("jsonwebtoken");
const db = require("../Models/index");
const shop = db.shop;

// Protected routes
const Protect = async (req, res, next) => {
  let Token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token for headers
      Token = req.headers.authorization.split(" ")[1];
      console.log({ Token });

      // verfiy the toke
      const decode = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decode);
      let id = decode.id;
      console.log({ id });

      // get user from the token
      let shopData = await shop.findOne({ where: { id } });
      console.log({ shopData });

      // Pass Shopname in Controllers
      req.shopName = shopData.domain;
      req.accesstoken = shopData.AccessToken;

      if (shopData) {
        next();
      }
    } catch (error) {
      res.status(401).json({message:"Not Authorized"})
      console.log({ error });
    }
  }
  
  if (!Token) {
    res.status(401);
    throw new Error("Not Autorized & No TOken");
  }
};

module.exports = Protect;
