import React, { useEffect, useState } from "react";
import axios from "axios";
import { userApi } from "../lib/api";

const Profile = () => {
  const [loginUser, setLoginUser] = useState(null);
  //const [loginName, setLoginName] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("whole object",parsedUser.Uname)
     //setLoginUser(parsedUser);
      //setLoginName(parsedUser.Uname)
      console.log("login user",parsedUser.Uname)
      console.log(parsedUser.UID)
      fetchUserProfile(parsedUser.UID);
    }
  }, []);

  const fetchUserProfile = async (UID) => {
    try {
      const res = await userApi.get(`/api/profile?UID=${UID}`);
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <>
  <style>{`
  @media (max-width: 768px) {
    .profile-photo-box {
      position: static !important;
      height: auto !important;
    }
    .right-scroll {
      max-height: none !important;
      overflow-y: visible !important;
    }
    .main-content {
      height: auto !important;
      overflow-y: auto !important;
    }
    .page-content {
      overflow-y: auto !important;
    }
  }

  /* Tablet Fix */
  @media (min-width: 768px) and (max-width: 1024px) {
    .profile-photo-box {
      height: 500px !important;
      width: 100% !important;
      position: static !important;
    }

    .profile-photo-box img {
      height: 100% !important;
      width: 100% !important;
      object-fit: cover !important;
    }
  }
`}</style>

    <div
      className="main-content d-flex flex-column"
      style={{
        height: "100vh",
        backgroundColor: "#f8f9fa",
        overflow: "hidden",
      }}
    >
      {/* Scrollable Page Content */}
      <div
        className="page-content flex-grow-1 d-flex flex-wrap"
        style={{
          marginTop: "80px",
          padding: "15px",
          gap: "15px",
          //overflowY: "auto", // FULL PAGE SCROLL
        }}
      >
        {/* Left Side – Profile Photo */}
        <div className="col-12 col-md-3 d-flex justify-content-center">
          <div
            className="card shadow-sm w-100 profile-photo-box"
            style={{
              height: "600px",
              width:"600px",
             // maxHeight: "600px",
              position:"sticky",
             
            }}
          >
            <img
              src={userData.uprofile}
              alt={userData.Uname}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
          </div>
        </div>

        {/* Right Side – Scrollable Cards */}
        <div
          className="col-12 col-md-8 right-scroll"
          style={{

            maxHeight: "calc(100vh - 100px)",   // page height - header
            overflowY: "auto",                  // scroll ONLY in right side
            paddingRight: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {/* Basic Info */}
          <div className="card shadow-sm">
              
            <div className="card-header text-white" style={{ backgroundColor: "#c52e79ff" }}>
              <h5 className="mb-0"> {userData.Uname} - ID: {userData.UID} </h5>
            </div>
            <div className="card-body">
              <p><strong>Age/Height:</strong> {userData.age} yrs | {userData.height}</p>
              <p><strong>Education:</strong> {userData.education_details}</p>
              <p><strong>Subcast:</strong> {userData.Subcast}</p>
              <p><strong>Income:</strong> {userData.income || "NA"}</p>
            </div>
          </div>

          {/* Personal Details */}
          <div className="card shadow-sm">
            <div className="card-header text-white" style={{ backgroundColor: "#c52e79ff" }}>
              Personal Details
            </div>
            <div className="card-body">
              <p><strong>Birth Date:</strong> {userData.DOB?.split("T")[0] || "-"}</p>
              <p><strong>Birth Time:</strong> {userData.dob_time || "-"}</p>
              <p><strong>Birth Place:</strong> {userData.birthplace || "-"}</p>
              <p><strong>Weight:</strong> {userData.weight || "-"}</p>
              <p><strong>Marriage Type:</strong> {userData.marriage_type || "-"}</p>
              <p><strong>Blood Group:</strong> {userData.bloodgroup || "-"}</p>
            </div>
          </div>

          {/* Education Details */}
          <div className="card shadow-sm">
            <div className="card-header text-white" style={{ backgroundColor: "#c52e79ff" }}>
              Education Details
            </div>
            <div className="card-body">
              <p><strong>Education:</strong> {userData.Education || "-"}</p>
              <p><strong>Details:</strong> {userData.education_details || "-"}</p>
              <p><strong>Country:</strong> {userData.Country || "-"}</p>
              <p><strong>State:</strong> {userData.State || "-"}</p>
              <p><strong>District:</strong> {userData.District || "-"}</p>
              <p><strong>Fix Income:</strong> {userData.fincome || "-"}</p>
            </div>
          </div>

          {/* Family Details */}
          <div className="card shadow-sm">
            <div className="card-header text-white" style={{ backgroundColor: "#c52e79ff" }}>
              Family Details
            </div>
            <div className="card-body">
              <p><strong>Father:</strong> {userData.Father || "-"}</p>
              <p><strong>Mother:</strong> {userData.Mother || "-"}</p>
              <p><strong>Brother:</strong> {userData.Brother || "-"}</p>
              <p><strong>Sister:</strong> {userData.Sister || "-"}</p>
            </div>
          </div>

          {/* Other Details */}
          <div className="card shadow-sm">
            <div className="card-header text-white" style={{ backgroundColor: "#c52e79ff" }}>
              Other Details
            </div>
            <div className="card-body">
              <p><strong>Ras:</strong> {userData.Ras || "-"}</p>
              <p><strong>Gotra:</strong> {userData.Gotra || "-"}</p>
              <p><strong>Nakshtra:</strong> {userData.Nakshtra || "-"}</p>
              <p><strong>Nadi:</strong> {userData.Nadi || "-"}</p>
              <p><strong>Gan:</strong> {userData.Gan || "-"}</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="card shadow-sm mb-5">
            <div className="card-header text-white" style={{ backgroundColor: "#c52e79ff" }}>
              Contact Details
            </div>
            <div className="card-body">
              <p><strong>Mobile:</strong> {userData.Umobile}</p>
              <p><strong>Whatsapp:</strong> {userData.whatsappno || "-"}</p>
              <p><strong>Address:</strong> {userData.address || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
