const jwt = require('jsonwebtoken');

const genreteToken = (id) => {
    return jwt.sign(
        {id},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:'1d'
        }
    );
};

module.exports = genreteToken;