import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
export const updateUser=async(req,res)=>{
    const {id}=req.params;
    try{
        const upDatedUser=await User.findByIdAndUpdate(id,{$set:req.body},{new:true});
        // get the updated user in response . this is function of the new;true option 
        res.status(200).json({success: true, message:"successfully updated user",data:upDatedUser});
    }catch(err){
        res.status(500).json({success :false, message:"failed to update"});
    }
}
export const deleteUser=async(req,res)=>{
    const {id}=req.params;
    try{
        await User.findByIdAndDelete(id);
       
        res.status(200).json({success: true, message:"successfully deleted  user"});
    }catch(err){
        res.status(500).json({success :false, message:"failed to delete "});
    }
}
export const getSingleUser=async(req,res)=>{
    const {id}=req.params;
    try{
        const user=await User.findById(id).select("-password");
       
        res.status(200).json({success: true, message:"User found successfully",data:user});
    }catch(err){
        res.status(404).json({success :false, message:"failed to find user "});
    }
}

export const getAllUser=async(req,res)=>{
    const {id}=req.params;
    try{
        const users=await User.find({}).select("-password"); // pass empty object and find all the user in the database
        // avoid sending the password or sensitive data 
       
        res.status(200).json({success: true, message:"User sfound successfully",data:users});
    }catch(err){
        res.status(404).json({success :false, message:"failed to find  all user "});
    }
}

export const getUserProfile=async(req,res)=>{
    const userId=req.userId;

    try{
        const user=await User.findById(userId);
        //.select("-password");
        if(!user)
        {
            return res.status(404).json({success :false, message:"user not found"});
        }
        const {password, ...others}=user._doc;
       
        res.status(200).json({success: true, message:"User found successfully",data:{...others}});
    }catch(err){
        res.status(404).json({success :false, message:"Something went wrong please try again"});
    }
}


export const getMyAppointments=async(req,res)=>{
    const userId=req.userId;


    try{
        // step1 retrive appointmnet from booking for specifice user 
        const bookings=await Booking.find({user:req.userId});
        //  step2  doctorid from doctor appointments booking 
        const doctorIds=bookings.map((booking)=>booking.doctor.id);
        // step3   retrive doctor from extracted  doctor id
        const doctors=await Doctor.find({_id:{$in:doctorIds}}).select("-password");

        // step4
       

        res.status(200).json({success: true, message:"Appintment are getting ",data:doctors});

        // codium 
       // const user=await User.findById(userId).populate("appointments").select("-password");
        // if(!user)
        // {
        //     return res.status(404).json({success :false, message:"user not found"});
        // }
        // const {password, ...others}=user._doc;
       
        // res.status(200).json({success: true, message:"User found successfully",data:others});
    }catch(err){
        res.status(500).json({success :false, message:"Something went wrong  can not get appointments please try again"});
        
    }
}



