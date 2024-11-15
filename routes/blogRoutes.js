import express from "express";
import multer from "multer";
import {
  createBlog,
  addComment,
  getBlogs,
} from "../controllers/blogController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/blogs", upload.single("image"), createBlog);
router.post("/blogs/:id/comments", addComment);
router.get("/blogs", getBlogs);

export default router;
