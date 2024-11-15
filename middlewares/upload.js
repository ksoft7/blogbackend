import multer from "multer";
import path from "path";

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be saved in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use timestamp to ensure unique filenames
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimeType && extName) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png)"), false);
  }
};

// Initialize Multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export default upload;
