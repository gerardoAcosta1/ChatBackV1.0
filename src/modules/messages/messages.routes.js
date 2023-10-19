import { Router } from "express";
import { getAllMessages, sendMessage } from "./messages.controllers.js";

const router = Router();

router.get('/:id', getAllMessages)
router.post('/:id', sendMessage)

export default router