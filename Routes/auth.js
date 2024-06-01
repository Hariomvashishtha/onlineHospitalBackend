import express from "express";
import { register, login } from "../Controllers/authController.js"; // must be the .js extension 
 
const router = express.Router();
router.post("/register", register);
router.post("/login", login);// send sensitive data , so post request is used
export default router;
