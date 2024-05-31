import { updateDoctor,deleteDoctor,getSingleDoctor,getAllDoctor ,getDoctorProfile} from "../Controllers/doctorController.js";
import express from "express";
const router = express.Router();
// apply this middle ware
import { authenticate ,restrict} from "../auth/verifyToken.js";
import reviewRouter from "./review.js"; // using the concept of the nested routing 

// handle the request which are prefixed withe the /:doctorId/reviews .
// all the routes related to the doctor review are basically nested in the doctor Id which will grant us the review of the 
// specific doctor 
router.use("/:doctorId/reviews",reviewRouter);

router.get("/:id" ,authenticate,restrict(["doctor","admin","patient"]),getSingleDoctor); // dynamic router
router.get("/",authenticate,restrict(["admin","doctor","patient"]),getAllDoctor);
router.put("/:id",authenticate,restrict(["doctor","admin","patient"]),updateDoctor); // update doctor
router.delete("/:id" ,authenticate,restrict(["doctor","admin","patient"]),deleteDoctor);
router.get("/profiles/me",authenticate,restrict(["doctor","admin","patient"]),getDoctorProfile);
export default router;
