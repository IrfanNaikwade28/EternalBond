import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Home } from "./Home";
import { AboutPage } from "./AboutPage";
import { Match } from "./Match";
import SuccessStories from "./ScuccessStories";
import Testimonial from "./Testimonial";
import Contact from "./Contact";
import Gallery from "./Gallery";
import { ExperienceSection } from "./ExperienceSection";
import { useLocation, useNavigate } from "react-router-dom";

export default function Landing() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1️⃣ Check if we got state from Navbar click
    const scrollToId = location.state?.scrollTo || location.hash?.replace("#", "");
    if (!scrollToId) return;

    const tryScroll = () => {
      const el = document.getElementById(scrollToId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Clear state so it doesn't scroll again on reload
        navigate(location.pathname, { replace: true, state: null });
        return true;
      }
      return false;
    };

    // Immediate scroll, if element is ready
    if (!tryScroll()) {
      // Retry after short delays (for slow render)
      [150, 350, 700].forEach((delay) => setTimeout(tryScroll, delay));
    }
  }, [location, navigate]);

  return (
    <>
      <div id="home"><Home /></div>
      <div id="about"><AboutPage /></div>
      {/* <div id="story"><ExperienceSection /></div> */}
      <div id="match"><Match /></div>
      <div id="successstories"><SuccessStories /></div>
      <div id="testimonial"><Testimonial /></div>
      <div id="gallery"><Gallery /></div>
      <div id="contact"><Contact /></div>
    </>
  );
}
