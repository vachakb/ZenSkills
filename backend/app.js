require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,              // Allow credentials like cookies
}));

app.use(bodyParser.json());
app.use(cookieParser());

// Use routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
