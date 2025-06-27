import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const ticketSchema = new mongoose.Schema({
    ticketid: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    relatedservice: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    // New field for AI sentiment score (moved to comprehensive section above)
    // aiSuggestedPriority moved to comprehensive section above
    attachment: {
        type: String,
    },
    statement: {
        type: String,
        required: true,
    },
    // Track when sentiment analysis was performed
    sentimentAnalyzedAt: {
        type: Date,
        default: null
    },
    // Enhanced AI fields for comprehensive analysis (matching CreateTicket.jsx)
    // Basic sentiment analysis
    sentiment: {
        type: String,
        default: null
    },
    sentimentScore: {
        type: Number,
        default: null
    },
    
    // Category prediction
    aiPredictedCategory: {
        type: String,
        default: null
    },
    categoryConfidence: {
        type: Number,
        default: null
    },
    
    // Priority and urgency
    aiSuggestedPriority: {
        type: String,
        default: null
    },
    urgency: {
        type: String,
        default: null
    },
    
    // Emotion analysis
    detectedEmotion: {
        type: String,
        default: null
    },
    emotionIntensity: {
        type: Number,
        default: null
    },
    emotions: {
        type: Array,
        default: null
    },
    
    // AI-generated content
    automatedResponse: {
        type: String,
        default: null
    },
    estimatedResolutionTime: {
        type: String,
        default: null
    },
    supportAction: {
        type: String,
        default: null
    },
    
    // Additional insights
    chatbotSuggestions: {
        type: Array,
        default: null
    },
    shouldEscalate: {
        type: Boolean,
        default: false
    },
    
    // Complete AI insights object
    aiInsights: {
        type: Object,
        default: null
    },
    // Flag for tickets that received automated solutions
    hasAutomatedSolution: {
        type: Boolean,
        default: false
    },
    // Track if customer tried automated solution before creating ticket
    automatedSolutionAttempted: {
        type: Boolean,
        default: false
    },
    // Customer satisfaction after automated response
    automatedSolutionSatisfaction: {
        type: String,
        enum: ["satisfied", "needs_more_help", "escalated", null],
        default: null
    },
    status: {
        type: String,
        default: "Open",
        enum: ["Open", "In Progress", "Resolved", "Closed"],
    }
}, { timestamps: true }); // Add timestamps for creation and update tracking

//  Auto-increment ticket id 
ticketSchema.plugin(AutoIncrement, { inc_field: 'ticketid' });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;