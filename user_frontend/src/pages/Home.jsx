import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const slides = [
    {
      id: 1,
      image: "couple1.jpg",
      title: "Where Love Stories Begin",
      subtitle: "Find your perfect match with our intelligent matching system",
      buttonText: "Start Your Journey",
      gradient: "linear-gradient(135deg, #d63384, #ff6b9d)"
    },
    {
      id: 2,
      image: "couple5.jpg",
      title: "Together Forever",
      subtitle: "Creating lasting bonds through meaningful connections",
      buttonText: "Find Your Match",
      gradient: "linear-gradient(135deg, #36d1dc, #5b86e5)"
    },
    {
      id: 3,
      image: "couple6.jpg",
      title: "A Perfect Match",
      subtitle: "Thousands of successful matches made with love and care",
      buttonText: "View Success Stories",
      gradient: "linear-gradient(135deg, #f46b45, #eea849)"
    }
  ];

  const cardFeatures = [
    { icon: "fas fa-heart", title: "AI Matching", desc: "Intelligent compatibility algorithm" },
    { icon: "fas fa-shield-alt", title: "Verified Profiles", desc: "100% authenticated members" },
    { icon: "fas fa-users", title: "Family Support", desc: "Family involvement features" },
    { icon: "fas fa-lock", title: "Privacy First", desc: "End-to-end encryption" }
  ];

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const onSlid = (e) => {
      // Bootstrap provides the target slide index in e.to
      if (typeof e.to === "number") {
        setActiveIndex(e.to);
      } else {
        // Fallback: determine index by active item position
        const items = Array.from(el.querySelectorAll(".carousel-item"));
        const current = items.findIndex((i) => i.classList.contains("active"));
        if (current >= 0) setActiveIndex(current);
      }
    };

    el.addEventListener("slid.bs.carousel", onSlid);
    // Initialize to current active
    const items = Array.from(el.querySelectorAll(".carousel-item"));
    const initial = items.findIndex((i) => i.classList.contains("active"));
    if (initial >= 0) setActiveIndex(initial);

    return () => {
      el.removeEventListener("slid.bs.carousel", onSlid);
    };
  }, []);

  return (
    <div id="home">
      {/* Hero Carousel */}
      <div
        id="weddingCarousel"
        className="carousel slide carousel-fade position-relative"
        data-bs-ride="carousel"
        data-bs-interval="3000"
        style={{
          height: "100vh",
          minHeight: "700px",
          maxHeight: "900px",
          overflow: "hidden"
        }}
        ref={carouselRef}
      >
        {/* Custom Indicators */}
        <div className="carousel-indicators custom-indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              data-bs-target="#weddingCarousel"
              data-bs-slide-to={idx}
              className={idx === activeIndex ? "active" : ""}
              aria-current={idx === activeIndex ? "true" : "false"}
              aria-label={`Slide ${idx + 1}`}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                margin: "0 8px",
                background: idx === activeIndex ? "#fff" : "rgba(255,255,255,0.5)",
                border: "2px solid #fff",
                opacity: 1,
                transition: "all 0.3s ease"
              }}
            ></button>
          ))}
        </div>

        <div className="carousel-inner" style={{ height: "100%" }}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              style={{ height: "100%" }}
            >
              <img
                src={slide.image}
                className="d-block w-100"
                alt={slide.title}
                style={{
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.8)",
                  backfaceVisibility: "hidden",
                  transform: "translateZ(0)"
                }}
                loading={index === 0 ? "eager" : "lazy"}
              />
              
              {/* Gradient Overlay */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
              }}></div>

              {/* Content Overlay */}
              <div className="carousel-caption d-flex align-items-center justify-content-start text-start"
                style={{
                  left: "8%",
                  right: "auto",
                  bottom: "auto",
                  top: "0",
                  height: "100%",
                  maxWidth: "600px"
                }}
              >
                <div className="slide-content" style={{ animationDelay: "0.5s" }}>
                  <div className="mb-4">
                    <span className="badge mb-3" style={{
                      background: slide.gradient,
                      padding: "10px 25px",
                      borderRadius: "30px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      letterSpacing: "1px",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
                    }}>
                      FIND YOUR SOULMATE
                    </span>
                    
                    <h1 className="display-3 fw-bold mb-4" style={{
                      textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
                      fontFamily: "'Playfair Display', serif",
                      lineHeight: "1.2"
                    }}>
                      {slide.title}
                    </h1>
                    
                    <p className="lead mb-4" style={{
                      fontSize: "1.3rem",
                      textShadow: "1px 1px 4px rgba(0,0,0,0.5)"
                    }}>
                      {slide.subtitle}
                    </p>
                  </div>

                  <div className="d-flex flex-wrap gap-3">
                    <button
                      className="btn btn-md px-4 d-flex justify-content-center align-items-center gap-1 py-4"
                      style={{
                        background: slide.gradient,
                        color: "#fff",
                        borderRadius: "30px",
                        fontWeight: "600",
                        border: "none",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
                      }}
                    >
                      {slide.buttonText} <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                    
                    {/* <button
                      className="btn btn-lg px-5 py-3"
                      style={{
                        background: "transparent",
                        color: "#fff",
                        borderRadius: "30px",
                        fontWeight: "600",
                        border: "2px solid #fff",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                        e.currentTarget.style.transform = "translateY(-3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <i className="fas fa-play-circle me-2"></i> How It Works
                    </button> */}
                  </div>

                  {/* Quick Stats */}
                  <div className="row mt-5 pt-4">
                    <div className="col-4">
                      <div className="text-center">
                        <h3 className="fw-bold mb-1" style={{ 
                          background: slide.gradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}>
                          10K+
                        </h3>
                        <small className="text-light">Matches Made</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center">
                        <h3 className="fw-bold mb-1" style={{ 
                          background: slide.gradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}>
                          98%
                        </h3>
                        <small className="text-light">Success Rate</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center">
                        <h3 className="fw-bold mb-1" style={{ 
                          background: slide.gradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}>
                          500+
                        </h3>
                        <small className="text-light">Cities</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Controls */}
        {/* <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#weddingCarousel"
          data-bs-slide="prev"
          style={{ width: "80px" }}
        >
          <span className="carousel-control-prev-icon" style={{
            backgroundImage: "none",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(5px)",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(255,255,255,0.3)",
            transition: "all 0.3s ease"
          }}>
            <i className="fas fa-chevron-left" style={{ fontSize: "1.5rem", color: "#fff" }}></i>
          </span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#weddingCarousel"
          data-bs-slide="next"
          style={{ width: "80px" }}
        >
          <span className="carousel-control-next-icon" style={{
            backgroundImage: "none",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(5px)",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(255,255,255,0.3)",
            transition: "all 0.3s ease"
          }}>
            <i className="fas fa-chevron-right" style={{ fontSize: "1.5rem", color: "#fff" }}></i>
          </span>
        </button> */}
      </div>

      {/* Features Section Below Carousel */}
      <div className="container py-5 mt-5" style={{ marginTop: "-100px", position: "relative", zIndex: 5 }}>
        <div className="row g-4 justify-content-center px-3">
          {cardFeatures.map((feature, index) => (
            <div className="col-12 col-md-3" key={index}>
              <div className="text-center p-4" style={{
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                border: "1px solid rgba(214, 51, 132, 0.1)",
                height: "100%",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(214, 51, 132, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
              }}>
                <div className="mb-3" style={{
                  width: "70px",
                  height: "70px",
                  margin: "0 auto",
                  background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <i className={`${feature.icon} text-white`} style={{ fontSize: "1.8rem" }}></i>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: "#333" }}>{feature.title}</h5>
                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .slide-content {
          animation: fadeInUp 1s ease-out;
          will-change: transform, opacity;
        }
        
        .carousel-item {
          transition: transform 0.8s ease-in-out, opacity 0.8s ease-in-out;
          will-change: transform, opacity;
        }
        
        .carousel-control-prev:hover span,
        .carousel-control-next:hover span {
          background: rgba(214, 51, 132, 0.5) !important;
          border-color: #ff6b9d !important;
          transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
          .carousel-caption {
            left: 5% !important;
            right: 5% !important;
            max-width: 90% !important;
          }
          
          h1.display-3 {
            font-size: 2.5rem !important;
          }
        }

        /* Indicator positioning and behavior */
        .custom-indicators {
          position: absolute;
          bottom: 20px;
          z-index: 2;
          pointer-events: none; /* prevent blocking content */
        }
        .custom-indicators button {
          pointer-events: auto; /* allow clicking indicators */
          outline: none;
        }

        @media (max-width: 992px) {
          .custom-indicators {
            bottom: 32px; /* a bit higher on tablets */
          }
        }

        @media (max-width: 768px) {
          .custom-indicators {
            bottom: 20px; /* keep clear of caption + stats */
          }
        }
      `}</style>
    </div>
  );
}