// backend/src/app.js
require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const logRoutes = require("./routes/logRoutes");

const productsRoutes = require("./routes/productsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const uploadsRoutes = require("./routes/uploadRoutes");
const promotionsRoutes = require("./routes/promotionRoutes");

const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// core routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/logs", logRoutes);

// product system routes
app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/promotions", promotionsRoutes);
app.use("/uploads", uploadsRoutes);

// static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// inventory management routes
app.use('/inventory', inventoryRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});

module.exports = app;
