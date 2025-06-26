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
    // New field for AI sentiment score
    sentimentScore: {
        type: Number,
    },
    // New field for AI suggested priority
    aiSuggestedPriority: {
        type: String,
    },
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
    // Enhanced AI fields for predictive categorization
    aiPredictedCategory: {
        type: String,
        default: null
    },
    categoryConfidence: {
        type: Number,
        default: null
    },
    automatedResponse: {
        type: String,
        default: null
    },
    estimatedResolutionTime: {
        type: String,
        default: null
    },
    detectedEmotion: {
        type: String,
        default: null
    },
    emotionIntensity: {
        type: Number,
        default: null
    },
    supportAction: {
        type: String,
        default: null
    },
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