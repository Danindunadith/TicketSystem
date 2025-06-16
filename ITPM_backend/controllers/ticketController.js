import Ticket from "../models/ticket.js";

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const {
      name,
      email,
      date,
      subject,
      department,
      relatedservice,
      priority,
      statement,
      sentimentScore
    } = req.body;
    
    // Process sentiment score if available
    const parsedSentimentScore = sentimentScore ? parseFloat(sentimentScore) : null;
    
    // Determine AI suggested priority based on sentiment score
    let aiSuggestedPriority = null;
    if (parsedSentimentScore !== null) {
      if (parsedSentimentScore > 0.9) {
        aiSuggestedPriority = "Urgent";
      } else if (parsedSentimentScore > 0.7) {
        aiSuggestedPriority = "High";
      } else if (parsedSentimentScore > 0.4) {
        aiSuggestedPriority = "Medium";
      } else {
        aiSuggestedPriority = "Low";
      }
    }
    
    const attachment = req.file ? `/uploads/${req.file.filename}` : "";

    const ticket = new Ticket({
      name,
      email,
      date,
      subject,
      department,
      relatedservice,
      priority,
      attachment,
      statement,
      // Add sentiment analysis data
      sentimentScore: parsedSentimentScore,
      aiSuggestedPriority,
      sentimentAnalyzedAt: parsedSentimentScore ? new Date() : null
    });
    
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
};

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
};

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
};

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
};

// Get tickets by sentiment score range
export const getTicketsBySentimentScore = async (req, res) => {
  try {
    const { min, max } = req.query;
    const minScore = parseFloat(min) || 0;
    const maxScore = parseFloat(max) || 1;
    
    const tickets = await Ticket.find({ 
      sentimentScore: { 
        $gte: minScore, 
        $lte: maxScore 
      } 
    });
    
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found in this sentiment range" });
    }
    
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get count of tickets department wise
export const getTicketCountByDepartment = async (req, res) => {
  try {
    // List all possible departments here
    const allDepartments = ["IT", "HR", "Finance", "Support", "Sales"]; // Add your departments

    const counts = await Ticket.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      }
    ]);
    // Convert array to object: { department: count }
    const result = {};
    allDepartments.forEach(dep => {
      result[dep] = 0;
    });
    counts.forEach(item => {
      result[item._id] = item.count;
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sentiment analysis statistics
export const getSentimentStatistics = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $match: { sentimentScore: { $ne: null } }
      },
      {
        $group: {
          _id: null,
          avgSentiment: { $avg: "$sentimentScore" },
          highPriorityCount: {
            $sum: {
              $cond: [{ $or: [{ $eq: ["$priority", "High"] }, { $eq: ["$priority", "Urgent"] }] }, 1, 0]
            }
          },
          aiHighPriorityCount: {
            $sum: {
              $cond: [{ $or: [{ $eq: ["$aiSuggestedPriority", "High"] }, { $eq: ["$aiSuggestedPriority", "Urgent"] }] }, 1, 0]
            }
          },
          priorityMatchCount: {
            $sum: { $cond: [{ $eq: ["$priority", "$aiSuggestedPriority"] }, 1, 0] }
          },
          totalAnalyzed: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          avgSentiment: 1,
          highPriorityCount: 1,
          aiHighPriorityCount: 1,
          priorityMatchRate: { $divide: ["$priorityMatchCount", "$totalAnalyzed"] },
          totalAnalyzed: 1
        }
      }
    ]);
    
    res.status(200).json(stats[0] || {
      avgSentiment: 0,
      highPriorityCount: 0,
      aiHighPriorityCount: 0,
      priorityMatchRate: 0,
      totalAnalyzed: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};