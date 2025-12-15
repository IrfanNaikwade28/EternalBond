import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
//import Footer from "./Footer";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen); // toggle mobile sidebar
    } else {
      setSidebarCollapsed(!sidebarCollapsed); // toggle desktop collapsed
    }
  };

  return (
    <>
    <div style={{ display: "flex",  flexDirection: "column" }}>
      <Header toggleSidebar={toggleSidebar} />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          isMobile={isMobile}
          mobileOpen={mobileOpen}
          toggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
        />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            transition: "margin-left 0.3s",
            marginLeft: isMobile
              ? 0
              : sidebarCollapsed
              ? "80px"
              : "250px",
             //padding: "10px",
          }}
        >
          <Outlet />
        </div>
      </div>
      
    </div>
    {/* <Footer/> */}
    </>
  );
};

export default Layout;
