import jwt from 'jsonwebtoken'
import 'dotenv/config.js'

const signToken = (data, secret, expiresIn) => {
    try {
        return jwt.sign(data, secret, {
            expiresIn,
            algorithm: "HS512",
          });
    } catch (error) {
        console.log(error)
    }
};

const signAuthToken = (data) => {

    try {
        
        return signToken(data, process.env.WORD,'1h');

    } catch (error) {
        console.log(error)
    }
  
}


export {
    signAuthToken
}