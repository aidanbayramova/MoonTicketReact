import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Concert from "./pages/Concert";
import Theater from "./pages/Theater";
import Kids from "./pages/Kids";
import Sport from "./pages/Sport";
import Movie from "./pages/Movie";
import Museum from "./pages/Museum";
import Circus from "./pages/Circus";
import Tourism from "./pages/Tourism";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Cinema from "./pages/Cinema"; 
import ConcertDetail from "./pages/ConcertDetail"; 
import SportDetail from "./pages/SportDetail"; 
import  TheaterDetail from "./pages/TheaterDetail"; 
import  CircusDetail from "./pages/CircusDetail"; 
import  KidsDetail from "./pages/KidsDetail"; 
import  MuseumsDetail from "./pages/MuseumDetail"; 
import  TourismDetail from "./pages/TourismDetail"; 
import  Dashboard from "./pages/admin/Dashboard"; 









import React, { useState, useEffect } from "react";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) {
    return (
      <section style={styles.preloaderSection}>
        <h1 style={styles.logoText} className="preloader-text">
          <span style={styles.logoIcon}>▶</span>
          
          <span style={{ color: "#fff" }}>MOON</span>
          <span style={{ color: "#640c0c" }}>TICKET</span>
        </h1>
      </section>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/blog" element={<Layout><Blog /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/event/concert" element={<Layout><Concert /></Layout>} />
      <Route path="/event/theater" element={<Layout><Theater /></Layout>} />
      <Route path="/event/kids" element={<Layout><Kids /></Layout>} />
      <Route path="/event/sport" element={<Layout><Sport /></Layout>} />
      <Route path="/event/movie" element={<Layout><Movie /></Layout>} />
      <Route path="/event/museum" element={<Layout><Museum /></Layout>} />
      <Route path="/event/circus" element={<Layout><Circus /></Layout>} />
      <Route path="/event/tourism" element={<Layout><Tourism /></Layout>} />
      <Route path="/event/cinema/:id" element={<Layout><Cinema /></Layout>} />
      <Route path="/event/concertdetail/:id" element={<Layout><ConcertDetail /></Layout>} />
      <Route path="/event/sportdetail/:id" element={<Layout><SportDetail /></Layout>} />
      <Route path="/event/theaterdetail/:id" element={<Layout><TheaterDetail /></Layout>} />
      <Route path="/event/circusdetail/:id" element={<Layout><CircusDetail /></Layout>} />
      <Route path="/event/kidsdetail/:id" element={<Layout><KidsDetail /></Layout>} />
      <Route path="/event/museumdetail/:id" element={<Layout><MuseumsDetail/></Layout>} />
      <Route path="/event/tourismdetail/:id" element={<Layout><TourismDetail/></Layout>} />
      <Route path="/admin/dashboard" element={<Dashboard />} />



      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}

export default App;

const styles = {
  preloaderSection: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  logoText: {
    fontSize: "50px",
    fontWeight: "bold",
    letterSpacing: "2px",
    animation: "flipOut 2s forwards",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    color: "#640c0c",
    fontSize: "55px",
    marginRight: "10px",
  }
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes flipOut {
  0% { transform: rotateY(0deg); opacity: 1; }
  50% { transform: rotateY(90deg); opacity: 0.7; }
  100% { transform: rotateY(180deg); opacity: 0; }
}
`, styleSheet.cssRules.length);
