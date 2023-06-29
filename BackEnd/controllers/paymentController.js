import { catchAsyncError } from "../middlerware/catchAsyncErrors.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment=catchAsyncError( async(req,res,next)=>{
    const myPayment= await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"inr",
        metadata:{
            compnay:"Ecommerce"
        }
    })

    console.log(myPayment.client_secret);

    res.status(200).json({
        success:true,
        client_secret:myPayment.client_secret
    })
});


export const sendStripeApiKey=catchAsyncError( async(req,res,next)=>{

    res.status(200).json({
        success:true,
        stripeApiKey:process.env.STRIPE_API_KEY
    })
});
