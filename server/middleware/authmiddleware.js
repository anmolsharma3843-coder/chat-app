import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";

export const isAuthenticated = async ( req, res, next ) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify( token, process.env.JWT_SECRET );
    const user = await User.findById( decoded._id ).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};