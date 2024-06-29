import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true }, // Unique identifier for the request
  fullName: { type: String }, // Full name of the contact (optional)
  email: { type: String }, // Email address of the contact (optional)
  mobileNumber: { type: String }, // Mobile number of the contact (optional)
  subject: { type: String, required: true }, // Subject of the contact, required
  message: { type: String, required: true }, // Message content of the contact, required
  source: { type: String , required: true}, // Source of the contact, required
});

export default mongoose.model("Contact", ContactSchema);