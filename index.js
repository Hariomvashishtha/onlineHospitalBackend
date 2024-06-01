import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./Routes/auth.js";
import userRoutes from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";
dotenv.config();
const app=express();
const port=process.env.PORT || 8000;
const corsOptions={
    origin:true, // any domain can access the server
}

app.get("/", (req, res) => {   
    res.send("api is working");
 });    

 //  database connection
 mongoose.set("strictQuery", false);
 const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL
            
        );
        console.log(" mongodb database connected successfully");
    }catch(err){
        console.log("error while connecting to mongodb");
        console.log(err);
        
    }
 }

 // middlewares
 app.use(cors(corsOptions));
 app.use(express.json());
 app.use(cookieParser());

 app.use("/api/v1/auth", authRoutes); // any request coming on the /api/v1/auth will be handled by authRoutes
 app.use("/api/v1/users", userRoutes);
 app.use("/api/v1/doctors", doctorRoute);
 app.use("/api/v1/reviews", reviewRoute);
 app.use("/api/v1/bookings", bookingRoute);
 app.listen(port, () => {
    connectDb();
    console.log(`server is running on port ${port}`);
 })