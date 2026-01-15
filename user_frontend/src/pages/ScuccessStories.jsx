import React, { useEffect, useState } from "react";
import axios from "axios";
import { asset } from "../lib/api";

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_USER_API_BASE_URL || "http://localhost:5001"}/api/success-stories/`)
      .then((res) => {
        setStories(res.data.stories || []);
        setError(null);
      })
      .catch((err) => {
        console.log("Error loading success stories", err);
        setError("Failed to load success stories. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Get stories to display
  const storiesToShow = showAll ? stories : stories.slice(0, 6);

  // Function to handle image error
  const handleImageError = (e, index) => {
    e.target.onerror = null;
    e.target.src = `https://via.placeholder.com/400x300/d63384/ffffff?text=Couple+${index + 1}`;
  };

  return (
    <section className="container py-5" id="story">
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
          LOVE STORIES
        </span>
        <h2 className="fw-bold mb-3" style={{
          fontSize: "2.5rem",
          background: "linear-gradient(135deg, #333, #555)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "'Playfair Display', serif"
        }}>
          Real <span style={{
            background: "linear-gradient(135deg, #d63384, #ff6b9d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Success Stories</span>
        </h2>
        <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
          Join thousands of happy couples who found their soulmates through EternalBond
        </p>
        
        {/* Stories Count */}
        {!isLoading && stories.length > 0 && (
          <div className="mt-3">
            <div style={{
              display: "inline-block",
              padding: "6px 15px",
              background: "linear-gradient(135deg, rgba(214, 51, 132, 0.05), rgba(255, 107, 157, 0.05))",
              borderRadius: "20px",
              color: "#666",
              fontSize: "0.9rem"
            }}>
              <i className="fas fa-heart me-2" style={{ color: "#d63384" }}></i>
              Showing {showAll ? stories.length : Math.min(6, stories.length)} of {stories.length} Stories
            </div>
          </div>
        )}
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
            <i className="fas fa-heartbeat" style={{ fontSize: "2.5rem", color: "#d63384" }}></i>
          </div>
          <h4 style={{ color: "#666", marginBottom: "10px" }}>Loading Beautiful Stories...</h4>
          <p className="text-muted">We're fetching inspiring love stories for you</p>
        </div>
      ) : error ? (
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
            <i className="fas fa-exclamation-triangle" style={{ fontSize: "2.5rem", color: "#d63384" }}></i>
          </div>
          <h4 style={{ color: "#666", marginBottom: "10px" }}>Unable to Load Stories</h4>
          <p className="text-muted">{error}</p>
          <button 
            className="btn px-4 py-2 mt-3"
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(135deg, #d63384, #ff6b9d)",
              color: "#fff",
              borderRadius: "30px",
              fontWeight: "600",
              border: "none"
            }}
          >
            <i className="fas fa-redo me-2"></i> Try Again
          </button>
        </div>
      ) : stories.length === 0 ? (
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
            <i className="fas fa-heart" style={{ fontSize: "2.5rem", color: "#d63384" }}></i>
          </div>
          <h4 style={{ color: "#666", marginBottom: "10px" }}>No Success Stories Yet</h4>
          <p className="text-muted">Be the first to share your love story with us!</p>
          <button className="btn px-4 py-2 mt-3" style={{
            background: "transparent",
            color: "#d63384",
            border: "2px solid #d63384",
            borderRadius: "30px",
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#d63384";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#d63384";
          }}>
            Share Your Story <i className="fas fa-pen ms-2"></i>
          </button>
        </div>
      ) : (
        <>
          {/* Stories Grid */}
          <div className="row g-4 justify-content-center">
            {storiesToShow.map((s, index) => (
              <div className="col-lg-4 col-md-6" key={s.id || index}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    transition: "all 0.4s ease",
                    height: "100%",
                    transform: hoveredCard === index ? "translateY(-10px)" : "translateY(0)",
                    border: "1px solid rgba(214, 51, 132, 0.1)"
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Image Container */}
                  <div style={{
                    position: "relative",
                    overflow: "hidden",
                    height: "300px"
                  }}>
                    <img
                      src={asset(`/story/${s.image}`)}
                      alt={s.name || "Happy Couple"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.6s ease",
                        transform: hoveredCard === index ? "scale(1.05)" : "scale(1)"
                      }}
                      onError={(e) => handleImageError(e, index)}
                    />
                    <div style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                      color: "#fff",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      boxShadow: "0 4px 15px rgba(214, 51, 132, 0.3)",
                      fontSize: "1.1rem"
                    }}>
                      {index + 1}
                    </div>
                    
                    {/* Overlay on hover */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)",
                      opacity: hoveredCard === index ? 1 : 0,
                      transition: "opacity 0.4s ease",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: "20px",
                      color: "#fff"
                    }}>
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          <span>{s.location || s.city || "India"}</span>
                        </div>
                        <div style={{ fontSize: "0.9rem" }}>
                          <i className="fas fa-calendar-alt me-2"></i>
                          {s.wedding_date || "Recently Married"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "25px" }}>
                    <div className="d-flex align-items-center mb-3">
                      <div style={{
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "15px",
                        flexShrink: 0
                      }}>
                        <i className="fas fa-heart text-white"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 className="fw-bold mb-1" style={{ color: "#333" }}>
                          {s.name || "Happy Couple"}
                        </h5>
                        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                          {s.status || "Married"}
                          {s.age && ` • ${s.age} years old`}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      padding: "15px",
                      background: "linear-gradient(135deg, rgba(214, 51, 132, 0.05), rgba(255, 107, 157, 0.05))",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      minHeight: "100px"
                    }}>
                      <p className="mb-0" style={{ 
                        color: "#666", 
                        fontSize: "0.95rem", 
                        fontStyle: "italic",
                        lineHeight: "1.6",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        "{s.feedback || s.story || "Found our perfect match through EternalBond. Thank you for making our dreams come true!"}"
                      </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div style={{ fontSize: "0.9rem", color: "#d63384", fontWeight: "600" }}>
                          <i className="fas fa-heart me-2"></i>
                          Success Story #{s.id || index + 1}
                        </div>
                      </div>
                      <div style={{
                        width: "35px",
                        height: "35px",
                        background: "linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(255, 107, 157, 0.1))",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #d63384, #ff6b9d)";
                        e.currentTarget.querySelector('i').style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(255, 107, 157, 0.1))";
                        e.currentTarget.querySelector('i').style.color = "#d63384";
                      }}
                      onClick={() => {
                        // Open detailed view or modal for this story
                        console.log("View story:", s.id);
                      }}>
                        <i className="fas fa-external-link-alt" style={{ color: "#d63384", fontSize: "0.9rem", transition: "all 0.3s ease" }}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All / Show Less Button - Only show if there are more than 6 stories */}
          {stories.length > 6 && (
            <div className="text-center mt-5">
              <div className="d-flex justify-content-center gap-2 mb-4">
                {/* Pagination indicator */}
                {Array.from({ length: Math.ceil(stories.length / 6) }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: i === 0 ? "#d63384" : "#e0e0e0",
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      // Scroll to top of stories when clicking pagination dots
                      document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
                    }}
                  ></div>
                ))}
              </div>
              
              <button 
                className="btn "
                onClick={() => {
                  setShowAll(!showAll);
                  // Smooth scroll to top of section when showing all
                  if (!showAll) {
                    setTimeout(() => {
                      document.getElementById('story').scrollIntoView({ 
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
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: "250px",
                  alignItems:"center",
                  justifyContent:"center"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d63384";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(214, 51, 132, 0.3)";
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
                    <i className="  fas fa-chevron-up me-2"></i>
                    Show Less Stories
                  </>
                ) : (
                  <>
                    View All Success Stories ({stories.length})
                    <i className="  fas fa-arrow-right ms-2"></i>
                  </>
                )}
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transition: "0.5s"
                }}></div>
              </button>
            </div>
          )}
        </>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .story-card {
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }
        
        /* Stagger animation for cards */
        .story-card:nth-child(1) { animation-delay: 0.1s; }
        .story-card:nth-child(2) { animation-delay: 0.2s; }
        .story-card:nth-child(3) { animation-delay: 0.3s; }
        .story-card:nth-child(4) { animation-delay: 0.4s; }
        .story-card:nth-child(5) { animation-delay: 0.5s; }
        .story-card:nth-child(6) { animation-delay: 0.6s; }
        
        @media (max-width: 768px) {
          h2 { font-size: 2rem !important; }
          .story-content { padding: 20px !important; }
        }
      `}</style>
    </section>
  );
}