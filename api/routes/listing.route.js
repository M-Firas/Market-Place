import express from "express";
const router = express.Router();
// controllers
import { createListing, deleteListing, getAllListings, getSingleListing, updateListing } from "../controllers/lisitng.controller.js";
// middlewares
import { authenticateUser } from '../middleware/authentication.js'

router.post('/create', authenticateUser, createListing);
router.patch('/update/:id', authenticateUser, updateListing);
router.delete('/delete/:id', authenticateUser, deleteListing);
router.get('/getSingleListing/:id', getSingleListing);
router.get('/get', getAllListings)


export default router;