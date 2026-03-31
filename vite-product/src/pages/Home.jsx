import React from "react";
import Banner from "../components/home/Banner";
import Hero from "../components/home/Hero";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div className="min-h-screen text-[var(--premium-charcoal)]" style={{ background: "linear-gradient(135deg, #f7f5f2 0%, #f5f3ef 100%)" }}>
      <Banner />
      <Hero />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
