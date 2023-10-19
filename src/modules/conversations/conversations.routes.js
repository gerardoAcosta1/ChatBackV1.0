import { Router } from "express";
import { createConversationWithParticipants, deleteConversation, getAllConversations } from "./conversations.controllers.js";

const router = Router();

router.get('/:id', getAllConversations)
router.post('/', createConversationWithParticipants)
router.delete('/:id', deleteConversation)

export default router