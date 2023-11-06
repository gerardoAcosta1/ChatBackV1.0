
import defineModels from "../../models/index.js";

const { Conversation, Message, User } = defineModels();

const sendMessage = async (req, res) => {

    try {

        const ConversationId = req.params.id

        const { SenderId, content, Sender } = req.body

        const conversationExist = await Conversation.findOne({
            where: { id: ConversationId }
        })

        if (!conversationExist) {
            return res.json('la conversación no existe')
        }
        
        const newMessage = await Message.create({
            ConversationId,
            SenderId,
            content,
            Sender
        })

        res.status(200).json(newMessage);
    } catch (error) {
        console.log(error)
        res.json(error)
    }
}

const getAllMessages = async (req, res) => {

    try {
        const { id: conversationId } = req.params;

        const messages = await Message.findAll({
            where: { ConversationId: conversationId },//se filtran los mensajes por ID de conversación
            order: [['createdAt', 'DESC']], // Ordenamos los mensajes por fecha de creación en orden descendente (para obtener los últimos primeros)
            limit: 40, // Limitamos la consulta a los últimos 20 mensajes
            
        })

        if (messages.length < 1) {
            return res.json('sin mensajes para esta conversación')
        }

        res.status(200).json(messages);
    } catch (error) {
        res.json(error)
    }
}

export {

    sendMessage,
    getAllMessages
}