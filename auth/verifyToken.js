import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";
import { toast } from "react-toastify";
const JWT_SECRET='48b9f6c1a8d6b7b7115b650648271dee315ca3000f75e657572eb04e5ae836b388be83b7122ada41a63da65f0d76ef67c64c52728cd44935d72c9889a9a1832f'
const STRIPE_SECRET_KEY='sk_test_51PFFNNSCY92SifIK3jhFRWFQLVxnvlgdLKPVCsMDw4mKMOyZZVzLxZWEfniCOHQ3OILepIqDpcDM1melLy0NC5Wz00KKAoHHgG'

// takes the 3 parameter and next is the function which pass the controller to the next middleware
// in the context of this code snippet, "Bearer" is a type of token authentication scheme commonly used in web applications.

// The Authorization header in the HTTP request typically contains a token in the format "Bearer ". The "Bearer" prefix is used to indicate that the token is a bearer token, which is a type of token that is used to authenticate and authorize requests.
export const authenticate=async(req,res,next)=>{
    // get token from req header 
    
    const authToken=req.headers.authorization;
    // check if token is null
    if(!authToken || !authToken.startsWith("Bearer "))
    {
          toast.error("no token unauthorized access");
        return res.status(401).json({success:false,message:" no token unauthorized access"});

    }
    try
    {
        //console.log(authToken);
        const token=authToken.split(" ")[1]; // ACTUAL TOKEN VALUE
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        // if token is valid we will get the id of the user
        req.userId=decoded.id;
        req.role=decoded.role;

        next();
    }
    catch(err)
    {
        if(err.name==="TokenExpiredError")
        {
            toast.error("token expired");
            return res.status(401).json({success:false,message:"token expired"});
        }
        toast.error("no token (invalid token )catch block unauthorized access");
        res.status(401).json({success:false,message:" no token (invalid token )catch block unauthorized access"});
    }
    
}



// using the concept of the higher order function 
export const restrict=(roles)=>async(req,res,next)=>{
    const userId=req.userId; // added by the previous middleware
    let user;
    const patient=await User.findById(userId);
    const doctor=await Doctor.findById(userId);
    if(patient)
    {
        user=patient;
    }
    if(doctor)
    {
        user=doctor;

    }

    if(!roles.includes(user?.role))
    {
        return res.status(401).json({success:false,message:"unauthorized role for access"});
    }
    next();
}
    
