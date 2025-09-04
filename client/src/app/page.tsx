"use client";
import React from "react";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import FindOrganization from "@/components/landing/FindOrganization";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import Demo from "@/components/landing/Demo";
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/landing/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-dark-bg">
      <Header />
      <main>
        <Hero />
        <Features />
        <FindOrganization />
        <Pricing />
        <Testimonials />
        <Demo />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
