import express from "express";
import { join, resolve } from "path";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import reviewRouter from "./routes/reviewRouter.js";
import dotenv from "dotenv";
import inquiryRouter from "./routes/inquiryRouter.js";
import peopleRoute from "./routes/peopleRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import StockRoute from "./routes/StockRoute.js";
import ticketRoute from "./routes/ticketRoute.js";
import replyTicketRoute from "./routes/replyTicketRoute.js";
import analysisRouter from "./routes/analysisRoute.js";

import cors from "cors";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files for images and other non-PDF files
app.use("/uploads", express.static(join(resolve(), "uploads")));

// Custom route for PDF downloads
app.get("/uploads/*.pdf", (req, res) => {
  const filePath = join(resolve(), "uploads", req.path.split("/uploads/")[1]);
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filePath.split("/").pop()}"`);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// JWT Middleware
app.use((req, res, next) => {
  let token = req.header("Authorization");
  if (token) {
    token = token.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Token verification failed:", err);
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    next();
  }
});

// MongoDB Connection
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connection established successfully");
});
connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/analysis", analysisRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/peoples", peopleRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/stock", StockRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/reticket",replyTicketRoute)

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});