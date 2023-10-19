import defineModels from "../../models/index.js"

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
        }

        const user = await User.create(newUser)
        
        res.status(200).json(user);

    } catch (error) {
        console.log(error)
        res.status(409).json({error: 'error en la base creando al usuario'})
    }
}
export {
    getAllUsers, 
    addNewUser
}