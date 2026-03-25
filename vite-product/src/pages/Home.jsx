import React from 'react'
import Banner from '../components/home/Banner'
import Hero from '../components/home/Hero'
import CallToAction from '../components/home/CallToAction'
import Footer from '../components/home/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FFF7E3] text-[#025c52]">
        <Banner/>
        <Hero/>
        <CallToAction/>
        <Footer/>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

          body {
            background: #FFF7E3;
            color: #025c52;
          }

          .home-display {
            font-family: 'Cormorant Garamond', serif;
          }

          .home-body {
            font-family: 'Manrope', sans-serif;
          }

          .vintage-float {
            animation: vintageFloat 7s ease-in-out infinite;
          }

          .vintage-drift {
            animation: vintageDrift 16s linear infinite;
          }

          .vintage-fade-up {
            animation: vintageFadeUp 0.9s ease-out both;
          }

          @keyframes vintageFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes vintageDrift {
            0% { transform: translateX(0px); }
            50% { transform: translateX(14px); }
            100% { transform: translateX(0px); }
          }

          @keyframes vintageFadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
    </div>
  )
}

export default Home
