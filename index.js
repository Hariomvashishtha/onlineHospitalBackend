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
import contactRoute from "./Routes/contact.js";
// worrking version 
const MONGO_URL="mongodb+srv://hs1957490:Nishu%402001@cluster0.qhlqz6y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
dotenv.config();
const app=express();
const port=process.env.PORT || 3000;
const corsOptions={
    origin:true, // any domain can access the server
}

app.get("/", (req, res) => { 
    console.log("request came from frontend");  
    res.send("api is working");
 });    
app.get("/testing",(req,res)=>{
    res.send("testing");
}); 

 //  database connection
 mongoose.set("strictQuery", false);
 const connectDb=async()=>{
    try{
        await mongoose.connect(MONGO_URL
            
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
 app.use("/api/v1/contact", contactRoute);


//  app.listen(port, "0.0.0.0", function () {
//     // ...
//   });
 app.listen(port,"0.0.0.0", () => {
    connectDb();
    console.log(`server is running on port ${port}`);
 })