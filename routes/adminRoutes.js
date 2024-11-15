import express from "express";
import { createBlog } from "../controllers/blogController.js";
import {
  getUsers,
  getUser,
  deleteUser,
  deleteAdmin,
  updateAdmin,
} from "../controllers/adminController.js";
import { adminReg } from "../controllers/adminController.js";
import { getAdmin } from "../controllers/adminController.js";
import { getoneAdmin } from "../controllers/adminController.js";
import { loginAdmin } from "../controllers/adminController.js";
import { authorizeUser } from "../middlewares/authorize.js";
import upload from "../middlewares/upload.js"; // Multer setup

const router = express.Router();

router.route("/register").post(adminReg);

router.route("/login").post(loginAdmin);

router.route("/users").get(getUsers);

router.route("/list-user").get(getUser);

router.route("/list-admin").get(getoneAdmin);

router.route("/admins").get(getAdmin);

router.route("/delete-user/:id").delete(deleteUser);

router.route("/delete-admin/:id").delete(authorizeUser, deleteAdmin);

router.route("/update-admin/:id").patch(updateAdmin);
router.post("/create", upload.single("image"), createBlog);

export default router;
