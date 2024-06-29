import ContactSchema from "../models/ContactSchema.js";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 function from uuid package


export const createContactRequest = async (req, res) => {
    req.body.source="online Hospital website";
    if(req.body.fullName=="" || req.body.fullName==null || req.body.fullName==undefined)
    {
        req.body.fullName="Anonymous name";
    }
    if(req.body.email=="" || req.body.email==null || req.body.email==undefined)
    {
        req.body.email="Anonymous@gmail.com";
    }
    if(req.body.mobileNumber=="" || req.body.mobileNumber==null || req.body.mobileNumber==undefined)
    {
        req.body.mobileNumber="0000000000";
    }
    const { fullName, email, mobileNumber, subject, message ,source} = req.body;
    const requestId = uuidv4(); // Generate a unique ID for the request
    try {
        const newContact = new ContactSchema({
            requestId,
            fullName ,
            email,
            mobileNumber,
            subject,
            message,
            source 
        });
        await newContact.save();
        res.status(200).json({ success: true, message: "contact created", data: newContact });
    } catch (error) {
        res.status(500).json({ success: false, message: "failed to create" , data: error});
    }
}