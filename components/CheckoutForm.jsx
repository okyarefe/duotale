"use client";
import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import SubscriptionPage from "./SubscriptionPage";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState(null);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/gettokens",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
      console.log(error);
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      <SubscriptionPage />
      <div className="max-w-xl mx-auto mt-10 p-6 border-b-indigo-300 rounded-lg shadow-lg">
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            {" "}
            <PaymentElement
              id="payment-element"
              options={paymentElementOptions}
            />
          </div>

          <button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span id="button-text" className="flex items-center justify-center">
              {isLoading ? (
                <div
                  className="spinner animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                  id="spinner"
                ></div>
              ) : (
                "Pay now"
              )}
            </span>
          </button>
          {/* Show any error or success messages */}
          {message && (
            <div
              id="payment-message"
              className="text-center text-sm font-medium text-gray-700 bg-gray-100 p-3 rounded-md"
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </>
  );
}
