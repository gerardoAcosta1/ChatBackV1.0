import defineModels from "../../models/index.js"
import bcryp from 'bcrypt'
import { signAuthToken } from "../../utils/singToken.js";
import { Conversation } from "../../models/conversation.model.js";

const { User } = defineModels();

const getAllUsers = async (req, res) => {

    try {
       
        const users = await User.findAll();

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
        const { username, password } = req.body;

        const user = await User.findOne({
            where: { username }
        });

        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const validPassword = await bcryp.compare(password, user?.password);

        if (!validPassword) {
            console.log("Error: la contraseña no coincide");
            return res.status(400).json({ message: "Error, la contraseña no coincide" });
        }

        const copyUser = { ...user.dataValues };
        delete copyUser.password;

        const token = signAuthToken(copyUser);
        copyUser.token = token;

        console.log("Usuario autenticado exitosamente");
        return res.status(200).json(copyUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error validando al usuario" });
    }
};
export {
    getAllUsers, 
    addNewUser,
    loginUser
}