import Ticket from "../models/ticket.js";

// Create a new ticket
export const createTicket = async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Get all tickets
export const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get a ticket by ID
export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update a ticket by ID
export const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(200).json(ticket);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
// Delete a ticket by ID
export const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Get tickets by email
export const getTicketsByEmail = async (req, res) => {
    try {
        const tickets = await Ticket.find({ email: req.params.email });
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: "No tickets found for this email" });
        }
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Get tickets by department
export const getTicketsByDepartment = async (req, res) => {
    try {
        const tickets = await Ticket.find({ department: req.params.department });
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: "No tickets found for this department" });
        }
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Get tickets by priority
export const getTicketsByPriority = async (req, res) => {
    try {
        const tickets = await Ticket.find({ priority: req.params.priority });
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: "No tickets found for this priority" });
        }
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}