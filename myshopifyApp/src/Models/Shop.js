// Shop Schema 
module.exports = ( sequelize , DataTypes ) => {
    const Shop = sequelize.define('Shop', {
        id:{
            type:DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey:true
        },
        AccessToken:{
            type:DataTypes.STRING,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull: false,  
        },
        domain:{
            type:DataTypes.STRING,
            allowNull: false,  
        },
        customer_email:{
            type:DataTypes.STRING,
            allowNull: false,  
        },
        myshopify_domain:{
            type:DataTypes.STRING,
            allowNull: false,  
        },
    },{
        freezeTableName: true
    });

    return Shop;
};

