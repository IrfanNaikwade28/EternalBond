import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll contact you soon.");
    setFormData({ name: "", mobile: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Our Address",
      details: "Balwant Plaza, Sangali Road, Ichalkaranji, Maharashtra 416115",
      bgColor: "linear-gradient(135deg, #d63384, #ff6b9d)"
    },
    {
      icon: "fas fa-envelope",
      title: "Email Us",
      details: "info@eternalbond.com\nsupport@eternalbond.com",
      bgColor: "linear-gradient(135deg, #36d1dc, #5b86e5)"
    },
    {
      icon: "fas fa-phone",
      title: "Call Us",
      details: "+91 89564 54578\n+91 98765 43210",
      bgColor: "linear-gradient(135deg, #f46b45, #eea849)"
    },
    {
      icon: "fas fa-clock",
      title: "Working Hours",
      details: "Mon - Sat: 9:00 AM - 8:00 PM\nSunday: 10:00 AM - 6:00 PM",
      bgColor: "linear-gradient(135deg, #834d9b, #d04ed6)"
    }
  ];

  return (
    <div id="contact" className="container py-5">
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
          GET IN TOUCH
        </span>
        <h2 className="fw-bold mb-3" style={{
          fontSize: "2.5rem",
          background: "linear-gradient(135deg, #333, #555)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "'Playfair Display', serif"
        }}>
          Contact <span style={{
            background: "linear-gradient(135deg, #d63384, #ff6b9d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Us</span>
        </h2>
        <p className="text-muted" style={{ maxWidth: "700px", margin: "0 auto" }}>
          Have questions or need assistance? Our team is here to help you find your perfect match
        </p>
      </div>

      <div className="row g-4 mb-5">
        {contactInfo.map((info, index) => (
          <div className="col-12 col-sm-6 col-lg-3" key={index}>
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
              height: "100%",
              border: "1px solid rgba(214, 51, 132, 0.1)",
              transition: "all 0.3s ease",
              textAlign: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.08)";
            }}>
              <div className="contact-icon" style={{
                width: "70px",
                height: "70px",
                background: info.bgColor,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 25px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
              }}>
                <i className={`${info.icon} text-white`} style={{ fontSize: "1.5rem" }}></i>
              </div>
              
              <h5 className="fw-bold mb-3" style={{ color: "#333" }}>{info.title}</h5>
              
              <p className="text-muted mb-0" style={{ 
                lineHeight: "1.8",
                fontSize: "0.95rem",
                whiteSpace: "pre-line"
              }}>
                {info.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="contact-form-card" style={{
            background: "#fff",
            borderRadius: "25px",
            padding: "50px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
            border: "1px solid rgba(214, 51, 132, 0.1)"
          }}>
            <h3 className="fw-bold mb-4 text-center" style={{ color: "#333" }}>
              Send Us a Message
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-bold mb-2" style={{ color: "#555" }}>
                      Your Name <span style={{ color: "#d63384" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <i className="fas fa-user" style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#d63384",
                        zIndex: 1
                      }}></i>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your full name"
                        required
                        style={{
                          paddingLeft: "45px",
                          borderRadius: "12px",
                          border: "2px solid rgba(214, 51, 132, 0.2)",
                          height: "50px",
                          transition: "all 0.3s ease"
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#d63384";
                          e.currentTarget.style.boxShadow = "0 0 0 0.2rem rgba(214, 51, 132, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(214, 51, 132, 0.2)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-bold mb-2" style={{ color: "#555" }}>
                      Mobile Number <span style={{ color: "#d63384" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <i className="fas fa-phone" style={{
                        position: "absolute",
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#d63384",
                        zIndex: 1
                      }}></i>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your mobile number"
                        required
                        style={{
                          paddingLeft: "45px",
                          borderRadius: "12px",
                          border: "2px solid rgba(214, 51, 132, 0.2)",
                          height: "50px",
                          transition: "all 0.3s ease"
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#d63384";
                          e.currentTarget.style.boxShadow = "0 0 0 0.2rem rgba(214, 51, 132, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(214, 51, 132, 0.2)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="form-group">
                  <label className="form-label fw-bold mb-2" style={{ color: "#555" }}>
                    Subject <span style={{ color: "#d63384" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <i className="fas fa-tag" style={{
                      position: "absolute",
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#d63384",
                      zIndex: 1
                    }}></i>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="What is this regarding?"
                      required
                      style={{
                        paddingLeft: "45px",
                        borderRadius: "12px",
                        border: "2px solid rgba(214, 51, 132, 0.2)",
                        height: "50px",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d63384";
                        e.currentTarget.style.boxShadow = "0 0 0 0.2rem rgba(214, 51, 132, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(214, 51, 132, 0.2)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <div className="form-group">
                  <label className="form-label fw-bold mb-2" style={{ color: "#555" }}>
                    Your Message <span style={{ color: "#d63384" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <i className="fas fa-comment-dots" style={{
                      position: "absolute",
                      left: "15px",
                      top: "20px",
                      color: "#d63384",
                      zIndex: 1
                    }}></i>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="form-control"
                      rows="5"
                      placeholder="Tell us how we can help you..."
                      required
                      style={{
                        paddingLeft: "45px",
                        borderRadius: "12px",
                        border: "2px solid rgba(214, 51, 132, 0.2)",
                        transition: "all 0.3s ease",
                        resize: "vertical"
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d63384";
                        e.currentTarget.style.boxShadow = "0 0 0 0.2rem rgba(214, 51, 132, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(214, 51, 132, 0.2)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-responsive"
                  style={{
                    background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                    color: "#fff",
                    borderRadius: "15px",
                    fontWeight: "600",
                    fontSize: "1rem",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(214, 51, 132, 0.3)",
                    transition: "all 0.3s ease",
                    
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(214, 51, 132, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(214, 51, 132, 0.3)";
                  }}
                >
                  <span style={{ position: "relative", zIndex: 2 }}>
                    <i className="fas fa-paper-plane me-2"></i>
                    Send Message
                  </span>
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
            </form>
          </div>
        </div>
      </div>
      {/* Responsive helpers */}
      <style>{`
        /* Button scales and layout */
        .btn-responsive {
          width: 100%;
          padding: 0.6rem 1rem;
          font-size: 1rem;
          border-radius: 12px;
        }

        /* Contact icon + card padding adjustments */
        .contact-icon {
          width: 56px;
          height: 56px;
        }
        .contact-form-card {
          padding: 24px;
        }

        /* >=576px */
        @media (min-width: 576px) {
          .btn-responsive {
            padding: 0.5rem 1.5rem;
            font-size: 1.05rem;
            border-radius: 14px;
          }
          .contact-icon {
            width: 64px;
            height: 64px;
          }
          .contact-form-card { padding: 32px; }
        }

        /* >=768px */
        @media (min-width: 768px) {
          .btn-responsive {
            width: auto;
            padding: 0.5rem 1.4rem;
            font-size: 1.1rem;
            border-radius: 15px;
          }
          .contact-form-card { padding: 40px; }
        }

        /* >=992px */
        @media (min-width: 992px) {
          .btn-responsive {
            padding: 0.5rem 1.6rem;
            font-size: 1.12rem;
          }
          .contact-icon {
            width: 70px;
            height: 70px;
          }
          .contact-form-card { padding: 50px; }
        }
      `}</style>
    </div>
  );
}

/* Responsive helpers scoped in-component */
