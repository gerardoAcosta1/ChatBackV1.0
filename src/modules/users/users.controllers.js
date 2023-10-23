import defineModels from "../../models/index.js"
import bcryp from 'bcrypt'
import { signAuthToken } from "../../utils/singToken.js";

const { User } = defineModels();

const getAllUsers = async (req, res) => {

    try {

        const users = await User.findAll()

        res.status(200).json(users)
    } catch (error) {

        res.status(500).json({error: 'error al obtener los usuarios'})
    }
}
const addNewUser = async (req, res) => {

    try {

        const newUser = req.body

        const userExist = await User.findOne({
            where: {username: newUser.username}
        })

        if(userExist){
            res.json('el usuario ya existe')
        }else{
            const user = await User.create(newUser)
        
            res.status(200).json(user);
        }

    
    } catch (error) {
        console.log(error)
        res.status(409).json({error: 'error en la base creando al usuario'})
    }
}

const loginUser = async (req, res) => {

    try {
        
        const {username, password} = req.body

        const user = await User.findOne({
            where: {username}
        })
        console.log(user)
        if(!user){
            
            res.status(404).json({message: 'user not found'})
        }

        const validPassword = await bcryp.compare(password, user?.password);

        if(!validPassword){
            res.status(300).json({message: 'error, la contraseña no coincide'})
        }

        const copyUser = {...user.dataValues}
        delete copyUser.password

        const token = signAuthToken(copyUser);
        copyUser.token = token;

        res.status(200).json(copyUser);

    } catch (error) {

        console.log(error)
        res.status(409).json({error: 'error validando al usuario'})
    }
}
export {
    getAllUsers, 
    addNewUser,
    loginUser
}