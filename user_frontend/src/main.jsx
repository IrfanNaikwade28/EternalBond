import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from "./context/UserContext.jsx";
import { FilterModalProvider } from "./context/FilterModalContext.jsx"; // ✅ import FilterModalContext
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <FilterModalProvider>  {/* ✅ Wrap App with FilterModalProvider */}
          <App />
        </FilterModalProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
