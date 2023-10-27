import { Router } from "express";
import { createConversationWithParticipants, createPrivateConversation, deleteConversation, getAllConversations } from "./conversations.controllers.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = Router();

router
    .route('/:id')
    .get(authenticate, getAllConversations)
    .delete(authenticate, deleteConversation)

router.post('/groups/', authenticate, createConversationWithParticipants)
router.post('/private/', authenticate, createPrivateConversation)

export default router