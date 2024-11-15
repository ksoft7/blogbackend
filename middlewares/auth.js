// middleware/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "Access denied. Admins only." });
  next();
};

export { authenticate, isAdmin };
