import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
    return jwt.sign({id:user._id, role:user.role},process.env.JWT_SECRET,{expiresIn:"15d"});
    
}
export const register = async (req, res) => {
    const {name, email, password,gender,photo,role} = req.body; // kind of data we will get from the register 

    try{
      let user=null;
      if(role==='patient')
      {
        user=await User.findOne({email})
      }
      else if(role==='doctor')
      {
        user=await Doctor.findOne({email})
      }
      // check if user already exists
      if(user)
      {
        return res.status(400).json({message: "user already exists"});

      }
      //has password
      const salt=await bcrypt.genSalt(10); // random value , higher number can slow down the hashing 
      const hashPassword=await bcrypt.hash(password,salt);
      if(role==='patient')
      {
         user=new User({
           name,
           email,
           password:hashPassword,
           gender,
           photo,
           role
         });
      }
      if(role=='doctor')
      {
        user=new Doctor({
          name,
          email,
          password:hashPassword,
          gender,
          photo,
          role
        });
      }
      await user.save();
      res.status(200).json({ success :true,message:"user created successfully"});

    }
    catch(err){
        res.status(500).json({ success :false,message:"Internal server error ,try again "});
    }
}

export const login= async (req, res) => {
    
    const {email} = req.body; // face issue if password access here 

    try{
        let user=null;
        const patient=await User.findOne({email});
        const doctor=await Doctor.findOne({email});
        if(patient)
        {
             user=patient;
        }
        if(doctor)
        {
            user=doctor;
        }
        // no user is found 
        if(!user)
        {
            return res.status(400).json({message: "user not found"});
        }
        const password1=user.password;
        const isPasswordMatch=await bcrypt.compare(req.body.password,user.password);
        if(!isPasswordMatch)
        {
            return res.status(400).json({status :false,message: "invalid credentials"});
        }
        // const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET); // gen token
        // res.status(200).json({success:true,token});  this is codium code 
        const token=generateToken(user);
        const {password,role,appointments, ...other}=user._doc; // extract some fields from the user docs 
        res.status(200).json({success:true,message : "Log in successfully",token,data:{...other}, role,appointments});  

    }
    catch(err){
        res.status(500).json({ success :false,message:"failed to login "+err});
    }
}