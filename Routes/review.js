import { getAllReview,createReview } from "../Controllers/reviewController.js";
import express from "express";
const router = express.Router({mergeParams:true}); // to have access  params like doctorID ARE ACCESS IN NESTED ROUTE
// to use the params in the nested route . this is used  
import { authenticate,restrict } from "../auth/verifyToken.js";

// router.get("/",getAllReview);
// router.post("/",createReview);

// WE HAVE TO KEEP THIS ROUTE FOR THE SOME SPECIFIC ROUTE OR SOME specific doctor 
router.route("/").get(getAllReview).post(authenticate,restrict(["patient","admin"]),createReview);

export default router;