import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Organization from "../models/organization.js";

//middleware to protect routes

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const model = decoded.userType === "member" ? User : Organization;
      let user = await model.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 🔑 Normalize organizationToken for both User & Organization
      if (decoded.userType === "member") {
        req.user = user;
      } else {
        // org login: ensure req.user has organizationToken
        req.user = {
          ...user.toObject(),
          organizationToken: user.token || user.organizationToken || user._id,
        };
      }

      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};


// MIDDLEWARE FOR ADMIN ROUTES
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

export { protect, adminOnly };
