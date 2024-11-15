import httpStatus from "http-status";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { registerSchema } from "../utility/usersValidatiom.js";
import jwt from "jsonwebtoken";

// Controller function for registering a user
const registerUser = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: error.details[0].message,
    });
  }
  const { gender, email, password, role, username } = value;

  try {
    // Check if a user with the provided email already exists
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(httpStatus.CONFLICT).json({
        status: "error",
        message: "User with email already exists",
      });
    }

    // Check if a user with the provided username already exists
    user = await User.findOne({ username: username });
    if (user) {
      return res.status(httpStatus.CONFLICT).json({
        status: "error",
        message: "User with username already exists",
      });
    }

    const salt = await bcrypt.genSalt(10); //the number is cost factor
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      gender,
      email,
      password: hashedPassword,
      role,
      username,
    });

    // Save the user to the database
    await user.save();

    // Return a success response
    res.status(httpStatus.CREATED).json({
      status: "success",
      message: "User registration successful",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while registering the user",
    });
  }
};

// Updating a user

const updateUser = async (req, res) => {
  const { email, username, password, gender } = req.body;
  const { id } = req.params;

  try {
    const userExists = await User.findById(id);
    if (!userExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "User not found",
      });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== id) {
      return res.status(httpStatus.CONFLICT).json({
        status: "error",
        message: "Email already exists",
      });
    }

    const fullNameExists = await User.findOne({ fullname });
    if (fullNameExists && fullNameExists._id.toString() !== id) {
      return res.status(httpStatus.CONFLICT).json({
        status: "error",
        message: "Fullname already exists",
      });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists && usernameExists._id.toString() !== id) {
      return res.status(httpStatus.CONFLICT).json({
        status: "error",
        message: "Username already exists",
      });
    }

    const xists = await User.findOne({});
    if (xists && xists._id.toString() !== id) {
      return res.status(httpStatus.CONFLICT).json({
        status: "error",
        message: "already exists",
      });
    }

    let updateData = {};
    if (email) updateData.email = email;
    if (fullname) updateData.fullname = fullname;
    if (username) updateData.username = username;
    if (gender) updateData.gender = gender;
    if (password) {
      // const hashPassword = await bcrypt.hash(password, 10);
      updateData.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(httpStatus.OK).json({
      status: "success",
      message: "User updated successfully",
      updatedData: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while updating the user",
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email: email });

    if (!userExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "Not Found",
        message: "Invalid login details",
      });
    }

    // check and compare password

    const correctPassword = await bcrypt.compare(password, userExists.password);

    if (!correctPassword) {
      return res.status(httpStatus.NOT_EXTENDED).json({
        status: "Not Found",
        message: "Invalid password",
      });
    }

    // Create an authorization token for the user
    const token = jwt.sign(
      {
        id: userExists._id,
        email: userExists.email,
      },
      process.env.JWT_SECRET
    );

    return res.status(httpStatus.OK).json({
      status: "sucess",
      message: "Token created",
      userData: {
        id: userExists._id,
        name: userExists.username,
        email: userExists.email,
      },
      authToken: token,
    });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while trying to login",
    });
  }
};

export { registerUser, updateUser, loginUser };
