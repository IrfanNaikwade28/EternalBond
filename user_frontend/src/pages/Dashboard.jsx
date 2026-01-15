import React, { useEffect, useState, useRef } from "react";
import { userApi, asset, withBase } from "../lib/api";
import { Offcanvas } from "react-bootstrap";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle"; // optional for module init
import FilterModal from "./FilterModal"; // your filter modal component
import { useFilterModal } from "../context/FilterModalContext";

const Dashboard = () => {


 //const { showFilterModal, openFilterModal, closeFilterModal, onApplyFilter } = useFilterModal();

//const { showFilterModal, openFilterModal } = useFilterModal();

  const [allUsers, setAllUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const limit = 20;
  const [selectedUser, setSelectedUser] = useState(null);
  const [zoomImage, setZoomImage] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [contactInfo, setContactInfo] = useState({});
  // Refs
  const mainContentRef = useRef(null);
  const offcanvasRef = useRef(null);
  const bsRef = useRef(null); 
 






const { filteredUsers, originalUsers, setOriginalUsers, showNoDataMessage } = useFilterModal();
const [likedUsers, setLikedUsers] = useState([]);
  const [unlockedProfiles, setUnlockedProfiles] = useState([]);
// Retrieve the stored user object safely
const storedUser = localStorage.getItem("user");
const loginUID = storedUser ? JSON.parse(storedUser).UID : null;
//Determine if selected profile is unlocked
const isUnlocked = selectedUser && unlockedProfiles.includes(selectedUser.UID);
const [loadingContactMap, setLoadingContactMap] = useState({});
const [planExpired, setPlanExpired] = useState(false);
//const [contactInfo, setContactInfo] = useState({});

useEffect(() => {
  if (!loginUID) return;

  const fetchUnlockedProfiles = async () => {
    try {
      const res = await userApi.get(
        `/api/incrementViewCount?loginUserUID=${loginUID}`
      );

      if (res.data.success) {
        setUnlockedProfiles(res.data.unlocked);
        setPlanExpired(false); // plan is fine
      } else if (res.data.message && res.data.message.includes("expired")) {
        setPlanExpired(true); // plan expired
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchUnlockedProfiles();
}, [loginUID, selectedUser]);


// Handle unlocking contact
  const handleViewContact = async (uid) => {
  setLoadingContactMap(prev => ({ ...prev, [uid]: true }));

  try {
      const response = await userApi.post(
        "/api/incrementViewCount",
        { loginUserUID: loginUID, selectedUserUID: uid }
      );

    const data = response.data;

    if (!data.success && data.message.includes("upgrade")) {
      alert(data.message);
      return;
    }

    if (data.success && data.allowView) {
      // Mark profile as unlocked
      setUnlockedProfiles(prev => [...new Set([...prev, uid])]);

      // Save the returned mobile info
      setContactInfo(prev => ({ ...prev, [uid]: data.mobile }));

      if (!data.alreadyUnlocked) {
        alert(`Contact unlocked! Mobile: ${data.mobile.Umobile}`);
      }
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while unlocking contact.");
  } finally {
    setLoadingContactMap(prev => ({ ...prev, [uid]: false }));
  }
};





useEffect(() => {
  userApi.get(`/api/likes?PRID=${loginUID}`)
    .then(res => {
      if (res.data.status) {
        setLikedUsers(res.data.likedUIDs);
      }
    })
    .catch(err => console.log(err));
}, []);


const handleLike = async (profile_uid) => {
  const isLiked = likedUsers.includes(profile_uid);
  const action = isLiked ? "unlike" : "like";

  const response = await fetch(`${userApi.defaults.baseURL}/api/toggle-like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      UID: profile_uid,    // profile you liked
      PRID: loginUID,      // logged-in user
      action: action
    })
  });

  const data = await response.json();

  if (data.status) {
    if (action === "like") {
      setLikedUsers([...likedUsers, profile_uid]);
    } else {
      setLikedUsers(likedUsers.filter(id => id !== profile_uid));
    }
  }
};

function formatDOBOnly(dob) {
  if (!dob) return "-";

  const dateObj = new Date(dob);
  if (isNaN(dateObj.getTime())) return "-";

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}
// Format: DD/MM/YYYY | HH:mm:ss
function formatDOBWithTime(dob, time) {
  if (!dob) return "-";

  // Ensure time exists
  const finalTime = time || "00:00:00";

  // Convert ISO date to normal date
  const dateObj = new Date(dob);

  if (isNaN(dateObj.getTime())) return "-";

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year} | ${finalTime}`;
}

const formatDateTime = (dob, time) => {
  if (!dob) return "N/A";

  const date = new Date(dob);
  if (isNaN(date.getTime())) return "N/A";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let finalTime = "00:00:00";
  if (time) finalTime = time; // Already "hh:mm:ss" format

  return `${day}/${month}/${year} | ${finalTime}`;
};

useEffect(() => {
  const loadUsers = async () => {
    if (!user) return;

    setLoading(true);

    try {
      let users = [];

      if (filteredUsers.length > 0) {
        // Show filtered users if available
        users = filteredUsers;
      } else if (originalUsers.length > 0) {
        // Otherwise, use original users from context
        users = originalUsers;
      } else {
        // Fetch from API if original users not loaded
        const response = await userApi.get(`/api/usersInfo?gender=${user.Gender}`);
        users = response.data;
        setOriginalUsers(users); // save original data to context
      }

      // Set state
      setAllUsers(users);
     
      setVisibleUsers(users.slice(0, limit));
      setHasMore(users.length > limit);
      //DOBFormatted: formatDOB(u.DOB)
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  loadUsers();
}, [user, filteredUsers, originalUsers]);




  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    //console.log(storedUser.UID)
    //setLoginUser(JSON.parse(storedUser));
    //console.log("login"+loginUser)
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  
  // infinite scroll observer (kept as you had it)
  useEffect(() => {
    if (loading || !hasMore) return;
    if (observerRef.current && typeof observerRef.current.disconnect === 'function') {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    const loader = document.querySelector("#scroll-loader");
    if (loader) observer.observe(loader);
    observerRef.current = observer;

    return () => {
      if (observer && typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
    };
  }, [visibleUsers, hasMore, loading]);

  const loadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);

    setTimeout(() => {
      const newCount = visibleUsers.length + limit;
      const newUsers = allUsers.slice(0, newCount);

      setVisibleUsers(newUsers);
      setLoadingMore(false);

      if (newUsers.length >= allUsers.length) setHasMore(false);
    }, 800);
  };

  // Setup offcanvas bootstrap instance + events once
  useEffect(() => {
    const node = offcanvasRef.current;
    if (!node) return;

    // Create a single bootstrap Offcanvas instance and keep it in bsRef
    if (!bsRef.current) {
      bsRef.current = new bootstrap.Offcanvas(node, {
        backdrop: true,
        scroll: false, // prefer to let offcanvas control body scroll
      });
    }

    const handleShown = () => {
      // When offcanvas opens, disable dashboard scrolling (so one scrollbar remains)
      if (mainContentRef.current) {
        mainContentRef.current.style.overflowY = "hidden";
      }

      // Also ensure body scroll is disabled (bootstrap may set it) — keep safe
      try {
        document.body.style.overflow = "hidden";
      } catch (e) { }
    };

    const handleHidden = () => {
      // Restore dashboard scroll
      if (mainContentRef.current) {
        mainContentRef.current.style.overflowY = "auto";
      }

      // Clean any inline body overflow set by bootstrap or our code
      try {
        document.body.style.overflow = "";
      } catch (e) { }

      // Remove leftover backdrop if any (safety)
      const backdrop = document.querySelector(".offcanvas-backdrop");
      if (backdrop) backdrop.remove();
    };

    node.addEventListener("shown.bs.offcanvas", handleShown);
    node.addEventListener("hidden.bs.offcanvas", handleHidden);

    // cleanup on unmount
    return () => {
      node.removeEventListener("shown.bs.offcanvas", handleShown);
      node.removeEventListener("hidden.bs.offcanvas", handleHidden);
      // dispose bootstrap instance
      if (bsRef.current) {
        try {
          bsRef.current.dispose();
        } catch (e) { }
        bsRef.current = null;
      }
    };
  }, [offcanvasRef.current]); // run once when ref attached

  // Open offcanvas via bsRef (clean single point)
  const openOffcanvas = (userObj) => {
    setSelectedUser(userObj);
    setContactInfo(null); // <-- reset mobile number for new user
    // small timeout ensures selectedUser renders if used inside offcanvas content
    setTimeout(() => {
      if (!bsRef.current) {
        // fallback: create instance if not present yet
        const node = offcanvasRef.current;
        if (!node) return;
        bsRef.current = new bootstrap.Offcanvas(node, { backdrop: true, scroll: false });
      }
      try {
        bsRef.current.show();
      } catch (e) {
        // fallback: manually add class to show if something weird
        const node = offcanvasRef.current;
        if (node) node.classList.add("show");
      }
    }, 50);
  };
  // const handleViewContact = async () => {
  //   if (!selectedUser || !user) return;

  //   setLoadingContact(true);

  //   try {
  //     const response = await axios.post("http://localhost:5001/api/incrementViewCount", {
  //       loginUserUID: user.UID,           // Logged-in user (whose count will decrease)
  //       selectedUserUID: selectedUser.UID // Profile user (whose number will show)
  //     });

  //     const data = response.data;

  //     if (data.success && data.allowView) {
  //       setContactInfo({ mobile: data.mobile, UID: selectedUser.UID });

  //       alert(
  //         `Contact Unlocked!\nMobile: ${data.mobile}\nUsed: ${data.used}/${data.used + data.remaining}`
  //       );

  //     } else {
  //       alert(data.message);
  //     }

  //   } catch (error) {
  //     console.error(error);
  //     alert("Something went wrong, try again.");
  //   } finally {
  //     setLoadingContact(false);
  //   }
  // };




  if (loading) return <p className="text-center mt-5">Loading users...</p>;


  //if (loading) return <p className="text-center mt-5">Loading users...</p>;
  function formatDOB(dob) {
    if (!dob) return "-";
    const [year, month, day] = dob.split("-");
    return `${day}/${month}/${year}`;
  }

// Age calculation function
const calculateAge = (dob) => {
  if (!dob) return null;
  
  try {
    const birthDate = new Date(dob);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(birthDate.getTime())) return null;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age > 0 ? `${age} yrs` : null;
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
};





  return (
    <>
    
    <style>
       {`
      /* Modern SaaS Profile Card Styles */
      .profile-card-modern {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        will-change: transform, box-shadow;
      }

      .profile-card-modern:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
      }

      /* Ensure cards maintain equal height in grid */
      .col-lg-4 {
        display: flex;
      }

      .profile-card-modern .card-image-wrapper {
        position: relative;
        flex-shrink: 0;
      }

      /* Object fit for consistent image sizing */
      .object-fit-cover {
        object-fit: cover;
        object-position: center;
      }

      /* Smooth transitions for interactive elements */
      .profile-card-modern button {
        cursor: pointer;
      }

      /* Text truncation utility */
      .text-truncate-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Min width utility for flex items */
      .min-width-0 {
        min-width: 0;
      }

      /* Responsive adjustments for mobile */
      @media (max-width: 576px) {
        .profile-card-modern {
          max-width: 100%;
          height: auto;
        }
        
        .profile-card-modern .card-image-wrapper {
          height: 280px !important;
        }

        .profile-card-modern {
          height: auto !important;
        }
      }

      /* Tablet responsive */
      @media (min-width: 577px) and (max-width: 991px) {
        .profile-card-modern .card-image-wrapper {
          height: 300px !important;
        }
      }

      /* Ensure 3 cards per row on desktop */
      @media (min-width: 992px) {
        .col-lg-4 {
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
        }
      }

      /* Custom spacing utilities */
      .x-small {
        font-size: 0.7rem;
      }

      .small {
        font-size: 0.8rem;
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
  background: linear-gradient(135deg, #c52e79 0%, #a32561 100%) !important;
}

.bg-gradient-red {
  background: linear-gradient(135deg, #ff5858 0%, #f09819 100%) !important;
}

/* Circular Progress */
.circular-progress {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.circular-progress::before {
  content: "";
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
}

.progress-inner {
  position: relative;
  z-index: 1;
  background: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
  color: #28a745;
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
  border-left: 4px solid #c52e79;
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

/* Enhanced Custom Scrollbar with Gradient */
.offcanvas-body::-webkit-scrollbar {
  width: 10px;
}

.offcanvas-body::-webkit-scrollbar-track {
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
}

.offcanvas-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #c52e79 0%, #a32561 100%);
  border-radius: 10px;
  border: 2px solid #f8f9fa;
}

.offcanvas-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #a32561 0%, #c52e79 100%);
  box-shadow: 0 2px 8px rgba(197, 46, 121, 0.4);
}

/* Smooth scroll behavior */
.offcanvas-body {
  scroll-behavior: smooth;
}

/* Smooth transitions for data sections */
.row.g-4 > div {
  transition: transform 0.2s ease;
}

/* Mobile responsive for sidebar */
@media (max-width: 991px) {
  .col-12.col-lg-4 {
    border-right: none !important;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .col-12.col-lg-4 > div {
    position: static !important;
    max-height: none !important;
  }
}

/* Shimmer loading effect for images */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.loading-shimmer {
  animation: shimmer 2s infinite;
  background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
  background-size: 1000px 100%;
}

/* Pulse animation for buttons */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.pulse-animation {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Fade in animation for widgets */
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

.fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

/* Floating animation for decorative elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.float-animation {
  animation: float 3s ease-in-out infinite;
}

/* Glassmorphism effect */
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Enhanced hover effect for cards */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(197, 46, 121, 0.2);
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #c52e79 0%, #a32561 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Badge pulse effect */
@keyframes badge-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(197, 46, 121, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(197, 46, 121, 0);
  }
}

.badge-pulse {
  animation: badge-pulse 2s infinite;
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
          {/* <h3 className="text-center fw-bold pt-4">User Dashboard</h3> */}

          {/* Cards Section */}


           {/* DATA NOT FOUND MESSAGE */}
  {showNoDataMessage && (
    <div className="alert alert-warning text-center fw-bold">
      ❌ Data Not Found
    </div>
  )}

  {!showNoDataMessage && (

          <div className="row g-4 mt-4">
            {visibleUsers.map((u) => (
              <div
                key={u.UID}
                className="col-12 col-sm-6 col-md-6 col-lg-4 d-flex"
              >
                {/* Modern SaaS Profile Card */}
                <div className="profile-card-modern shadow-sm border-0 d-flex flex-column w-100"
                     style={{
                       borderRadius: '16px',
                       overflow: 'hidden',
                       backgroundColor: '#ffffff',
                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                       height: '580px'
                     }}>
                  
                  {/* Image Section - Fixed Height with Hover Zoom */}
                  <div className="card-image-wrapper position-relative" 
                       style={{ 
                         height: '320px',
                         overflow: 'hidden',
                         backgroundColor: '#f8f9fa'
                       }}>
                    {u.uprofile ? (
                      <img
                        src={(() => {
                          let v = u.uprofile || "";
                          v = withBase(v);
                          if (/^https?:\/\//i.test(v)) return v;
                          v = v.replace(/^:?5000\//, "");
                          v = v.replace(/^\/?uploads\//, "");
                          if (!v.startsWith("photos/")) v = `photos/${v}`;
                          const finalUrl = asset(v);
                          console.log(`Image URL for ${u.Uname}:`, finalUrl, '| Original:', u.uprofile);
                          return finalUrl;
                        })()}
                        alt={u.Uname || 'Profile'}
                        className="w-100 h-100 object-fit-cover"
                        style={{ 
                          transition: 'transform 0.5s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          zIndex: 1
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                        <div className="text-center">
                          <div className="rounded-circle bg-white shadow-sm d-inline-flex align-items-center justify-content-center"
                               style={{ width: '80px', height: '80px' }}>
                            <i className="fas fa-user fa-2x text-muted"></i>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Profile ID Badge - Top Left */}
                    <div className="position-absolute top-0 start-0 m-3">
                      <span className="badge px-3 py-2 shadow-sm"
                            style={{
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              backdropFilter: 'blur(10px)',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              borderRadius: '8px'
                            }}>
                        ID: {u.UID}
                      </span>
                    </div>

                    {/* Wishlist Heart - Top Right */}
                    <div className="position-absolute top-0 end-0 m-3">
                      <button
                        className="btn btn-sm rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(u.UID);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.backgroundColor = likedUsers.includes(u.UID) ? '#dc3545' : '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                        }}
                      >
                        <i className={`${likedUsers.includes(u.UID) ? 'fas' : 'far'} fa-heart`}
                           style={{ 
                             color: likedUsers.includes(u.UID) ? '#dc3545' : '#6c757d',
                             fontSize: '1rem'
                           }}></i>
                      </button>
                    </div>
                  </div>

                  {/* Card Body - Clean Information Hierarchy */}
                  <div className="card-body p-4 d-flex flex-column flex-grow-1">
                    
                    {/* Primary Info: Name + Age/Gender */}
                    <div className="mb-3">
                      <h5 className="mb-2 fw-bold text-dark" 
                          style={{ 
                            fontSize: '1.25rem',
                            lineHeight: '1.3',
                            letterSpacing: '-0.01em'
                          }}>
                        {u.Uname || 'Name Not Available'}
                      </h5>
                      <div className="d-flex align-items-center gap-2 text-muted" 
                           style={{ fontSize: '0.9rem' }}>
                        <span className="fw-medium">{calculateAge(u.DOB) || 'Age N/A'}</span>
                        <span style={{ 
                          width: '4px', 
                          height: '4px', 
                          borderRadius: '50%',
                          backgroundColor: '#6c757d'
                        }}></span>
                        <span>{u.Gender || 'Not specified'}</span>
                      </div>
                    </div>

                    {/* Secondary Info: Profession/Education + Location */}
                    <div className="mb-3 pb-3 border-bottom">
                      <p className="mb-0 text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                        <span className="fw-medium text-dark">{u.education_details || 'Education details not provided'}</span>
                        {u.Subcast && (
                          <>
                            {' • '}
                            <span>{u.Subcast}</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Stats Row: Single Row with Icons */}
                    <div className="d-flex gap-3 mb-3 pb-3 border-bottom">
                      {/* Height */}
                      <div className="d-flex align-items-center gap-2 flex-fill">
                        <div className="d-flex align-items-center justify-content-center rounded-circle"
                             style={{
                               width: '32px',
                               height: '32px',
                               backgroundColor: '#f8f9fa',
                               flexShrink: 0
                             }}>
                          <i className="fas fa-ruler-vertical" style={{ fontSize: '0.75rem', color: '#6c757d' }}></i>
                        </div>
                        <div className="flex-grow-1 min-width-0">
                          <div className="text-dark fw-medium text-truncate" style={{ fontSize: '0.85rem' }}>
                            {u.height || 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Income */}
                      <div className="d-flex align-items-center gap-2 flex-fill">
                        <div className="d-flex align-items-center justify-content-center rounded-circle"
                             style={{
                               width: '32px',
                               height: '32px',
                               backgroundColor: '#f8f9fa',
                               flexShrink: 0
                             }}>
                          <i className="fas fa-wallet" style={{ fontSize: '0.75rem', color: '#6c757d' }}></i>
                        </div>
                        <div className="flex-grow-1 min-width-0">
                          <div className="text-dark fw-medium text-truncate" style={{ fontSize: '0.85rem' }}>
                            {u.income || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spacer to push button to bottom */}
                    <div className="flex-grow-1"></div>

                    {/* Action Button */}
                    <button
                      className="btn w-100 py-3 fw-semibold border-0 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        backgroundColor: '#c52e79',
                        color: 'white',
                        fontSize: '0.95rem',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                        letterSpacing: '0.02em'
                      }}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#userOffcanvas"
                      onClick={() => openOffcanvas(u)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#a32561';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(197, 46, 121, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#c52e79';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <i className="fas fa-eye"></i>
                      <span>View Full Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
)}
          {/* Loader Animation */}
          {loadingMore && (
            <div className="text-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
 
          {/* Invisible Scroll Trigger */}
          {hasMore && (
            <div id="scroll-loader" style={{ height: "40px" }}></div>
          )}
        </div>
      </div>
    </div>

    {/* Offcanvas Profile View */}
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
    background: "linear-gradient(135deg, #c52e79 0%, #a32561 100%)",
    boxShadow: "0 4px 20px rgba(197, 46, 121, 0.25)",
    padding: "1.5rem 2rem",
    minHeight: "90px"
  }}>
    <div className="d-flex align-items-center w-100">
      <div className="flex-grow-1">
        <div className="d-flex align-items-center">
          <div className="rounded-circle d-flex align-items-center justify-content-center shadow-lg me-3" 
               style={{ 
                 width: "56px", 
                 height: "56px",
                 background: "rgba(255, 255, 255, 0.95)",
                 backdropFilter: "blur(10px)"
               }}>
            <i className="fas fa-heart" style={{ color: "#c52e79", fontSize: "1.4rem" }}></i>
          </div>
          <div>
            <h4 className="offcanvas-title mb-1 fw-bold" style={{ color: "white", letterSpacing: "-0.02em" }}>{selectedUser?.Uname}</h4>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="badge px-3 py-1" style={{ 
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                fontSize: "0.75rem"
              }}>
                <i className="fas fa-id-card me-1"></i>
                ID: {selectedUser?.UID}
              </span>
              <span className="badge px-3 py-1" style={{ 
                background: "rgba(76, 175, 80, 0.25)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(76, 175, 80, 0.4)",
                color: "white",
                fontSize: "0.75rem"
              }}>
                <i className="fas fa-shield-check me-1"></i>
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="d-flex align-items-center gap-2">
  {/* Close Button with Font Awesome */}
  <button
    type="button"
    className="btn-close-custom d-flex align-items-center justify-content-center"
    data-bs-dismiss="offcanvas"
    aria-label="Close"
    style={{
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      border: "1.5px solid rgba(255, 255, 255, 0.3)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color: "white",
      fontSize: "18px"
    }}
    onMouseEnter={(e) => {
      e.target.style.background = "rgba(255, 255, 255, 0.3)";
      e.target.style.transform = "rotate(90deg) scale(1.1)";
      e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "rgba(255, 255, 255, 0.2)";
      e.target.style.transform = "rotate(0deg) scale(1)";
      e.target.style.boxShadow = "none";
    }}
    // onMouseEnter={(e) => {
    //   e.target.style.backgroundColor = "rgba(255,255,255,0.25)";
    //   e.target.style.borderColor = "rgba(255,255,255,0.5)";
    //   e.target.style.transform = "scale(1.1)";
    //   e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    // }}
    // onMouseLeave={(e) => {
    //   e.target.style.backgroundColor = "rgba(255,255,255,0.15)";
    //   e.target.style.borderColor = "rgba(255,255,255,0.3)";
    //   e.target.style.transform = "scale(1)";
    //   e.target.style.boxShadow = "none";
    // }}
  >
    <i className="fas fa-times"></i>
  </button>
</div>
    </div>
    
    {/* Premium Crown */}
    {/* <div className="position-absolute top-0 end-0 m-3">
      <div className="bg-warning text-dark px-3 py-1 rounded-pill shadow">
        <i className="fas fa-crown me-1"></i>
        Premium Member
      </div>
    </div> */}
  </div>

  <div className="offcanvas-body p-0" style={{ 
    overflowY: "auto", 
    background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)"
  }}>
    {selectedUser && (
      <>
        {/* ========== COMPACT HEADER (NOT A CARD) ========== */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(197, 46, 121, 0.1)", 
          padding: "16px 24px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
        }}>
          <div className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              {/* Small Profile Image */}
              <img
                src={(() => {
                  let v = selectedUser.uprofile || "";
                  v = withBase(v);
                  if (/^https?:\/\//i.test(v)) return v;
                  v = v.replace(/^:?5000\//, "");
                  v = v.replace(/^\/?uploads\//, "");
                  if (!v.startsWith("photos/")) v = `photos/${v}`;
                  return asset(v);
                })()}
                alt={selectedUser.Uname}
                onClick={() => setZoomImage(true)}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "2px solid rgba(197, 46, 121, 0.3)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 4px 12px rgba(197, 46, 121, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                }}
              />
              
              {/* Inline Name + Metadata */}
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold" style={{ fontSize: "15px", color: "#18181b", letterSpacing: "-0.01em" }}>
                    {selectedUser.Uname}
                  </span>
                  <span style={{ fontSize: "13px", color: "#71717a" }}>
                    {calculateAge(selectedUser.DOB)} • {selectedUser.Gender}
                  </span>
                  <span style={{ fontSize: "11px", color: "#a1a1aa", fontFamily: "ui-monospace, monospace" }}>
                    #{selectedUser.UID}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Compact Action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike(selectedUser.UID);
              }}
              style={{
                background: likedUsers.includes(selectedUser.UID) 
                  ? "linear-gradient(135deg, #c52e79 0%, #a32561 100%)"
                  : "rgba(197, 46, 121, 0.1)",
                color: likedUsers.includes(selectedUser.UID) ? "white" : "#c52e79",
                border: `1px solid ${likedUsers.includes(selectedUser.UID) ? "transparent" : "rgba(197, 46, 121, 0.2)"}`,
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: likedUsers.includes(selectedUser.UID) ? "0 2px 8px rgba(197, 46, 121, 0.3)" : "none"
              }}
              onMouseEnter={(e) => {
                if (likedUsers.includes(selectedUser.UID)) {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 4px 12px rgba(197, 46, 121, 0.4)";
                } else {
                  e.target.style.background = "rgba(197, 46, 121, 0.15)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                if (likedUsers.includes(selectedUser.UID)) {
                  e.target.style.boxShadow = "0 2px 8px rgba(197, 46, 121, 0.3)";
                } else {
                  e.target.style.background = "rgba(197, 46, 121, 0.1)";
                }
              }}
            >
              <i className={`${likedUsers.includes(selectedUser.UID) ? 'fas' : 'far'} fa-heart me-1`}></i>
              {likedUsers.includes(selectedUser.UID) ? 'Liked' : 'Like'}
            </button>
          </div>
        </div>

        {/* ========== DASHBOARD GRID (4-2-1) ========== */}
        <div style={{ padding: "24px" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "12px"
          }}>
            
            {/* ========== WIDGET: Basic Overview ========== */}
            <div style={{ 
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(197, 46, 121, 0.15)",
              borderRadius: "12px", 
              padding: "18px 20px",
              minHeight: "140px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease",
              cursor: "default"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(197, 46, 121, 0.15)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.15)";
            }}>
              <div style={{ 
                fontSize: "11px", 
                fontWeight: 700, 
                color: "#c52e79", 
                textTransform: "uppercase", 
                letterSpacing: "1px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "3px",
                  height: "14px",
                  background: "linear-gradient(180deg, #c52e79 0%, #a32561 100%)",
                  borderRadius: "2px"
                }}></div>
                Basic Overview
              </div>
              <div style={{ fontSize: "13px", color: "#27272a", lineHeight: "1.7" }}>
                Born {formatDOBOnly(selectedUser.DOB) || "—"}{selectedUser.dob_time ? `, ${selectedUser.dob_time}` : ""}{selectedUser.birthplace ? ` • ${selectedUser.birthplace}` : ""}
              </div>
              <div style={{ fontSize: "13px", color: "#52525b", lineHeight: "1.7", marginTop: "8px" }}>
                {selectedUser.height || "—"} • {selectedUser.weight ? `${selectedUser.weight} kg` : "—"} • {selectedUser.bloodgroup || "—"}
              </div>
            </div>

            {/* ========== WIDGET: Work & Education ========== */}
            <div style={{ 
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(197, 46, 121, 0.15)",
              borderRadius: "12px", 
              padding: "18px 20px",
              minHeight: "140px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(197, 46, 121, 0.15)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.15)";
            }}>
              <div style={{ 
                fontSize: "11px", 
                fontWeight: 700, 
                color: "#c52e79", 
                textTransform: "uppercase", 
                letterSpacing: "1px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "3px",
                  height: "14px",
                  background: "linear-gradient(180deg, #c52e79 0%, #a32561 100%)",
                  borderRadius: "2px"
                }}></div>
                Professional
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#18181b", letterSpacing: "-0.01em" }}>
                {selectedUser.Education || "Not specified"}
              </div>
              <div style={{ fontSize: "13px", color: "#71717a", marginTop: "4px", lineHeight: "1.5" }}>
                {selectedUser.education_details || ""}
              </div>
              <div style={{ fontSize: "13px", color: "#27272a", marginTop: "10px", fontWeight: 500 }}>
                {selectedUser.income || "Income not specified"}
              </div>
              <div style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "4px" }}>
                {[selectedUser.District, selectedUser.State, selectedUser.Country].filter(Boolean).join(", ") || "Location not specified"}
              </div>
            </div>

            {/* ========== WIDGET: Religion & Caste ========== */}
            <div style={{ 
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(197, 46, 121, 0.15)",
              borderRadius: "12px", 
              padding: "18px 20px",
              minHeight: "140px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(197, 46, 121, 0.15)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.15)";
            }}>
              <div style={{ 
                fontSize: "11px", 
                fontWeight: 700, 
                color: "#c52e79", 
                textTransform: "uppercase", 
                letterSpacing: "1px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "3px",
                  height: "14px",
                  background: "linear-gradient(180deg, #c52e79 0%, #a32561 100%)",
                  borderRadius: "2px"
                }}></div>
                Caste & Astrology
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#18181b" }}>
                {[selectedUser.Cast, selectedUser.Subcast].filter(Boolean).join(" • ") || "Not specified"}
              </div>
              <div style={{ fontSize: "13px", color: "#52525b", marginTop: "8px" }}>
                {[selectedUser.Ras, selectedUser.Nakshtra].filter(Boolean).join(" • ") || "—"}
              </div>
              <div style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "6px" }}>
                Gotra {selectedUser.Gotra || "—"} • Nadi {selectedUser.Nadi || "—"}
              </div>
            </div>

            {/* ========== WIDGET: Family ========== */}
            <div style={{ 
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(197, 46, 121, 0.15)",
              borderRadius: "12px", 
              padding: "18px 20px",
              minHeight: "140px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(197, 46, 121, 0.15)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.15)";
            }}>
              <div style={{ 
                fontSize: "11px", 
                fontWeight: 700, 
                color: "#c52e79", 
                textTransform: "uppercase", 
                letterSpacing: "1px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "3px",
                  height: "14px",
                  background: "linear-gradient(180deg, #c52e79 0%, #a32561 100%)",
                  borderRadius: "2px"
                }}></div>
                Family Background
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <div style={{ fontSize: "13px", color: "#52525b" }}>
                  Father — {selectedUser.father_occupation || "Not specified"}
                </div>
                <div style={{ fontSize: "13px", color: "#52525b" }}>
                  Mother — {selectedUser.mother_occupation || "Not specified"}
                </div>
                {(selectedUser.Brother || selectedUser.brother_occupation) && (
                  <div style={{ fontSize: "13px", color: "#52525b" }}>
                    Brother — {selectedUser.brother_occupation || selectedUser.Brother || "—"}
                  </div>
                )}
                {selectedUser.Sister && (
                  <div style={{ fontSize: "13px", color: "#52525b" }}>
                    Sister — {selectedUser.Sister}
                  </div>
                )}
              </div>
            </div>

            {/* ========== WIDGET: Lifestyle ========== */}
            <div style={{ 
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(197, 46, 121, 0.15)",
              borderRadius: "12px", 
              padding: "18px 20px",
              minHeight: "140px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(197, 46, 121, 0.15)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.15)";
            }}>
              <div style={{ 
                fontSize: "11px", 
                fontWeight: 700, 
                color: "#c52e79", 
                textTransform: "uppercase", 
                letterSpacing: "1px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "3px",
                  height: "14px",
                  background: "linear-gradient(180deg, #c52e79 0%, #a32561 100%)",
                  borderRadius: "2px"
                }}></div>
                Lifestyle
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  selectedUser.Diet && { text: selectedUser.Diet, icon: "utensils" },
                  selectedUser.Drink && { text: selectedUser.Drink === "No" || selectedUser.Drink === "no" ? "Non-Drinker" : selectedUser.Drink, icon: "glass-water" },
                  selectedUser.Smoking && { text: selectedUser.Smoking === "No" || selectedUser.Smoking === "no" ? "Non-Smoker" : selectedUser.Smoking, icon: "smoking-ban" },
                  selectedUser.specs && { text: selectedUser.specs === "Yes" || selectedUser.specs === "yes" ? "Wears Glasses" : "No Glasses", icon: "glasses" }
                ].filter(Boolean).map((item, idx) => (
                  <div key={idx} style={{
                    background: "linear-gradient(135deg, rgba(197, 46, 121, 0.08) 0%, rgba(163, 37, 97, 0.08) 100%)",
                    border: "1px solid rgba(197, 46, 121, 0.2)",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "12px",
                    color: "#c52e79",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                    cursor: "default"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(197, 46, 121, 0.15) 0%, rgba(163, 37, 97, 0.15) 100%)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(197, 46, 121, 0.08) 0%, rgba(163, 37, 97, 0.08) 100%)";
                  }}>
                    <i className={`fas fa-${item.icon}`} style={{ fontSize: "10px" }}></i>
                    {item.text}
                  </div>
                ))}
              </div>
              {selectedUser.Dieses && selectedUser.Dieses !== "No" && selectedUser.Dieses !== "no" && (
                <div style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "12px" }}>
                  Health — {selectedUser.Dieses}
                </div>
              )}
            </div>

            {/* ========== WIDGET: Astro Details ========== */}
            <div style={{ 
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(197, 46, 121, 0.15)",
              borderRadius: "12px", 
              padding: "18px 20px",
              minHeight: "140px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(197, 46, 121, 0.15)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.15)";
            }}>
              <div style={{ 
                fontSize: "11px", 
                fontWeight: 700, 
                color: "#c52e79", 
                textTransform: "uppercase", 
                letterSpacing: "1px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "3px",
                  height: "14px",
                  background: "linear-gradient(180deg, #c52e79 0%, #a32561 100%)",
                  borderRadius: "2px"
                }}></div>
                Additional Details
              </div>
              <div style={{ fontSize: "13px", color: "#52525b", lineHeight: "1.7" }}>
                Gan {selectedUser.Gan || "—"} • Mangal {selectedUser.managal || "—"}
              </div>
              <div style={{ fontSize: "13px", color: "#52525b", lineHeight: "1.7", marginTop: "6px" }}>
                Charan {selectedUser.charan || "—"}
              </div>
            </div>

            {/* ========== WIDGET: Partner Expectations (FULL WIDTH) ========== */}
            <div style={{ 
              gridColumn: "1 / -1",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(197, 46, 121, 0.15)",
              borderRadius: "12px", 
              padding: "18px 20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(197, 46, 121, 0.15)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.15)";
            }}>
              <div style={{ 
                fontSize: "11px", 
                fontWeight: 700, 
                color: "#c52e79", 
                textTransform: "uppercase", 
                letterSpacing: "1px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "3px",
                  height: "14px",
                  background: "linear-gradient(180deg, #c52e79 0%, #a32561 100%)",
                  borderRadius: "2px"
                }}></div>
                Partner Preferences
              </div>
              <p style={{ fontSize: "13px", color: "#52525b", lineHeight: "1.8", margin: 0 }}>
                {selectedUser.Expectation || "No specific preferences mentioned."}
              </p>
            </div>

            {/* ========== WIDGET: Contact Information (FULL WIDTH) ========== */}
            <div style={{ 
              gridColumn: "1 / -1",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(197, 46, 121, 0.15)",
              borderRadius: "12px", 
              padding: "18px 20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(197, 46, 121, 0.15)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.15)";
            }}>
              <div style={{ 
                fontSize: "11px", 
                fontWeight: 700, 
                color: "#c52e79", 
                textTransform: "uppercase", 
                letterSpacing: "1px",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "3px",
                  height: "14px",
                  background: "linear-gradient(180deg, #c52e79 0%, #a32561 100%)",
                  borderRadius: "2px"
                }}></div>
                Contact Details
              </div>
              
              {!isUnlocked ? (
                <div style={{
                  background: "linear-gradient(135deg, rgba(197, 46, 121, 0.08) 0%, rgba(163, 37, 97, 0.08) 100%)",
                  border: "1px solid rgba(197, 46, 121, 0.2)",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "13px", color: "#52525b", marginBottom: "14px", lineHeight: "1.6", fontWeight: 500 }}>
                    स्थळाचा मोबाईल नंबर पाहण्यासाठी खालील बटन वर क्लिक करा
                  </div>
                  <button
                    onClick={() => handleViewContact(selectedUser.UID)}
                    disabled={loadingContactMap[selectedUser.UID]}
                    style={{
                      background: "linear-gradient(135deg, #c52e79 0%, #a32561 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px 28px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: loadingContactMap[selectedUser.UID] ? "not-allowed" : "pointer",
                      opacity: loadingContactMap[selectedUser.UID] ? 0.6 : 1,
                      boxShadow: "0 4px 12px rgba(197, 46, 121, 0.3)",
                      transition: "all 0.3s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      if (!loadingContactMap[selectedUser.UID]) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 16px rgba(197, 46, 121, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 12px rgba(197, 46, 121, 0.3)";
                    }}
                  >
                    <i className="fas fa-unlock" style={{ fontSize: "14px" }}></i>
                    {loadingContactMap[selectedUser.UID] ? "Unlocking..." : "View Contact Details"}
                  </button>
                </div>
              ) : (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
                  gap: "14px" 
                }}>
                  {[
                    { label: "Mobile", key: "Umobile", icon: "phone" },
                    { label: "WhatsApp", key: "whatsappno", icon: "whatsapp" },
                    { label: "Alt Mobile", key: "alt_mobile", icon: "mobile-alt" },
                    { label: "Address", key: "address", icon: "map-marker-alt" },
                    { label: "Property", key: "property_details", icon: "home" },
                    { label: "Other Details", key: "other_details", icon: "info-circle" }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      background: "linear-gradient(135deg, rgba(197, 46, 121, 0.05) 0%, rgba(163, 37, 97, 0.05) 100%)",
                      border: "1px solid rgba(197, 46, 121, 0.15)",
                      borderRadius: "10px",
                      padding: "14px 16px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(197, 46, 121, 0.15)";
                      e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "rgba(197, 46, 121, 0.15)";
                    }}>
                      <div style={{ 
                        fontSize: "10px", 
                        color: "#c52e79", 
                        marginBottom: "8px", 
                        textTransform: "uppercase", 
                        letterSpacing: "0.8px", 
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <i className={`fas fa-${item.icon}`} style={{ fontSize: "10px" }}></i>
                        {item.label}
                      </div>
                      <div style={{ 
                        fontSize: "13px", 
                        color: "#18181b", 
                        fontWeight: 600, 
                        wordBreak: "break-word", 
                        lineHeight: "1.5" 
                      }}>
                        {selectedUser[item.key] || <span style={{ color: "#a1a1aa", fontWeight: 400 }}>Not provided</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </>
    )}

    {/* ========== IMAGE ZOOM MODAL ========== */}
    {zoomImage && (
      <div
        onClick={() => {
          setZoomImage(false);
          setZoomLevel(1);
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
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.9)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          backdropFilter: "blur(4px)"
        }}
      >
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
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          ✕
        </div>

        <img
          src={(() => {
            let v = selectedUser.uprofile || "";
            v = withBase(v);
            if (/^https?:\/\//i.test(v)) return v;
            v = v.replace(/^:?5000\//, "");
            v = v.replace(/^\/?uploads\//, "");
            if (!v.startsWith("photos/")) v = `photos/${v}`;
            return asset(v);
          })()}
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
            transition: "transform 0.2s ease"
          }}
        />
      </div>
    )}
  </div>
</div>

      {/* Main User Cards Grid */}
      <div ref={mainContentRef} className="container-fluid px-3 px-md-4 py-4">
        <div className="row g-3 g-md-4">
          {visibleUsers.map((user) => (
            <div key={user.UID} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div
                onClick={() => openOffcanvas(user)}
                style={{
                  cursor: "pointer",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  height: "100%"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                }}
              >
                {/* Image Section */}
                <div style={{ position: "relative", overflow: "hidden", height: "280px" }}>
                  <img
                    src={(() => {
                      let v = user.uprofile || "";
                      v = withBase(v);
                      if (/^https?:\/\//i.test(v)) return v;
                      v = v.replace(/^:?5000\//, "");
                      v = v.replace(/^\/?uploads\//, "");
                      if (!v.startsWith("photos/")) v = `photos/${v}`;
                      return asset(v);
                    })()}
                    alt={user.Uname}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      const target = e.target;
                      target.style.display = "none";
                      const placeholder = target.nextElementSibling;
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />

                  {/* Placeholder */}
                  {!user.uprofile && (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #f0f0f0 0%, #e5e5e5 100%)"
                      }}
                    >
                      <i className="fas fa-user" style={{ fontSize: "64px", color: "#d0d0d0" }}></i>
                    </div>
                  )}

                  {/* Shortlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(user.UID);
                    }}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <i
                      className={`${likedUsers.includes(user.UID) ? 'fas' : 'far'} fa-heart`}
                      style={{
                        fontSize: "16px",
                        color: likedUsers.includes(user.UID) ? "#c52e79" : "#666"
                      }}
                    ></i>
                  </button>
                </div>

                {/* Content Section */}
                <div style={{ padding: "16px" }}>
                  <h6 className="mb-2 fw-bold" style={{ fontSize: "1rem", color: "#212529" }}>
                    {user.Uname}
                  </h6>
                  <div className="d-flex flex-column gap-1" style={{ fontSize: "0.875rem", color: "#6c757d" }}>
                    <div className="d-flex align-items-center gap-2">
                      <i className="fas fa-calendar-alt" style={{ fontSize: "12px", width: "16px" }}></i>
                      <span>{calculateAge(user.DOB)} years</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <i className="fas fa-ruler-vertical" style={{ fontSize: "12px", width: "16px" }}></i>
                      <span>{user.height || 'N/A'}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <i className="fas fa-graduation-cap" style={{ fontSize: "12px", width: "16px" }}></i>
                      <span className="text-truncate">{user.Education || 'N/A'}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <i className="fas fa-map-marker-alt" style={{ fontSize: "12px", width: "16px" }}></i>
                      <span className="text-truncate">{[user.District, user.State].filter(Boolean).join(", ") || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Indicator */}
        {loadingMore && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* No More Data */}
        {!hasMore && visibleUsers.length > 0 && (
          <div className="text-center py-4 text-muted">
            <p>No more profiles to load</p>
          </div>
        )}

        {/* No Data Message */}
        {showNoDataMessage && visibleUsers.length === 0 && !loading && (
          <div className="text-center py-5">
            <i className="fas fa-search" style={{ fontSize: "48px", color: "#d0d0d0", marginBottom: "16px" }}></i>
            <h5 className="text-muted">No profiles found</h5>
            <p className="text-muted">Try adjusting your filters</p>
          </div>
        )}

        {/* Observer Target */}
        <div ref={observerRef} style={{ height: "20px" }}></div>
      </div>

    </>
  );
};

export default Dashboard;
