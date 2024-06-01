import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";
const photo_default="http://res.cloudinary.com/dfqhfwxvy/image/upload/v1714440252/lzrryprb8f4kxl6pnasn.png";
const JWT_SECRET='48b9f6c1a8d6b7b7115b650648271dee315ca3000f75e657572eb04e5ae836b388be83b7122ada41a63da65f0d76ef67c64c52728cd44935d72c9889a9a1832f'
const STRIPE_SECRET_KEY='sk_test_51PFFNNSCY92SifIK3jhFRWFQLVxnvlgdLKPVCsMDw4mKMOyZZVzLxZWEfniCOHQ3OILepIqDpcDM1melLy0NC5Wz00KKAoHHgG'

export const getCheckoutSession = async (req, res) => {
  try {
    // cuurent booker doctor
    
    const doctor = await Doctor.findById(req.params.doctorId);
    // cuurent booker user
    const user = await User.findById(req.userId);
    //create a session for the stripe
    const domainURL = STRIPE_SECRET_KEY;
    const  stripe = new Stripe(STRIPE_SECRET_KEY);
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
