import { Router } from "express";
import { getAllUsers, addNewUser } from "./users.controllers.js";

const router = Router();

    router.get('/', getAllUsers);
    router.post('/', addNewUser);
    
export default router