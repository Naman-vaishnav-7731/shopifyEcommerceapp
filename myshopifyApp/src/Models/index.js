const DB = require("../Config/db");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

// crate connection from database
const sequelize = new Sequelize(DB.DB, DB.USER, DB.PASSWORD, {
  host: DB.HOST,
  dialect: DB.dialect,

  pool: {
    max: DB.pool.max,
    min: DB.pool.min,
    acquire: DB.pool.acquire,
    idle: DB.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Shema for Shop
db.shop = require("./Shop")(sequelize, Sequelize.DataTypes);

//Customer and Address Schema
db.customer = require("./Customer/Customer")(sequelize, Sequelize.DataTypes);
db.address = require("./Customer/Address")(sequelize, Sequelize.DataTypes);

// Establish Realtion Between Shop and Customers
db.shop.hasMany(db.customer, { foreignKey: "shop_id" });
db.customer.belongsTo(db.shop, { foreignKey: "shop_id" });


// Establish Realtion Between Customer and Address one To many
db.customer.hasMany(db.address, { as: "addresses", foreignKey: "customer_id" });
db.address.belongsTo(db.customer, { foreignKey: "customer_id" });

// Schema of Product and Variants and Images
db.product = require('./Product/Product')(sequelize, Sequelize.DataTypes);
db.variant = require('./Product/variants')(sequelize, Sequelize.DataTypes);
db.images = require('./Product/images')(sequelize, Sequelize.DataTypes);

// Establish Realtion Between Shop and Product
db.shop.hasMany(db.product, { foreignKey: "shop_id" });
db.product.belongsTo(db.shop, { foreignKey: "shop_id" });


// Product and Varinats One to Many Relationship
db.product.hasMany(db.variant , {as : "variants" , foreignKey: "Product_id"});
db.variant.belongsTo(db.product, { foreignKey: "Product_id" });

// Product and Images one to Many Relationship
db.product.hasMany(db.images , {as : "Images" , foreignKey: "Product_id"});
db.images.belongsTo(db.product, { foreignKey: "Product_id" });


db.sequelize.sync({ force:false }).then(() => {
  console.log("re sync is done");
});

module.exports = db;

