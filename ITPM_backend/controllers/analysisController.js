import axios from 'axios';
import dotenv from 'dotenv';
import Ticket from '../models/ticket.js';

dotenv.config();

// Get API key from .env file
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Log if API key is missing (but don't log the actual key)
if (!HUGGING_FACE_API_KEY || HUGGING_FACE_API_KEY === 'your-huggingface-api-key') {
  console.error('⚠️ HUGGING_FACE_API_KEY is not properly set in .env file');
}

export const analyzeSentiment = async (req, res) => {
  try {
    console.log('Analyzing sentiment for ticket...');
    const { subject, department, relatedService, description } = req.body;
    
    // Combine text for sentiment analysis
    const text = `${subject} ${description}`;
    console.log(`Text length for analysis: ${text.length} characters`);
    
    // Using a valid, popular sentiment model
    const sentimentModel = 'cardiffnlp/twitter-roberta-base-sentiment';
    console.log(`Calling Hugging Face API with model: ${sentimentModel}`);
    
    // Call Hugging Face API for sentiment analysis
    const sentimentResponse = await axios.post(
      `https://api-inference.huggingface.co/models/${sentimentModel}`,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Sentiment API response received');
    
    // Process sentiment results
    const sentimentData = sentimentResponse.data;
    console.log('Raw sentiment data:', JSON.stringify(sentimentData).substring(0, 200));
    
    // Map sentiment from the cardiffnlp model (which uses numeric labels)
    let sentiment = 'NEUTRAL';
    let priority = 'Medium';
    let score = 0.5;
    
    // Process cardiffnlp model response
    if (Array.isArray(sentimentData) && sentimentData[0] && Array.isArray(sentimentData[0])) {
      const results = sentimentData[0];
      
      // Map the labels (cardiffnlp model uses 0:negative, 1:neutral, 2:positive)
      const negativeResult = results.find(item => item.label === "LABEL_0" || item.label === "negative");
      const positiveResult = results.find(item => item.label === "LABEL_2" || item.label === "positive");
      
      if (negativeResult && positiveResult) {
        if (negativeResult.score > positiveResult.score) {
          sentiment = 'NEGATIVE';
          score = negativeResult.score;
          
          // Determine priority based on negative sentiment strength
          if (score > 0.8) priority = 'Critical';
          else if (score > 0.6) priority = 'High';
          else priority = 'Medium';
        } else {
          sentiment = 'POSITIVE';
          score = positiveResult.score;
          
          // Lower priority for positive sentiment
          if (score > 0.8) priority = 'Low';
          else priority = 'Medium';
        }
      }
    }
    
    // Generate a simple solution using a smaller, reliable summarization model
    const solutionPrompt = `Issue: ${subject}. ${description}. Provide a brief solution.`;
    
    const suggestedSolution = generateSolutionLocally(subject, department, description);
    
    // Return the analysis results
    res.json({
      sentiment,
      score,
      priority,
      suggestedSolution
    });
    
  } catch (error) {
    console.error('Sentiment analysis error:', error.message);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    
    // Use fallback method
    console.log('Using fallback sentiment analysis...');
    const text = `${req.body.subject} ${req.body.description}`;
    const sentimentResult = analyzeSentimentLocally(text);
    const suggestedSolution = generateSolutionLocally(
      req.body.subject, 
      req.body.department, 
      req.body.description
    );
    
    // Return the fallback results
    res.json({
      sentiment: sentimentResult.sentiment,
      score: sentimentResult.score,
      priority: sentimentResult.priority,
      suggestedSolution,
      fromFallback: true
    });
  }
};

// NEW: Get sentiment statistics for analytics dashboard
export const getSentimentStats = async (req, res) => {
  try {
    console.log('Fetching sentiment statistics...');
    
    // Get all tickets with sentiment data
    const tickets = await Ticket.find({}).lean();
    
    if (tickets.length === 0) {
      return res.json({
        avgSentiment: 0.5,
        totalAnalyzed: 0,
        sentimentDistribution: {
          positive: 0,
          negative: 0,
          neutral: 0
        },
        emotionDistribution: {}
      });
    }
    
    // Calculate sentiment statistics
    let totalSentiment = 0;
    let analyzedCount = 0;
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    const emotionCounts = {};
    
    tickets.forEach(ticket => {
      // Count sentiments
      if (ticket.detectedSentiment) {
        analyzedCount++;
        const sentiment = ticket.detectedSentiment.toLowerCase();
        if (sentimentCounts.hasOwnProperty(sentiment)) {
          sentimentCounts[sentiment]++;
        }
        
        // Add to total for average calculation
        if (ticket.sentimentScore !== undefined) {
          totalSentiment += ticket.sentimentScore;
        } else {
          // Default scores if not stored
          totalSentiment += sentiment === 'positive' ? 0.8 : 
                           sentiment === 'negative' ? 0.2 : 0.5;
        }
      }
      
      // Count emotions
      if (ticket.detectedEmotion) {
        const emotion = ticket.detectedEmotion.toLowerCase();
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      }
    });
    
    const avgSentiment = analyzedCount > 0 ? totalSentiment / analyzedCount : 0.5;
    
    const stats = {
      avgSentiment,
      totalAnalyzed: analyzedCount,
      sentimentDistribution: sentimentCounts,
      emotionDistribution: emotionCounts
    };
    
    console.log('Sentiment stats calculated:', stats);
    res.json(stats);
    
  } catch (error) {
    console.error('Error fetching sentiment stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch sentiment statistics',
      avgSentiment: 0.5,
      totalAnalyzed: 0,
      sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
      emotionDistribution: {}
    });
  }
};

// Fallback functions if API calls fail
const analyzeSentimentLocally = (text) => {
  // Simple keyword-based sentiment analysis
  const negativeWords = ['error', 'issue', 'problem', 'broken', 'not working', 'failed', 'crash', 'bug', 
                        'terrible', 'awful', 'poor', 'bad', 'slow', 'incorrect', 'wrong', 'missing'];
  const positiveWords = ['thank', 'good', 'great', 'excellent', 'working', 'fixed', 'resolved', 
                        'appreciate', 'helpful', 'satisfied', 'perfect', 'best', 'easy'];
  
  const lowercaseText = text.toLowerCase();
  let negativeScore = 0;
  let positiveScore = 0;
  
  negativeWords.forEach(word => {
    if (lowercaseText.includes(word)) negativeScore += 1;
  });
  
  positiveWords.forEach(word => {
    if (lowercaseText.includes(word)) positiveScore += 1;
  });
  
  const totalWords = text.split(/\s+/).length;
  const negativeRatio = negativeScore / Math.min(20, totalWords);
  const positiveRatio = positiveScore / Math.min(20, totalWords);
  
  let sentiment, score, priority;
  
  if (negativeScore > positiveScore) {
    sentiment = 'NEGATIVE';
    score = Math.min(0.9, 0.5 + (negativeRatio * 0.5));
    priority = score > 0.8 ? 'Critical' : (score > 0.6 ? 'High' : 'Medium');
  } else if (positiveScore > negativeScore) {
    sentiment = 'POSITIVE';
    score = Math.min(0.9, 0.5 + (positiveRatio * 0.5));
    priority = score > 0.7 ? 'Low' : 'Medium';
  } else {
    sentiment = 'NEUTRAL';
    score = 0.5;
    priority = 'Medium';
  }
  
  return { sentiment, score, priority };
};

const generateSolutionLocally = (subject, department, description) => {
  // Generate a generic solution based on department and ticket content
  const lowerSubject = subject.toLowerCase();
  const lowerDesc = description.toLowerCase();
  let solution = `Based on your ticket regarding "${subject}", `;
  
  if (lowerDesc.includes('password') || lowerSubject.includes('password')) {
    solution += "we recommend resetting your password through the account settings page. If you're still having issues, contact the support team.";
  } else if (lowerDesc.includes('login') || lowerSubject.includes('login') || 
             lowerDesc.includes('sign in') || lowerSubject.includes('sign in')) {
    solution += "please try clearing your browser cache and cookies, then restart your browser. If the issue persists, try using a different browser.";
  } else if (lowerDesc.includes('email') || lowerSubject.includes('email')) {
    solution += "please check your spam folder and verify your email address is correct. If you still don't receive emails, try adding our domain to your safe senders list.";
  } else if (lowerDesc.includes('slow') || lowerSubject.includes('slow') || 
             lowerDesc.includes('performance') || lowerSubject.includes('performance')) {
    solution += "try clearing your browser cache, close unnecessary applications, and ensure your device meets the minimum system requirements. If the issue persists, our technical team will investigate further.";
  } else if (department === 'IT') {
    solution += "try restarting your device and ensuring all software is updated to the latest version. If the issue persists, our IT team will investigate further.";
  } else if (department === 'HR') {
    solution += "please check the employee handbook for initial guidance. A member of our HR team will contact you shortly to address your specific concerns.";
  } else if (department === 'Finance') {
    solution += "please verify all the payment information is correct and try again. For further assistance, our finance team will review your case.";
  } else {
    solution += "our team will review your issue shortly. In the meantime, please check our knowledge base for possible solutions to common problems.";
  }
  
  return solution;
};