import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoute from "./routes/usersRoutes.js";
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/user", userRoute);

// Database Connection
const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
