import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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
  const [contactInfo, setContactInfo] = useState(null);
  const [viewError, setViewError] = useState(""); // for plan expired message
  const [loadingContact, setLoadingContact] = useState(false);
  // Refs
  const mainContentRef = useRef(null);
  const offcanvasRef = useRef(null);
  const bsRef = useRef(null); 
 






const { filteredUsers, originalUsers, setOriginalUsers, clearFilter,showFilterModal ,showNoDataMessage } = useFilterModal();
const [likedUsers, setLikedUsers] = useState([]);
const [likedUIDs, setLikedUIDs] = useState([]);
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
      const res = await axios.get(
        `http://localhost:5001/api/incrementViewCount?loginUserUID=${loginUID}`
      );

      if (res.data.success) {
        setUnlockedProfiles(res.data.unlocked);
        setPlanExpired(false); // plan is fine
      } else if (res.data.message.includes("expired")) {
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
    const response = await axios.post(
      "http://localhost:5001/api/incrementViewCount",
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
  axios.get(`http://localhost:5001/api/likes?PRID=${loginUID}`)
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

  const response = await fetch("http://localhost:5001/api/toggle-like", {
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
        const response = await axios.get(`http://localhost:5001/api/usersInfo?gender=${user.Gender}`);
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
    if (observerRef.current) observerRef.current.disconnect();

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

    return () => observer.disconnect();
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
      @media (min-width: 1024px) and (max-width: 1199.98px) {
        .col-lg-3.custom-3cards {
          flex: 0 0 calc(33.333% - 1rem); /* 3 cards per row */
          max-width: calc(33.333% - 1rem);
        }
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

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
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

/* Responsive */
@media (max-width: 576px) {
  .premium-match-card {
    width: 100% !important;
    max-width: 260px;
    margin: 0 auto;
  }
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

          <div className="row g-3 mt-4">
            {visibleUsers.map((u) => (
              <div
                key={u.UID}
                className="col-12 col-sm-6 col-md-6 col-lg-3 custom-3cards   d-flex"
              >




<div className="card premium-match-card shadow-lg rounded-4 overflow-hidden border-0" style={{
  width: '400px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid #667eea'
}}>
  {/* Photo Section - Same Size & Functionality */}
  <div className="card-image-container position-relative" style={{ 
    height: "400px",
    padding: "12px",
    background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)'
  }}>
    {u.uprofile ? (
      <img
        src={u.uprofile}
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
    
    {/* Enhanced Dummy Image Container  */}
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


    
    {/* Enhanced Profile Badge */}
    <div className="profile-badge position-absolute top-3 start-3 bg-dark bg-opacity-75 text-white px-2 py-1 rounded-pill d-flex align-items-center shadow-sm">
      <i className="fas fa-id-card me-1 "></i>
      <span className="badge-text small fw-bold">{"Profile Id "+u.UID || 'N/A'}</span>
    </div>
    
    {/* Enhanced Premium Ribbon 
    <div className="premium-ribbon position-absolute top-3 end-3 bg-warning text-dark px-2 py-1 rounded-pill d-flex align-items-center shadow-sm">
      <i className="fas fa-crown me-1 fa-xs"></i>
      <span className="small fw-bold">Premium</span>
    </div>
    */}
    {/* Enhanced Image Overlay */}
    <div className="image-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
         style={{
           opacity: 0,
           transition: 'opacity 0.3s ease',
           background: 'rgba(102, 126, 234, 0.1)',
           margin: '12px'
         }}>
      <div className="overlay-content bg-white rounded-circle p-2 shadow">
        <i className="fas fa-expand-alt overlay-icon text-dark fa-sm"></i>
      </div>
    </div>
  </div>
  
  {/* Card Body - Adjusted height to fit all content */}
  <div className="card-body p-3 d-flex flex-column" style={{
    height: '260px', // Increased by 20px to fit birth details
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
    <div className="quick-action ms-2">
  <button
    className={`btn-heart btn btn-sm rounded-circle p-1 
        ${likedUsers.includes(u.UID) ? "btn-danger" : "btn-outline-danger"}`}
    style={{ width: "32px", height: "32px" }}
    onClick={(e) => {
      e.stopPropagation();
      handleLike(u.UID);
    }}
  >
    <i
      className={
        likedUsers.includes(u.UID)
          ? "fas fa-heart  fa-l text-danger"   // 🔴 filled red
          : "far fa-heart fa-l"   // 🤍 outline
      }
    ></i>
  </button>
</div>


    </div>

    {/* Compact Stats Grid - Changed to horizontal layout to save space */}
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
        <div className="stat-icon-wrapper fs-5 bg-success rounded-circle d-flex align-items-center justify-content-center"
             style={{width: '28px', height: '28px', minWidth: '28px'}}>
          <i className="fas fa-graduation-cap text-white fa-xs"></i>
        </div>
        <div className="stat-content flex-grow-1">
          <div className="stat-value small fw-bold text-dark text-truncate">{u.education_details || 'N/A'}</div>
          <div className="stat-label x-small text-muted" style={{fontSize: '0.65rem'}}>EDUCATION</div>
        </div>
      </div>
    </div>

    {/* Compact Details Section - Adjusted spacing */}
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
     // background: 'linear-gradient(135deg, #6d748fff 0%, #764ba2 100%)'
     backgroundColor:"#c52e79ff"
    }}
    data-bs-toggle="offcanvas"
    data-bs-target="#userOffcanvas"
    onClick={() => openOffcanvas(u)}
  >
    <div className="action-buttons d-flex">
      <button  className="btn-action  btn-sm py-2 rounded-2 flex-grow-1 d-flex align-items-center justify-content-center fw-bold border-0"
              style={{
                transition: 'all 0.3s ease', 
                color: '#c52e79ff',
                fontSize: '0.85rem',
                
              }}>
        <i className="fas fa-eye me-2"></i>
        View Profile
      </button>
    </div>
  </div>
</div>

<style jsx>{`
  .premium-match-card {
    transition: all 0.3s ease;
  }
  
  .premium-match-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15) !important;
  }
  
  .card-image-container:hover .image-overlay {
    opacity: 1 !important;
  }
  
  .btn-heart:hover {
    transform: scale(1.1);
    background-color: #dc3545 !important;
    color: white !important;
  }
  
  .btn-action:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
  }
  
  .stat-item, .detail-item {
    transition: all 0.2s ease;
  }
  
  .stat-item:hover, .detail-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
`}</style>




                {/* <div className="card flex-fill shadow-sm  rounded-3" style={{ border: "1px solid #8b5cf6" }}>
                  <img
                    src={u.uprofile}
                    alt={u.Uname}
                    className="card-img-top rounded-top"
                    style={{
                      height: "400px",
                      objectFit: "cover",
                      padding: "10px"
                    }}
                  />
                  <div className="card-body p-3 p-sm-2 p-md-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0 fs-6 fs-md-5">{u.Uname}</h5>
                      <h6 className="text-muted mb-0 fs-6 fs-md-5">ID: {u.UID}</h6>
                    </div>

                    <ul className="list-unstyled fs-6 fs-md-5 mb-3 d-flex justify-content-between">
                      <li>
                        <strong>{u.age} yrs | {u.height}</strong>
                      </li>
                      <li>
                        <strong>{u.education_details}</strong>
                      </li>
                    </ul>

                    <ul className="list-unstyled  mb-3 d-flex justify-content-between flex-wrap fs-6 fs-md-">
                      <li>
                         <strong> {formatDOBWithTime(u.DOB, u.dob_time)}
</strong>

                      </li>
                      <li>
                        <strong>{u.Subcast}</strong>
                      </li>
                    </ul>
                    <ul className="list-unstyled fs-6 fs-md-5 mb-3 d-flex justify-content-between">
                      <li>
                        <strong>{u.income}</strong>

                      </li>
                      <li>
                        <strong>{u.Gender}</strong>
                      </li>
                    </ul>
                  </div>


                 
                  <div style={{ background: "linear-gradient(135deg, #d63384 0%, #8b5cf6 100%)", height: "60px", cursor: "pointer" }}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#userOffcanvas"
                    onClick={() => openOffcanvas(u)}>
                    <h6 className="d-flex align-items-center p-3" style={{ color: "white" }}>
                      <i className="fa-solid fa-eye p-1" style={{ color: "white" }}></i>
                       <i className="fa-solid fa-heart p-1" style={{ color: "white" }}></i> 
                      View Profile
                    </h6>
                  </div>
                </div> */}





                
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

          {/* All Loaded Message */}
          {!hasMore && (
            <p className="text-center text-muted mt-3">
              ✅ All users loaded.
            </p>
          )}
          {/* Offcanvas */}


         <div
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
    //background: "linear-gradient( #764ba2 , #667eea 100%)",
    backgroundColor:"#c52e79ff",
    //borderBottom: "3px solid #b8860b",
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
              {/* <span className="badge bg-success bg-opacity-90 px-2 py-1">
                <i className="fas fa-shield-alt me-1"></i>
                Verified Profile
              </span> */}
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
      //backgroundColor: "rgba(255,255,255,0.15)",
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
                      src={selectedUser.uprofile}
                      alt={selectedUser.Uname}
                      className="w-100 "
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
                    
                    {/* Online Status 
                    <div className="position-absolute top-0 start-0 m-3">
                      <div className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: "35px", height: "35px" }}
                           title="Online Now">
                        <i className="fas fa-circle text-white fs-6"></i>
                      </div>
                    </div>*/}
                  </div>
                  
                 
                </div>
              </div>

              {/* Quick Actions 
              <div className="card border-0 shadow-sm rounded-3 mb-4">
                <div className="card-header bg-white border-bottom">
                  <h6 className="mb-0 text-primary">
                    <i className="fas fa-bolt me-2"></i>
                    Quick Actions
                  </h6>
                </div>
                <div className="card-body p-3">
                  <div className="d-grid gap-2">
                    <button className="btn btn-danger btn-lg rounded-pill">
                      <i className="fas fa-heart me-2"></i>
                      Express Interest
                    </button>
                     <button className="btn btn-outline-primary btn-lg rounded-pill">
                      <i className="fas fa-star me-2"></i>
                      Shortlist Profile
                    </button>
                    <button className="btn btn-outline-success btn-lg rounded-pill">
                      <i className="fas fa-comment me-2"></i>
                      Send Message
                    </button> 
                  </div>
                </div>
              </div>*/}

              {/* Profile Completeness */}
              {/* <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-white border-bottom">
                  <h6 className="mb-0 text-primary">
                    <i className="fas fa-chart-line me-2"></i>
                    Profile Score
                  </h6>
                </div>
                <div className="card-body text-center">
                  <div className="progress-score mb-3">
                    <div className="position-relative d-inline-block">
                      <div className="circular-progress" 
                           style={{ 
                             background: `conic-gradient(#28a745 ${85 * 3.6}deg, #e9ecef 0deg)` 
                           }}>
                        <div className="progress-inner">
                          <span className="score">85%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted small mb-0">Profile completeness & matching score</p>
                </div>
              </div> */}
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
                            <small className="fw-bold  text-dark">{item.label}</small>
                          </div>
                          <div className="fw-bold  text-muted ">{item.value}</div>
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
                          <span className=" fw-bold text-dark">{item.label}:</span>
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
                      // { icon: "money-bill-wave", label: "Annual Income", value: selectedUser.income },
                      { icon: "chart-line", label: "Fixed Income", value: selectedUser.fincome },
                      { icon: "globe-americas", label: "Work Country", value: selectedUser.Country },
                      { icon: "map", label: "Work State", value: selectedUser.State },
                      { icon: "location-arrow", label: "Work District", value: selectedUser.District }
                    ].map((item, index) => (
                      <div key={index} className="col-12 col-sm-6">
                        <div className="d-flex align-items-start mb-3">
                          <i className={`fas fa-${item.icon} text-primary mt-1 me-3`}></i>
                          <div className="flex-grow-1">
                            <div className="text-dark fw-bold ">{item.label}</div>
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
                          <div className=" fw-bold  small">{member.occupation || "NA"}</div>
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
                  
                  
                  {/* Contact Access */}



  <div className="card-body">
    {/* Contact Details */}
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
          <i style={{color:"#c52e79ff"}} className="fas fa-lock fs-2  mb-2"></i>
          <h6 className="text-dark fw-bold">Contact Details Locked</h6>
          <p className="text-muted small">
            स्थळाचा मोबाईल नंबर पाहण्यासाठी खालील बटन वर क्लिक करा
          </p>
        </div>

        <button
          className="btn  btn-lg rounded-pill shadow px-4 fw-bold"
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
      </div>
    )}

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
                      src={selectedUser.uprofile}
                      alt="Zoom"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        //maxWidth: "90vw",
                        //maxHeight: "85vh",
                        width: "90vw",     // mobile वर full width
                        maxWidth: "400px", // desktop वर fixed
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



        {/* {showFilterModal && (
        <FilterModal
  showFilterModal={showFilterModal}
  closeFilterModal={closeFilterModal}
  onApplyFilter={handleApplyFilter}
/>
      )} */}
       {/* Filter Modal */}
     
      </div>
       {/* {showFilterModal && <FilterModal />} */}
       {/* {showFilterModal && (
  <FilterModal
    onApplyFilter={handleApplyFilter}
    closeFilterModal={closeFilterModal}
  />
)} */}
    </div>
    </>
  );
};

export default Dashboard;
