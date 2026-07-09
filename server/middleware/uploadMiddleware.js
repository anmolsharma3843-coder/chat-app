import multer from "multer";
import path from "path";
import fs from "fs";

fs.mkdirSync("uploads/profile", { recursive: true });
fs.mkdirSync("uploads/group", { recursive: true });

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/group");
  },
  filename: (req, file, cb) => {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const uploadProfile = multer({
  storage: profileStorage,
  fileFilter,
});

export const uploadProduct = multer({
  storage: productStorage,
  fileFilter,
});