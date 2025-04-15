import express from "express";
const router = express.Router();
// controllers
import { signup, login, googleAuth, logout } from "../controllers/auth.controller.js";
// middlewares
import { authenticateUser } from '../middleware/authentication.js'



router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.delete("/logout", authenticateUser, logout);


export default router;
