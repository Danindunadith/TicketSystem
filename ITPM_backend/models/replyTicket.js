import mongoose from "mongoose";

const replyTicketSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  userSendEmail: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const ReplyTicket = mongoose.model("ReplyTicket", replyTicketSchema);

export default ReplyTicket;