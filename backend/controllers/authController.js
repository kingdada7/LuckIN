import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Organization from "../models/organization.js";
import { nanoid } from "nanoid";
// generate jwt tokens
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      organizationToken: user.organizationToken,
      userType: user.userType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
//@desc    Register a new user
//@route   POST /api/auth/register
//@access  Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      profileImageUrl,
      userType,
      organizationToken,
    } = req.body;
    console.log(req.body);

    const model = userType === "member" ? User : Organization;
    // CHECK IF USER ALREADY EXISTS
    const userExists = await model.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (userType === "member" && !organizationToken) {
      return res
        .status(400)
        .json({ message: "Organization token is required" });
    }

    // validate the organization Token
    if (userType === "member") {
      const organization = await Organization.findOne({
        organizationToken,
      });
      if (!organization) {
        return res.status(400).json({ message: "Invalid organization token" });
      }
    }

    //hash password
    const userSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, userSalt);

    //create user
    const user = await model.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      organizationToken: userType === "member" ? organizationToken : nanoid(5),
    });

    user.userType = userType;
    //return user data with jwt
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user),
      organizationToken: user?.organizationToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc login user
//@route POST /api/auth/login
//@access Public

const loginUser = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    const model = userType === "member" ? User : Organization;
    //check for user email
    const user = await model.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //check for password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    user.userType = userType;
    //return user data with jwt
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user),
      organizationToken: user?.organizationToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//@desc get user
//@route GET /api/auth/profile
//@access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//@desc update user
//@route PUT /api/auth/profile
//@access Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // If password is provided, hash it
    if (req.body.password) {
      const userSalt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, userSalt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
