import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const profilestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const groupProfilestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/group");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadProfile = multer({
  storage: profilestorage,
  fileFilter,
});

export const uploadGroupProfile = multer({
  storage: groupProfilestorage,
  fileFilter,
});