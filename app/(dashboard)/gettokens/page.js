"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../../../components/CheckoutForm";
import CompletePage from "../../../components/CompletePage";
import Spinner from "@/components/Spinner";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function App() {
  return <h1>Not available yet</h1>;
  // const [clientSecret, setClientSecret] = React.useState("");
  // const [dpmCheckerLink, setDpmCheckerLink] = React.useState("");
  // const [confirmed, setConfirmed] = React.useState(false);
  // const [isLoading, setIsLoading] = React.useState(true); // Add loading state
  // React.useEffect(() => {
  //   setConfirmed(
  //     new URLSearchParams(window.location.search).get(
  //       "payment_intent_client_secret"
  //     )
  //   );
  // });
  // React.useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch("/api/create-payment-intent", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ packagename: "basic" }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setClientSecret(data.clientSecret);
  //       setIsLoading(false);
  //     });
  // }, []);
  // const appearance = {
  //   theme: "stripe",
  // };
  // const options = {
  //   clientSecret,
  //   appearance,
  // };
  // return (
  //   <div className="App">
  //     {isLoading ? (
  //       <Spinner /> // Show spinner while loading
  //     ) : (
  //       clientSecret && (
  //         <Elements options={options} stripe={stripePromise}>
  //           {confirmed ? <CompletePage /> : <CheckoutForm />}
  //         </Elements>
  //       )
  //     )}
  //   </div>
  // );
}
