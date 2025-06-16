import ReplyTicket from "../models/replyTicket.js";

// Create a reply
export const createReply = async (req, res) => {
  try {
    const { topic, reply, status, ticketId } = req.body;
    const newReply = new ReplyTicket({ topic, reply, status, ticketId });
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