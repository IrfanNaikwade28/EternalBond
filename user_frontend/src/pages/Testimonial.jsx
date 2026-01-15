import React, { useEffect, useState } from "react";
import { asset } from "../lib/api";

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_USER_API_BASE_URL || "http://localhost:5001"}/api/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTestimonials(data.testimonials);
        }
      })
      .catch((err) => console.log("Error Loading Testimonials", err))
      .finally(() => setIsLoading(false));
  }, []);

  const StarRating = ({ rating }) => (
    <div className="d-flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#ffd700" : "#e4e5e9"}
          stroke={star <= rating ? "#ffd700" : "#e4e5e9"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: "2px" }}
        >
          <polygon points="12 2 15 10 23 10 17 14 19 22 12 18 5 22 7 14 1 10 9 10" />
        </svg>
      ))}
    </div>
  );

  const TestimonialCard = ({ t, index }) => (
    <div className="col-md-4 mb-4" key={t.TSID || index}>
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
          height: "100%",
          border: "1px solid rgba(214, 51, 132, 0.1)",
          transition: "all 0.3s ease",
          transform: activeIndex === index ? "translateY(-5px)" : "translateY(0)",
          opacity: activeIndex === index ? 1 : 0.9
        }}
        onMouseEnter={() => setActiveIndex(index)}
        onMouseLeave={() => setActiveIndex(-1)}
      >
        <div className="d-flex align-items-center mb-4">
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            overflow: "hidden",
            marginRight: "15px",
            border: "3px solid #fff",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            flexShrink: 0
          }}>
            <img
              src={asset(`/testimonial/${t.simg}`)}
              alt={t.Name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/60x60/d63384/ffffff?text=" + t.Name.charAt(0);
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h6 className="fw-bold mb-1" style={{ 
              color: "#333",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {t.Name}
            </h6>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>
              <i className="fas fa-map-marker-alt me-1"></i> 
              {t.location || t.Location || "India"}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <StarRating rating={t.rating || 5} />
        </div>

        <div style={{
          position: "relative",
          paddingLeft: "20px",
          minHeight: "120px"
        }}>
          <div style={{
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "0",
            width: "4px",
            background: "linear-gradient(to bottom, #d63384, #ff6b9d)",
            borderRadius: "2px"
          }}></div>
          <p className="mb-0" style={{
            color: "#555",
            lineHeight: "1.6",
            fontStyle: "italic",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            "{t.Testimonial}"
          </p>
        </div>

        <div className="mt-4 pt-3" style={{
          borderTop: "1px dashed rgba(214, 51, 132, 0.2)",
          paddingTop: "15px"
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div style={{ fontSize: "0.9rem", color: "#999" }}>
              <i className="fas fa-calendar me-1"></i>
              {t.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div style={{
              width: "35px",
              height: "35px",
              background: "linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(255, 107, 157, 0.1))",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <i className="fas fa-quote-right" style={{ color: "#d63384", fontSize: "0.9rem" }}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Get testimonials to display
  const testimonialsToShow = showAll ? testimonials : testimonials.slice(0, 3);

  return (
    <section className="container py-5" id="testimonial">
      <div className="text-center mb-5">
        <span style={{
          display: "inline-block",
          padding: "8px 25px",
          background: "linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(255, 107, 157, 0.1))",
          color: "#d63384",
          borderRadius: "30px",
          fontWeight: "600",
          marginBottom: "15px"
        }}>
          TESTIMONIALS
        </span>
        <h2 className="fw-bold mb-3" style={{
          fontSize: "2.5rem",
          background: "linear-gradient(135deg, #333, #555)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "'Playfair Display', serif"
        }}>
          What People <span style={{
            background: "linear-gradient(135deg, #d63384, #ff6b9d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Say About Us</span>
        </h2>
        <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
          Hear from our happy members who found their life partners
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div style={{
            width: "100px",
            height: "100px",
            background: "linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(255, 107, 157, 0.1))",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            animation: "pulse 1.5s infinite"
          }}>
            <i className="fas fa-comments" style={{ fontSize: "2.5rem", color: "#d63384" }}></i>
          </div>
          <h4 style={{ color: "#666", marginBottom: "10px" }}>Loading Testimonials...</h4>
          <p className="text-muted">Our happy members will share their experiences soon</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-5">
          <div style={{
            width: "100px",
            height: "100px",
            background: "linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(255, 107, 157, 0.1))",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            <i className="fas fa-comment-slash" style={{ fontSize: "2.5rem", color: "#d63384" }}></i>
          </div>
          <h4 style={{ color: "#666", marginBottom: "10px" }}>No Testimonials Yet</h4>
          <p className="text-muted">Be the first to share your experience with us!</p>
        </div>
      ) : (
        <>
          {/* Grid Layout for Testimonials */}
          <div className="row g-4 justify-content-center">
            {testimonialsToShow.map((t, index) => (
              <TestimonialCard key={t.TSID || index} t={t} index={index} />
            ))}
          </div>

          {/* Show More/Less Button - Only show if there are more than 3 testimonials */}
          {testimonials.length > 3 && (
            <div className="text-center mt-5">
              <div className="d-flex justify-content-center gap-2 mb-4">
                {/* Pagination dots */}
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      // Scroll to top of testimonials
                      document.getElementById('testimonial').scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "none",
                      background: i === 0 ? "#d63384" : "#e0e0e0",
                      transition: "all 0.3s ease",
                      padding: "0",
                      cursor: "pointer"
                    }}
                  ></button>
                ))}
              </div>
              
              <button 
                className="btn px-4 py-2"
                onClick={() => {
                  setShowAll(!showAll);
                  // Scroll back to testimonials section when showing all
                  if (!showAll) {
                    setTimeout(() => {
                      document.getElementById('testimonial').scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }, 100);
                  }
                }}
                style={{
                  background: "transparent",
                  color: "#d63384",
                  border: "2px solid #d63384",
                  borderRadius: "30px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d63384";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(214, 51, 132, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#d63384";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {showAll ? (
                  <>
                    <i className="fas fa-chevron-up me-2"></i>
                    Show Less Testimonials
                  </>
                ) : (
                  <>
                    View All Testimonials ({testimonials.length})
                    <i className="fas fa-arrow-right ms-2"></i>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Testimonials Count */}
          <div className="text-center mt-4">
            <div style={{
              display: "inline-block",
              padding: "8px 20px",
              background: "linear-gradient(135deg, rgba(214, 51, 132, 0.05), rgba(255, 107, 157, 0.05))",
              borderRadius: "20px",
              color: "#666",
              fontSize: "0.9rem"
            }}>
              <i className="fas fa-users me-2"></i>
              Showing {showAll ? testimonials.length : Math.min(3, testimonials.length)} of {testimonials.length} Testimonials
            </div>
          </div>
        </>
      )}

      {/* Add CSS for animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .testimonial-enter {
          opacity: 0;
          transform: translateY(20px);
        }
        
        .testimonial-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </section>
  );
}