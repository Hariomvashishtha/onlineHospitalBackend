import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import {getCheckoutSession} from "../Controllers/bookingController.js";

const router = express.Router();
router.post("/checkout-session/:doctorId",authenticate,restrict(["patient","admin","doctor"]),getCheckoutSession);
export default router;