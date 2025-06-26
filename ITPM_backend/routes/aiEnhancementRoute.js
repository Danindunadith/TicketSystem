import express from 'express';
import { 
  predictTicketCategory, 
  analyzeTicketEmotion, 
  getTicketInsights,
  analyzeTicketForChatbot,
  provideInstantHelp,
  getCategorizationAnalytics
} from '../controllers/aiEnhancementController.js';

const router = express.Router();

// Predictive ticket categorization
router.post('/predict-category', predictTicketCategory);

// Emotion analysis for enhanced support
router.post('/analyze-emotion', analyzeTicketEmotion);

// Get AI-powered insights for support agents
router.get('/ticket-insights/:ticketId', getTicketInsights);

// AI ticket analysis for chatbot
router.post('/analyze-ticket', analyzeTicketForChatbot);

// Instant help system for chatbot
router.post('/instant-help', provideInstantHelp);

// NEW: Analytics endpoints
router.get('/analytics/categorization', getCategorizationAnalytics);

export default router;
