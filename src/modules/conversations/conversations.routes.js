import { Router } from "express";
import { createConversationWithParticipants, deleteConversation, getAllConversations } from "./conversations.controllers.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = Router();

router
    .route('/:id')
    .get(authenticate, getAllConversations)
    .delete(authenticate, deleteConversation)

router.post('/', authenticate, createConversationWithParticipants)

export default router