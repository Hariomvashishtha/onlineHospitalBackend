import { updateUser,deleteUser,getSingleUser,getAllUser ,getUserProfile,getMyAppointments} from "../Controllers/userController.js";
// very imp to write .js file 
import express from "express";
const router = express.Router();
import { authenticate ,restrict} from "../auth/verifyToken.js";
// apply this middle ware 
router.get("/:id",authenticate,restrict(["patient","admin"]),getSingleUser); // dynamic router 
router.get("/",authenticate,restrict(["admin","patient"]),getAllUser);
router.put("/:id",authenticate,restrict(["patient","admin"]),updateUser); // update user 
router.delete("/:id",authenticate,restrict(["patient","admin"]),deleteUser);
router.get("/profile/me",authenticate,restrict(["patient","admin"]),getUserProfile);
router.get("/appointments/my-appointments",authenticate,restrict(["patient","admin"]),getMyAppointments);
export default router;
