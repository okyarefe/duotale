import React from "react";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import CTA from "../components/landing/CTA";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
};

export default LandingPage;
