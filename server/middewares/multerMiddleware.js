import multer from "multer";

// Define storage for uploaded files
const storage = multer.memoryStorage();

// Create multer instance with desired configuration
const upload = multer({ storage: storage });

// Middleware function to handle file uploads
export const uploadFiles = upload.fields([
  { name: 'files', maxCount: 5 }, // adjust maxCount as needed
  // { name: 'submitted_files', maxCount: 5 }, // adjust maxCount as needed
]);

