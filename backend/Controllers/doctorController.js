
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
export const updateDoctor=async(req,res)=>{
    const {id}=req.params;
    try{
        const upDatedDoctor=await Doctor.findByIdAndUpdate(id,{$set:req.body},{new:true});
        console.log(updateDoctor);
        // get the updated Doctor in response . this is function of the new;true option 
        res.status(200).json({success: true, message:"successfully updated Doctor",data:upDatedDoctor});
    }catch(err){
        res.status(500).json({success :false, message:"failed to update"});
    }
}
// currently anyone can identify the info but i want checks on them for the updating
export const deleteDoctor=async(req,res)=>{
    const {id}=req.params;
    try{
        await Doctor.findByIdAndDelete(id);
       
        res.status(200).json({success: true, message:"successfully deleted  Doctor"});
    }catch(err){
        res.status(500).json({success :false, message:"failed to delete "});
    }
}
export const getSingleDoctor=async(req,res)=>{
    const {id}=req.params;
    try{
        const doctor=await Doctor.findById(id).populate("reviews").select("-password");
       
        res.status(200).json({success: true, message:"Doctor found successfully",data:doctor});
    }catch(err){
        res.status(404).json({success :false, message:"failed to find Doctor "});
    }
}

export const getAllDoctor=async(req,res)=>{
    //const {id}=req.params; instead of id we have to implement the search functionality in the frontend
    // so we are using the query parameter for this 
    
    try{
        const {query}   = req.query;
        let  doctors;
        if(query)
        {
            doctors=await Doctor.find({isApproved:'approved',$or:[{name:{$regex:query,$options:"i"}},{speciality:{$regex:query,$options:"i"}}]}).select("-password");
        }
        else
        {
            doctors=await Doctor.find({isApproved:'approved'}).populate("reviews").select("-password"); // pass empty object and find all the Doctor in the database
              // avoid sending the password or sensitive data 
              //=await Doctor.find({}).select("-password");
        }
        
      
       
        res.status(200).json({success: true, message:"Doctors found successfully",data:doctors});
    }catch(err){
        res.status(404).json({success :false, message:"failed to find  all Doctor "});
    }
}


export const getDoctorProfile=async(req,res)=>{
    const doctorId=req.userId;
    try
    {
        const doctor=await Doctor.findById(doctorId);
        //.select("-password");
        if(!doctor)
        {
            return res.status(404).json({success :false, message:"Doctor not found"});
        }
        const {password, ...others}=doctor._doc;
        const appointments=await Booking.find({doctor:doctor._id});
        res.status(200).json({success: true, message:"Doctor found successfully",data:{...others,appointments}});



    }
    catch(err)
    {
        res.status(500).json({success :false, message:"Something went wrong get doctor profile please try again"});
    }
}






