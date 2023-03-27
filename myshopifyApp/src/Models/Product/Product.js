// product Schema
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body_html: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      vendor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      handle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at:{
        type: DataTypes.DATE,
        allowNull: true,
      }
    },
    {
      freezeTableName: true,
    }
  );

  return Product;
};
