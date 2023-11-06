import defineModels from "../../models/index.js";

const { Conversation, Participant, User, Message } = defineModels()

const getAllConversations = async (req, res) => {
  try {
    const UserId = req.params.id;
    const conversations = await Participant.findAll({
      where: { UserId },
      attributes: [],
      include: {
        model: Conversation,
        include: {
          model: Participant,
          attributes: ['UserId'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      }
    });

    if (conversations.length < 1) {
      return res.status(200).json({ message: 'No existen conversaciones para este usuario' });
    } else {

      return res.status(200).json(conversations);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las conversaciones del usuario' });
  }
};



const createConversationWithParticipants = async (req, res) => {
  try {
    const { title, participantIds } = req.body;

    // Elimina duplicados
    const uniqueParticipantIds = [...new Set(participantIds)];
    const orderParticipants = uniqueParticipantIds.sort((a, b) => a - b);

    const exist = await Conversation.findOne({
      where:{title: 'General'},
      include:[{model:Participant}]
    });

    if(exist){

      const participantsGeneral = exist.Participants.map(participant => participant.UserId);

      const newParticipants = orderParticipants.filter(participant => !participantsGeneral.includes(participant));

      if(newParticipants.length > 0){

        await Promise.all(
          newParticipants.map(async idParticipant => await Participant.create(
            {
              UserId: idParticipant,
              ConversationId: exist.id
            }
          ))
        );
      }

      const updateExist = await Conversation.findOne({
        where:{title: 'General'},
        include:[{model:Participant}]
      })

      return res.status(200).json(updateExist)
    }

    const conversation = await Conversation.create({ title });

    // Se agregan los participantes
    await Promise.all(orderParticipants.map(async (participant) => {
      await Participant.create({
        UserId: participant,
        ConversationId: conversation.id,
      });
    }));

    const conversationWithParticipants = await Conversation.findByPk(conversation.id, {
      include: [
        {
          model: Participant
        }
      ]
    });

    const addConversa = [
      {
      Conversation: conversationWithParticipants
      }
  ]
    // Retorna la conversación con los participantes
    res.status(200).json(addConversa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la conversación' });
  }
};


const createPrivateConversation = async (req, res) => {

  try {
    const { usersId } = req.body
    console.log(usersId)

    const Chanel = await Conversation.create({ title: 'private' });

    const participants = await usersId.map(user => Participant.create({
      UserId: user,
      ConversationId: Chanel.id
    }));

    res.status(200).json(Chanel);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la conversación' });
  }
}

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
  createPrivateConversation,
  deleteConversation
}