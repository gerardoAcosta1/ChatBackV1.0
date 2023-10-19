import defineModels from "../../models/index.js";

const { Conversation, Participant, User, Message } = defineModels()

const getAllConversations = async (req, res) => {

  try {
    const userId = req.params.id;

    const conversations = await Participant.findAll({
      where: { UserId: userId },
      attributes: [],
      include: {
        model: Conversation,
        attributes:['id', 'title'],
        include: {
          model: Participant,
          attributes: ['UserId'],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      },
    });

    if(conversations.length < 1){
      return res.json('no existen conversaciones para este usuario')
    }

    res.status(200).json(conversations);
    
  } catch (error) {
    
    res.status(500).json({ error: 'Error al obtener las conversaciones del usuario' });
  }
};

const createConversationWithParticipants = async (req, res) => {

  try {

    const { title, participantIds } = req.body;


    const newConversation = await Conversation.create({ title });

    for (const userId of participantIds) {
      await Participant.create({ UserId: userId, ConversationId: newConversation.id });
    }

    res.status(201).json({ message: 'Conversación creada con participantes' });

  } catch (error) {

    res.status(500).json({ error: 'Error al crear la conversación' });
  }
};

const deleteConversation = async (req, res) => {

  try {
    const { id } = req.params; 

    const participantExist = await Participant.findOne({
      where: { ConversationId: id } 
    });

    if(!participantExist){
      return res.json('la conversacion no existe')
    }

    await Participant.destroy({
      where: { ConversationId: id } 
    });

    await Message.destroy({
      where: { ConversationId: id } 
    });

    await Conversation.destroy({
      where: { id }
    });

    res.status(201).json('Eliminada la conversación con sus participantes y mensajes.');
  } catch (error) {
console.log(error)
    res.status(500).json({ error: 'Error al eliminar la conversación' });
  }
}

export { 
  getAllConversations, 
  createConversationWithParticipants, 
  deleteConversation 
}