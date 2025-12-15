import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFilterModal } from "../context/FilterModalContext";

const FilterModal = () => {
  //const { showFilterModal, closeFilterModal, onApplyFilter } = useFilterModal(); // context
const { showFilterModal, closeFilterModal, onApplyFilter } = useFilterModal();
//const { closeFilterModal, onApplyFilter } = useFilterModal();
  const [incomeList, setIncomeList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [heightList, setHeightList] = useState([]);
  const [casteList, setCasteList] = useState([]);
  const [subcastList, setSubcastList] = useState([]);
  const [marriageList, setMarriageList] = useState([]);
  const [countryList, setCountryList] = useState([]);
const [applyingFilter, setApplyingFilter] = useState(false);
  const [filterValues, setFilterValues] = useState({
    fromYear: "",
    toYear: "",
    EDID: "",
    CTID: "",
    SCTID: "",
    height: "",
    INID: "",
    CNID: "",
    marriage_type: ""
  });

  useEffect(() => {
    if (!showFilterModal) return;
// Reset all filter values when modal opens
  setFilterValues({
    fromYear: "",
    toYear: "",
    EDID: "",
    CTID: "",
    SCTID: "",
    height: "",
    INID: "",
    CNID: "",
    marriage_type: ""
  });
    const fetchData = async () => {
      const baseURL = "http://localhost:5001/api/filter";
      try {
        const results = await Promise.allSettled([
          axios.get(`${baseURL}/income`),
          axios.get(`${baseURL}/education`),
          axios.get(`${baseURL}/height`),
          axios.get(`${baseURL}/caste`),
          axios.get(`${baseURL}/subcast`),
          axios.get(`${baseURL}/marriage`),
          axios.get(`${baseURL}/country`)
        ]);

        setIncomeList(results[0].status === "fulfilled" ? results[0].value.data : []);
        setEducationList(results[1].status === "fulfilled" ? results[1].value.data : []);
        setHeightList(results[2].status === "fulfilled" ? results[2].value.data : []);
        setCasteList(results[3].status === "fulfilled" ? results[3].value.data : []);
        setSubcastList(results[4].status === "fulfilled" ? results[4].value.data : []);
        setMarriageList(results[5].status === "fulfilled" ? results[5].value.data : []);
        setCountryList(results[6].status === "fulfilled" ? results[6].value.data : []);
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };

    fetchData();
  }, [showFilterModal]);

  if (!showFilterModal) return null;

  // Function to render options
const renderOptions = (list, keyField, valueField, useTextAsValue = false) =>
  list.map(item => (
    <option
      key={item[keyField]}
      value={useTextAsValue ? item[valueField] : item[keyField]}
    >
      {String(item[valueField]).trim()}
    </option>
  ));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterValues(prev => ({ ...prev, [name]: value }));
  };

  // const handleApply = () => {
  //   //alert("hi")
  //   if (onApplyFilter) onApplyFilter(filterValues);
  //   closeFilterModal(); // close via context
  // };
const handleApply = async (e) => {
  e.preventDefault();
  setApplyingFilter(true); // start loading

  if (onApplyFilter) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
    onApplyFilter(filterValues);
  }

  setApplyingFilter(false); // end loading
  closeFilterModal();
};

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        overflowY: "auto",
        padding: "20px",
      }}
      onClick={closeFilterModal}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "1000px",
          position: "relative",
          minWidth: "250px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            fontSize: "24px",
            cursor: "pointer",
            color: "#346cb0",
          }}
          onClick={closeFilterModal}
        >
          &times;
        </span>

        <h3 style={{ textAlign: "center", color: "#c52e79ff", marginBottom: "25px" }}>Filter</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px 20px" }}>
          {/* All select fields */}
          {/* From Year */}
          <div>
            <label>From Birth Year</label>
            <select name="fromYear" className="form-select" value={filterValues.fromYear} onChange={handleChange}>
              <option value="">Select Year</option>
              {Array.from({ length: 100 }, (_, i) => (<option key={i} value={2025 - i}>{2025 - i}</option>))}
            </select>
          </div>
          {/* To Year */}
          <div>
            <label>To Birth Year</label>
            <select name="toYear" className="form-select" value={filterValues.toYear} onChange={handleChange}>
              <option value="">Select Year</option>
              {Array.from({ length: 100 }, (_, i) => (<option key={i} value={2025 - i}>{2025 - i}</option>))}
            </select>
          </div>

          {/* Income */}
          <div>
            <label>Income</label>
            <select name="INID" className="form-select" value={filterValues.INID} onChange={handleChange}>
              <option value="">Select Income</option>
              {renderOptions(incomeList, "INID", "Income")}
            </select>
          </div>

          {/* Education */}
          <div>
            <label>Education</label>
            <select name="EDID" className="form-select" value={filterValues.EDID} onChange={handleChange}>
              <option value="">Select Education</option>
              {renderOptions(educationList, "EDID", "Education")}
            </select>
          </div>

          <div>
  <label>Height</label>
  <select
    name="height"
    className="form-select"
    value={filterValues.height}
    onChange={handleChange}
  >
    <option value="">Select Height</option>
    {renderOptions(heightList, "HID", "height_between", true)} {/* text as value */}
  </select>
</div>


          {/* Caste */}
          <div>
            <label>Caste</label>
            <select name="CTID" className="form-select" value={filterValues.CTID} onChange={handleChange}>
              <option value="">Select Caste</option>
              {renderOptions(casteList, "CTID", "Cast")}
            </select>
          </div>

          {/* Subcaste */}
          <div>
            <label>Subcaste</label>
            <select name="SCTID" className="form-select" value={filterValues.SCTID} onChange={handleChange}>
              <option value="">Select Subcaste</option>
              {renderOptions(subcastList, "SCTID", "Subcast")}
            </select>
          </div>

          {/* Marriage Type */}
<div>
  <label>Marriage Type</label>
  <select
    name="marriage_type"
    className="form-select"
    value={filterValues.marriage_type}
    onChange={handleChange}
  >
    <option value="">Select Marriage Type</option>
    {renderOptions(marriageList, "MRID", "Marriage", true)} {/* pass true to use text */}
  </select>
</div>

          {/* Country */}
          <div>
            <label>Work Country</label>
            <select name="CNID" className="form-select" value={filterValues.CNID} onChange={handleChange}>
              <option value="">Select Country</option>
              {renderOptions(countryList, "CNID", "Country")}
            </select>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <button
            style={{
              padding: "10px 25px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#c52e79ff",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
            }}
            onClick={handleApply}
            disabled={applyingFilter} // disable button while applying
          >
           {applyingFilter ? "Applying..." : "Apply Filter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
