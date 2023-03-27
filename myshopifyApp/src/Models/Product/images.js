const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const images = sequelize.define(
      "images",
      { 
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
          },  
          position:{
            type:DataTypes.INTEGER,
            allowNull:false
          },
          width:{
            type:DataTypes.INTEGER,
            allowNull:false
          },
          height:{
            type:DataTypes.INTEGER,
            allowNull:false
          },
          src:{
            type:DataTypes.STRING,
            allowNull: false
          },
          alt:{
            type:DataTypes.STRING,
            allowNull: false
          },
          Defaultimg:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
            allowNull: false
        },
        variant_ids:{
            type: Sequelize.JSON,
            defaultValue: [],
        }
        },
      {
        freezeTableName: true,
      }
    );
  
    return images;
};
