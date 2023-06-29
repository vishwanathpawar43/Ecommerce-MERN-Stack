import express from "express";
import { isAuthenticated } from "../middlerware/auth.js";
import { processPayment, sendStripeApiKey } from "../controllers/paymentController.js";

export const router=express.Router();

router.route("/payment/process").post(isAuthenticated,processPayment);

// router.route("/stripeapikey").get(isAuthenticated,sendStripeApiKey);

router.route("/stripeapikey").get(sendStripeApiKey);
