// src/Pages/BioDataView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaUser, FaPhone, FaEnvelope, FaHome, FaBirthdayCake, 
  FaUserFriends, FaGraduationCap, FaBriefcase, FaStar, 
  FaHeart, FaPrint, FaVenusMars, FaMapMarkerAlt, 
  FaRupeeSign, FaWeight, FaRulerVertical, FaEye,
  FaWineGlassAlt, FaAppleAlt, FaStethoscope, FaRing
} from "react-icons/fa";

const Bio = ({ uid }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uid) {
      setError("UID not provided.");
      return;
    }

    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`http://localhost:5000/api/bio/${uid}`);
        if (res.data.success) {
          setUserData(res.data.data);
        } else {
          setError(res.data.error || "Failed to load biodata");
        }
      } catch (err) {
        setError("Server error while fetching biodata");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [uid]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="text-center">
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading Matrimonial Profile...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: "500px" }}>
      {error}
    </div>
  );
  
  if (!userData) return null;

  return (
    <div className="biodata-container" style={{ 
      background: "linear-gradient(135deg, #fffaf0 0%, #fff5e6 100%)", 
      minHeight: "100vh",
      padding: "20px 0"
    }}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap');
        
        :root {
          --maroon: #8B0000;
          --gold: #D4AF37;
          --cream: #FFF8E1;
          --light-gold: #F5E6CA;
          --dark-maroon: #660000;
        }
        
        .ganapati-watermark {
          position: absolute;
          width: 300px;
          height: 300px;
          opacity: 0.05;
          z-index: 0;
          pointer-events: none;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        .main-container {
          position: relative;
          z-index: 1;
          background: white;
          border-radius: 30px;
          box-shadow: 0 25px 70px rgba(139, 0, 0, 0.15);
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .ganapati-header {
          background: linear-gradient(135deg, var(--maroon) 0%, var(--dark-maroon) 100%);
          padding: 40px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .ganapati-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" font-size="8" fill="rgba(255,255,255,0.03)" text-anchor="middle" dominant-baseline="middle">🕉️</text></svg>');
        }
        
        .ganapati-image {
          width: 120px;
          height: 120px;
          margin: 0 auto 20px;
          border-radius: 50%;
          border: 6px solid var(--gold);
          padding: 10px;
          background: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .header-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          color: white;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          position: relative;
          display: inline-block;
        }
        
        .header-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: var(--gold);
          border-radius: 2px;
        }
        
        .header-subtitle {
          color: var(--light-gold);
          font-family: 'Poppins', sans-serif;
          font-size: 1.1rem;
          margin-top: 15px;
          letter-spacing: 1px;
        }
        
        .profile-section {
          padding: 40px 30px;
        }
        
        .profile-avatar {
          width: 180px;
          height: 180px;
          border-radius: 20px;
          border: 5px solid white;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          object-fit: cover;
          background: linear-gradient(45deg, #f8f9fa, #e9ecef);
        }
        
        .profile-info {
          background: linear-gradient(135deg, var(--cream) 0%, #fffaf0 100%);
          border-radius: 20px;
          padding: 25px;
          border: 2px solid var(--light-gold);
          position: relative;
          overflow: hidden;
        }
        
        .profile-info::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, var(--gold), var(--maroon));
        }
        
        .profile-name {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          color: var(--dark-maroon);
          margin-bottom: 5px;
          font-weight: 700;
        }
        
        .profile-profession {
          font-family: 'Poppins', sans-serif;
          color: var(--maroon);
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 15px;
        }
        
        .profile-id {
          display: inline-block;
          background: rgba(139, 0, 0, 0.1);
          color: var(--maroon);
          padding: 8px 20px;
          border-radius: 30px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin-top: 30px;
        }
        
        .info-card {
          background: white;
          border-radius: 18px;
          padding: 25px;
          border: 1px solid #f0e6d6;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(139, 0, 0, 0.12);
          border-color: var(--gold);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid var(--light-gold);
        }
        
        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(139, 0, 0, 0.1), rgba(212, 175, 55, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          color: var(--maroon);
          font-size: 1.3rem;
        }
        
        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: var(--dark-maroon);
          margin: 0;
        }
        
        .info-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 18px;
          padding-bottom: 18px;
          border-bottom: 1px dashed #eee;
        }
        
        .info-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .item-icon {
          color: var(--maroon);
          margin-right: 15px;
          margin-top: 2px;
          font-size: 1.1rem;
          min-width: 20px;
        }
        
        .item-content {
          flex: 1;
        }
        
        .item-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 3px;
          font-weight: 600;
        }
        
        .item-value {
          font-family: 'Poppins', sans-serif;
          font-size: 1.05rem;
          color: #333;
          font-weight: 500;
          line-height: 1.4;
        }
        
        .highlight-value {
          color: var(--maroon);
          font-weight: 600;
        }
        
        .attributes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 15px;
          margin-top: 10px;
        }
        
        .attribute-badge {
          background: linear-gradient(135deg, var(--cream), white);
          border: 1px solid var(--light-gold);
          border-radius: 12px;
          padding: 15px 10px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .attribute-badge:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          border-color: var(--gold);
        }
        
        .attribute-icon {
          font-size: 1.5rem;
          color: var(--gold);
          margin-bottom: 8px;
        }
        
        .attribute-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          color: #888;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .attribute-value {
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          color: var(--dark-maroon);
          font-weight: 600;
        }
        
        .horoscope-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .horoscope-item {
          background: linear-gradient(135deg, #fffaf0, #fff5e6);
          border-radius: 12px;
          padding: 15px;
          text-align: center;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .horoscope-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: var(--maroon);
          margin-bottom: 5px;
          font-weight: 600;
        }
        
        .horoscope-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: var(--dark-maroon);
          font-weight: 700;
        }
        
        .expectations-card {
          background: linear-gradient(135deg, var(--cream), #fffaf0);
          border-radius: 20px;
          padding: 30px;
          border: 2px solid var(--gold);
          margin-top: 30px;
          position: relative;
          overflow: hidden;
        }
        
        .expectations-card::before {
          content: '💖';
          position: absolute;
          font-size: 100px;
          opacity: 0.05;
          right: 20px;
          top: 20px;
        }
        
        .expectations-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: var(--maroon);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }
        
        .expectations-text {
          font-family: 'Poppins', sans-serif;
          font-size: 1.1rem;
          color: #555;
          line-height: 1.7;
          padding-left: 10px;
          border-left: 3px solid var(--gold);
        }
        
        .print-section {
          text-align: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #eee;
        }
        
        .print-button {
          background: linear-gradient(135deg, var(--maroon), var(--dark-maroon));
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 1.1rem;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(139, 0, 0, 0.3);
        }
        
        .print-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(139, 0, 0, 0.4);
          background: linear-gradient(135deg, var(--dark-maroon), var(--maroon));
        }
        
        @media (max-width: 768px) {
          .ganapati-image {
            width: 100px;
            height: 100px;
          }
          
          .header-title {
            font-size: 2rem;
          }
          
          .profile-name {
            font-size: 1.8rem;
          }
          
          .profile-section {
            padding: 25px 15px;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .attributes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .horoscope-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media print {
          .print-button {
            display: none;
          }
          
          .main-container {
            box-shadow: none;
            border: 2px solid #ddd;
          }
        }
        `}
      </style>

      {/* Ganapati Watermark */}
      <div className="ganapati-watermark">
        <div style={{
          fontSize: '300px',
          opacity: 0.05,
          textAlign: 'center',
          lineHeight: 1
        }}>
          🪭
        </div>
      </div>

      <div className="container" style={{ maxWidth: "1200px", position: "relative" }}>
        {/* Ganapati Header */}
        <div className="ganapati-header">
          <div className="ganapati-image d-flex align-items-center justify-content-center">
            <div style={{ fontSize: '60px', color: '#D4AF37' }}>
              🪭
            </div>
          </div>
          <h1 className="header-title">Matrimonial Biodata</h1>
          <p className="header-subtitle">Seeking Life Partner for Eternal Happiness</p>
        </div>

        {/* Main Content */}
        <div className="main-container">
          <div className="profile-section">
            {/* Profile Header */}
            <div className="row align-items-center mb-5">
              <div className="col-md-4 text-center">
                <div className="position-relative">
                  {userData.uprofile ? (
                    <img 
                      src={userData.uprofile} 
                      alt={userData.Uname}
                      className="profile-avatar"
                    />
                  ) : (
                    <div className="profile-avatar d-flex align-items-center justify-content-center">
                      <FaUser size={80} color="#8B0000" />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-8">
                <div className="profile-info">
                  <h2 className="profile-name">{userData.Uname}</h2>
                  <p className="profile-profession">
                    <FaBriefcase className="me-2" />
                    {userData.current_work}
                  </p>
                  <span className="profile-id">Profile ID: {uid}</span>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="info-grid">
              {/* Personal Information */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon">
                    <FaUser />
                  </div>
                  <h3 className="card-title">Personal Details</h3>
                </div>
                
                <div className="info-item">
                  <span className="item-icon"><FaPhone /></span>
                  <div className="item-content">
                    <div className="item-label">Mobile Number</div>
                    <div className="item-value highlight-value">{userData.Umobile}</div>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="item-icon"><FaEnvelope /></span>
                  <div className="item-content">
                    <div className="item-label">Email Address</div>
                    <div className="item-value">{userData.Email}</div>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="item-icon"><FaMapMarkerAlt /></span>
                  <div className="item-content">
                    <div className="item-label">Current Address</div>
                    <div className="item-value">{userData.address}</div>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="item-icon"><FaBirthdayCake /></span>
                  <div className="item-content">
                    <div className="item-label">Date of Birth</div>
                    <div className="item-value highlight-value">{formatDate(userData.DOB)}</div>
                  </div>
                </div>
              </div>

              {/* Family Details */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon">
                    <FaUserFriends />
                  </div>
                  <h3 className="card-title">Family Background</h3>
                </div>
                
                <div className="info-item">
                  <div className="item-content">
                    <div className="item-label">Father's Name</div>
                    <div className="item-value highlight-value">{userData.Father}</div>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="item-content">
                    <div className="item-label">Father's Occupation</div>
                    <div className="item-value">{userData.father_occupation}</div>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="item-content">
                    <div className="item-label">Mother's Name</div>
                    <div className="item-value highlight-value">{userData.Mother}</div>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="item-content">
                    <div className="item-label">Mother's Occupation</div>
                    <div className="item-value">{userData.mother_occupation}</div>
                  </div>
                </div>
              </div>

              {/* Education & Career */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon">
                    <FaGraduationCap />
                  </div>
                  <h3 className="card-title">Education & Career</h3>
                </div>
                
                <div className="info-item">
                  <div className="item-content">
                    <div className="item-label">Highest Education</div>
                    <div className="item-value highlight-value">{userData.Education}</div>
                  </div>
                </div>
                
                {userData.education_details && (
                  <div className="info-item">
                    <div className="item-content">
                      <div className="item-label">Education Details</div>
                      <div className="item-value">{userData.education_details}</div>
                    </div>
                  </div>
                )}
                
                <div className="info-item">
                  <div className="item-content">
                    <div className="item-label">Current Profession</div>
                    <div className="item-value highlight-value">{userData.current_work}</div>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="item-content">
                    <div className="item-label">Annual Income</div>
                    <div className="item-value highlight-value">
                      <FaRupeeSign className="me-1" />
                      {userData.fincome}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="info-card mt-4">
              <div className="card-header">
                <div className="card-icon">
                  <FaVenusMars />
                </div>
                <h3 className="card-title">Physical Attributes</h3>
              </div>
              
              <div className="attributes-grid">
                <div className="attribute-badge">
                  <div className="attribute-icon">
                    <FaRulerVertical />
                  </div>
                  <div className="attribute-label">Height</div>
                  <div className="attribute-value">{userData.height}</div>
                </div>
                
                <div className="attribute-badge">
                  <div className="attribute-icon">
                    <FaWeight />
                  </div>
                  <div className="attribute-label">Weight</div>
                  <div className="attribute-value">{userData.weight}</div>
                </div>
                
                <div className="attribute-badge">
                  <div className="attribute-icon">
                    <FaEye />
                  </div>
                  <div className="attribute-label">Spectacles</div>
                  <div className="attribute-value">{userData.specs}</div>
                </div>
                
                <div className="attribute-badge">
                  <div className="attribute-icon">
                    <FaAppleAlt />
                  </div>
                  <div className="attribute-label">Diet</div>
                  <div className="attribute-value">{userData.Diet}</div>
                </div>
                
                <div className="attribute-badge">
                  <div className="attribute-icon">
                    <FaWineGlassAlt />
                  </div>
                  <div className="attribute-label">Drinking</div>
                  <div className="attribute-value">{userData.Drink}</div>
                </div>
                
                <div className="attribute-badge">
                  <div className="attribute-icon">
                    <FaStethoscope />
                  </div>
                  <div className="attribute-label">Health</div>
                  <div className="attribute-value">{userData.Dieses || "Good"}</div>
                </div>
              </div>
            </div>

            {/* Horoscope Details */}
            <div className="info-card mt-4">
              <div className="card-header">
                <div className="card-icon">
                  <FaStar />
                </div>
                <h3 className="card-title">Horoscope Details</h3>
              </div>
              
              <div className="horoscope-grid">
                <div className="horoscope-item">
                  <div className="horoscope-label">Rashi</div>
                  <div className="horoscope-value">{userData.Rashi}</div>
                </div>
                
                <div className="horoscope-item">
                  <div className="horoscope-label">Nakshatra</div>
                  <div className="horoscope-value">{userData.Nakshatra}</div>
                </div>
                
                <div className="horoscope-item">
                  <div className="horoscope-label">Gan</div>
                  <div className="horoscope-value">{userData.Gan}</div>
                </div>
                
                <div className="horoscope-item">
                  <div className="horoscope-label">Nadi</div>
                  <div className="horoscope-value">{userData.Nadi}</div>
                </div>
                
                <div className="horoscope-item">
                  <div className="horoscope-label">Charan</div>
                  <div className="horoscope-value">{userData.charan}</div>
                </div>
                
                <div className="horoscope-item">
                  <div className="horoscope-label">Mangalik</div>
                  <div className="horoscope-value">{userData.mangal}</div>
                </div>
              </div>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="info-item">
                    <div className="item-content">
                      <div className="item-label">Birth Time</div>
                      <div className="item-value">{userData.dob_time}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-item">
                    <div className="item-content">
                      <div className="item-label">Birth Place</div>
                      <div className="item-value">{userData.birthplace}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Expectations */}
            {userData.Expectation && (
              <div className="expectations-card">
                <h3 className="expectations-title">
                  <FaHeart className="me-3" />
                  Partner Expectations
                </h3>
                <div className="expectations-text">
                  {userData.Expectation}
                </div>
              </div>
            )}

            {/* Print Button */}
            <div className="print-section">
              <button
                className="print-button"
                onClick={() => window.print()}
              >
                <FaPrint />
                Download pdf
              </button>
              <p className="text-muted mt-3" style={{ fontSize: "0.9rem" }}>
                For best results, use landscape mode when printing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bio;