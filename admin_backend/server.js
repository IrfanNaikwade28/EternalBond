require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");



const gotraRoutes = require("./routes/gotraRoutes");
const ganRoutes = require("./routes/ganRoutes");
const authRoutes = require("./routes/authRoutes");
const nadiRoutes = require("./routes/nadiRoutes");
const nakshtraRoutes = require("./routes/nakshtraRoutes");
const rashiRoutes = require("./routes/rashiRoutes");
const educationRoutes = require("./routes/educationRoutes");
const heightRoutes = require("./routes/heightRoutes");
const marriageRoutes = require("./routes/marriageRoutes");
const subcastRoutes = require("./routes/subcastRoutes");
const countryRoutes = require("./routes/countryRoutes");
const locationRoutes=require("./routes/locationRoutes");
const castRoutes = require("./routes/castRoutes");
const userRoutes = require("./routes/usersRoutes");
const userDetailRoutes = require("./routes/userDetailRoutes");
const familyRoutes = require("./routes/familyRoutes");
const educationWorkRoutes = require("./routes/educationWorkRoutes");
const healthRoutes = require("./routes/healthRoutes.js");
const otherinfoRoutes = require("./routes/otherinfoRoutes");

const filterRoutes = require("./routes/filterRoutes");
const extendViewCountRoutes = require("./routes/extendViewCountRoutes");
//const heightRoutes = require("./routes/heightRoutes");
//app.use(cors());
const activeUsersRoutes = require("./routes/activeUsersRoutes");
const deactiveUsersRoutes = require("./routes/deactiveUsersRoutes");
const profileViewRoutes = require("./routes/profileViewRoutes");
const expiryPlanRoutes=require("./routes/expiryPlanRoutes");
const renewPlanRoutes = require("./routes/renewPlanRoutes");
// Import Routes
const successstoryRoutes = require("./routes/successstoryRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const registrationRoutes=require("./routes/registrationRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes");
const biodataRoutes = require("./routes/biodataRoutes");
const bioRoutes = require("./routes/bioRoutes");
app.use(cors({
  origin: "*",        // React कुठूनही कॉल करू शकतो
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/gotra", gotraRoutes);
app.use("/api/gan", ganRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/nadi", nadiRoutes);
app.use("/api/nakshtra", nakshtraRoutes);
app.use("/api/rashi", rashiRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/height", heightRoutes);
app.use("/api/marriage", marriageRoutes);
app.use("/api/subcast", subcastRoutes);
app.use("/api/country", countryRoutes);
app.use("/api/location", locationRoutes);
// === Routes ===
app.use("/api/cast", castRoutes);
app.use("/api", familyRoutes);
//app.use("/api/height", heightRoutes);

//const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//app.use("/uploads", express.static("uploads")); // serve uploaded files
app.use("/api/users", userRoutes);
app.use("/api/userdetails", userDetailRoutes);
app.use("/api/education-work", educationWorkRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/otherinfo", otherinfoRoutes);
app.use("/api/filter", filterRoutes);
app.use("/api/extendviewcount", extendViewCountRoutes);
app.use("/api/active-users", activeUsersRoutes);
app.use("/api/deactive-users", deactiveUsersRoutes);
app.use("/api/profile-views", profileViewRoutes);
app.use("/api/expiry-plans", expiryPlanRoutes);
app.use("/api/renew-plan-users", renewPlanRoutes);
// Use Routes
app.use("/api/successstory", successstoryRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/register", registrationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/biodata-users", biodataRoutes);
app.use("/api/bio", bioRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
