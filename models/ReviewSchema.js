
import mongoose from "mongoose";
import Doctor from "./DoctorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);


// enhance the review system by providing the user info who has provided the info 
// this middleware function can be used to populate the user info in the review system
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user", // inside the review schema 
//     select: "name",
//   });
//   next();
// });


//calculate the average rating
reviewSchema.statics.getAverageRating = async function (doctorId) {
  // this points the current review , aggregation pipeline of mongodb 
    const stats = await this.aggregate([
    {
      $match: { doctor: doctorId }, // match with doctorId
    },
    {
      $group: {
        _id: "$doctor",     // group on id
        averageRating: { $avg: "$rating" },   
        numOfRatings: { $sum: 1 },   //calculate no of rating    // calculate the average rating
      },
    },
  ]);

  console.log(stats);
  await Doctor.findByIdAndUpdate(doctorId, {
    averageRating: stats[0].averageRating,
   totalRating : stats[0].numOfRatings

      
  });


//   if (stats.length > 0) {
//     await this.model("Doctor").findByIdAndUpdate(doctorId, {
//       averageRating: stats[0].averageRating,
//     });
//   } else {
//     await this.model("Doctor").findByIdAndUpdate(doctorId, {
//       averageRating: 0,
//     });
//   }
}



// call the function to calculate the average rating
reviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.doctor);
})







export default mongoose.model("Review", reviewSchema);
