import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoute from "./routes/usersRoutes.js";
import Blog from "./models/Blog.js";
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
app.get("/api/blog/blogs/:id", async (req, res) => {
  const { id } = req.params; // Get the blog ID from the URL parameters

  try {
    // Find the blog by ID
    const blog = await Blog.findById(id);

    // If no blog found, return a 404 error
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Return the blog data
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    // Return a 500 error if something goes wrong
    res.status(500).json({ message: "Server error" });
  }
});

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
