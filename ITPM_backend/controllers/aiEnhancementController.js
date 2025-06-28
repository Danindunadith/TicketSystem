import axios from 'axios';
import dotenv from 'dotenv';
import Ticket from '../models/ticket.js';

dotenv.config();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Enhanced AI Controller for Predictive Categorization and Automated Responses
export const predictTicketCategory = async (req, res) => {
  try {
    const { subject, description, department } = req.body;
    
    // Combine text for analysis
    const text = `${subject} ${description}`;
    
    // Use zero-shot classification model for category prediction
    const classificationModel = 'facebook/bart-large-mnli';
    
    // Define possible categories based on common IT support issues
    const candidateLabels = [
      'password reset',
      'software installation',
      'hardware issue',
      'network connectivity',
      'email problems',
      'system access',
      'account lockout',
      'performance issue',
      'data recovery',
      'security concern',
      'training request',
      'general inquiry'
    ];
    
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${classificationModel}`,
      {
        inputs: text,
        parameters: { candidate_labels: candidateLabels }
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const classification = response.data;
    
    // Get the top 3 predicted categories with confidence scores
    const predictions = classification.labels.slice(0, 3).map((label, index) => ({
      category: label,
      confidence: classification.scores[index]
    }));
    
    // Generate automated response based on top category
    const automatedResponse = await generateAutomatedResponse(predictions[0].category, text);
    
    // Estimate resolution time based on category
    const estimatedResolutionTime = getEstimatedResolutionTime(predictions[0].category);
    
    // Get similar resolved tickets for better prediction
    const similarTickets = await findSimilarResolvedTickets(text, predictions[0].category);
    
    res.json({
      predictions,
      automatedResponse,
      estimatedResolutionTime,
      similarTickets: similarTickets.slice(0, 3), // Return top 3 similar tickets
      confidence: predictions[0].confidence
    });
    
  } catch (error) {
    console.error('Predictive categorization error:', error);
    
    // Fallback to rule-based categorization
    const fallbackCategory = categorizeTicketLocally(req.body.subject, req.body.description);
    const automatedResponse = await generateAutomatedResponse(fallbackCategory.category, req.body.subject + ' ' + req.body.description);
    
    res.json({
      predictions: [{ category: fallbackCategory.category, confidence: fallbackCategory.confidence }],
      automatedResponse,
      estimatedResolutionTime: getEstimatedResolutionTime(fallbackCategory.category),
      similarTickets: [],
      confidence: fallbackCategory.confidence,
      fromFallback: true
    });
  }
};

// Generate automated response based on ticket category
const generateAutomatedResponse = async (category, ticketText) => {
  const responses = {
    'password reset': {
      response: "I can help you with your password reset request! Here's what you can do immediately:\n\n1. Visit our self-service password reset portal\n2. Enter your email address or username\n3. Check your email for reset instructions\n4. If you don't receive the email within 5 minutes, check your spam folder\n\nIf you still can't reset your password, our IT team will assist you within 2 hours.",
      steps: [
        "Visit the password reset portal",
        "Enter your credentials",
        "Check your email for instructions",
        "Follow the reset link"
      ],
      priority: "Medium",
      escalate: false
    },
    'software installation': {
      response: "I see you need help with software installation. Here's what I recommend:\n\n1. Check if you have admin rights on your computer\n2. Verify the software is approved by your organization\n3. Download the software from the official source only\n4. Run the installer as administrator\n\nIf you encounter any errors during installation, please provide the error message and our team will help you within 4 hours.",
      steps: [
        "Verify admin rights",
        "Confirm software approval",
        "Download from official source",
        "Run installer as administrator"
      ],
      priority: "Low",
      escalate: false
    },
    'hardware issue': {
      response: "I understand you're experiencing a hardware issue. This requires immediate attention:\n\n1. Please describe the specific hardware component affected\n2. Note any error messages or unusual sounds\n3. Try restarting the device if safe to do so\n4. Check all cable connections\n\nOur hardware technician will contact you within 1 hour to schedule a repair or replacement.",
      steps: [
        "Identify affected hardware",
        "Document error messages",
        "Restart device safely",
        "Check connections"
      ],
      priority: "High",
      escalate: true
    },
    'network connectivity': {
      response: "Network connectivity issues can be frustrating. Let's troubleshoot:\n\n1. Check if other devices can connect to the network\n2. Restart your network adapter or WiFi\n3. Try connecting via ethernet cable\n4. Restart your router/modem if accessible\n\nIf the issue persists, our network team will investigate within 30 minutes.",
      steps: [
        "Test other devices",
        "Restart network adapter",
        "Try ethernet connection",
        "Restart router/modem"
      ],
      priority: "High",
      escalate: true
    },
    'email problems': {
      response: "Email issues can impact your productivity. Here's what to try:\n\n1. Check your internet connection\n2. Verify your email settings\n3. Clear your email client cache\n4. Try accessing email via web browser\n\nOur email support team will assist you within 1 hour if these steps don't resolve the issue.",
      steps: [
        "Check internet connection",
        "Verify email settings",
        "Clear cache",
        "Try web access"
      ],
      priority: "Medium",
      escalate: false
    },
    'security concern': {
      response: "Security concerns require immediate attention! Please:\n\n1. Do NOT click any suspicious links or download attachments\n2. Change your passwords immediately\n3. Scan your computer for malware\n4. Report any suspicious activity\n\nOur security team has been notified and will contact you within 15 minutes.",
      steps: [
        "Avoid suspicious links",
        "Change passwords",
        "Run malware scan",
        "Report suspicious activity"
      ],
      priority: "Critical",
      escalate: true
    }
  };
  
  const defaultResponse = {
    response: "Thank you for contacting support! I've received your request and it's being reviewed by our team.\n\nIn the meantime, please:\n1. Provide any additional details that might help\n2. Try basic troubleshooting if applicable\n3. Check our knowledge base for similar issues\n\nOur support team will respond within 4 hours.",
    steps: [
      "Provide additional details",
      "Try basic troubleshooting",
      "Check knowledge base"
    ],
    priority: "Medium",
    escalate: false
  };
  
  return responses[category] || defaultResponse;
};

// Get estimated resolution time based on category
const getEstimatedResolutionTime = (category) => {
  const times = {
    'password reset': '2 hours',
    'software installation': '4 hours',
    'hardware issue': '1-2 business days',
    'network connectivity': '2-4 hours',
    'email problems': '2-6 hours',
    'system access': '1-4 hours',
    'account lockout': '1 hour',
    'performance issue': '4-8 hours',
    'data recovery': '1-3 business days',
    'security concern': '15 minutes - 2 hours',
    'training request': '1-2 business days',
    'general inquiry': '1-2 business days'
  };
  
  return times[category] || '4-8 hours';
};

// Find similar resolved tickets using text similarity
const findSimilarResolvedTickets = async (currentText, category) => {
  try {
    // Get resolved tickets from the same category
    const resolvedTickets = await Ticket.find({
      status: { $in: ['Resolved', 'Closed'] },
      $or: [
        { aiPredictedCategory: category },
        { subject: { $regex: category.split(' ').join('|'), $options: 'i' } }
      ]
    }).limit(10);
    
    // Simple text similarity scoring
    const similarities = resolvedTickets.map(ticket => {
      const ticketText = `${ticket.subject} ${ticket.statement}`.toLowerCase();
      const currentTextLower = currentText.toLowerCase();
      
      // Count common words (simple similarity measure)
      const currentWords = currentTextLower.split(/\s+/);
      const ticketWords = ticketText.split(/\s+/);
      const commonWords = currentWords.filter(word => 
        word.length > 3 && ticketWords.includes(word)
      );
      
      const similarity = commonWords.length / Math.max(currentWords.length, ticketWords.length);
      
      return {
        ticket: {
          id: ticket.ticketid,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          resolutionTime: ticket.updatedAt - ticket.createdAt
        },
        similarity
      };
    });
    
    // Sort by similarity and return
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .map(item => item.ticket);
      
  } catch (error) {
    console.error('Error finding similar tickets:', error);
    return [];
  }
};

// Fallback rule-based categorization
const categorizeTicketLocally = (subject, description) => {
  const text = `${subject} ${description}`.toLowerCase();
  
  const categories = {
    'password reset': ['password', 'reset', 'forgot', 'login', 'sign in', 'access'],
    'software installation': ['install', 'software', 'application', 'program', 'download'],
    'hardware issue': ['hardware', 'device', 'monitor', 'keyboard', 'mouse', 'printer'],
    'network connectivity': ['network', 'internet', 'wifi', 'connection', 'connect'],
    'email problems': ['email', 'outlook', 'mail', 'inbox', 'send', 'receive'],
    'security concern': ['security', 'virus', 'malware', 'suspicious', 'hack', 'breach']
  };
  
  let bestMatch = { category: 'general inquiry', confidence: 0.3 };
  
  Object.entries(categories).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    const confidence = matches / keywords.length;
    
    if (confidence > bestMatch.confidence) {
      bestMatch = { category, confidence };
    }
  });
  
  return bestMatch;
};

// Enhanced sentiment analysis with emotion detection
export const analyzeTicketEmotion = async (req, res) => {
  try {
    const { text } = req.body;
    
    // Use emotion classification model
    const emotionModel = 'j-hartmann/emotion-english-distilroberta-base';
    
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${emotionModel}`,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const emotions = response.data[0];
    
    // Map emotions to support actions
    const primaryEmotion = emotions[0];
    const supportAction = mapEmotionToAction(primaryEmotion.label, primaryEmotion.score);
    
    res.json({
      emotions,
      emotion: primaryEmotion.label,  // Add this field that the comprehensive analysis expects
      primaryEmotion: primaryEmotion.label,
      intensity: primaryEmotion.score,
      supportAction,
      priority: getSupportPriority(primaryEmotion.label, primaryEmotion.score)
    });
    
  } catch (error) {
    console.error('Emotion analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze emotions' });
  }
};

// Map emotions to specific support actions
const mapEmotionToAction = (emotion, intensity) => {
  const actions = {
    'anger': {
      action: 'Priority escalation and immediate human support',
      message: 'I understand your frustration. Let me connect you with a senior support agent immediately.',
      escalate: true
    },
    'frustration': {
      action: 'Empathetic response and faster resolution',
      message: 'I can see this issue is causing frustration. Let me prioritize your request.',
      escalate: intensity > 0.7
    },
    'sadness': {
      action: 'Compassionate support and regular updates',
      message: 'I\'m sorry you\'re experiencing this issue. I\'ll personally monitor your case.',
      escalate: false
    },
    'fear': {
      action: 'Reassurance and security validation',
      message: 'Your concerns are valid. Let me ensure your security and provide clear guidance.',
      escalate: intensity > 0.6
    },
    'joy': {
      action: 'Standard support with positive reinforcement',
      message: 'Great to hear from you! I\'ll make sure to resolve this quickly.',
      escalate: false
    }
  };
  
  return actions[emotion] || {
    action: 'Standard support response',
    message: 'Thank you for contacting support. I\'ll help resolve your issue.',
    escalate: false
  };
};

// Get support priority based on emotion
const getSupportPriority = (emotion, intensity) => {
  if (['anger', 'frustration'].includes(emotion) && intensity > 0.7) {
    return 'Critical';
  } else if (['anger', 'frustration', 'fear'].includes(emotion) && intensity > 0.5) {
    return 'High';
  } else if (intensity > 0.6) {
    return 'Medium';
  }
  return 'Low';
};

// Get AI-powered insights for support agents
export const getTicketInsights = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    // Analyze ticket content for insights
    const text = `${ticket.subject} ${ticket.statement}`;
    
    // Get category prediction
    const categoryResponse = await axios.post('/api/ai/predict-category', {
      subject: ticket.subject,
      description: ticket.statement,
      department: ticket.department
    });
    
    // Get emotion analysis
    const emotionResponse = await axios.post('/api/ai/analyze-emotion', {
      text: text
    });
    
    // Find patterns in customer's other tickets
    const customerHistory = await Ticket.find({ email: ticket.email })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Generate insights
    const insights = {
      ticketAnalysis: {
        predictedCategory: categoryResponse.data.predictions[0],
        emotions: emotionResponse.data,
        urgencyLevel: calculateUrgencyLevel(ticket, emotionResponse.data),
        estimatedResolution: categoryResponse.data.estimatedResolutionTime
      },
      customerPattern: {
        totalTickets: customerHistory.length,
        recentIssues: customerHistory.map(t => t.subject),
        isRepeatedIssue: checkForRepeatedIssues(customerHistory),
        customerSatisfaction: calculateCustomerSatisfaction(customerHistory)
      },
      recommendations: generateAgentRecommendations(ticket, categoryResponse.data, emotionResponse.data)
    };
    
    res.json(insights);
    
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};

// Calculate urgency level based on multiple factors
const calculateUrgencyLevel = (ticket, emotionData) => {
  let urgencyScore = 0;
  
  // Base urgency from priority
  const priorityScores = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
  urgencyScore += priorityScores[ticket.priority] || 2;
  
  // Add emotion factor
  if (emotionData.primaryEmotion === 'anger' && emotionData.intensity > 0.7) {
    urgencyScore += 2;
  } else if (['frustration', 'fear'].includes(emotionData.primaryEmotion)) {
    urgencyScore += 1;
  }
  
  // Add time factor (older tickets get higher urgency)
  const hoursSinceCreation = (Date.now() - new Date(ticket.createdAt)) / (1000 * 60 * 60);
  if (hoursSinceCreation > 24) urgencyScore += 1;
  if (hoursSinceCreation > 72) urgencyScore += 1;
  
  // Convert to urgency level
  if (urgencyScore >= 6) return 'Critical';
  if (urgencyScore >= 4) return 'High';
  if (urgencyScore >= 2) return 'Medium';
  return 'Low';
};

// Check for repeated issues
const checkForRepeatedIssues = (tickets) => {
  if (tickets.length < 2) return false;
  
  const recentSubjects = tickets.slice(0, 3).map(t => t.subject.toLowerCase());
  return recentSubjects.some((subject, index) => 
    recentSubjects.slice(index + 1).some(other => 
      subject.includes(other) || other.includes(subject)
    )
  );
};

// Calculate customer satisfaction based on ticket history
const calculateCustomerSatisfaction = (tickets) => {
  if (tickets.length === 0) return 'Unknown';
  
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved');
  const resolutionRate = resolvedTickets.length / tickets.length;
  
  const avgSentiment = tickets
    .filter(t => t.sentimentScore)
    .reduce((sum, t) => sum + t.sentimentScore, 0) / tickets.length;
  
  if (resolutionRate > 0.8 && avgSentiment > 0.6) return 'High';
  if (resolutionRate > 0.6 && avgSentiment > 0.4) return 'Medium';
  return 'Low';
};

// Generate recommendations for support agents
const generateAgentRecommendations = (ticket, categoryData, emotionData) => {
  const recommendations = [];
  
  // Category-based recommendations
  if (categoryData.confidence > 0.8) {
    recommendations.push({
      type: 'Category',
      message: `High confidence category prediction: ${categoryData.predictions[0].category}`,
      action: 'Use category-specific resolution templates'
    });
  }
  
  // Emotion-based recommendations
  if (emotionData.intensity > 0.7) {
    recommendations.push({
      type: 'Emotion',
      message: `Customer shows strong ${emotionData.primaryEmotion}`,
      action: emotionData.supportAction.message
    });
  }
  
  // Similar tickets recommendations
  if (categoryData.similarTickets && categoryData.similarTickets.length > 0) {
    recommendations.push({
      type: 'Similar Cases',
      message: `Found ${categoryData.similarTickets.length} similar resolved tickets`,
      action: 'Review similar resolutions for guidance'
    });
  }
  
  return recommendations;
};

// NEW: AI ticket analysis specifically for chatbot interactions
export const analyzeTicketForChatbot = async (req, res) => {
  try {
    const { message, category } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required for analysis',
        success: false 
      });
    }

    // Perform sentiment analysis
    const sentimentResponse = await axios.post(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
      { inputs: message },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Predict category if not provided
    let predictedCategory = category;
    let categoryConfidence = 1.0;
    
    if (!category) {
      const classificationModel = 'facebook/bart-large-mnli';
      const candidateLabels = [
        'password reset', 'software installation', 'hardware issue',
        'network connectivity', 'email problems', 'system access',
        'account lockout', 'performance issue', 'data recovery',
        'security concern', 'training request', 'general inquiry'
      ];

      const categoryResponse = await axios.post(
        `https://api-inference.huggingface.co/models/${classificationModel}`,
        {
          inputs: message,
          parameters: { candidate_labels: candidateLabels }
        },
        {
          headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      predictedCategory = categoryResponse.data.labels[0];
      categoryConfidence = categoryResponse.data.scores[0];
    }

    // Get priority based on sentiment and category
    const sentiment = sentimentResponse.data[0];
    const urgencyLevel = calculateChatbotUrgencyLevel(sentiment, predictedCategory);
    
    // Generate smart response
    const smartResponse = generateSmartChatbotResponse(predictedCategory, sentiment, message);

    res.json({
      success: true,
      analysis: {
        category: predictedCategory,
        categoryConfidence,
        sentiment: {
          label: sentiment.label,
          score: sentiment.score
        },
        urgency: urgencyLevel,
        estimatedResolution: getEstimatedResolutionTime(predictedCategory)
      },
      response: smartResponse,
      suggestions: getChatbotSuggestions(predictedCategory)
    });

  } catch (error) {
    console.error('Chatbot AI analysis error:', error);
    
    // Fallback analysis
    const fallbackCategory = categorizeTicketLocally(req.body.message || '', '');
    const fallbackResponse = generateSmartChatbotResponse(fallbackCategory.category, null, req.body.message);
    
    res.json({
      success: true,
      analysis: {
        category: fallbackCategory.category,
        categoryConfidence: fallbackCategory.confidence,
        sentiment: { label: 'NEUTRAL', score: 0.5 },
        urgency: 'Medium',
        estimatedResolution: getEstimatedResolutionTime(fallbackCategory.category)
      },
      response: fallbackResponse,
      suggestions: getChatbotSuggestions(fallbackCategory.category),
      fromFallback: true
    });
  }
};

// NEW: Provide instant help suggestions based on user query
export const provideInstantHelp = async (req, res) => {
  try {
    const { query, context } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Query is required for instant help',
        success: false 
      });
    }

    // Use question-answering model for instant help
    const qaModel = 'deepset/roberta-base-squad2';
    
    // Create knowledge base context
    const knowledgeBase = `
    Password Reset: To reset your password, visit the self-service portal, enter your email, and follow the instructions sent to your email.
    Software Installation: Ensure you have admin rights, download from official sources, and run as administrator.
    Network Issues: Check other devices, restart network adapter, try ethernet, restart router if needed.
    Email Problems: Check internet, verify settings, clear cache, try web access.
    Hardware Issues: Document symptoms, check connections, restart if safe, contact technician for repairs.
    Account Lockout: Wait 30 minutes for automatic unlock or contact IT immediately.
    System Access: Verify credentials, check permissions, ensure VPN connection if remote.
    Performance Issues: Close unnecessary programs, restart computer, check disk space, run system cleanup.
    Data Recovery: Stop using the device immediately, contact IT team, do not attempt recovery yourself.
    Security Concerns: Report immediately, change passwords, scan for malware, document incident.
    `;

    const contextText = context || knowledgeBase;
    
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${qaModel}`,
      {
        inputs: {
          question: query,
          context: contextText
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data;
    
    // Generate additional suggestions
    const additionalSuggestions = generateInstantHelpSuggestions(query);
    
    res.json({
      success: true,
      answer: answer.answer,
      confidence: answer.score,
      suggestions: additionalSuggestions,
      relatedTopics: getRelatedHelpTopics(query),
      escalationRecommended: answer.score < 0.3
    });

  } catch (error) {
    console.error('Instant help error:', error);
    
    // Fallback to predefined responses
    const fallbackHelp = getFallbackInstantHelp(req.body.query);
    
    res.json({
      success: true,
      answer: fallbackHelp.answer,
      confidence: 0.8,
      suggestions: fallbackHelp.suggestions,
      relatedTopics: fallbackHelp.relatedTopics,
      escalationRecommended: false,
      fromFallback: true
    });
  }
};

// Helper function to calculate urgency level for chatbot
const calculateChatbotUrgencyLevel = (sentiment, category) => {
  const highUrgencyCategories = ['hardware issue', 'network connectivity', 'security concern', 'system access'];
  const mediumUrgencyCategories = ['email problems', 'account lockout', 'performance issue'];
  
  let urgency = 'Low';
  
  if (highUrgencyCategories.includes(category)) {
    urgency = 'High';
  } else if (mediumUrgencyCategories.includes(category)) {
    urgency = 'Medium';
  }
  
  // Adjust based on sentiment
  if (sentiment && sentiment.label === 'NEGATIVE' && sentiment.score > 0.8) {
    urgency = urgency === 'Low' ? 'Medium' : 'High';
  }
  
  return urgency;
};

// Helper function to generate smart chatbot responses
const generateSmartChatbotResponse = (category, sentiment, message) => {
  const responses = {
    'password reset': "I can help you reset your password! I'll guide you through the self-service portal process, which usually takes just a few minutes.",
    'software installation': "I see you need help with software installation. Let me provide you with the proper steps to ensure a successful installation.",
    'hardware issue': "Hardware issues need immediate attention. I'll help you troubleshoot and escalate to our technical team if needed.",
    'network connectivity': "Network problems can be frustrating! Let me help you diagnose and resolve this connectivity issue.",
    'email problems': "Email issues can impact your productivity. I'll provide troubleshooting steps to get you back online quickly.",
    'system access': "Access issues need quick resolution. Let me help you regain access to your systems.",
    'account lockout': "Account lockouts can be resolved quickly. I'll guide you through the unlock process.",
    'performance issue': "Performance problems slow down your work. Let me help optimize your system performance.",
    'data recovery': "Data recovery is critical and needs careful handling. I'll connect you with our data recovery specialists immediately.",
    'security concern': "Security issues require immediate attention. I'll escalate this to our security team and provide immediate steps to secure your account.",
    'general inquiry': "I'm here to help with your inquiry. Let me provide you with the information you need."
  };
  
  let baseResponse = responses[category] || responses['general inquiry'];
  
  // Adjust response based on sentiment
  if (sentiment && sentiment.label === 'NEGATIVE' && sentiment.score > 0.7) {
    baseResponse = "I understand this is frustrating for you. " + baseResponse + " I'll make sure we resolve this as quickly as possible.";
  }
  
  return baseResponse;
};

// Helper function to get chatbot suggestions
const getChatbotSuggestions = (category) => {
  const suggestions = {
    'password reset': [
      "Visit self-service password portal",
      "Check email for reset instructions",
      "Contact IT if email not received",
      "Try alternative email address"
    ],
    'software installation': [
      "Check admin privileges",
      "Verify software approval",
      "Download from official source",
      "Run installer as administrator"
    ],
    'hardware issue': [
      "Document error messages",
      "Check all connections",
      "Restart device safely",
      "Contact hardware support"
    ],
    'network connectivity': [
      "Test other devices",
      "Restart network adapter",
      "Try ethernet connection",
      "Restart router/modem"
    ],
    'general inquiry': [
      "Provide more details",
      "Check knowledge base",
      "Contact specific department",
      "Schedule a call with support"
    ]
  };
  
  return suggestions[category] || suggestions['general inquiry'];
};

// Helper function to generate instant help suggestions
const generateInstantHelpSuggestions = (query) => {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('password')) {
    return [
      "Reset password via self-service portal",
      "Check password requirements",
      "Contact IT for account unlock",
      "Enable two-factor authentication"
    ];
  } else if (queryLower.includes('email')) {
    return [
      "Check internet connection",
      "Verify email settings",
      "Clear email cache",
      "Try webmail access"
    ];
  } else if (queryLower.includes('software') || queryLower.includes('install')) {
    return [
      "Verify admin rights",
      "Check software whitelist",
      "Download from official source",
      "Run as administrator"
    ];
  } else if (queryLower.includes('network') || queryLower.includes('internet')) {
    return [
      "Restart network adapter",
      "Check ethernet cable",
      "Test with other devices",
      "Contact network support"
    ];
  }
  
  return [
    "Contact IT support",
    "Check knowledge base",
    "Submit a ticket",
    "Schedule support call"
  ];
};

// Helper function to get related help topics
const getRelatedHelpTopics = (query) => {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('password')) {
    return ['Account Security', 'Two-Factor Authentication', 'Account Recovery'];
  } else if (queryLower.includes('email')) {
    return ['Email Settings', 'Spam Management', 'Email Backup'];
  } else if (queryLower.includes('software')) {
    return ['Software Updates', 'License Management', 'Compatibility Issues'];
  } else if (queryLower.includes('network')) {
    return ['VPN Setup', 'WiFi Configuration', 'Firewall Settings'];
  }
  
  return ['General Support', 'Knowledge Base', 'Contact Information'];
};

// Helper function to provide fallback instant help
const getFallbackInstantHelp = (query) => {
  const queryLower = (query || '').toLowerCase();
  
  if (queryLower.includes('password')) {
    return {
      answer: "For password issues, please visit our self-service password reset portal or contact IT support.",
      suggestions: ["Reset Password", "Contact IT", "Check Account Status", "Update Security Info"],
      relatedTopics: ["Account Security", "Password Policy", "Two-Factor Auth"]
    };
  } else if (queryLower.includes('email')) {
    return {
      answer: "For email problems, try checking your internet connection and email settings first.",
      suggestions: ["Check Connection", "Verify Settings", "Clear Cache", "Contact Email Support"],
      relatedTopics: ["Email Configuration", "Spam Management", "Email Backup"]
    };
  }
  
  return {
    answer: "I'd be happy to help! For the best assistance, please provide more details about your issue or contact our IT support team.",
    suggestions: ["Provide More Details", "Contact Support", "Check Knowledge Base", "Submit Ticket"],
    relatedTopics: ["General Support", "Knowledge Base", "Contact Info"]
  };
};

// NEW: Get categorization analytics for dashboard
export const getCategorizationAnalytics = async (req, res) => {
  try {
    console.log('Fetching categorization analytics...');
    const { timeRange = 'week' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    // Get tickets within date range
    const tickets = await Ticket.find({
      createdAt: { $gte: startDate }
    }).lean();
    
    if (tickets.length === 0) {
      return res.json({
        totalTickets: 0,
        categorizedTickets: 0,
        categorizationRate: 0,
        averageConfidence: 0,
        topCategories: [],
        timeRange
      });
    }
    
    // Filter categorized tickets
    const categorizedTickets = tickets.filter(ticket => 
      ticket.aiPredictedCategory && ticket.aiPredictedCategory !== 'unknown'
    );
    
    // Calculate category distribution
    const categoryCount = {};
    let totalConfidence = 0;
    
    categorizedTickets.forEach(ticket => {
      const category = ticket.aiPredictedCategory;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      
      // Add confidence score (default to 0.8 if not stored)
      totalConfidence += ticket.categoryConfidence || 0.8;
    });
    
    // Get top categories
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([category, count]) => ({
        name: category,
        count,
        percentage: Math.round((count / categorizedTickets.length) * 100)
      }));
    
    // Calculate average confidence (ensure it's between 0-1, then convert to percentage)
    let avgConfidence = 0;
    if (categorizedTickets.length > 0) {
      avgConfidence = totalConfidence / categorizedTickets.length;
      // If confidence is stored as percentage (>1), convert to decimal first
      if (avgConfidence > 1) {
        avgConfidence = avgConfidence / 100;
      }
      // Convert to percentage for display
      avgConfidence = Math.round(avgConfidence * 100);
    }

    const analytics = {
      totalTickets: tickets.length,
      categorizedTickets: categorizedTickets.length,
      categorizationRate: Math.round((categorizedTickets.length / tickets.length) * 100),
      averageConfidence: avgConfidence,
      topCategories,
      timeRange
    };
    
    console.log('Categorization analytics calculated:', analytics);
    res.json(analytics);
    
  } catch (error) {
    console.error('Error fetching categorization analytics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch categorization analytics',
      totalTickets: 0,
      categorizedTickets: 0,
      categorizationRate: 0,
      averageConfidence: 0,
      topCategories: [],
      timeRange: req.query.timeRange || 'week'
    });
  }
};

// Comprehensive ticket analysis for CreateTicket and Chatbot
export const comprehensiveTicketAnalysis = async (req, res) => {
  try {
    const { title, description, priority, message } = req.body;
    
    // Use either title+description or message
    const analysisText = message || `${title || ''} ${description || ''}`.trim();
    
    if (!analysisText) {
      return res.status(400).json({ 
        error: 'Title and description or message is required for analysis',
        success: false 
      });
    }

    console.log('Running comprehensive analysis for:', analysisText.substring(0, 100) + '...');

    // Run all AI analyses in parallel
    const [sentimentResponse, categoryResponse, emotionResponse] = await Promise.all([
      // Sentiment analysis
      axios.post(
        'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
        { inputs: analysisText },
        {
          headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      ).catch(err => {
        console.warn('Sentiment analysis failed, using fallback');
        return { data: [{ label: 'NEUTRAL', score: 0.5 }] };
      }),

      // Category prediction
      axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
        {
          inputs: analysisText,
          parameters: { 
            candidate_labels: [
              'password reset', 'software installation', 'hardware issue',
              'network connectivity', 'email problems', 'system access',
              'account lockout', 'performance issue', 'data recovery',
              'security concern', 'training request', 'general inquiry',
              'payroll issue', 'billing inquiry', 'technical support'
            ]
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      ).catch(err => {
        console.warn('Category prediction failed, using fallback');
        return { data: { labels: ['general inquiry'], scores: [0.8] } };
      }),

      // Emotion analysis
      axios.post(
        'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base',
        { inputs: analysisText },
        {
          headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      ).catch(err => {
        console.warn('Emotion analysis failed, using fallback');
        return { data: [
          { label: 'neutral', score: 0.7 },
          { label: 'joy', score: 0.2 },
          { label: 'sadness', score: 0.1 }
        ]};
      })
    ]);

    // Process results
    const sentiment = sentimentResponse.data[0];
    const predictedCategory = categoryResponse.data.labels[0];
    const categoryConfidence = categoryResponse.data.scores[0];
    
    // Handle nested emotion response structure
    console.log('Emotion response data:', emotionResponse.data);
    const emotionData = Array.isArray(emotionResponse.data[0]) ? emotionResponse.data[0] : emotionResponse.data;
    
    const detectedEmotion = emotionData[0]?.label;
    const emotionIntensity = emotionData[0]?.score;
    
    // Convert emotion response to object format
    const emotions = {};
    if (Array.isArray(emotionData) && emotionData.length > 0) {
      emotionData.forEach(emotion => {
        emotions[emotion.label] = emotion.score;
      });
    }

    console.log('Processed emotion values:', { detectedEmotion, emotionIntensity, emotions });

    // Calculate derived fields
    const sentimentScore = sentiment.score;
    const aiSuggestedPriority = calculateAISuggestedPriority(sentiment, detectedEmotion, emotionIntensity);
    const urgency = calculateChatbotUrgencyLevel(sentiment, predictedCategory);
    const shouldEscalate = shouldEscalateTicket(sentiment, detectedEmotion, emotionIntensity, predictedCategory);
    const estimatedResolutionTime = getEstimatedResolutionTime(predictedCategory);
    const supportAction = determineSupportAction(predictedCategory, sentiment);
    const automatedResponse = generateSimpleAutomatedResponse(predictedCategory, sentiment);
    const chatbotSuggestions = getChatbotSuggestions(predictedCategory);
    const aiInsights = generateAIInsights(sentiment, detectedEmotion, predictedCategory, categoryConfidence);

    // Create comprehensive analysis object
    const comprehensiveAnalysis = {
      sentiment: sentiment.label,
      sentimentScore,
      predictedCategory,
      categoryConfidence,
      aiSuggestedPriority,
      urgency,
      detectedEmotion,
      emotionIntensity,
      emotions,
      automatedResponse,
      estimatedResolutionTime,
      supportAction,
      chatbotSuggestions,
      shouldEscalate,
      aiInsights
    };

    console.log('Comprehensive analysis completed:', Object.keys(comprehensiveAnalysis));

    res.json({
      success: true,
      ...comprehensiveAnalysis
    });

  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    
    // Fallback response with basic analysis
    res.json({
      success: true,
      sentiment: 'NEUTRAL',
      sentimentScore: 0.5,
      predictedCategory: 'general inquiry',
      categoryConfidence: 0.8,
      aiSuggestedPriority: priority || 'Medium',
      urgency: 'Medium',
      detectedEmotion: 'neutral',
      emotionIntensity: 0.5,
      emotions: { neutral: 0.7, joy: 0.2, sadness: 0.1 },
      automatedResponse: 'Thank you for contacting us. We will review your request and respond accordingly.',
      estimatedResolutionTime: 24,
      supportAction: 'Standard Review',
      chatbotSuggestions: ['Check our FAQ', 'Contact support', 'Try troubleshooting guide'],
      shouldEscalate: false,
      aiInsights: 'Standard ticket requiring routine processing.',
      fromFallback: true
    });
  }
};

// Helper functions
function calculateAISuggestedPriority(sentiment, emotion, intensity) {
  if (sentiment.label === 'NEGATIVE' && ['anger', 'fear'].includes(emotion) && intensity > 0.7) {
    return 'Critical';
  }
  if (sentiment.label === 'NEGATIVE' && intensity > 0.6) {
    return 'High';
  }
  if (sentiment.label === 'POSITIVE') {
    return 'Low';
  }
  return 'Medium';
}

function shouldEscalateTicket(sentiment, emotion, intensity, category) {
  const criticalEmotions = ['anger', 'fear', 'sadness'];
  const criticalCategories = ['security concern', 'data recovery', 'system access'];
  
  return (
    (sentiment.label === 'NEGATIVE' && criticalEmotions.includes(emotion) && intensity > 0.7) ||
    criticalCategories.includes(category) ||
    intensity > 0.8
  );
}

function determineSupportAction(category, sentiment) {
  const actionMap = {
    'password reset': 'Password Reset Process',
    'software installation': 'Software Support',
    'hardware issue': 'Hardware Diagnostics',
    'network connectivity': 'Network Troubleshooting',
    'email problems': 'Email Configuration',
    'system access': 'Access Management',
    'account lockout': 'Account Recovery',
    'security concern': 'Security Investigation',
    'data recovery': 'Data Recovery Process'
  };
  
  return actionMap[category] || 'Standard Review';
}

function generateSimpleAutomatedResponse(category, sentiment) {
  const responses = {
    'password reset': 'I can help you reset your password. Please check your email for the reset link, or contact our IT support team.',
    'software installation': 'For software installation assistance, please ensure you have administrator privileges and follow our installation guide.',
    'hardware issue': 'I understand you\'re experiencing hardware issues. Please try basic troubleshooting steps or contact our technical team.',
    'email problems': 'Email issues can be frustrating. Please check your internet connection and email settings, or contact our support team.',
    'general inquiry': 'Thank you for reaching out. We\'ve received your inquiry and will respond as soon as possible.'
  };
  
  const baseResponse = responses[category] || responses['general inquiry'];
  
  if (sentiment.label === 'NEGATIVE') {
    return `I understand this situation is frustrating. ${baseResponse} We're here to help resolve this quickly.`;
  }
  
  return baseResponse;
}

function generateAIInsights(sentiment, emotion, category, confidence) {
  const insights = [];
  
  if (confidence < 0.6) {
    insights.push('Low categorization confidence - may need manual review');
  }
  
  if (sentiment.label === 'NEGATIVE' && ['anger', 'frustration'].includes(emotion)) {
    insights.push('Customer appears frustrated - prioritize for quick response');
  }
  
  if (['security concern', 'data recovery'].includes(category)) {
    insights.push('High-priority category - requires specialized attention');
  }
  
  return insights.length > 0 ? insights.join('; ') : 'Standard ticket requiring routine processing';
}
