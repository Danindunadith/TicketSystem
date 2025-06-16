import express from "express";
import multer from "multer";
import path from "path";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByEmail,
  getTicketsByDepartment,
  getTicketsByPriority,
  getTicketCountByDepartment
} from "../controllers/ticketController.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed"));
    }
  }
});

// Routes
router.post("/", upload.single("attachment"), createTicket);
router.get("/", getAllTickets);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);
router.get("/email/:email", getTicketsByEmail);
router.get("/department/:department", getTicketsByDepartment);
router.get("/count/department", getTicketCountByDepartment);
router.get("/priority/:priority", getTicketsByPriority);

export default router;