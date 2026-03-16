import { Routes, Route, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Layout from "./components/Layout";
import Home from "./pages/client/home/Home";
import About from "./pages/client/about/About";
import Blog from "./pages/client/blog/Blog";
import Contact from "./pages/client/contact/Contact";

import Concert from "./pages/client/concert/Concert";
import Theater from "./pages/client/theater/Theater";
import Kids from "./pages/client/kids/Kids";
import Sport from "./pages/client/sport/Sport";
import Movie from "./pages/client/cinema/Movie";
import Museum from "./pages/client/museum/Museum";
import Circus from "./pages/client/circus/Circus";
import Tourism from "./pages/client/tourism/Tourism";
import Cinema from "./pages/client/cinema/Cinema";

import ConcertDetail from "./pages/client/concert/ConcertDetail";
import SportDetail from "./pages/client/sport/SportDetail";
import TheaterDetail from "./pages/client/theater/TheaterDetail";
import CircusDetail from "./pages/client/circus/CircusDetail";
import KidsDetail from "./pages/client/kids/KidsDetail";
import MuseumsDetail from "./pages/client/museum/MuseumDetail";
import TourismDetail from "./pages/client/tourism/TourismDetail";

import SignUp from "./pages/client/auth/SignUp";
import SignIn from "./pages/client/auth/SignIn";

/* ===== ADMIN ===== */
import Dashboard from "./pages/admin/dashboard/Dashboard";
import SliderIndex from "./pages/admin/slider/SliderIndex";
import CreateSliderForm from "./pages/admin/slider/CreateSliderForm";
import EditSliderForm from "./pages/admin/slider/EditSliderForm";


import SettingIndex from "./pages/admin/setting/SettingIndex";
import CreateSettingForm from "./pages/admin/setting/CreateSettingForm";
import EditSettingForm from "./pages/admin/setting/EditSettingForm";
import SettingDetail from "./pages/admin/setting/SettingDetail";

import CategoryIndex from "./pages/admin/category/CategoryIndex";
import CreateCategoryForm from "./pages/admin/category/CreateCategoryForm";
import EditCategoryForm from "./pages/admin/category/EditCategoryForm";


import PersonIndex from "./pages/admin/person/PersonIndex";
import CreatePersonForm from "./pages/admin/person/CreatePersonForm";
import EditPersonForm from "./pages/admin/person/EditPersonForm";


import LanguageIndex from "./pages/admin/language/LanguageIndex";
import CreateLanguageForm from "./pages/admin/language/CreateLanguageForm";
import EditLanguageForm from "./pages/admin/language/EditLanguageForm";


import SubCategoryIndex from "./pages/admin/subcategory/SubCategoryIndex";
import CreateSubCategoryForm from "./pages/admin/subcategory/CreateSubCategoryForm";
import EditSubCategoryForm from "./pages/admin/subcategory/EditSubCategoryForm";



import ProductIndex from "./pages/admin/product/ProductIndex";
import CreateProductForm from "./pages/admin/product/CreateProductForm";
import EditProductForm from "./pages/admin/product/EditProductForm";
import DetailProduct from "./pages/admin/product/DetailProduct";





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
        <h1 style={styles.logoText}>
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
      <Route path="/event/museumdetail/:id" element={<Layout><MuseumsDetail /></Layout>} />
      <Route path="/event/tourismdetail/:id" element={<Layout><TourismDetail /></Layout>} />

      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      {/* ================= ADMIN  ================= */}
      <Route path="/admin" element={<Dashboard />}>
        <Route index element={<h2>Admin Dashboard</h2>} />
        <Route path="dashboard" element={<h2 style={{fontSize:"40px",display:"flex" , justifyContent:"center",alignItems:"center",marginTop:"-3pc"}}>Admin Dashboard</h2>} />

        <Route path="slider/sliderIndex" element={<SliderIndex />} />
        <Route path="slider/createSliderForm" element={<CreateSliderForm />} />
        <Route path="slider/editSliderForm/:id" element={<EditSliderForm />} />

        <Route path="setting/settingIndex" element={<SettingIndex />} />
        <Route path="setting/createSettingForm" element={<CreateSettingForm />} />
        <Route path="setting/editSettingForm/:id" element={<EditSettingForm />} />
        <Route path="setting/settingDetail/:id" element={<SettingDetail />} />

        <Route path="category/categoryIndex" element={<CategoryIndex />} />
        <Route path="category/createCategoryForm" element={<CreateCategoryForm />} />
        <Route path="category/editCategoryForm/:id" element={<EditCategoryForm />} />


        <Route path="person/personIndex" element={<PersonIndex />} />
        <Route path="person/createPersonForm" element={<CreatePersonForm />} />
        <Route path="person/editPersonForm/:id" element={<EditPersonForm />} />

        <Route path="language/languageIndex" element={<LanguageIndex />} />
        <Route path="language/createLanguageForm" element={<CreateLanguageForm />} />
        <Route path="language/editLanguageForm/:id" element={<EditLanguageForm />} />

        <Route path="subcategory/subCategoryIndex" element={<SubCategoryIndex />} />
        <Route path="subcategory/createSubCategoryForm" element={<CreateSubCategoryForm />} />
        <Route path="subcategory/editSubCategoryForm/:id" element={<EditSubCategoryForm />} />

        <Route path="product/productIndex" element={<ProductIndex />} />
        <Route path="product/createProductForm" element={<CreateProductForm />} />
        <Route path="product/editProductForm/:id" element={<EditProductForm />} />
        <Route path="product/detailProduct/:id" element={<DetailProduct />} />
      </Route>
    </Routes>
  );
}

export default App;

const styles = {
  preloaderSection: {
    position: "fixed",
    inset: 0,
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  logoText: {
    fontSize: "50px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    animation: "flipOut 2s forwards",
  },
  logoIcon: {
    color: "#640c0c",
    fontSize: "55px",
  },
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes flipOut {
  0% { transform: rotateY(0deg); opacity: 1; }
  50% { transform: rotateY(90deg); opacity: 0.7; }
  100% { transform: rotateY(180deg); opacity: 0; }
}
`, styleSheet.cssRules.length);
