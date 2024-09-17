// This is your test secret API key.

import { getPackage } from "@/app/_lib/data-service";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  console.log("Incoming request, body:", req.body);
  const { packagename } = await req.json();
  let price = 400;

  console.log("Package name:", packagename);
  try {
    const packageInfo = await getPackage(packagename);
    console.log("Package info:", packageInfo);
    price = packageInfo.price;
  } catch (error) {
    console.error("Error fetching package info:", error);
    return NextResponse.error("Error fetching package info");
  }

  // Create a PaymentIntent with the order amount and currency
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "eur",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.error("Error creating PaymentIntent");
  }
}
