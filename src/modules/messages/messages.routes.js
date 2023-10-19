import { Router } from "express";
import { getAllMessages, sendMessage } from "./messages.controllers.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = Router();

router
    .route('/:id')
    .get(authenticate, getAllMessages)
    .post(authenticate, sendMessage)

export default router