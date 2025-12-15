import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Basic Info
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);
  // In UserContext.js
const [upass, setUpass] = useState(() => localStorage.getItem("upass") || "");
const [uprofile, setUprofile] = useState(() => localStorage.getItem("uprofile") || "");
  const [ctid, setCtid] = useState(() => localStorage.getItem("ctid") || null);
  const [fatherName, setFatherName] = useState(() => localStorage.getItem("fatherName") || "");
  const [motherName, setMotherName] = useState(() => localStorage.getItem("motherName") || "");

  // Education & Location Info
  const [EDID, setEDID] = useState(() => localStorage.getItem("EDID") || null);
  const [CNID, setCNID] = useState(() => localStorage.getItem("CNID") || null);
  const [DSID, setDSID] = useState(() => localStorage.getItem("DSID") || null);
  const [INID, setINID] = useState(() => localStorage.getItem("INID") || null);

  // 🟢 Health Info (NEW)
  const [Diet, setDiet] = useState(() => localStorage.getItem("Diet") || "");
  const [Drink, setDrink] = useState(() => localStorage.getItem("Drink") || "");
  const [Smoking, setSmoking] = useState(() => localStorage.getItem("Smoking") || "");

  // 🔹 Sync everything with localStorage
  useEffect(() => {
    const storeOrRemove = (key, value) => {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    };

    storeOrRemove("userId", userId);
    storeOrRemove("ctid", ctid);
    storeOrRemove("fatherName", fatherName);
    storeOrRemove("motherName", motherName);
    storeOrRemove("EDID", EDID);
    storeOrRemove("CNID", CNID);
    storeOrRemove("DSID", DSID);
    storeOrRemove("INID", INID);
    storeOrRemove("Diet", Diet);
    storeOrRemove("Drink", Drink);
    storeOrRemove("Smoking", Smoking);
    // ✅ New fields
  storeOrRemove("upass", upass);
  storeOrRemove("uprofile", uprofile);
  }, [
    userId,
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
     upass, 
     uprofile
  ]);

  return (
    <UserContext.Provider
      value={{
        userId, setUserId,
        ctid, setCtid,
        fatherName, setFatherName,
        motherName, setMotherName,
        EDID, setEDID,
        CNID, setCNID,
        DSID, setDSID,
        INID, setINID,
        Diet, setDiet,
        Drink, setDrink,
        Smoking, setSmoking,
        upass, setUpass,         // ✅ new
        uprofile, setUprofile    // ✅ new
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
