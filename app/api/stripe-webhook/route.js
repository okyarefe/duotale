import { updateUserCreditsBasicPackage } from "../../../app/_lib/data-service";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

export async function POST(request, response) {
  let event = request.body;
  const rawBody = await request.text();

  console.log("Incoming request to webhook endpoint");

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers.get("stripe-signature");
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return new Response("Webhook Error", { status: 400 });
    }
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("HOP 1 - - - - -  - -  - - ");
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      const userId = paymentIntent.metadata.userId;
      try {
        console.log("Initiation of updateUserCreditsBasicPackage");
        const update = await updateUserCreditsBasicPackage(userId);
      } catch (error) {
        console.error("Error updating user credits:", error);
        return new Response("Error updating user credits", { status: 500 });
      }

      return new Response("Payment Intent Succeed", { status: 200 });

    case "payment_method.attached":
      const paymentMethod = event.data.object;
      console.log("HOP 2 - - - - -  - -  - - ");
      console.log(`PAYMENT_METHOD_ATTACHED was successful!`);
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);

      return new Response("Payment method succeed", { status: 200 });
    default:
      // Unexpected event type
      console.log("HOP 3 - - - - -  - -  - - ");
      return new Response("Unknown Type", { status: 200 });
  }
}
