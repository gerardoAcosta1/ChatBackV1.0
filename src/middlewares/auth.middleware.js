import jwt from "jsonwebtoken";
import 'dotenv/config.js'

const authenticate =  async (req, res, next) => {

    try {
        
        const authorization = req.headers.authorization;

        if(!authorization){

            return res.status(401).json({
                error: 'no authorization headers'
            });
        }

        const token = authorization.split(' ')[1];

        const user = await jwt.verify(token, process.env.WORD, {
            algorithms: 'HS512',
        })

        req.user = user;
       
        next();

    } catch (error) {
        
        res.status(400).json(error)
    }
}
export default authenticate