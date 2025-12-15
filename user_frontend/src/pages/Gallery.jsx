import React, { useState } from "react";

const couples = [
  { id: 1, name: "Priya & Raj", location: "Mumbai", img: "sucessstory1.jpg" },
  { id: 2, name: "Anjali & Arjun", location: "Delhi", img: "sucessstory2.jpg" },
  { id: 3, name: "Sneha & Vikram", location: "Bangalore", img: "sucessstory3.jpg" },
  { id: 4, name: "Meera & Karan", location: "Chennai", img: "sucessstory4.jpg" },
  { id: 5, name: "Neha & Rohan", location: "Hyderabad", img: "sucessstory5.jpg" },
  { id: 6, name: "Pooja & Sameer", location: "Pune", img: "sucessstory6.jpg" },
];

function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const openModal = (index) => setCurrentIndex(index);
  const closeModal = () => setCurrentIndex(null);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? couples.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === couples.length - 1 ? 0 : prev + 1));

  return (
    <section id="gallery" className="container py-5">
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
          GALLERY
        </span>
        <h2 className="fw-bold mb-3" style={{
          fontSize: "2.5rem",
          background: "linear-gradient(135deg, #333, #555)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "'Playfair Display', serif"
        }}>
          Our <span style={{
            background: "linear-gradient(135deg, #d63384, #ff6b9d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Happy Couples</span>
        </h2>
        <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
          A collection of beautiful moments from our married couples
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "25px",
        padding: "20px 0"
      }}>
        {couples.map((couple, index) => (
          <div
            key={couple.id}
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              transition: "all 0.4s ease",
              transform: hoveredIndex === index ? "translateY(-10px)" : "translateY(0)",
              border: "1px solid rgba(214, 51, 132, 0.1)"
            }}
            onClick={() => openModal(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={couple.img}
              alt={couple.name}
              style={{
                width: "100%",
                height: "350px",
                objectFit: "cover",
                transition: "transform 0.6s ease",
                transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)"
              }}
            />
            
            <div style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              padding: "25px",
              color: "#fff",
              transform: hoveredIndex === index ? "translateY(0)" : "translateY(20px)",
              opacity: hoveredIndex === index ? 1 : 0,
              transition: "all 0.4s ease"
            }}>
              <h5 className="fw-bold mb-2">{couple.name}</h5>
              <div className="d-flex align-items-center mb-1">
                <i className="fas fa-map-marker-alt me-2" style={{ fontSize: "0.9rem" }}></i>
                <span style={{ fontSize: "0.9rem" }}>{couple.location}</span>
              </div>
              <div style={{
                display: "inline-block",
                padding: "5px 15px",
                background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: "500"
              }}>
                Married 2023
              </div>
            </div>
            
            <div style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "40px",
              height: "40px",
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hoveredIndex === index ? 1 : 0,
              transition: "all 0.3s ease",
              transform: hoveredIndex === index ? "scale(1)" : "scale(0.8)"
            }}>
              <i className="fas fa-expand" style={{ color: "#d63384" }}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {currentIndex !== null && (
        <>
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.95)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}>
            <button
              onClick={closeModal}
              style={{
                position: "fixed",
                top: "30px",
                right: "30px",
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "40px",
                cursor: "pointer",
                zIndex: 1002,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ff6b9d"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
            >
              &times;
            </button>
            
            <button
              onClick={prevImage}
              style={{
                position: "fixed",
                left: "30px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.1)",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#fff",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 1001,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(214, 51, 132, 0.5)";
                e.currentTarget.style.borderColor = "#ff6b9d";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
            }}>
              <img
                src={couples[currentIndex].img}
                alt={couples[currentIndex].name}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "80vh",
                  objectFit: "contain"
                }}
              />
              
              <div style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                padding: "30px",
                color: "#fff"
              }}>
                <h3 className="fw-bold mb-2">{couples[currentIndex].name}</h3>
                <p className="mb-1">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {couples[currentIndex].location}
                </p>
                <div className="d-flex align-items-center">
                  <div style={{
                    padding: "5px 15px",
                    background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: "500"
                  }}>
                    EternalBond Success Story
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: "1.2rem" }}>
                    {currentIndex + 1} / {couples.length}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={nextImage}
              style={{
                position: "fixed",
                right: "30px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.1)",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#fff",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 1001,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(214, 51, 132, 0.5)";
                e.currentTarget.style.borderColor = "#ff6b9d";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Gallery;