module.exports = (sequelize, DataTypes) => {
    const Variant = sequelize.define(
      "Variant",
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
          },
          title:{
            type:DataTypes.STRING,
            allowNull:false
          },
          price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
          },
          sku:{
            type:DataTypes.STRING,
            allowNull: false
          },
          position:{
            type:DataTypes.INTEGER,
            allowNull:false
          },
          compare_at_price:{
            type:DataTypes.DECIMAL(10,2),
            allowNull:false
          },
          inventory_policy:{
            type:DataTypes.STRING,
            allowNull: false
          },
          image_id:{
            type:DataTypes.INTEGER,
          },
          weight:{
            type:DataTypes.FLOAT,
            allowNull:false
          },
          inventory_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          option1:{
            type:DataTypes.STRING,
            allowNull: false
          }
        },
      {
        freezeTableName: true,
      }
    );
  
    return Variant;
  };

  