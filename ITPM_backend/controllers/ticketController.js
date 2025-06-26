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
      sentimentScore,
      aiPredictedCategory,
      categoryConfidence,
      estimatedResolutionTime,
      automatedResponse,
      detectedEmotion,
      aiInsights,
      suggestedSolution
    } = req.body;
    
    // Process sentiment score if available
    const parsedSentimentScore = sentimentScore ? parseFloat(sentimentScore) : null;
    const parsedCategoryConfidence = categoryConfidence ? parseFloat(categoryConfidence) : null;
    
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
      // Enhanced AI analysis data (matching both chatbot and CreateTicket.jsx)
      sentimentScore: parsedSentimentScore,
      aiSuggestedPriority,
      sentimentAnalyzedAt: parsedSentimentScore ? new Date() : null,
      aiPredictedCategory: aiPredictedCategory || null,
      categoryConfidence: parsedCategoryConfidence,
      automatedResponse: automatedResponse || null,
      estimatedResolutionTime: estimatedResolutionTime || null,
      detectedEmotion: detectedEmotion || null,
      aiInsights: aiInsights || null,
      // Flag for AI-enhanced tickets
      hasAutomatedSolution: Boolean(automatedResponse || suggestedSolution),
      automatedSolutionAttempted: Boolean(automatedResponse || suggestedSolution)
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

// Send email confirmation after ticket creation
export const sendConfirmationEmail = async (req, res) => {
  try {
    const { ticketId, email, name, subject } = req.body;
    
    if (!ticketId || !email) {
      return res.status(400).json({ 
        success: false, 
        message: "Ticket ID and email are required" 
      });
    }

    // Try to find ticket by MongoDB _id first, then by ticketid field
    let ticket;
    try {
      // Try finding by MongoDB ObjectId first
      ticket = await Ticket.findById(ticketId);
    } catch (error) {
      // If ObjectId parsing fails, try finding by ticketid field
      ticket = await Ticket.findOne({ ticketid: ticketId });
    }
    
    // If still not found, try finding by ticketid as string
    if (!ticket) {
      ticket = await Ticket.findOne({ ticketid: parseInt(ticketId) });
    }
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        message: "Ticket not found" 
      });
    }

    // Create email content
    const emailContent = {
      to: email,
      subject: `Ticket Confirmation - ${subject || ticket.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Ticket Created Successfully</h2>
            
            <p>Dear ${name || ticket.name},</p>
            
            <p>Your support ticket has been successfully created and submitted to our system. Here are the details:</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Ticket ID:</strong> ${ticket.ticketid || ticket._id}<br>
              <strong>Subject:</strong> ${ticket.subject}<br>
              <strong>Department:</strong> ${ticket.department}<br>
              <strong>Priority:</strong> ${ticket.priority}<br>
              <strong>Status:</strong> ${ticket.status || 'Open'}<br>
              <strong>Created:</strong> ${new Date(ticket.date || ticket.createdAt).toLocaleString()}
            </div>
            
            <p>Our support team will review your ticket and respond within the estimated timeframe based on your ticket priority:</p>
            <ul>
              <li><strong>Low Priority:</strong> 24-48 hours</li>
              <li><strong>Medium Priority:</strong> 4-8 hours</li>
              <li><strong>High Priority:</strong> 1-4 hours</li>
              <li><strong>Critical/Urgent:</strong> 30 minutes - 1 hour</li>
            </ul>
            
            <p>You can check your ticket status using our chatbot by providing your email address.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p>Thank you for contacting our support team!</p>
              <p style="color: #666; font-size: 14px;">
                This is an automated message. Please do not reply to this email directly.
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Note: In a real implementation, you would use a service like SendGrid, Nodemailer, etc.
    // For now, we'll simulate successful email sending
    console.log('Email confirmation would be sent:', emailContent);
    
    // You can integrate with your preferred email service here
    // Example with Nodemailer (commented out):
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      // Your email service configuration
    });
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html
    });
    */

    res.status(200).json({
      success: true,
      message: "Confirmation email sent successfully",
      ticketId: ticket.ticketid || ticket._id
    });

  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send confirmation email",
      error: error.message 
    });
  }
};