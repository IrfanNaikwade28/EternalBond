// src/context/FilterModalContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const FilterModalContext = createContext();

export const useFilterModal = () => useContext(FilterModalContext);

export const FilterModalProvider = ({ children }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [originalUsers, setOriginalUsers] = useState([]); // API data
  const [filteredUsers, setFilteredUsers] = useState([]); // filter data
  const [showNoDataMessage, setShowNoDataMessage] = useState(false); // for dashboard message
 const [searchUID, setSearchUID] = useState(""); // UID search state
  const openFilterModal = () => setShowFilterModal(true);
  const closeFilterModal = () => setShowFilterModal(false);

  const onApplyFilter = async (filterValues) => {
    // alert(JSON.stringify(filterValues))
    try {
      const response = await axios.post(
        "http://localhost:5001/api/filter/profiles",
        filterValues
      );

      if (response.data && response.data.length > 0) {
        setFilteredUsers(response.data); // store filtered data
      } else {
        setFilteredUsers([]);
        setShowNoDataMessage(true); // show "Data Not Found"

        // hide message after 3 seconds
        setTimeout(() => {
          setShowNoDataMessage(false);
        }, 800);
      }

      closeFilterModal();
    } catch (err) {
      console.error(err);
      setFilteredUsers([]);
      setShowNoDataMessage(true); // show message on error

      setTimeout(() => {
        setShowNoDataMessage(false);
      }, 3000);
    }
  };

  const clearFilter = () => {
    setFilteredUsers([]); // remove filter
    setSearchUID("");
  };

  return (
    <FilterModalContext.Provider
      value={{
        showFilterModal,
        openFilterModal,
        closeFilterModal,
        onApplyFilter,
        filteredUsers,
        originalUsers,
        setOriginalUsers,
        clearFilter,
        showNoDataMessage, // provide to dashboard
        searchUID,
        setSearchUID,
      }}
    >
      {children}
    </FilterModalContext.Provider>
  );
};
