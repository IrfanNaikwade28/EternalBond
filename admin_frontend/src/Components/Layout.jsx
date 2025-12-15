import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // ✅ new
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <Header onToggleMenu={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content with Sidebar */}
      <div style={{ display: "flex", flex: 1, marginTop: "70px" }}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onCollapse={(val) => setSidebarCollapsed(val)} // ✅ get collapse state
        />

        <div
          style={{
            flex: 1,
            marginLeft: !isMobile
              ? sidebarCollapsed
                ? 80 // ✅ collapsed width
                : sidebarOpen
                ? 250 // ✅ expanded width
                : 0
              : 0,
            transition: "margin-left 0.3s ease",
            //padding: "20px",
            minHeight: "calc(100vh - 70px - 60px)",
          }}
        >
          <Outlet />
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
