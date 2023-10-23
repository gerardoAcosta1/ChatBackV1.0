import { Sequelize } from "sequelize";
import defineModels from "../../models/index.js";

const { Conversation, Participant, User, Message } = defineModels()

const getAllConversations = async (req, res) => {

  try {
    const userId = req.params.id;
    const conversations = await Conversation.findAll({
      include: [
        {
          model: Participant,
          where: { UserId: userId },
        },
        {
          model: User, // Relación con el creador de la conversación
          as: 'User',
          attributes: ['username'],
        },
      ],
    });
    
  

    if (conversations.length < 1) {
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

    if (!Array.isArray(participantIds)) {
      return res.status(400).json({ error: 'La lista de participantes debe ser un arreglo.' });
    }

    // Eliminar duplicados del arreglo de participantes
    const uniqueParticipantIds = [...new Set(participantIds)];

    if (uniqueParticipantIds.length < 2) {
      return res.status(400).json({ error: 'Debe haber al menos dos participantes en la conversación.' });
    }

    const orderParticipants = uniqueParticipantIds.sort((a, b) => a - b);

    const conversationsExist = await Conversation.findOne({
      include: [
        {
          model: Participant,
          where: { UserId: orderParticipants },
          group: ['Conversation.id'],
          having: Sequelize.where(
            Sequelize.fn('count', Sequelize.col('Participants.UserId')),
            orderParticipants.length
          ),
        },
      ],
    });

    if (conversationsExist) {
      return res.status(400).json(conversationsExist);
    }
    const newConversation = await Conversation.create({ title });
    for (const userId of participantIds) {
      await Participant.create({ UserId: userId, ConversationId: newConversation.id });
    }

    res.status(201).json({ message: 'Conversación creada y participantes agregados' });

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

    if (!participantExist) {
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

    res.status(201).json('Eliminada la conversación, participantes y mensajes.');
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