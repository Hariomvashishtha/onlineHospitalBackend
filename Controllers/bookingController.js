import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";
const photo_default="http://res.cloudinary.com/dfqhfwxvy/image/upload/v1714440252/lzrryprb8f4kxl6pnasn.png";

export const getCheckoutSession = async (req, res) => {
  try {
    // cuurent booker doctor
    
    const doctor = await Doctor.findById(req.params.doctorId);
    // cuurent booker user
    const user = await User.findById(req.userId);
    //create a session for the stripe
    const domainURL = process.env.STRIPE_SECRET_KEY;
    const  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    //const stripe = new stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/doctor/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "USD",
            unit_amount: (doctor.ticketPrice || 200) * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio || "bio testing",
              images: [doctor.photo  || photo_default ],
            },
            
          },
          quantity: 1,
        },
      ],
    });


    // create a new booking 
    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice || 60,
      session : session.id,
      appointmentDate:new Date(),
    //   doctorInfo: {
    //     name: doctor.name,
    //     email: doctor.email,
    //     address: doctor.address,
    //     specialization: doctor.specialization,
    //   },
    //   userInfo: {
    //     name: user.name,
    //     email: user.email,
    //     address: user.address,
    //   },
    //   paymentInfo: {
    //     id: session.payment_intent,
    //     status: session.payment_status, // payment intent id
    //   }
    });
    await booking.save();
    res.status(200).json({ success : true, message :" Successfully paid ", session});

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success :false,  message: "Error created checkout session"});
  }
};
