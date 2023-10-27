import { Participant } from "./participants.model.js";
import { Conversation } from "./conversation.model.js";
import { User } from "./user.model.js";
import { Message } from "./messages.model.js";
const defineModels = () => {
  
    Participant.belongsTo(Conversation); // Un participante pertenece a una conversación
    Conversation.hasMany(Participant); // Una conversación puede tener varios participantes
    Participant.belongsTo(User);
    User.hasMany(Participant);
   
    User.hasMany(Message, {foreignKey: 'SenderId'})
    Message.belongsTo(Conversation, {
      foreignKey: 'ConversationId',
      onDelete: 'CASCADE',
    });
    Conversation.hasMany(Message, {
      foreignKey: 'ConversationId',
      onDelete: 'CASCADE',
    });
    
    return {
      Conversation,
      Participant,
      User,
      Message
    };
  };
  
  export default defineModels;
  