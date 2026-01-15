import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { userApi, asset } from "../lib/api";
import { Offcanvas } from "react-bootstrap";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle"; // optional for module init

const WishList = () => {
  const [likedUsers, setLikedUsers] = useState([]); // State for liked users
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [zoomImage, setZoomImage] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [contactInfo, setContactInfo] = useState({});
  const [loadingContactMap, setLoadingContactMap] = useState({});
  const [unlockedProfiles, setUnlockedProfiles] = useState([]);
  const [planExpired, setPlanExpired] = useState(false);
  
  // Refs
  const mainContentRef = useRef(null);
  const offcanvasRef = useRef(null);
  const bsRef = useRef(null); 
  
  // Retrieve the stored user object safely
  const storedUser = localStorage.getItem("user");
  const loginUID = storedUser ? JSON.parse(storedUser).UID : null;
  
  // Determine if selected profile is unlocked
  const isUnlocked = selectedUser && unlockedProfiles.includes(selectedUser.UID);

  // Fetch liked profiles on component mount
  useEffect(() => {
    const fetchLikedProfiles = async () => {
      try {
        setLoading(true);
        const response = await userApi.get(
          `/api/liked-profiles/${loginUID}`
        );
        
        if (response.data.data && Array.isArray(response.data.data)) {
          setLikedUsers(response.data.data);
        } else {
          setLikedUsers([]);
        }
      } catch (err) {
        console.error("Error fetching liked profiles:", err);
        setLikedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (loginUID) {
      fetchLikedProfiles();
    }
  }, [loginUID]);

  // Handle unlike a profile
  const handleUnlike = async (profile_uid) => {
    try {
      const response = await fetch(`${userApi.defaults.baseURL}/api/toggle-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UID: profile_uid,
          PRID: loginUID,
          action: "unlike"
        })
      });

      const data = await response.json();

      if (data.status) {
        // Remove the unliked user from the likedUsers state
        setLikedUsers(prev => prev.filter(user => user.UID !== profile_uid));
        
        // If the currently selected user is unliked, close the offcanvas
        if (selectedUser && selectedUser.UID === profile_uid) {
          closeOffcanvas();
        }
      }
    } catch (error) {
      console.error("Error unliking profile:", error);
    }
  };

  // Handle unlocking contact
  const handleViewContact = async (uid) => {
    setLoadingContactMap(prev => ({ ...prev, [uid]: true }));

    try {
      const response = await userApi.post(
        "/api/incrementViewCount",
        { 
          loginUserUID: loginUID, 
          selectedUserUID: uid 
        }
      );

      const data = response.data;

      if (!data.success && data.message.includes("upgrade")) {
        alert(data.message);
        setPlanExpired(true);
        return;
      }

      if (data.success && data.allowView) {
        // Mark profile as unlocked
        setUnlockedProfiles(prev => [...new Set([...prev, uid])]);

        // Save the returned mobile info
        setContactInfo(prev => ({ 
          ...prev, 
          [uid]: data.mobile 
        }));

        if (!data.alreadyUnlocked) {
          alert(`Contact unlocked! Mobile: ${data.mobile?.Umobile || data.mobile}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while unlocking contact.");
    } finally {
      setLoadingContactMap(prev => ({ ...prev, [uid]: false }));
    }
  };

  // Format DOB with time
  function formatDOBWithTime(dob, time) {
    if (!dob) return "-";
    
    const dateObj = new Date(dob);
    if (isNaN(dateObj.getTime())) return "-";
    
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const finalTime = time || "00:00:00";
    
    return `${day}/${month}/${year} | ${finalTime}`;
  };

  // Format DOB only
  function formatDOBOnly(dob) {
    if (!dob) return "-";
    
    const dateObj = new Date(dob);
    if (isNaN(dateObj.getTime())) return "-";
    
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return null;
    
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      
      if (isNaN(birthDate.getTime())) return null;
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age > 0 ? `${age} yrs` : null;
    } catch (error) {
      console.error('Error calculating age:', error);
      return null;
    }
  };

  // Setup offcanvas bootstrap instance + events once
  useEffect(() => {
    const node = offcanvasRef.current;
    if (!node) return;

    // Create a single bootstrap Offcanvas instance
    if (!bsRef.current) {
      bsRef.current = new bootstrap.Offcanvas(node, {
        backdrop: true,
        scroll: false,
      });
    }

    const handleShown = () => {
      if (mainContentRef.current) {
        mainContentRef.current.style.overflowY = "hidden";
      }
      try {
        document.body.style.overflow = "hidden";
      } catch (e) { }
    };

    const handleHidden = () => {
      if (mainContentRef.current) {
        mainContentRef.current.style.overflowY = "auto";
      }
      try {
        document.body.style.overflow = "";
      } catch (e) { }
      
      const backdrop = document.querySelector(".offcanvas-backdrop");
      if (backdrop) backdrop.remove();
    };

    node.addEventListener("shown.bs.offcanvas", handleShown);
    node.addEventListener("hidden.bs.offcanvas", handleHidden);

    return () => {
      node.removeEventListener("shown.bs.offcanvas", handleShown);
      node.removeEventListener("hidden.bs.offcanvas", handleHidden);
      if (bsRef.current) {
        try {
          bsRef.current.dispose();
        } catch (e) { }
        bsRef.current = null;
      }
    };
  }, [offcanvasRef.current]);

  // Open offcanvas
  const openOffcanvas = (userObj) => {
    setSelectedUser(userObj);
    setContactInfo(prev => ({ ...prev, [userObj.UID]: null }));
    
    setTimeout(() => {
      if (!bsRef.current) {
        const node = offcanvasRef.current;
        if (!node) return;
        bsRef.current = new bootstrap.Offcanvas(node, { backdrop: true, scroll: false });
      }
      try {
        bsRef.current.show();
      } catch (e) {
        const node = offcanvasRef.current;
        if (node) node.classList.add("show");
      }
    }, 50);
  };

  // Close offcanvas
  const closeOffcanvas = () => {
    if (bsRef.current) {
      bsRef.current.hide();
    }
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="main-content pt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (likedUsers.length === 0) {
    return (
      <div className="main-content pt-5" ref={mainContentRef}>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="text-center mt-5 py-5">
                <i className="fas fa-heart fa-4x text-muted mb-4"></i>
                <h4 className="text-muted mb-3">Your wishlist is empty</h4>
                <p className="text-muted">You haven't liked any profiles yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .wishlist-header {
            background: linear-gradient(135deg, #c52e79ff 0%, #8a2c62 100%);
            color: white;
            border-radius: 15px;
            margin-bottom: 2rem;
          }
          
          .empty-wishlist {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Custom spacing utilities */
          .x-small {
            font-size: 0.7rem;
          }
          
          .small {
            font-size: 0.8rem;
          }
          
          /* Card image container */
          .card-image-container {
            overflow: hidden;
          }
          
          /* Stats grid */
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }
          
          .stat-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .stat-icon-wrapper {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 0.7rem;
          }
          
          /* Details grid */
          .details-grid {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .detail-item {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .detail-icon {
            color: #6c757d;
            font-size: 0.8rem;
            margin-top: 0.1rem;
            flex-shrink: 0;
          }
          
          .detail-content {
            flex: 1;
            min-width: 0;
          }
          
          /* Buttons */
          .btn-heart {
            border: none;
            background: transparent;
            color: #6c757d;
            transition: color 0.2s;
          }
          
          .btn-heart:hover {
            color: #dc3545;
          }
          
          .btn-action {
            border: none;
            border-radius: 4px;
            font-weight: 500;
            font-size: 0.8rem;
            transition: all 0.2s;
          }
          
          .btn-action:hover {
            transform: translateY(-1px);
          }
          
          /* Badges */
          .profile-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.7rem;
            backdrop-filter: blur(10px);
          }
          
          .premium-ribbon {
            position: absolute;
            top: 8px;
            right: 8px;
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: #000;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 600;
          }
          
          /* Image overlay */
          .image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
          }
          
          .card-image-container:hover .image-overlay {
            opacity: 1;
          }
          
          .overlay-icon {
            color: white;
            font-size: 1.2rem;
          }
          
          /* Dummy image container */
          .dummy-image-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
          }
          
          .dummy-visible {
            display: flex;
          }
          
          .dummy-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.1);
          }
          
          .dummy-icon {
            font-size: 2rem;
            color: #6c757d;
          }
          
          /* Age badge and gender dot */
          .age-badge {
            background: #e9ecef;
            padding: 0.1rem 0.4rem;
            border-radius: 12px;
            font-weight: 500;
          }
          
          .gender-dot {
            width: 4px;
            height: 4px;
            background: #6c757d;
            border-radius: 50%;
          }
          
          .income-badge {
            background: #764ba2;
            color: #ffffff;
            padding: 0.3rem 0.6rem;
            border-radius: 6px;
            border: 1px solid #ffeaa7;
          }
          
          /* Smooth hover effect */
          .premium-match-card {
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }
          
          .premium-match-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
          }
          
          /* Gradient Backgrounds */
          .bg-gradient-reverse {
            background-color: #c52e79ff !important;
          }
          
          .bg-gradient-blue {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
          }
          
          .bg-gradient-orange {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%) !important;
          }
          
          .bg-gradient-green {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) !important;
          }
          
          .bg-gradient-purple {
            background: linear-gradient(135deg, #a6c0fe 0%, #f68084 100%) !important;
          }
          
          .bg-gradient-red {
            background: linear-gradient(135deg, #ff5858 0%, #f09819 100%) !important;
          }
          
          /* Custom Close Button */
          .btn-close-custom {
            opacity: 2;
            filter: invert(1);
          }
          
          /* Hover Effects */
          .info-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          }
          
          .family-member:hover {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            transition: all 0.3s ease;
          }
          
          .lifestyle-item:hover {
            transform: scale(1.05);
            transition: all 0.3s ease;
          }
          
          /* Section Headers */
          .section-header {
            border-left: 4px solid #d4af37;
            padding-left: 1rem;
          }
          
          /* Profile Image Container */
          .profile-image-container {
            position: relative;
            overflow: hidden;
            border-radius: 15px 15px 0 0;
          }
          
          .profile-image-container::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: linear-gradient(transparent, rgba(0,0,0,0.1));
            z-index: 1;
          }
          
          /* Mobile responsive close button */
          @media (max-width: 768px) {
            .btn-close-custom {
              width: 30px !important;
              height: 28px !important;
              font-size: 22px !important;
              position: fixed !important;
              top: 15px !important;
              right: 15px !important;
              background-color: rgba(255,255,255,0.25) !important;
              border: 2px solid rgba(255,255,255,0.5) !important;
              z-index: 9999 !important;
            }
          }
          
          /* Ensure the header has proper spacing on mobile */
          @media (max-width: 768px) {
            .offcanvas-header {
              padding-right: 50px !important; /* Make space for the close button */
            }
          }
          
          @media (min-width: 1024px) and (max-width: 1199.98px) {
            .col-lg-3.custom-3cards {
              flex: 0 0 calc(33.333% - 1rem); /* 3 cards per row */
              max-width: calc(33.333% - 1rem);
            }
          }
        `}
      </style>
      
      <div className="main-content pt-5" ref={mainContentRef}
        style={{
          overflowY: "auto",
          overflowX: "hidden",
        }}>
        <div className="page-content">
          <div className="container-fluid">
            
            {/* Wishlist Header */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="wishlist-header p-4 shadow-sm">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h3 className="fw-bold mb-1">Your Wishlist</h3>
                      <p className="mb-0 opacity-75">
                        <i className="fas fa-heart me-2"></i>
                        {likedUsers.length} profile{likedUsers.length !== 1 ? 's' : ''} liked
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Liked Profiles Grid */}
            <div className="row g-3 mt-2">
              {likedUsers.map((u) => (
                <div
                  key={u.UID}
                  className="col-12 col-sm-6 col-md-6 col-lg-3 custom-3cards d-flex"
                >
                  <div className="card premium-match-card shadow-lg rounded-4 overflow-hidden border-0" style={{
                    width: '400px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid #c52e79ff'
                  }}>
                    
                    {/* Photo Section */}
                    <div className="card-image-container position-relative" style={{ 
                      height: "400px",
                      padding: "12px",
                      background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)'
                    }}>
                      {u.uprofile ? (
                        <img
                          src={asset(`photos/${u.uprofile}`)}
                          alt={u.Uname || 'User Profile'}
                          className="card-img-top h-100 w-100 object-fit-cover rounded-3 shadow-sm"
                          style={{ transition: 'transform 0.3s ease' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const placeholder = e.target.nextElementSibling;
                            placeholder.style.display = 'flex';
                            const gender = u.Gender || 'male';
                            const dummyImg = gender.toLowerCase() === 'female' 
                              ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
                              : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80';
                            placeholder.querySelector('.dummy-image').src = dummyImg;
                          }}
                        />
                      ) : null}
                      
                      {/* Dummy Image Container */}
                      <div className={`dummy-image-container h-100 w-100 position-absolute top-0 start-0 ${!u.uprofile ? 'dummy-visible' : ''}`}
                           style={{ 
                             padding: '12px',
                             display: !u.uprofile ? 'block' : 'none'
                           }}>
                        <div className="h-100 w-100 position-relative rounded-3 overflow-hidden shadow-sm">
                          <img
                            className="dummy-image h-100 w-100 object-fit-cover"
                            src={u.Gender && u.Gender.toLowerCase() === 'female' 
                              ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
                              : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
                            }
                            alt="Profile"
                          />
                          <div className="dummy-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                               style={{ background: 'rgba(0,0,0,0.3)' }}>
                            <div className="dummy-icon-container bg-white rounded-circle p-3 shadow">
                              <i className="fas fa-user text-muted"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Profile Badge */}
                      <div className="profile-badge position-absolute top-3 start-3 bg-dark bg-opacity-75 text-white px-2 py-1 rounded-pill d-flex align-items-center shadow-sm">
                        <i className="fas fa-id-card me-1"></i>
                        <span className="badge-text small fw-bold">{"Profile ID: " + u.UID || 'N/A'}</span>
                      </div>
                      
                      {/* Unlike Button */}
                      <div className="position-absolute top-3 end-3">
                        <button
                          className="btn btn-sm btn-danger rounded-circle shadow-sm"
                          style={{ width: "36px", height: "36px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnlike(u.UID);
                          }}
                          title="Remove from wishlist"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      
                      {/* Image Overlay */}
                      <div className="image-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                           style={{
                             opacity: 0,
                             transition: 'opacity 0.3s ease',
                             background: 'rgba(197, 46, 121, 0.1)',
                             margin: '12px'
                           }}>
                        <div className="overlay-content bg-white rounded-circle p-2 shadow">
                          <i className="fas fa-expand-alt overlay-icon text-dark fa-sm"></i>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Body */}
                    <div className="card-body p-3 d-flex flex-column" style={{
                      height: '260px',
                      background: 'white'
                    }}>
                      {/* Compact Header Section */}
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="user-info flex-grow-1">
                          <h6 className="user-name mb-1 fw-bold text-truncate text-dark">
                            {u.Uname || <span className="text-muted">Unknown User</span>}
                          </h6>
                          <div className="user-age-gender d-flex align-items-center gap-2">
{u.DOB && (
  <span
    style={{
      backgroundColor: "#007bff",
      color: "white",
      padding: "2px 6px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold"
    }}
  >
    {calculateAge(u.DOB)} 
  </span>
)}
                            <span className="gender-dot" style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: u.Gender?.toLowerCase() === 'female' ? '#e91e63' : '#2196f3'
                            }}></span>
                            <span className="gender-text small text-muted text-truncate">
                              {u.Gender || 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Compact Stats Grid */}
                      <div className="d-flex gap-2 mb-2">
                        <div className="stat-item d-flex align-items-center gap-2 p-2 rounded-2 flex-fill" 
                             style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
                          <div className="stat-icon-wrapper bg bg-dark fs-5 rounded-circle d-flex align-items-center justify-content-center"
                               style={{width: '28px', height: '28px', minWidth: '28px'}}>
                            <i className="fas fa-ruler-vertical text-white fa-xs"></i>
                          </div>
                          <div className="stat-content flex-grow-1">
                            <div className="stat-value small fw-bold text-dark">{u.height || 'N/A'}</div>
                            <div className="stat-label x-small text-muted" style={{fontSize: '0.65rem'}}>HEIGHT</div>
                          </div>
                        </div>
                        <div className="stat-item d-flex align-items-center gap-2 p-2 rounded-2 flex-fill" 
                             style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
                          <div className="stat-icon-wrapper  fs-5 bg-success rounded-circle d-flex align-items-center justify-content-center"
                               style={{width: '28px', height: '28px', minWidth: '28px'}}>
                            <i className="fas fa-graduation-cap text-white fa-xs"></i>
                          </div>
                          <div className="stat-content flex-grow-1">
                            <div className="stat-value small fw-bold text-dark text-truncate">{u.education_details || 'N/A'}</div>
                            <div className="stat-label x-small text-muted" style={{fontSize: '0.65rem'}}>EDUCATION</div>
                          </div>
                        </div>
                      </div>

                      {/* Compact Details Section */}
                      <div className="flex-grow-1 d-flex flex-column" style={{gap: '4px'}}>
                        <div className="detail-item d-flex align-items-center gap-2 p-1 rounded-2 flex-fill"
                             style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
                          <i className="fas fa-money-bill-wave detail-icon text-success fa-xs" 
                             style={{width: '16px', textAlign: 'center'}}></i>
                          <div className="detail-content flex-grow-1">
                            <div className="detail-label x-small text-muted fw-bold" style={{fontSize: '0.65rem', lineHeight: '1'}}>INCOME</div>
                            <div className="detail-value small text-truncate text-dark" style={{fontSize: '0.8rem', lineHeight: '1.2'}}>{u.income || 'Not specified'}</div>
                          </div>
                        </div>

                        <div className="detail-item d-flex align-items-center gap-2 p-1 rounded-2 flex-fill"
                             style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
                          <i className="fas fa-birthday-cake detail-icon text-secodary fa-xs"
                             style={{width: '16px', textAlign: 'center'}}></i>
                          <div className="detail-content flex-grow-1">
                            <div className="detail-label x-small text-muted fw-bold" style={{fontSize: '0.65rem', lineHeight: '1'}}>BIRTH DETAILS</div>
                            <div className="detail-value small text-truncate text-dark" style={{fontSize: '0.8rem', lineHeight: '1.2'}}>
                              {u.DOB ? formatDOBWithTime(u.DOB, u.dob_time) : 'Not provided'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="detail-item d-flex align-items-center gap-2 p-1 rounded-2 flex-fill"
                             style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
                          <i className="fas fa-users detail-icon text-info fa-xs"
                             style={{width: '16px', textAlign: 'center'}}></i>
                          <div className="detail-content flex-grow-1">
                            <div className="detail-label x-small text-muted fw-bold" style={{fontSize: '0.65rem', lineHeight: '1'}}>SUBCAST</div>
                            <div className="detail-value small text-truncate text-dark" style={{fontSize: '0.8rem', lineHeight: '1.2'}}>{u.Subcast || 'Not specified'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div 
                      className="card-footer profile-actions p-2 border-top-0"
                      style={{
                        backgroundColor: "#c52e79ff"
                      }}
                      onClick={() => openOffcanvas(u)}
                    >
                      <div className="action-buttons d-flex">
                        <button className="btn-action btn-sm py-2 rounded-2 flex-grow-1 d-flex align-items-center justify-content-center fw-bold border-0"
                                style={{
                                  transition: 'all 0.3s ease', 
                                  color: '#ffffff',
                                  fontSize: '0.85rem',
                                  backgroundColor:"#c52e79ff"
                                }}>
                          <i className="fas fa-eye me-2"></i>
                          View Full Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Offcanvas Modal */}
            <div
              ref={offcanvasRef}
              className="offcanvas offcanvas-center"
              tabIndex="-1"
              id="userOffcanvas"
              aria-labelledby="userOffcanvasLabel"
              data-bs-backdrop="true"
              data-bs-scroll="false"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "95vw",
                maxWidth: "1000px",
                height: "95vh",
                borderRadius: "20px",
                boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
              }}
            >
              {/* Premium Header */}
              <div className="offcanvas-header position-relative" style={{ 
                borderRadius: "20px 20px 0 0",
                backgroundColor:"#c52e79ff",
                padding: "1rem 1.5rem",
                minHeight: "80px"
              }}>
                <div className="d-flex align-items-center w-100">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center">
                      <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow me-3" 
                           style={{ width: "50px", height: "50px" }}>
                        <i className="fas fa-heart text-danger fs-5"></i>
                      </div>
                      <div>
                        <h4 className="offcanvas-title mb-0 fw-bold text-dark">{selectedUser?.Uname}</h4>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-dark bg-opacity-75 px-2 py-1">
                            <i className="fas fa-id-card me-1"></i>
                            User Profile ID: {selectedUser?.UID}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn-close-custom d-flex align-items-center justify-content-center"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                      onClick={closeOffcanvas}
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        backgroundColor:"#c52e79ff",
                        backdropFilter: "blur(10px)",
                        border: "1.5px solid #c52e79ff",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "white",
                        fontSize: "18px"
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="offcanvas-body p-0" style={{ overflowY: "auto", background: "#f8f9fa" }}>
                {selectedUser && (
                  <div className="container-fluid p-0">
                    <div className="row g-0">
                      
                      {/* Left Sidebar - Profile & Quick Actions */}
                      <div className="col-12 col-lg-4">
                        <div className="p-3" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)" }}>
                          
                          {/* Profile Photo Card */}
                          <div className="card border-0 shadow-lg rounded-3 overflow-hidden mb-4">
                            <div className="position-relative">
                              <div className="profile-image-container">
                                <img
                                  src={selectedUser.uprofile ? asset(`photos/${selectedUser.uprofile}`) : (selectedUser.Gender && selectedUser.Gender.toLowerCase() === 'female' ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80')}
                                  alt={selectedUser.Uname}
                                  className="w-100"
                                  style={{
                                    height: "500px",
                                    objectFit: "cover",
                                    cursor: "pointer"
                                  }}
                                  onClick={() => setZoomImage(true)}
                                />
                                
                                {/* Zoom Button */}
                                <div
                                  onClick={() => setZoomImage(true)}
                                  className="position-absolute top-0 end-0 m-3 bg-dark bg-opacity-50 text-white rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    cursor: "pointer",
                                    backdropFilter: "blur(5px)",
                                    border: "2px solid rgba(255,255,255,0.3)"
                                  }}
                                  title="Zoom Image"
                                >
                                  <i className="fas fa-expand-arrows-alt"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Content - Detailed Information */}
                      <div className="col-12 col-lg-8">
                        <div className="p-4" style={{ background: "white", minHeight: "100%" }}>
                          
                          {/* Basic Information */}
                          <div className="row g-3 mb-4">
                            <div className="col-12">
                              <div className="section-header mb-3">
                                <h5 className="fw-bold text-primary mb-2">
                                  <i className="fas fa-user-circle me-2"></i>
                                  Basic Information
                                </h5>
                              </div>
                              <div className="row g-3">
                                {[
                                  { icon: "venus-mars", label: "Gender", value: selectedUser.Gender || "Not specified" },
                                  { icon: "birthday-cake", label: "Date of Birth", value: formatDOBOnly(selectedUser.DOB) || "-" },
                                  { icon: "clock", label: "Birth Time", value: selectedUser.dob_time || "-" },
                                  { icon: "map-marker-alt", label: "Birth Place", value: selectedUser.birthplace || "-" },
                                  { icon: "weight", label: "Weight", value: selectedUser.weight || "-" },
                                  { icon: "heart", label: "Marriage Type", value: selectedUser.marriage_type || "-" },
                                  { icon: "tint", label: "Blood Group", value: selectedUser.bloodgroup || "-" },
                                  { icon: "ruler-vertical", label: "Height", value: selectedUser.height || "-" },
                                  { icon: "money-bill-wave", label: "Income", value: selectedUser.income || "-" }
                                ].map((item, index) => (
                                  <div key={index} className="col-12 col-sm-6 col-lg-4">
                                    <div className="info-card p-3 rounded-3 border h-100">
                                      <div className="d-flex align-items-center mb-2">
                                        <i className={`fas fa-${item.icon} text-primary me-2`}></i>
                                        <small className="fw-bold text-dark">{item.label}</small>
                                      </div>
                                      <div className="fw-bold text-muted">{item.value}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Religion & Caste */}
                          <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-gradient-reverse text-white py-3">
                              <h6 className="mb-0">
                                <i className="fas fa-praying-hands me-2"></i>
                                Religion & Caste Information
                              </h6>
                            </div>
                            <div className="card-body">
                              <div className="row g-3">
                                {[
                                  { label: "Caste", value: selectedUser.Cast },
                                  { label: "Sub Caste", value: selectedUser.Subcast },
                                  { label: "Ras", value: selectedUser.Ras },
                                  { label: "Gotra", value: selectedUser.Gotra },
                                  { label: "Nakshtra", value: selectedUser.Nakshtra },
                                  { label: "Nadi", value: selectedUser.Nadi },
                                  { label: "Gan", value: selectedUser.Gan },
                                  { label: "Mangal", value: selectedUser.managal },
                                  { label: "Charan", value: selectedUser.charan }
                                ].map((item, index) => (
                                  <div key={index} className="col-12 col-sm-6 col-md-4">
                                    <div className="d-flex justify-content-between border-bottom pb-2">
                                      <span className="fw-bold text-dark">{item.label}:</span>
                                      <span className="fw-bold text-muted text-end">{item.value || "-"}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Professional & Education */}
                          <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-gradient-reverse text-white py-3">
                              <h6 className="mb-0">
                                <i className="fas fa-briefcase me-2"></i>
                                Professional & Education
                              </h6>
                            </div>
                            <div className="card-body">
                              <div className="row g-3">
                                {[
                                  { icon: "graduation-cap", label: "Education", value: selectedUser.Education },
                                  { icon: "book", label: "Education Details", value: selectedUser.education_details },
                                  { icon: "chart-line", label: "Fixed Income", value: selectedUser.fincome },
                                  { icon: "globe-americas", label: "Work Country", value: selectedUser.Country },
                                  { icon: "map", label: "Work State", value: selectedUser.State },
                                  { icon: "location-arrow", label: "Work District", value: selectedUser.District }
                                ].map((item, index) => (
                                  <div key={index} className="col-12 col-sm-6">
                                    <div className="d-flex align-items-start mb-3">
                                      <i className={`fas fa-${item.icon} text-primary mt-1 me-3`}></i>
                                      <div className="flex-grow-1">
                                        <div className="text-dark fw-bold">{item.label}</div>
                                        <div className="text-muted fw-bold">{item.value || "NA"}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Family Information */}
                          <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-gradient-reverse text-white py-3">
                              <h6 className="mb-0">
                                <i className="fas fa-users me-2"></i>
                                Family Background
                              </h6>
                            </div>
                            <div className="card-body">
                              <div className="row g-3">
                                {[
                                  { relation: "Father", name: selectedUser.father, occupation: selectedUser.father_occupation },
                                  { relation: "Mother", name: selectedUser.Mother, occupation: selectedUser.mother_occupation },
                                  { relation: "Brother", name: selectedUser.Brother, occupation: selectedUser.brother_occupation },
                                  { relation: "Sister", name: selectedUser.Sister, occupation: "Not specified" }
                                ].map((member, index) => (
                                  <div key={index} className="col-12 col-sm-6">
                                    <div className="family-member p-3 rounded-3 border">
                                      <div className="fw-bold text-primary mb-1">{member.relation}</div>
                                      <div className="fw-bold small mb-1">{member.name || "NA"}</div>
                                      <div className="fw-bold small">{member.occupation || "NA"}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Lifestyle & Preferences */}
                          <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-gradient-reverse text-white py-3">
                              <h6 className="mb-0">
                                <i className="fas fa-heartbeat me-2"></i>
                                Lifestyle & Preferences
                              </h6>
                            </div>
                            <div className="card-body">
                              <div className="row g-3">
                                {[
                                  { icon: "utensils", label: "Diet", value: selectedUser.Diet, color: "success" },
                                  { icon: "wine-glass", label: "Drink", value: selectedUser.Drink, color: "warning" },
                                  { icon: "smoking", label: "Smoking", value: selectedUser.Smoking, color: "danger" },
                                  { icon: "stethoscope", label: "Health Condition", value: selectedUser.Dieses, color: "info" },
                                  { icon: "glasses", label: "Spectacles", value: selectedUser.specs, color: "primary" }
                                ].map((item, index) => (
                                  <div key={index} className="col-12 col-sm-6 col-md-4">
                                    <div className="lifestyle-item text-center p-3 rounded-3 border">
                                      <i className={`fas fa-${item.icon} text-${item.color} fs-4 mb-2`}></i>
                                      <div className="text-dark fw-bold small">{item.label}</div>
                                      <div className="fw-bold text-muted">{item.value || "NA"}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Partner Expectations */}
                          <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-gradient-reverse text-white py-3">
                              <h6 className="mb-0">
                                <i className="fas fa-bullseye me-2"></i>
                                Partner Expectations
                              </h6>
                            </div>
                            <div className="card-body">
                              <div className="expectation-content p-3 bg-light rounded-3">
                                <p className="mb-0 fst-italic text-dark">
                                  {selectedUser.Expectation || "Expectations not specified yet."}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-header bg-gradient-reverse text-white py-3">
                              <h6 className="mb-0">
                                <i className="fas fa-address-card me-2"></i>
                                Contact Information
                              </h6>
                            </div>
                            <div className="card-body">
                              <div className="row g-3 mb-4">
                                {[
                                  { icon: "mobile-alt", label: "Mobile Number", key: "Umobile" },
                                  { icon: "phone", label: "Other Mobile", key: "alt_mobile" },
                                  { icon: "whatsapp", label: "WhatsApp Number", key: "whatsappno" },
                                  { icon: "map-marked-alt", label: "Address", key: "address" },
                                  { icon: "home", label: "Property Details", key: "property_details" },
                                  { icon: "info-circle", label: "Other Details", key: "other_details" },
                                ].map((item, index) => {
                                  const value =
                                    isUnlocked && selectedUser
                                      ? selectedUser[item.key] || "NA"
                                      : item.key === "Umobile" || item.key === "alt_mobile" || item.key === "whatsappno"
                                      ? "***********"
                                      : selectedUser?.[item.key] || "NA";

                                  return (
                                    <div key={index} className="col-12 col-sm-6">
                                      <div className="d-flex align-items-start">
                                        <i className={`fas fa-${item.icon} text-muted mt-1 me-3`}></i>
                                        <div className="flex-grow-1">
                                          <div className="text-dark fw-bold small">{item.label}</div>
                                          <div className="fw-bold text-muted small">{value}</div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Locked / Unlock Button */}
                              {(!isUnlocked || planExpired) && selectedUser && (
                                <div className="text-center bg-warning bg-opacity-10 rounded-3 p-3 p-md-4 border">
                                  <div className="mb-3">
                                    <i style={{color:"#c52e79ff"}} className="fas fa-lock fs-2 mb-2"></i>
                                    <h6 className="text-dark fw-bold">Contact Details Locked</h6>
                                    <p className="text-muted small">
                                      स्थळाचा मोबाईल नंबर पाहण्यासाठी खालील बटन वर क्लिक करा
                                    </p>
                                  </div>

                                  <button
                                    className="btn btn-lg rounded-pill shadow px-4 fw-bold"
                                    onClick={() => handleViewContact(selectedUser.UID)}
                                    disabled={loadingContactMap[selectedUser.UID]}
                                    style={{backgroundColor:"#c52e79ff",color:"#fff" }}
                                  >
                                    {loadingContactMap[selectedUser.UID] ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <i className="fas fa-unlock me-2"></i>
                                        View Contact
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Zoom Modal */}
            {zoomImage && (
              <div
                onClick={() => {
                  setZoomImage(false);
                  setZoomLevel(1); // reset zoom on close
                }}
                onWheel={(e) => {
                  e.preventDefault();

                  if (e.deltaY < 0) {
                    setZoomLevel((prev) => Math.min(prev + 0.1, 3));
                  } else {
                    setZoomLevel((prev) => Math.max(prev - 0.1, 1));
                  }
                }}
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(0,0,0,0.85)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 9999,
                  backdropFilter: "blur(3px)",
                  overflow: "hidden",
                }}
              >
                {/* CLOSE BUTTON */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomImage(false);
                    setZoomLevel(1);
                  }}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#fff",
                    cursor: "pointer",
                    zIndex: 10000,
                  }}
                >
                  ✕
                </div>

                {/* IMAGE */}
                <img
                  src={selectedUser?.uprofile ? asset(`photos/${selectedUser.uprofile}`) : (selectedUser?.Gender && selectedUser.Gender.toLowerCase() === 'female' ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80')}
                  alt="Zoom"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "90vw",
                    maxWidth: "400px",
                    height: "70vh",
                    maxHeight: "500px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    boxShadow: "0 0 40px rgba(0,0,0,0.6)",
                    transform: `scale(${zoomLevel})`,
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WishList;