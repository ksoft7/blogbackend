// import
import express from "express";
import { registerUser, loginUser } from "../controllers/usersController.js";
import { authorizeUser } from "../middlewares/authorize.js";

const router = express.Router();

router.route("/register").post(registerUser);
// router
//   .route("/update-user/:id")
//   .patch(authorizeUser, checkRoles(["admin", "regular-user"]), updateUser);
router.route("/login").post(loginUser);

export default router;
