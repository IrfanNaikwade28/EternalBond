import React, { useState } from "react";
import AddGotra from "./AddGotra";
import AddGan from "./AddGan";
import AddNadi from "./AddNadi";
import AddNakshtra from "./AddNakshtra";
import AddRashi from "./AddRashi";
import AddEducation from "./AddEducation";
import AddHeight from "./AddHeight";
import AddMarriageType from "./AddMarriageType";
import AddSubCast from "./AddSubCast";
import AddCountry from "./AddCountry";
import AddCast from "./AddCast";

const Master = () => {
  const [activeTab, setActiveTab] = useState("cast");

  return (

    <>
    
   <style>
{`
@media (max-width: 425px) {

  /* Whole card width adjust for mobile */
  .card.card-fluid.data {
    width: 450px !important;
   
    margin-left: auto;
    margin-right: auto;
  }

  /* nav container scrolling */
  .nav {
    overflow-x: auto !important;
    overflow-y: hidden !important;
    white-space: nowrap !important;
    flex-wrap: nowrap !important;
  }

  /* tabs bar width fixed so horizontal scroll works */
  .nav.nav-tabs {
    width: 400px !important;
    display: flex !important;
    flex-wrap: nowrap !important;
  }

  /* tab items */
  .nav.nav-tabs .nav-item {
    flex: 0 0 auto !important;
  }
}

@media (min-width: 426px) and (max-width: 768px) {

  /* Whole card width adjust for mobile */
  .card.card-fluid.data{
    width: 515px !important;
   
    margin-left: auto;
    margin-right: auto;
  }

  /* nav container scrolling */
  .nav {
    overflow-x: auto !important;
    overflow-y: hidden !important;
    white-space: nowrap !important;
    flex-wrap: nowrap !important;
  }

  /* tabs bar width fixed so horizontal scroll works */
  .nav.nav-tabs {
    width: 400px !important;
    display: flex !important;
    flex-wrap: nowrap !important;
  }

  /* tab items */
  .nav.nav-tabs .nav-item {
    flex: 0 0 auto !important;
  }
}
`}
</style>


  
    <div className="section-block">
        <h4>Master</h4>
      <div className="row">
        {/* Tabs Section Full Width */}
        <div className="col-12">
          <div className="card card-fluid data">
            <div className="card-header">

              <div
                className="d-block d-md-none"
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  whiteSpace: "nowrap",
                }}
              ></div>
              <ul className="nav nav-tabs card-header-tabs">
                 <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "cast" ? "active show" : ""}`}
                    onClick={() => setActiveTab("cast")}
                  >
                    Cast
                  </button>
                </li>
                <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "subCast" ? "active show" : ""}`}
                    onClick={() => setActiveTab("subCast")}
                  >
                    SubCast
                  </button>
                </li>
                <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "gotra" ? "active show" : ""}`}
                    onClick={() => setActiveTab("gotra")}
                  >
                    Gotra
                  </button>
                </li>
                <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "gan" ? "active show" : ""}`}
                    onClick={() => setActiveTab("gan")}
                  >
                    Gan
                  </button>
                </li>
                <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "nadi" ? "active show" : ""}`}
                    onClick={() => setActiveTab("nadi")}
                  >
                   Nadi
                  </button>
                </li>
                <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "nakshtra" ? "active show" : ""}`}
                    onClick={() => setActiveTab("nakshtra")}
                  >
                   Nakshtra
                  </button>
                </li>
                <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "rashi" ? "active show" : ""}`}
                    onClick={() => setActiveTab("rashi")}
                  >
                   Rashi
                  </button>
                </li>
                 <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "education" ? "active show" : ""}`}
                    onClick={() => setActiveTab("education")}
                  >
                   Education
                  </button>
                </li>
                <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "height" ? "active show" : ""}`}
                    onClick={() => setActiveTab("height")}
                  >
                   Height
                  </button>
                </li>
                <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "marraigeType" ? "active show" : ""}`}
                    onClick={() => setActiveTab("marraigeType")}
                  >
                   Marrige Type
                  </button>
                </li>
                
                <li className="nav-item">
                  <button style={{width:"120px"}}
                    className={`nav-link ${activeTab === "country" ? "active show" : ""}`}
                    onClick={() => setActiveTab("country")}
                  >
                    Country
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body">
              <div className="tab-content">
                {activeTab === "cast" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddCast/>
                    </div>
                  </div>
                )}
                {activeTab === "gotra" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddGotra />
                    </div>
                  </div>
                )}
                {activeTab === "gan" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddGan />
                    </div>
                  </div>
                )}
                {activeTab === "nadi" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddNadi/>
                    </div>
                  </div>
                )}
                {activeTab === "nakshtra" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddNakshtra/>
                    </div>
                  </div>
                )}
                {activeTab === "rashi" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddRashi/>
                    </div>
                  </div>
                )}
                {activeTab === "education" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddEducation/>
                    </div>
                  </div>
                )}
                {activeTab === "height" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddHeight/>
                    </div>
                  </div>
                )}
                {activeTab === "marraigeType" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddMarriageType/>
                    </div>
                  </div>
                )}
                {activeTab === "subCast" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddSubCast/>
                    </div>
                  </div>
                )}
                {activeTab === "country" && (
                  <div className="row">
                    <div className="col-md-9">
                      <AddCountry/>
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

export default Master;
