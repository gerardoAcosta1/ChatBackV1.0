import { Router } from "express";
import { getAllUsers, addNewUser, loginUser } from "./users.controllers.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = Router();

router
    .route('/')
    .get(authenticate, getAllUsers)
    .post(addNewUser)

router.post('/login/', loginUser)

export default router