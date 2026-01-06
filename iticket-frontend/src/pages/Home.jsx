import React, { Suspense } from "react";
import "./Home.css";
import TrendingSection from "../components/TrendingSection"; 
import ConcertSection from "../components/ConcertSection";
import HeroSection from "../components/HeroSection";
import TourismSection from "../components/TourismSection";
import TheaterSection from "../components/TheaterSection";
import CustomCursor from "../components/CustomCursor";
import MoodEvents from "../components/MoodEvents";
import SportsSection from "../components/SportsSection";
import MuseumSection from "../components/MuseumSection";
import EuropeMap from "../components/EuropeMap";


function Home() {
  return (
    <div>
      <TrendingSection />
      <ConcertSection />
      <HeroSection />
      <TourismSection />
      <TheaterSection />
      <CustomCursor />
      <MoodEvents />
      <SportsSection />
      <MuseumSection />
      <EuropeMap />

          </div>
  );
}

export default Home;
