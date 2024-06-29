import express from "express";
import { createContactRequest } from "../Controllers/contactController.js"; // must be the .js extension 
import { authenticate, restrict } from "../auth/verifyToken.js";
const router = express.Router();
router.post("/", createContactRequest);
export default router;