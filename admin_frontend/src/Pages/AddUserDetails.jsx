import React, { useState } from "react";
import { useUser } from "../context/UserContext";

import UserBasicInfo from "./UserBasicInfo";
import UserDetailInfo from "./UserDetailInfo";
import AddFamilyInfo from "./AddFamilyInfo";
import EducationWorkInfo from "./EducationWorkInfo";
import HealthInfo from "./HealthInfo";
import RashiInfo from "./RashiInfo";

const AddUserDetails = () => {
  const [activeTab, setActiveTab] = useState("basicInfo");

  const {
    userId,
    upass,
    ctid,
    fatherName,
    motherName,
    EDID,
    CNID,
    DSID,
    INID,
    Diet,
    Drink,
    Smoking,
  } = useUser();

  // ✅ Handle tab switch
  const handleTabClick = (tab) => {
    if (tab === "basicInfo" && userId) return setActiveTab(tab);
    if (tab === "userDetailInfo" && userId && upass) return setActiveTab(tab);
    if (tab === "addFamily" && userId && ctid) return setActiveTab(tab);
    if (tab === "educationWorkInfo" && userId && ctid && fatherName && motherName)
      return setActiveTab(tab);
    if (tab === "healthInfo" && userId && ctid && fatherName && motherName && EDID && CNID && DSID && INID)
      return setActiveTab(tab);

    // ✅ Rashi tab: requires health info filled
    if (
      tab === "rashiInfo" &&
      userId &&
      ctid &&
      fatherName &&
      motherName &&
      EDID &&
      CNID &&
      DSID &&
      INID &&
      Diet &&
      Drink &&
      Smoking
    ) {
      return setActiveTab(tab);
    }

    alert("⚠️ Please complete all previous sections (including Health Info) first!");
  };

  // ✅ Disable logic for all tabs
  const isDisabled = (tab) => {
    if (tab === "basicInfo") return !userId //false
    if (tab === "userDetailInfo") return !userId || !upass  ;
    if (tab === "addFamily") return !userId || !ctid;
    if (tab === "educationWorkInfo")
      return !userId || !ctid || !fatherName || !motherName;
    if (tab === "healthInfo")
      return (
        !userId || !ctid || !fatherName || !motherName || !EDID || !CNID || !DSID || !INID
      );
    if (tab === "rashiInfo")
      return (
        !userId ||
        !ctid ||
        !fatherName ||
        !motherName ||
        !EDID ||
        !CNID ||
        !DSID ||
        !INID ||
        !Diet ||
        !Drink ||
        !Smoking
      );
    return false;
  };

  return (
    <>
      <div className="section-block">
        <h4>Add User Details</h4>
        <div className="row">
          <div className="col-md-12">
            <div className="card card-fluid">
              <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                  {[
                    { key: "basicInfo", label: "Basic Info" },
                    { key: "userDetailInfo", label: "User Detail Info" },
                    { key: "addFamily", label: "Family Info" },
                    { key: "educationWorkInfo", label: "Education & Work Info" },
                    { key: "healthInfo", label: "Health Info" },
                    { key: "rashiInfo", label: "Rashi Info" },
                  ].map((tab) => (
                    <li key={tab.key} className="nav-item">
                      <button
                        style={{ width: "220px" }}
                        className={`nav-link ${activeTab === tab.key ? "active show" : ""}`}
                        onClick={() => handleTabClick(tab.key)}
                        disabled={isDisabled(tab.key)}
                      >
                        {tab.label}
                        {isDisabled(tab.key) && (
                          <span
                            style={{
                              fontSize: "10px",
                              marginLeft: "5px",
                              color: "red",
                            }}
                          >
                            (Locked)
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>


              <div className="card-body">
                <div className="tab-content">
                  {activeTab === "basicInfo" && (
                    <div className="row">
                      <div className="col-md-12">
                        <UserBasicInfo onNextTab={() => setActiveTab("userDetailInfo")} />
                      </div>
                    </div>
                  )}
                  {activeTab === "userDetailInfo" && (
                    <div className="row">
                      <div className="col-md-12">
                        <UserDetailInfo onNextTab={() => setActiveTab("addFamily")} />
                      </div>
                    </div>
                  )}
                  {activeTab === "addFamily" && (
                    <div className="row">
                      <div className="col-md-12">
                        <AddFamilyInfo onNextTab={() => setActiveTab("educationWorkInfo")} />
                      </div>
                    </div>
                  )
                  }
                  {activeTab === "educationWorkInfo" && (
                    <div className="row">
                      <div className="col-md-12">
                        <EducationWorkInfo onNextTab={() => setActiveTab("healthInfo")} />
                      </div>
                    </div>
                  )
                  }
                  {activeTab === "healthInfo" && (
                    <div className="row">
                      <div className="col-md-12">
                        <HealthInfo onNextTab={() => setActiveTab("healrashiInfothInfo")} />
                      </div>
                    </div>
                  )
                  }
                  {activeTab === "rashiInfo" && (
                    <div className="row">
                      <div className="col-md-12">

                        <RashiInfo />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUserDetails;
