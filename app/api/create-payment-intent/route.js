// This is your test secret API key.

import { getPackage } from "@/app/_lib/data-service";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "../../_lib/data-service";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  const { packagename } = await req.json();
  console.log("packagename", packagename);
  const session = await getServerSession();

  const emailFromSession = session.user.email;
  console.log(
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    emailFromSession
  );
  const userDataFromDb = await getUserByEmail(emailFromSession);

  let price = 400;

  // Fetch the package info from the database
  try {
    const packageInfo = await getPackage(packagename);

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
      metadata: {
        userId: userDataFromDb.id,
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
