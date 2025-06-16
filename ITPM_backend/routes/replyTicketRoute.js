import express from "express";
import { createReply, getAllReplies, getRepliesByTicket } from "../controllers/replyTicketController.js";

const replyTicketRoute = express.Router();

replyTicketRoute.post("/replyticket", createReply);
replyTicketRoute.get("/replyticket", getAllReplies);
replyTicketRoute.get("/ticket/:ticketId", getRepliesByTicket);

export default replyTicketRoute;