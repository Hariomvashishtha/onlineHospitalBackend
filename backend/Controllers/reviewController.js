import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";

// get all review function 
export const getAllReview=async(req,res)=>{
    try{
        const reviews=await Review.find({});
        res.status(200).json({success: true, message:"Reviews found successfully",data:reviews});
    }catch(err){
        res.status(404).json({success :false, message:"failed to find reviews "});
    }
}

//create review function 
export const createReview=async(req,res)=>{
    if(!req.body.doctor) req.body.doctor=req.params.doctorId;
    if(!req.body.user) req.body.user=req.userId;



    const newreview=new Review(req.body);
    try
    {
         const savedReview=await newreview.save();
         console.log("new review created is and user is " + savedReview.user);
         console.log(savedReview);
         const updatedDoctor=await Doctor.findByIdAndUpdate(req.body.doctor,{
             $push:{reviews:savedReview}    
         }); // set up the relation between the review and the doctor 
         console.log("updated doctor is " + updatedDoctor);

         res.status(200).json({success: true, message:"Review created successfully",data:savedReview});

    }
    catch(err)
    {
        res.status(500).json({success :false, message:"failed to save review "});
    }




}