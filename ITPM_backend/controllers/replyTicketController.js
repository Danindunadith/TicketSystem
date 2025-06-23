import ReplyTicket from "../models/replyTicket.js";
import jwt from "jsonwebtoken";

// Create a reply
export const createReply = async (req, res) => {
  try {
    const { topic, reply, status, ticketId, userSendEmail, firstName, email } = req.body;
    const newReply = new ReplyTicket({ topic, reply, status, ticketId, userSendEmail, firstName, email });
    await newReply.save();
    res.status(201).json(newReply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all replies
export const getAllReplies = async (req, res) => {
  try {
    const replies = await ReplyTicket.find();
    res.status(200).json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get replies by ticketId
export const getRepliesByTicket = async (req, res) => {
  try {
    const replies = await ReplyTicket.find({ ticketId: req.params.ticketId });
    res.status(200).json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Extract and decode JWT token details
export const getReplyTokenDetails = (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "kv-secret-89!");
    const id = decoded.id;
    res.status(200).json({ id, tokenDetails: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};