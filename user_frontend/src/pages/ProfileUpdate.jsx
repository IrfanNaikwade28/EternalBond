import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import UserBasicInfo from "./UserBasicInfo";
import UserDetailInfo from "./UserDetailInfo";
import AddFamilyInfo from "./AddFamilyInfo";
import EducationWorkInfo from "./EducationWorkInfo";
import HealthInfo from "./HealthInfo";
import RashiInfo from "./RashiInfo";

const ProfileUpdate = () => {
 return (
  <>
   {/* Alternative: Clean Purple Theme */}
<div className="card border-0 shadow rounded-3">
  <div className="card-header bg-white border-0 pb-0">
    <div className="text-center mb-4 mt-2">
      <h3 className="fw-bold text-dark mb-2"></h3>
      <p className="text-muted">Update your information section by section</p>
    </div>
    
    <Tabs defaultActiveKey="basic" className="purple-tabs">
      {[
        { key: "basic", icon: "user", label: "Basic", component: <UserBasicInfo/> },
        { key: "user", icon: "id-card", label: "Details", component: <UserDetailInfo/> },
        { key: "family", icon: "users", label: "Family", component: <AddFamilyInfo/> },
        { key: "education", icon: "graduation-cap", label: "Education", component: <EducationWorkInfo/> },
        { key: "health", icon: "heartbeat", label: "Health", component: <HealthInfo/> },
        { key: "rashi", icon: "star", label: "Rashi", component: <RashiInfo/> }
      ].map(tab => (
        <Tab 
          key={tab.key}
          eventKey={tab.key}
          title={
            <div className="d-flex align-items-center">
              <i className={`fas fa-${tab.icon} me-2`}></i>
              {tab.label}
            </div>
          }
        >
          <div className="p-1">
            {tab.component}
          </div>
        </Tab>
      ))}
    </Tabs>
  </div>
</div>

<style>{`
  .purple-tabs .nav-tabs {
    border-bottom: 2px solid #e9ecef;
  }
  
  .purple-tabs .nav-link {
    border: none;
    color: #6c757d;
    font-weight: 500;
    padding: 1rem 1.5rem;
    border-radius: 0;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .purple-tabs .nav-link:hover {
    color: #c52e79ff;
    background: rgba(118, 75, 162, 0.05);
  }
  
  .purple-tabs .nav-link.active {
    color: #c52e79ff;
    background: transparent;
    font-weight: 600;
  }
  
  .purple-tabs .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background: #c52e79ff;
    border-radius: 2px;
  }
`}</style>
  </>
);
};

export default ProfileUpdate;
