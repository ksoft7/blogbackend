import httpStatus from "http-status";
import { User } from "../models/user.js";
import { Admin } from "../models/Admin.js";
import bcrypt from "bcryptjs";
import { registeradminSchema } from "../utility/adminValidation.js";
import jwt from "jsonwebtoken";

const adminReg = async (req, res) => {
  const { error, value } = registeradminSchema.validate(req.body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  const { username, password } = value;

  try {
    let admin = await Admin.findOne({ username: username });
    if (admin) {
      return res.status(httpStatus.CONFLICT).json({
        status: httpStatus.CONFLICT,
        message: "admin with username already exixts",
      });
    }

    const salt = await bcrypt.genSalt(10); //the number is cost factor
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin
    admin = new Admin({
      username,
      password: hashedPassword,
    });
    await admin.save();

    return res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      message: "Admin registered successfully",
      data: admin,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Registeration unsuccessful",
    });
  }
};

export { adminReg };

// Login user
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await Admin.findOne({ username: username });

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
        username: userExists.username,
      },
      process.env.JWT_SECRET
    );

    return res.status(httpStatus.OK).json({
      status: "sucess",
      message: "Token created",
      userData: {
        id: userExists._id,
        username: userExists.username,
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

export { loginAdmin };

const getAdmin = async (req, res) => {
  try {
    let admin = await Admin.find({});
    if (admin.length === 0 || !admin) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "Admin not found",
      });
    }

    res.status(httpStatus.OK).json({
      status: "success",
      message: "Admin retrieved successfully",
      data: admin,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "not found",
    });
  }
};

export { getAdmin };

const getUsers = async (req, res) => {
  try {
    let user = await User.find({});

    if (user.lenght === 0 || !user) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }
    res.status(httpStatus.OK).json({
      status: "success",
      message: "registered users retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "not found",
    });
  }
};

// get one user
const getUser = async (req, res) => {
  const { type, id, username } = req.query;
  let user;
  try {
    switch (type) {
      case "id":
        if (!id) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "error",
            message: "id parameter is required",
          });
        }
        user = await User.findById(id);
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: httpStatus.NOT_FOUND,
            message: "User not found id",
          });
        }

        return res.status(httpStatus.OK).json({
          status: "success",
          message: "User retrieved successfully",
          data: user,
        });

      case "username":
        if (!username) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "error",
            message: "User with username does not exist",
          });
        }

        user = await User.findOne({ username });
        if (!user) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: httpStatus.NOT_FOUND,
            message: "User with username not found",
          });
        }

        return res.status(httpStatus.OK).json({
          status: "success",
          message: "User retrieved successfully",
          data: user,
        });

      default:
        return res.status(httpStatus.NOT_FOUND).json({
          status: "error",
          message: "Invalid type",
        });
    }
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Invalid",
    });
  }
};

// get one admin
const getoneAdmin = async (req, res) => {
  const { type, id, username } = req.query;
  let admin;
  try {
    switch (type) {
      case "id":
        if (!id) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "error",
            message: "id is required",
          });
        }

        admin = await Admin.findById(id);
        if (!admin) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: httpStatus.NOT_FOUND,
            message: "Admin not found",
          });
        }

        return res.status(httpStatus.OK).json({
          status: "Success",
          message: "Admin retrieved successfully",
          data: admin,
        });

      case "username":
        if (!username) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: "error",
            message: "Admin with username does not exist",
          });
        }

        admin = await Admin.findOne({ username });
        if (!admin) {
          return res.status(httpStatus.NOT_FOUND).json({
            status: httpStatus.NOT_FOUND,
            message: "Admin with username does not exist",
          });
        }

        return res.status(httpStatus.OK).json({
          status: "Success",
          message: "Admin retrieved successfully",
          data: admin,
        });

      default:
        return res.status(httpStatus.NOT_FOUND).json({
          status: "Error",
          message: "Invalid type",
        });
        break;
    }
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Invalid",
    });
  }
};

// delete the user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "User not found",
      });
    }
    return res.status(httpStatus.OK).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while deleting the user",
    });
  }
};

// delete the user
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "admin not found",
      });
    }
    return res.status(httpStatus.OK).json({
      status: "success",
      message: "admin deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while deleting the admin",
    });
  }
};

// Updating a user

const updateAdmin = async (req, res) => {
  const { username, password } = req.body;
  const { id } = req.params;

  try {
    const adminExists = await Admin.findById(id);
    if (!adminExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "admin not found",
      });
    }

    const usernameExists = await Admin.findOne({ username });
    if (usernameExists && usernameExists._id.toString() !== id) {
      return res.status(httpStatus.CONFLICT).json({
        status: "error",
        message: "Username already exists",
      });
    }

    let updateData = {};
    if (username) updateData.username = username;
    if (password) {
      // const hashPassword = await bcrypt.hash(password, 10);
      updateData.password = password;
    }

    const updatedUser = await Admin.findByIdAndUpdate(
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
      message: "An error occurred while updating the Admin",
    });
  }
};

// create recycle bin

export { getUsers, getUser, deleteUser, getoneAdmin, deleteAdmin, updateAdmin };
