import express from "express";
// controllers
import { deleteUser, getCurrentUser, getSingleUser, updateUser } from "../controllers/user.controller.js";
// middlewares
import { authenticateUser } from '../middleware/authentication.js'

const router = express.Router();


router.patch("/updateUser", authenticateUser, updateUser)
router.delete("/deleteUser", authenticateUser, deleteUser)
router.get('/getCurrentUser', authenticateUser, getCurrentUser)
router.get("/:id", authenticateUser, getSingleUser)

export default router;
