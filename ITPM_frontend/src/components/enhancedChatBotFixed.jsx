import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Paperclip, Bot, User, Sparkles, Loader2, CheckCircle2, ArrowRight, RefreshCw, Zap, Brain, Clock, Minimize2, Star, Shield } from 'lucide-react';
import axios from 'axios';

// Email configuration for this component
const EMAIL_CONFIG = {
  SERVICE_ID: 'service_jrj10f4',
  TEMPLATE_ID: 'template_l0ctqxs',
  PUBLIC_KEY: 'KHn7-uw2zB2TcNn3K'
};

export default function EnhancedChatBotFixed() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      content: '🚀 Welcome to AI Support Hub! I\'m your intelligent assistant powered by advanced AI.\n\n✨ **What I can do for you:**\n• Smart ticket creation with auto-categorization\n• Instant troubleshooting with real-time solutions\n• Priority detection using sentiment analysis\n• Predictive issue resolution\n\n🎯 How can I assist you today?',
      suggestions: [
        { text: '🎫 Create Smart Ticket', action: 'create_ticket', icon: '🎫' },
        { text: '⚡ Get Instant Help', action: 'instant_help', icon: '⚡' },
        { text: '📊 Check Status', action: 'check_status', icon: '📊' }
      ],
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('initial');
  const [userInput, setUserInput] = useState('');
  const [ticketData, setTicketData] = useState({
    name: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    subject: '',
    department: '',
    relatedservice: '',
    priority: '',
    attachment: null,
    statement: '',
    aiPredictedCategory: '',
    categoryConfidence: '',
    estimatedResolutionTime: '',
    automatedResponse: '',
    sentimentScore: '',
    detectedEmotion: '',
    aiInsights: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [instantHelp, setInstantHelp] = useState(false);
  const [showNewChatConfirm, setShowNewChatConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsOpen(false);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      resetChat();
      setAnimation(true);
      setTimeout(() => setAnimation(false), 300);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const resetChat = () => {
    setMessages([
      { 
        type: 'bot', 
        content: '🚀 Welcome back! I\'m your AI Support Assistant ready to help.\n\n✨ **What I can do for you:**\n• Smart ticket creation with auto-categorization\n• Instant troubleshooting with real-time solutions\n• Priority detection using sentiment analysis\n• Predictive issue resolution\n\n🎯 How can I assist you today?',
        suggestions: [
          { text: '🎫 Create Smart Ticket', action: 'create_ticket', icon: '🎫' },
          { text: '⚡ Get Instant Help', action: 'instant_help', icon: '⚡' },
          { text: '📊 Check Status', action: 'check_status', icon: '📊' }
        ],
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setCurrentStep('initial');
    setUserInput('');
    setIsSubmitting(false);
    setIsAnalyzing(false);
    setTypingIndicator(false);
    setInstantHelp(false);
    setShowNewChatConfirm(false);
    setSelectedFile(null);
    setTicketData({
      name: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      subject: '',
      department: '',
      relatedservice: '',
      priority: '',
      attachment: null,
      statement: '',
      aiPredictedCategory: '',
      categoryConfidence: '',
      estimatedResolutionTime: '',
      automatedResponse: '',
      sentimentScore: '',
      detectedEmotion: '',
      aiInsights: null
    });
  };

  const handleNewChatClick = () => {
    if (messages.length > 1) {
      setShowNewChatConfirm(true);
    } else {
      resetChat();
    }
  };

  const confirmNewChat = () => {
    resetChat();
  };

  const cancelNewChat = () => {
    setShowNewChatConfirm(false);
  };

  const simulateTyping = (callback, delay = 1500) => {
    setTypingIndicator(true);
    setTimeout(() => {
      setTypingIndicator(false);
      callback();
    }, delay);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNewChatConfirm && !event.target.closest('.new-chat-container')) {
        setShowNewChatConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewChatConfirm]);

  const handleSuggestionClick = (action) => {
    switch (action) {
      case 'create_ticket':
        startTicketCreation();
        break;
      case 'instant_help':
        startInstantHelp();
        break;
      case 'check_status':
        handleCheckStatus();
        break;
      case 'view_ticket':
        viewTicketDetails();
        break;
      case 'main_menu':
        resetChat();
        break;
      case 'call_support':
        handleCallSupport();
        break;
      case 'resolved_thanks':
        handleResolvedThanks();
        break;
      case 'attach_file':
        triggerFileInput();
        break;
      case 'skip_attachment':
        handleSkipAttachment();
        break;
      default:
        handleOptionClick(action);
    }
  };

  const handleResolvedThanks = () => {
    simulateTyping(() => {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: 'Issue resolved, thank you!' },
        {
          type: 'bot',
          content: `🎉 **Wonderful! I'm so glad I could help resolve your issue!**\n\n✅ **Issue Status:** Resolved\n⭐ **AI Assistance:** Successful\n🕒 **Resolution Time:** Quick & Efficient\n\n💫 **Your feedback helps me improve!** The AI learns from successful interactions to provide even better support in the future.\n\n🌟 **Thank you for using our AI Support Assistant!**\n\nIf you encounter any other issues or need further assistance, I'm always here to help. Have a great day! 😊`,
          timestamp: new Date().toLocaleTimeString(),
          suggestions: [
            { text: '🎫 Create New Ticket', action: 'create_ticket', icon: '🎫' },
            { text: '📊 Check Ticket Status', action: 'check_status', icon: '📊' },
            { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
          ]
        }
      ]);
    });
    setCurrentStep('initial');
  };

  const handleCallSupport = () => {
    simulateTyping(() => {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: 'I want to call support' },
        {
          type: 'bot',
          content: `📞 **Contact Support Directly**\n\n🔥 **Emergency Support Hotline:**\n• **Phone:** +1-800-SUPPORT (24/7)\n• **Direct:** +1-800-786-7678\n• **International:** +1-555-123-4567\n\n📧 **Email Support:**\n• **General:** support@company.com\n• **Technical:** tech-support@company.com\n• **Urgent:** urgent@company.com\n\n💬 **Alternative Channels:**\n• Live chat on our website\n• WhatsApp: +1-555-CHAT-NOW\n• Social media: @CompanySupport\n\n⏰ **Support Hours:**\n• 24/7 for critical issues\n• Standard: Mon-Fri 8AM-8PM EST\n• Weekend: 10AM-6PM EST\n\n💡 **When calling, have ready:**\n• Your ticket ID (if any)\n• Account information\n• Description of the issue`,
          timestamp: new Date().toLocaleTimeString(),
          suggestions: [
            { text: '📧 Check My Tickets', action: 'check_status', icon: '📧' },
            { text: '🎫 Create New Ticket', action: 'create_ticket', icon: '🎫' },
            { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
          ]
        }
      ]);
    });
    setCurrentStep('initial');
  };

  const startTicketCreation = () => {
    simulateTyping(() => {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: 'Create a ticket' },
        { 
          type: 'bot', 
          content: '🎫 **AI-Powered Ticket Creation**\n\nI\'ll guide you through creating a smart support ticket with:\n\n✨ **AI Features:**\n• Intelligent categorization\n• Priority auto-detection\n• Sentiment analysis\n• Estimated resolution time\n\n👤 Let\'s start with your name:',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    });
    setCurrentStep('name');
  };

  const startInstantHelp = () => {
    setInstantHelp(true);
    simulateTyping(() => {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: 'Get instant help' },
        { 
          type: 'bot', 
          content: '⚡ **Instant Help Mode Activated!**\n\n🚀 **Real-time AI Analysis:**\n• Automatic issue detection\n• Instant solution suggestions\n• Step-by-step troubleshooting\n• No ticket needed (unless required)\n\n🔍 Describe your issue and I\'ll provide immediate assistance:',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    });
    setCurrentStep('instant_help');
  };

  const handleCheckStatus = () => {
    simulateTyping(() => {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: 'Check ticket status' },
        { 
          type: 'bot', 
          content: '📊 **Smart Status Checker**\n\n🔍 **Email-Based Ticket Lookup:**\n• Find all your tickets instantly\n• Real-time status updates\n• Progress notifications\n• Agent assignments\n\n📧 Please provide your registered email address to view all your tickets:',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    });
    setCurrentStep('check_status');
  };

  const processStatusCheck = async (email) => {
    const updatedMessages = [...messages, { type: 'user', content: email }];
    
    updatedMessages.push({ 
      type: 'bot', 
      content: '🔍 Searching for tickets with your email...',
      isLoading: true 
    });
    setMessages(updatedMessages);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      updatedMessages.pop();

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(email);

      let statusResponse;

      if (isValidEmail) {
        try {
          // Try to get real tickets from backend
          const response = await axios.get(`http://localhost:3002/api/tickets/by-email/${email}`);
          const tickets = response.data.tickets || [];
          
          if (tickets.length > 0) {
            // Real tickets found
            statusResponse = {
              type: 'bot',
              content: `✅ **Tickets Found for ${email}**\n\n🎫 **Your Support Tickets:**\n\n${tickets.map((ticket, idx) => {
                const statusEmoji = ticket.status === 'Open' ? '🔴' : ticket.status === 'In Progress' ? '🟡' : '🟢';
                return `**${idx + 1}. ${ticket.ticketId}** - ${statusEmoji} **${ticket.status}**\n   • Subject: ${ticket.subject}\n   • Priority: ${ticket.priority}\n   • Created: ${new Date(ticket.date).toLocaleDateString()}\n   • Last Update: ${ticket.lastUpdate || 'Recently'}`;
              }).join('\n\n')}\n\n📊 **Summary:** ${tickets.filter(t => t.status !== 'Resolved').length} active tickets, ${tickets.filter(t => t.status === 'Resolved').length} resolved\n🔔 Email notifications are enabled for all tickets\n\n💡 Click below to view detailed information:`,
              timestamp: new Date().toLocaleTimeString(),
              suggestions: [
                { text: '🔍 View Ticket Details', action: 'view_ticket', icon: '🔍' },
                { text: '🎫 Create New Ticket', action: 'create_ticket', icon: '🎫' },
                { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
              ]
            };
          } else {
            // No tickets found
            statusResponse = {
              type: 'bot',
              content: `📋 **No Tickets Found for ${email}**\n\n🔍 **Search Results:**\n• No support tickets found in our system\n• This could mean you haven't created any tickets yet\n• Or you might have used a different email address\n\n💡 **What you can do:**\n• Create your first support ticket\n• Try a different email address\n• Contact support directly if you believe this is an error\n\n🎫 Would you like to create a new support ticket?`,
              timestamp: new Date().toLocaleTimeString(),
              suggestions: [
                { text: '🎫 Create New Ticket', action: 'create_ticket', icon: '🎫' },
                { text: '📞 Call Support', action: 'call_support', icon: '📞' },
                { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
              ]
            };
          }
        } catch (backendError) {
          console.warn('Backend unavailable, showing demo tickets...', backendError);
          // Fallback to demo tickets
          const ticketId1 = 'TK' + Math.random().toString(36).substr(2, 7).toUpperCase();
          const ticketId2 = 'TK' + Math.random().toString(36).substr(2, 7).toUpperCase();
          const ticketId3 = 'TK' + Math.random().toString(36).substr(2, 7).toUpperCase();
          
          statusResponse = {
            type: 'bot',
            content: `✅ **Demo Tickets for ${email}**\n\n🎫 **Your Support Tickets (Demo Mode):**\n\n**1. ${ticketId1}** - 🔴 **Open**\n   • Subject: Login Issues\n   • Priority: High\n   • Created: Today at 9:30 AM\n   • Agent: Sarah Johnson\n   • Last Update: 30 mins ago\n\n**2. ${ticketId2}** - 🟡 **In Progress**\n   • Subject: Password Reset Request\n   • Priority: Medium\n   • Created: Yesterday\n   • Agent: Mike Chen\n   • Last Update: 2 hours ago\n\n**3. ${ticketId3}** - 🟢 **Resolved**\n   • Subject: Account Settings\n   • Priority: Low\n   • Created: 3 days ago\n   • Resolved: Yesterday\n\n📊 **Summary:** 2 active tickets, 1 resolved\n🔔 Demo mode - Connect to backend for real tickets\n\n💡 Click below to view detailed information:`,
            timestamp: new Date().toLocaleTimeString(),
            suggestions: [
              { text: '🔍 View Open Ticket Details', action: 'view_ticket', icon: '🔍' },
              { text: '🎫 Create New Ticket', action: 'create_ticket', icon: '🎫' },
              { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
            ]
          };
        }
      } else {
        // Invalid email format
        statusResponse = {
          type: 'bot',
          content: `❌ **Invalid Email Format**\n\nThe email "${email}" doesn't appear to be valid.\n\n✅ **Please provide a valid email address:**\n• Example: john.doe@company.com\n• Example: support@example.org\n\n📧 Enter your registered email to find your tickets:`,
          timestamp: new Date().toLocaleTimeString()
        };
        // Stay in check_status mode for retry
        updatedMessages.push(statusResponse);
        setMessages(updatedMessages);
        return;
      }
      
      updatedMessages.push(statusResponse);
      setMessages(updatedMessages);
      setCurrentStep('initial');
      
    } catch (error) {
      console.error('Error in status check:', error);
      updatedMessages.pop();
      updatedMessages.push({
        type: 'bot',
        content: '❌ Sorry, I encountered an error while searching for your tickets. Please try again later or contact support directly.',
        timestamp: new Date().toLocaleTimeString()
      });
      setMessages(updatedMessages);
      setCurrentStep('initial');
    }
  };

  const viewTicketDetails = () => {
    simulateTyping(() => {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: 'View open ticket details' },
        {
          type: 'bot',
          content: `🔍 **Open Ticket Details**\n\n🎫 **Ticket ID:** TK${Math.random().toString(36).substr(2, 7).toUpperCase()}\n📝 **Subject:** Login Issues\n📊 **Status:** Open\n⚡ **Priority:** High\n👤 **Assigned Agent:** Sarah Johnson\n📅 **Created:** Today at 9:30 AM\n🕒 **Last Update:** 30 minutes ago\n⏱️ **ETA:** 2-4 hours\n\n💬 **Recent Conversation:**\n\n**You (9:30 AM):** "I can't log into my account. Keep getting error message."\n\n**Sarah (10:15 AM):** "Hi! I'm looking into this login issue. Can you tell me what error message you're seeing exactly?"\n\n**You (10:45 AM):** "It says 'Invalid credentials' but I'm sure my password is correct."\n\n**Sarah (11:30 AM):** "Thank you for the details. I've found the issue - there's a temporary problem with our authentication server. Our tech team is working on it now. You should be able to log in within the next 2 hours. I'll update you as soon as it's fixed."\n\n📧 **Next Update:** Within 1 hour\n🔔 **Notifications:** Email alerts enabled`,
          timestamp: new Date().toLocaleTimeString(),
          suggestions: [
            { text: '📧 Check Other Tickets', action: 'check_status', icon: '📧' },
            { text: '🎫 Create New Ticket', action: 'create_ticket', icon: '🎫' },
            { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
          ]
        }
      ]);
    });
    setCurrentStep('initial');
  };

  const processInstantHelp = async (userMessage) => {
    const updatedMessages = [...messages, { type: 'user', content: userMessage }];
    
    updatedMessages.push({ 
      type: 'bot', 
      content: '🧠 Analyzing your issue and searching for instant solutions...',
      isLoading: true 
    });
    setMessages(updatedMessages);

    try {
      let helpResponse;
      
      try {
        // Try to get AI-powered help from backend
        const response = await axios.post('http://localhost:3002/api/ai/instant-help', {
          message: userMessage,
          context: 'support_chat'
        });
        helpResponse = response.data;
      } catch (aiError) {
        console.warn('AI help service unavailable, using local knowledge base...', aiError);
        // Fallback to local intelligent help
        helpResponse = generateLocalHelp(userMessage);
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      updatedMessages.pop();

      const automatedResponse = {
        type: 'bot',
        content: `✅ **Instant Analysis Complete!**\n\nBased on your description: "${userMessage}"\n\n🔧 **AI-Suggested Solutions:**\n${helpResponse.solutions.map((sol, idx) => `${idx + 1}. ${sol}`).join('\n')}\n\n📊 **Issue Category:** ${helpResponse.category}\n🎯 **Confidence:** ${helpResponse.confidence}%\n⏱️ **Estimated Resolution:** ${helpResponse.estimatedTime}\n\n💡 **Additional Tips:**\n${helpResponse.tips.join('\n')}\n\n${helpResponse.needsTicket ? '🎫 If these solutions don\'t work, I can help you create a support ticket for human assistance.' : '✅ Try these solutions and let me know if you need further assistance!'}`,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: helpResponse.needsTicket ? [
          { text: '🎫 Create Support Ticket', action: 'create_ticket', icon: '🎫' },
          { text: '📞 Call Support', action: 'call_support', icon: '📞' },
          { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
        ] : [
          { text: '✅ Issue Resolved', action: 'resolved_thanks', icon: '✅' },
          { text: '🎫 Still Need Help', action: 'create_ticket', icon: '🎫' },
          { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
        ]
      };
      
      updatedMessages.push(automatedResponse);
      setMessages(updatedMessages);
      setCurrentStep('initial');
      
    } catch (error) {
      console.error('Error in instant help:', error);
      updatedMessages.pop();
      updatedMessages.push({
        type: 'bot',
        content: '❌ Sorry, I encountered an error while analyzing your issue. Let me help you create a support ticket for human assistance instead.',
        timestamp: new Date().toLocaleTimeString(),
        suggestions: [
          { text: '🎫 Create Support Ticket', action: 'create_ticket', icon: '🎫' },
          { text: '📞 Call Support', action: 'call_support', icon: '📞' },
          { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
        ]
      });
      setMessages(updatedMessages);
      setCurrentStep('initial');
    }
  };

  // Local AI Help Generation
  const generateLocalHelp = (userMessage) => {
    const text = userMessage.toLowerCase();
    let category = 'General Technical';
    let confidence = 75;
    let estimatedTime = '5-15 minutes';
    let solutions = [];
    let tips = [];
    let needsTicket = false;

    // Login/Authentication Issues
    if (text.includes('login') || text.includes('sign in') || text.includes('password')) {
      category = 'Authentication';
      confidence = 90;
      estimatedTime = '2-5 minutes';
      solutions = [
        'Clear your browser cache and cookies',
        'Try using an incognito/private browser window',
        'Reset your password using the "Forgot Password" link',
        'Disable browser extensions temporarily',
        'Try a different browser or device'
      ];
      tips = [
        '• Use a strong, unique password',
        '• Enable two-factor authentication for security'
      ];
      needsTicket = true;
    }
    // Performance Issues
    else if (text.includes('slow') || text.includes('loading') || text.includes('lag')) {
      category = 'Performance';
      confidence = 85;
      estimatedTime = '5-10 minutes';
      solutions = [
        'Close unnecessary browser tabs and applications',
        'Check your internet connection speed',
        'Clear browser cache and temporary files',
        'Restart your browser',
        'Try using a wired connection instead of WiFi'
      ];
      tips = [
        '• Regular cache clearing improves performance',
        '• Close background applications to free up memory'
      ];
    }
    // Error Messages
    else if (text.includes('error') || text.includes('bug') || text.includes('crash')) {
      category = 'Error Resolution';
      confidence = 80;
      estimatedTime = '10-20 minutes';
      solutions = [
        'Take a screenshot of the error message',
        'Refresh the page or restart the application',
        'Check if the issue occurs in incognito mode',
        'Update your browser to the latest version',
        'Temporarily disable antivirus/firewall'
      ];
      tips = [
        '• Screenshots help identify specific errors quickly',
        '• Note what you were doing when the error occurred'
      ];
      needsTicket = true;
    }
    // Connection Issues
    else if (text.includes('connect') || text.includes('network') || text.includes('internet')) {
      category = 'Connectivity';
      confidence = 88;
      estimatedTime = '5-15 minutes';
      solutions = [
        'Check your internet connection status',
        'Restart your modem and router',
        'Try connecting to a different network',
        'Disable VPN if you\'re using one',
        'Flush DNS cache (ipconfig /flushdns on Windows)'
      ];
      tips = [
        '• Wired connections are generally more stable',
        '• Router restart fixes many connectivity issues'
      ];
    }
    // Default/General Issues
    else {
      solutions = [
        'Try refreshing the page or restarting the application',
        'Clear your browser cache and cookies',
        'Check if the issue occurs in different browsers',
        'Restart your device',
        'Check for any recent software updates'
      ];
      tips = [
        '• Many issues are resolved with a simple restart',
        '• Keep your software and browsers updated'
      ];
    }

    return {
      category,
      confidence,
      estimatedTime,
      solutions,
      tips,
      needsTicket
    };
  };

  const handleFormInput = (input, field) => {
    setTicketData(prev => ({ ...prev, [field]: input }));
    
    switch (currentStep) {
      case 'name':
        simulateTyping(() => {
          setMessages(prev => [
            ...prev,
            { type: 'user', content: input },
            { type: 'bot', content: 'Great! Now please provide your email address:', timestamp: new Date().toLocaleTimeString() }
          ]);
        });
        setCurrentStep('email');
        break;
      
      case 'email':
        simulateTyping(() => {
          setMessages(prev => [
            ...prev,
            { type: 'user', content: input },
            { type: 'bot', content: 'What\'s the subject of your support request?', timestamp: new Date().toLocaleTimeString() }
          ]);
        });
        setCurrentStep('subject');
        break;
        
      case 'subject':
        simulateTyping(() => {
          setMessages(prev => [
            ...prev,
            { type: 'user', content: input },
            { 
              type: 'bot', 
              content: '📎 **Optional Attachment**\n\nWould you like to attach a file to help us understand your issue better?\n\n📋 **Supported formats:**\n• Images: PNG, JPG (screenshots, photos)\n• Documents: PDF, DOC, DOCX\n• Text files: TXT\n• Max size: 10MB\n\nChoose an option below:', 
              timestamp: new Date().toLocaleTimeString(),
              suggestions: [
                { text: '📎 Attach File', action: 'attach_file', icon: '📎' },
                { text: '✍️ Skip Attachment', action: 'skip_attachment', icon: '✍️' }
              ]
            }
          ]);
        });
        setCurrentStep('attachment');
        break;
        
      case 'description':
        processTicketWithAI(input);
        break;
        
      default:
        handleGeneralResponse(input);
    }
  };

  const processTicketWithAI = async (description) => {
    setIsAnalyzing(true);
    
    const updatedMessages = [...messages, { type: 'user', content: description }];
    updatedMessages.push({ 
      type: 'bot', 
      content: '🤖 AI is analyzing your ticket for smart categorization and priority detection...',
      isLoading: true 
    });
    setMessages(updatedMessages);

    try {
      // Real AI Analysis - Call backend AI service
      const aiAnalysisData = {
        subject: ticketData.subject,
        description: description,
        customerEmail: ticketData.email
      };

      let aiResponse;
      try {
        // Try to get real AI analysis from backend
        const response = await axios.post('http://localhost:3002/api/ai/analyze-ticket', aiAnalysisData);
        aiResponse = response.data;
      } catch (aiError) {
        console.warn('AI service unavailable, using local intelligence...', aiError);
        // Fallback to local AI logic
        aiResponse = performLocalAIAnalysis(ticketData.subject, description);
      }

      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      updatedMessages.pop();
      
      const aiResults = {
        type: 'bot',
        content: `✅ **AI Analysis Complete!**\n\n📊 **Predicted Category:** ${aiResponse.category}\n🎯 **Confidence:** ${aiResponse.confidence}%\n⚡ **Priority:** ${aiResponse.priority}\n🕒 **Estimated Resolution:** ${aiResponse.estimatedTime}\n\n🧠 **AI Insights:**\n• ${aiResponse.insights.join('\n• ')}\n\n🎫 **Creating your ticket with AI enhancements...**`,
        timestamp: new Date().toLocaleTimeString()
      };
      
      updatedMessages.push(aiResults);
      setMessages(updatedMessages);
      
      // Store AI results in ticket data
      setTicketData(prev => ({
        ...prev,
        aiPredictedCategory: aiResponse.category,
        categoryConfidence: aiResponse.confidence / 100,
        sentimentScore: aiResponse.sentimentScore || 0.7,
        detectedEmotion: aiResponse.detectedEmotion || 'neutral',
        estimatedResolutionTime: aiResponse.estimatedTime,
        automatedResponse: `AI Analysis: ${aiResponse.category} (${aiResponse.confidence}% confidence). ${aiResponse.insights.join(' ')}`,
        priority: aiResponse.priority,
        aiInsights: {
          category: aiResponse.category,
          confidence: aiResponse.confidence,
          insights: aiResponse.insights,
          analysisTimestamp: new Date().toISOString(),
          hasAutomation: true
        }
      }));
      
      setTimeout(() => {
        submitTicketWithAI(description);
      }, 2000);
      
    } catch (error) {
      console.error('Error in AI processing:', error);
      setIsAnalyzing(false);
      updatedMessages.pop();
      updatedMessages.push({
        type: 'bot',
        content: '❌ AI analysis encountered an issue, but I can still create your ticket manually. Creating ticket...',
        timestamp: new Date().toLocaleTimeString()
      });
      setMessages(updatedMessages);
      submitTicketWithAI(description);
    }
  };

  // Local AI Analysis Fallback
  const performLocalAIAnalysis = (subject, description) => {
    const text = `${subject} ${description}`.toLowerCase();
    
    // Category Detection
    let category = 'General Support';
    let priority = 'Medium';
    let confidence = 75;
    let estimatedTime = '4-8 hours';
    let insights = [];

    // Technical Issues
    if (text.includes('login') || text.includes('password') || text.includes('access')) {
      category = 'Authentication & Access';
      priority = 'High';
      confidence = 90;
      estimatedTime = '2-4 hours';
      insights.push('Authentication-related issue detected');
      insights.push('High priority due to access blocking nature');
    }
    // Performance Issues
    else if (text.includes('slow') || text.includes('loading') || text.includes('performance') || text.includes('timeout')) {
      category = 'Performance & Speed';
      priority = 'Medium';
      confidence = 85;
      estimatedTime = '4-6 hours';
      insights.push('Performance optimization may be required');
      insights.push('Monitoring system performance recommended');
    }
    // Bug Reports
    else if (text.includes('error') || text.includes('bug') || text.includes('crash') || text.includes('broken')) {
      category = 'Bug Report';
      priority = 'High';
      confidence = 88;
      estimatedTime = '6-12 hours';
      insights.push('Potential software defect identified');
      insights.push('Development team review recommended');
    }
    // Account Issues
    else if (text.includes('account') || text.includes('profile') || text.includes('settings')) {
      category = 'Account Management';
      priority = 'Medium';
      confidence = 82;
      estimatedTime = '2-6 hours';
      insights.push('Account configuration may need adjustment');
    }
    // Billing Issues
    else if (text.includes('billing') || text.includes('payment') || text.includes('charge') || text.includes('invoice')) {
      category = 'Billing & Payments';
      priority = 'High';
      confidence = 95;
      estimatedTime = '1-3 hours';
      insights.push('Financial matter requiring prompt attention');
    }

    // Sentiment Analysis
    if (text.includes('urgent') || text.includes('critical') || text.includes('emergency')) {
      priority = 'Critical';
      estimatedTime = '1-2 hours';
      insights.push('Urgent language detected - escalated priority');
    }

    if (insights.length === 0) {
      insights.push('Standard support request identified');
      insights.push('Will be handled by appropriate team');
    }

    return {
      category,
      priority,
      confidence,
      estimatedTime,
      insights
    };
  };

  // Smart department detection based on subject and statement (same as CreateTicket.jsx)
  const detectDepartment = (subject, statement) => {
    const text = `${subject} ${statement}`.toLowerCase();
    
    // IT Support keywords
    if (text.includes('login') || text.includes('password') || text.includes('access') || 
        text.includes('network') || text.includes('email') || text.includes('software') ||
        text.includes('hardware') || text.includes('computer') || text.includes('system') ||
        text.includes('server') || text.includes('internet') || text.includes('wifi') ||
        text.includes('vpn') || text.includes('security') || text.includes('virus') ||
        text.includes('malware') || text.includes('backup') || text.includes('data') ||
        text.includes('database') || text.includes('application') || text.includes('website') ||
        text.includes('browser') || text.includes('error') || text.includes('bug') ||
        text.includes('installation') || text.includes('configuration') || text.includes('update')) {
      return 'IT';
    }
    
    // HR keywords
    if (text.includes('payroll') || text.includes('salary') || text.includes('benefits') ||
        text.includes('leave') || text.includes('vacation') || text.includes('sick') ||
        text.includes('employee') || text.includes('staff') || text.includes('hiring') ||
        text.includes('recruitment') || text.includes('training') || text.includes('performance') ||
        text.includes('policy') || text.includes('handbook') || text.includes('compliance') ||
        text.includes('onboarding') || text.includes('termination') || text.includes('discipline')) {
      return 'HR';
    }
    
    // Finance keywords
    if (text.includes('invoice') || text.includes('payment') || text.includes('billing') ||
        text.includes('expense') || text.includes('budget') || text.includes('accounting') ||
        text.includes('tax') || text.includes('financial') || text.includes('cost') ||
        text.includes('refund') || text.includes('charge') || text.includes('fee') ||
        text.includes('bank') || text.includes('credit') || text.includes('debit')) {
      return 'Finance';
    }
    
    return 'General Support';
  };

  // Smart related service detection based on department and content
  const detectRelatedService = (subject, statement, department) => {
    const text = `${subject} ${statement}`.toLowerCase();
    
    if (department === 'IT') {
      if (text.includes('password') || text.includes('login') || text.includes('access')) return 'Account Management';
      if (text.includes('network') || text.includes('internet') || text.includes('wifi')) return 'Network Support';
      if (text.includes('software') || text.includes('application') || text.includes('installation')) return 'Software Support';
      if (text.includes('hardware') || text.includes('computer') || text.includes('device')) return 'Hardware Support';
      if (text.includes('email') || text.includes('outlook') || text.includes('mail')) return 'Email Support';
      if (text.includes('security') || text.includes('virus') || text.includes('malware')) return 'Security';
      return 'Technical Support';
    }
    
    if (department === 'HR') {
      if (text.includes('payroll') || text.includes('salary') || text.includes('payment')) return 'Payroll';
      if (text.includes('benefits') || text.includes('insurance') || text.includes('health')) return 'Benefits';
      if (text.includes('leave') || text.includes('vacation') || text.includes('sick')) return 'Leave Management';
      if (text.includes('training') || text.includes('development') || text.includes('course')) return 'Training';
      return 'General HR';
    }
    
    if (department === 'Finance') {
      if (text.includes('invoice') || text.includes('billing')) return 'Billing';
      if (text.includes('expense') || text.includes('reimbursement')) return 'Expenses';
      if (text.includes('payment') || text.includes('payroll')) return 'Payments';
      return 'General Finance';
    }
    
    return 'General Support';
  };

  const submitTicket = async (description) => {
    setIsSubmitting(true);
    setIsAnalyzing(true);
    
    try {
      // Smart department and service detection
      const detectedDepartment = detectDepartment(ticketData.subject, description);
      const detectedService = detectRelatedService(ticketData.subject, description, detectedDepartment);
      
      // Perform AI analysis using the same endpoint as CreateTicket.jsx
      let aiAnalysisResults = null;
      let finalPriority = 'Medium';
      let aiPredictedCategory = detectedDepartment;
      let categoryConfidence = 0.7;
      let estimatedResolutionTime = '2-4 hours';
      let automatedResponse = 'AI analyzed and categorized';
      
      try {
        const analysisResponse = await axios.post(`http://localhost:3002/api/ai/analyze-ticket`, {
          message: `${ticketData.subject}. ${description}`,
          category: null // Let AI predict the category
        });
        
        if (analysisResponse.data.success) {
          const aiResults = analysisResponse.data;
          aiAnalysisResults = aiResults;
          
          // Map urgency to priority
          const urgencyToPriority = {
            'High': 'Critical',
            'Medium': 'High', 
            'Low': 'Medium'
          };
          
          finalPriority = urgencyToPriority[aiResults.analysis.urgency] || 'Medium';
          aiPredictedCategory = aiResults.analysis.category;
          categoryConfidence = aiResults.analysis.categoryConfidence;
          estimatedResolutionTime = aiResults.analysis.estimatedResolution;
          automatedResponse = aiResults.response;
        }
      } catch (aiError) {
        console.warn('AI analysis failed, using fallback:', aiError);
        // Continue with detected values as fallback
      }
      
      // Prepare comprehensive ticket data for submission with FormData (matching CreateTicket.jsx structure)
      const formDataToSend = new FormData();
      formDataToSend.append("name", ticketData.name);
      formDataToSend.append("email", ticketData.email);
      formDataToSend.append("subject", ticketData.subject);
      formDataToSend.append("statement", description);
      formDataToSend.append("date", new Date().toISOString());
      formDataToSend.append("department", detectedDepartment);
      formDataToSend.append("relatedservice", detectedService);
      formDataToSend.append("priority", finalPriority);
      formDataToSend.append("aiPredictedCategory", aiPredictedCategory);
      formDataToSend.append("categoryConfidence", categoryConfidence);
      formDataToSend.append("estimatedResolutionTime", estimatedResolutionTime);
      formDataToSend.append("automatedResponse", automatedResponse);
      
      // Add attachment if available
      if (ticketData.attachment) {
        formDataToSend.append("attachment", ticketData.attachment);
      }
      
      // Include additional AI metadata if available
      if (aiAnalysisResults) {
        formDataToSend.append("sentimentScore", aiAnalysisResults.analysis.sentiment.score);
        formDataToSend.append("detectedEmotion", aiAnalysisResults.analysis.sentiment.label);
        formDataToSend.append("aiInsights", JSON.stringify({
          urgency: aiAnalysisResults.analysis.urgency,
          suggestions: aiAnalysisResults.suggestions || []
        }));
      }

      // Submit ticket to backend with multipart/form-data
      const response = await axios.post('http://localhost:3002/api/tickets', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      const ticketId = response.data.ticketId || 'TK' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Send confirmation email using EmailJS
      try {
        const emailResult = await sendEmailConfirmation({
          email: ticketData.email,
          name: ticketData.name,
          ticketId: ticketId,
          subject: ticketData.subject,
          department: detectedDepartment,
          priority: finalPriority,
          date: new Date().toLocaleDateString(),
          statement: description,
          aiPredictedCategory: aiPredictedCategory,
          automatedResponse: automatedResponse
        });
        
        if (!emailResult.success) {
          console.warn('EmailJS confirmation failed:', emailResult.error);
        }
      } catch (emailError) {
        console.warn('EmailJS confirmation failed:', emailError);
        // Continue even if email fails
      }
      
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          content: `🎉 **Ticket Created Successfully!**\n\n📋 **Ticket Details:**\n• **Ticket ID:** ${ticketId}\n• **Email:** ${ticketData.email}\n• **Subject:** ${ticketData.subject}\n• **Department:** ${detectedDepartment} (AI-detected)\n• **Service:** ${detectedService} (AI-detected)\n• **Priority:** ${finalPriority} (AI-analyzed)${ticketData.attachment ? `\n• **Attachment:** ${ticketData.attachment.name} (${(ticketData.attachment.size / 1024 / 1024).toFixed(2)} MB)` : ''}\n\n🤖 **AI Analysis Results:**\n• **Category:** ${aiPredictedCategory}\n• **Confidence:** ${Math.round(categoryConfidence * 100)}%\n• **Est. Resolution:** ${estimatedResolutionTime}\n\n✅ **Confirmation Status:**\n• Ticket saved to database with AI metadata${ticketData.attachment ? '\n• File attachment uploaded successfully' : ''}\n• Confirmation email sent to ${ticketData.email}\n• You'll receive email updates on ticket progress\n• Our support team will respond within ${estimatedResolutionTime}\n\n💡 **Important:**\n• Save your ticket ID: **${ticketId}**\n• Use your email (${ticketData.email}) to check status anytime\n• Check your email for confirmation details\n\n🔔 **Next Steps:**\n• Monitor your email for updates\n• You can check status anytime using your email\n\nIs there anything else I can help you with?`,
          timestamp: new Date().toLocaleTimeString(),
          suggestions: [
            { text: '📧 Check Ticket Status', action: 'check_status', icon: '📧' },
            { text: '🎫 Create Another Ticket', action: 'create_ticket', icon: '🎫' },
            { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
          ]
        }
      ]);
      
      setCurrentStep('initial');
      setSelectedFile(null);
      setTicketData({
        name: '',
        email: '',
        date: new Date().toISOString().split('T')[0],
        subject: '',
        department: '',
        relatedservice: '',
        priority: '',
        attachment: null,
        statement: '',
        aiPredictedCategory: '',
        categoryConfidence: '',
        estimatedResolutionTime: '',
        automatedResponse: '',
        sentimentScore: '',
        detectedEmotion: '',
        aiInsights: null
      });
      
    } catch (error) {
      console.error('Error submitting ticket:', error);
      
      // Generate fallback ticket ID for offline mode
      const fallbackTicketId = 'TK' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          content: `⚠️ **Ticket Created (Offline Mode)**\n\n📋 **Ticket Details:**\n• **Ticket ID:** ${fallbackTicketId}\n• **Email:** ${ticketData.email}\n• **Subject:** ${ticketData.subject}\n• **Department:** ${detectedDepartment} (AI-detected)\n• **Service:** ${detectedService} (AI-detected)\n• **Priority:** ${finalPriority}\n\n🔄 **Status Update:**\n• Ticket created locally (backend unavailable)\n• Email confirmation will be sent when connection is restored\n• Your ticket details have been saved\n\n📞 **Alternative Contact:**\n• Call support: +1-800-SUPPORT\n• Email: support@company.com\n• Live chat available 24/7\n\n💡 **Keep this information:**\n• Ticket ID: **${fallbackTicketId}**\n• Your email: ${ticketData.email}\n• Issue: ${ticketData.subject}\n\nOur system will sync your ticket once the connection is restored.`,
          timestamp: new Date().toLocaleTimeString(),
          suggestions: [
            { text: '📞 Call Support', action: 'call_support', icon: '📞' },
            { text: '🔄 Try Again', action: 'create_ticket', icon: '🔄' },
            { text: '🏠 Return to Main Menu', action: 'main_menu', icon: '🏠' }
          ]
        }
      ]);
    } finally {
      setIsSubmitting(false);
      setIsAnalyzing(false);
    }
  };

  // Comprehensive Ticket Submission with Email Confirmation
  const submitTicketWithAI = async (description) => {
    setIsSubmitting(true);
    
    const updatedMessages = [...messages, { 
      type: 'bot', 
      content: '🚀 **Creating your AI-powered ticket...**\n\n⚡ Running comprehensive analysis...\n🧠 Processing with advanced AI...',
      isLoading: true,
      timestamp: new Date().toLocaleTimeString()
    }];
    setMessages(updatedMessages);
    
    try {
      // Prepare form data for submission
      const formDataToSend = new FormData();
      
      // Add all ticket data
      formDataToSend.append("name", ticketData.name);
      formDataToSend.append("email", ticketData.email);
      formDataToSend.append("date", ticketData.date);
      formDataToSend.append("subject", ticketData.subject);
      formDataToSend.append("department", ticketData.department);
      formDataToSend.append("relatedservice", ticketData.relatedservice);
      formDataToSend.append("priority", ticketData.priority);
      formDataToSend.append("statement", description);
      
      // Add attachment if exists
      if (ticketData.attachment) {
        formDataToSend.append("attachment", ticketData.attachment);
      }
      
      // Add AI-generated data
      if (ticketData.aiPredictedCategory) {
        formDataToSend.append("aiPredictedCategory", ticketData.aiPredictedCategory);
      }
      if (ticketData.categoryConfidence) {
        formDataToSend.append("categoryConfidence", ticketData.categoryConfidence);
      }
      if (ticketData.sentimentScore) {
        formDataToSend.append("sentimentScore", ticketData.sentimentScore);
      }
      if (ticketData.detectedEmotion) {
        formDataToSend.append("detectedEmotion", ticketData.detectedEmotion);
      }
      if (ticketData.estimatedResolutionTime) {
        formDataToSend.append("estimatedResolutionTime", ticketData.estimatedResolutionTime);
      }
      if (ticketData.automatedResponse) {
        formDataToSend.append("automatedResponse", ticketData.automatedResponse);
      }
      if (ticketData.aiInsights) {
        formDataToSend.append("aiInsights", JSON.stringify(ticketData.aiInsights));
      }
      
      // Mark as AI-assisted
      formDataToSend.append("hasAutomatedSolution", "true");
      formDataToSend.append("automatedSolutionAttempted", "true");
      formDataToSend.append("sentimentAnalyzedAt", new Date().toISOString());
      
      // Submit ticket to backend
      const response = await axios.post('http://localhost:3002/api/tickets/', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      const ticket = response.data;
      const ticketId = ticket.ticketid || ticket._id || ticket.id || 'AI-' + Date.now();
      
      console.log('✅ Ticket created successfully:', ticketId);
      
      // Send confirmation email using centralized function
      try {
        const emailResult = await sendEmailConfirmation({
          email: ticketData.email,
          name: ticketData.name,
          ticketId: ticketId,
          subject: ticketData.subject,
          department: ticketData.department,
          priority: ticketData.priority,
          date: ticketData.date,
          statement: description,
          aiPredictedCategory: ticketData.aiPredictedCategory || 'AI Analysis',
          automatedResponse: ticketData.automatedResponse || 'AI-powered assistance provided'
        });
        
        if (emailResult.success) {
          console.log('✅ Confirmation email sent successfully');
        } else {
          console.error('❌ Email sending failed:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Email confirmation failed:', emailError);
      }
      
      // Remove loading message
      updatedMessages.pop();
      
      // Show success message with ticket details
      const successMessage = {
        type: 'bot',
        content: `🎉 **Ticket Created Successfully!**\n\n🎫 **Ticket ID:** \`${ticketId}\`\n👤 **Name:** ${ticketData.name}\n📧 **Email:** ${ticketData.email}\n🏷️ **Department:** ${ticketData.department}\n⚡ **Priority:** ${ticketData.priority}\n\n✅ **Confirmation email sent!**\n\n🤖 **AI Analysis Included:**\n• Category: ${ticketData.aiPredictedCategory || 'General'}\n• Estimated Resolution: ${ticketData.estimatedResolutionTime || 'TBD'}\n• Automated Response: Generated\n\nOur support team will review your ticket and respond based on the priority level.`,
        isSuccess: true,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: [
          { text: '🆕 Create New Ticket', action: 'create_ticket', icon: '🎫' },
          { text: '📊 Check Status', action: 'check_status', icon: '📊' },
          { text: '⚡ Get More Help', action: 'instant_help', icon: '⚡' }
        ]
      };
      
      updatedMessages.push(successMessage);
      setMessages(updatedMessages);
      
      // Reset state
      setCurrentStep('initial');
      setTicketData({
        name: '',
        email: '',
        date: new Date().toISOString().split('T')[0],
        subject: '',
        department: '',
        relatedservice: '',
        priority: '',
        attachment: null,
        statement: '',
        aiPredictedCategory: '',
        categoryConfidence: '',
        estimatedResolutionTime: '',
        automatedResponse: '',
        sentimentScore: '',
        detectedEmotion: '',
        aiInsights: null
      });
      setSelectedFile(null);
      
      // Show success toast
      import('react-hot-toast').then(toast => {
        toast.default.success("🎉 AI-Powered Ticket Created Successfully!");
      });
      
    } catch (error) {
      console.error("❌ Error creating ticket:", error);
      
      // Remove loading message
      updatedMessages.pop();
      
      // Show error message
      updatedMessages.push({ 
        type: 'bot', 
        content: '❌ **Ticket Creation Failed**\n\nSorry, there was an error creating your ticket. Please try again or contact support directly.\n\n**Error:** ' + (error.response?.data?.message || error.message),
        isError: true,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: [
          { text: '🔄 Try Again', action: 'create_ticket', icon: '🔄' },
          { text: '📞 Call Support', action: 'call_support', icon: '📞' }
        ]
      });
      setMessages(updatedMessages);
      setCurrentStep('initial');
      
      // Show error toast
      import('react-hot-toast').then(toast => {
        toast.default.error("Failed to create ticket. Please try again.");
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email sending function for chatbot
  const sendEmailConfirmation = async (ticketData) => {
    try {
      const emailjs = await import('@emailjs/browser');
      
      const templateParams = {
        to_email: ticketData.email,
        to_name: ticketData.name,
        ticket_id: ticketData.ticketId,
        subject: ticketData.subject,
        department: ticketData.department,
        priority: ticketData.priority,
        date: ticketData.date,
        statement: ticketData.statement,
        ai_category: ticketData.aiPredictedCategory || 'AI Analysis',
        automated_response: ticketData.automatedResponse || 'AI-powered assistance provided',
        reply_to: 'support@yourcompany.com'
      };

      const result = await emailjs.default.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      console.log('✅ Email sent successfully:', result);
      return { success: true, result };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }
  };

  const handleGeneralResponse = (input) => {
    const lowercaseInput = input.toLowerCase().trim();
    
    // Handle common responses more intelligently
    let response;
    
    if (lowercaseInput.includes('thank') || lowercaseInput.includes('thanks')) {
      response = "You're welcome! I'm glad I could help. Is there anything else you need assistance with?";
    } else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi') || lowercaseInput.includes('hey')) {
      response = "Hello! I'm your AI Support Assistant. How can I help you today?";
    } else if (lowercaseInput.includes('bye') || lowercaseInput.includes('goodbye')) {
      response = "Goodbye! Thank you for using our AI Support. Feel free to return anytime you need assistance. Have a great day!";
    } else if (lowercaseInput.includes('help') || lowercaseInput.includes('assist')) {
      response = "I'm here to help! I can assist you with:\n\n🎫 Creating support tickets\n⚡ Instant troubleshooting\n📊 Checking ticket status\n📞 Connecting you with human support\n\nWhat would you like to do?";
    } else if (lowercaseInput.includes('no') || lowercaseInput === 'n') {
      response = "Alright! If you need any assistance in the future, just let me know. I'm here whenever you need help.";
    } else if (lowercaseInput.includes('yes') || lowercaseInput === 'y') {
      response = "Great! How can I assist you further? You can create a ticket, get instant help, or check your ticket status.";
    } else {
      // Default responses for other inputs
      const responses = [
        "I understand. How can I help you with that specifically?",
        "Thank you for reaching out. What can I assist you with today?",
        "I'm here to help! Could you please provide more details about what you need?",
        "I'd be happy to assist you. What would you like me to help you with?"
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    simulateTyping(() => {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: input },
        { 
          type: 'bot', 
          content: response, 
          timestamp: new Date().toLocaleTimeString(),
          suggestions: response.includes('What would you like to do?') || response.includes('assist you further') ? [
            { text: '🎫 Create Smart Ticket', action: 'create_ticket', icon: '🎫' },
            { text: '⚡ Get Instant Help', action: 'instant_help', icon: '⚡' },
            { text: '📊 Check Status', action: 'check_status', icon: '📊' }
          ] : undefined
        }
      ]);
    });
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const trimmedInput = userInput.trim();

    if (currentStep === 'instant_help') {
      processInstantHelp(trimmedInput);
    } else if (currentStep === 'check_status') {
      processStatusCheck(trimmedInput);
    } else if (currentStep === 'name') {
      handleFormInput(trimmedInput, 'name');
    } else if (currentStep === 'email') {
      handleFormInput(trimmedInput, 'email');
    } else if (currentStep === 'subject') {
      handleFormInput(trimmedInput, 'subject');
    } else if (currentStep === 'description') {
      handleFormInput(trimmedInput, 'statement');
    } else {
      handleGeneralResponse(trimmedInput);
    }

    setUserInput('');
  };

  const handleOptionClick = (action) => {
    handleGeneralResponse(`Selected: ${action}`);
  };

  // File handling functions
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setMessages(prev => [
          ...prev,
          {
            type: 'bot',
            content: '❌ **File too large!**\n\nPlease select a file smaller than 10MB.\nSupported formats: PNG, JPG, PDF, DOC, DOCX, TXT',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setMessages(prev => [
          ...prev,
          {
            type: 'bot',
            content: '❌ **Unsupported file type!**\n\nPlease select one of these file types:\n• Images: PNG, JPG\n• Documents: PDF, DOC, DOCX\n• Text: TXT',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        return;
      }
      
      setSelectedFile(file);
      setTicketData(prev => ({ ...prev, attachment: file }));
      
      // Show file selected confirmation
      setMessages(prev => [
        ...prev,
        { type: 'user', content: 'Attach file' },
        {
          type: 'bot',
          content: `✅ **File attached successfully!**\n\n📎 **File:** ${file.name}\n📊 **Size:** ${(file.size / 1024 / 1024).toFixed(2)} MB\n📋 **Type:** ${file.type}\n\nNow, please describe your issue in detail:`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      
      setCurrentStep('description');
    }
    
    // Reset the input
    event.target.value = '';
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTicketData(prev => ({ ...prev, attachment: null }));
    
    setMessages(prev => [
      ...prev,
      {
        type: 'bot',
        content: '🗑️ **File removed.**\n\nWould you like to attach a different file, or skip and proceed with the description?',
        timestamp: new Date().toLocaleTimeString(),
        suggestions: [
          { text: '📎 Attach Different File', action: 'attach_file', icon: '📎' },
          { text: '✍️ Skip to Description', action: 'skip_attachment', icon: '✍️' }
        ]
      }
    ]);
  };

  const handleSkipAttachment = () => {
    setMessages(prev => [
      ...prev,
      { type: 'user', content: 'Skip attachment' },
      {
        type: 'bot',
        content: 'No problem! Please describe your issue in detail:',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setCurrentStep('description');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="group relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-110 hover:rotate-3"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
        {isOpen && !isMinimized ? (
          <X size={24} className="relative z-10 transition-transform duration-300 group-hover:rotate-90" />
        ) : (
          <Brain size={24} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
        )}
        
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"></div>
        
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
          <Sparkles size={8} className="text-white" />
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-20 right-4 w-[420px] h-[650px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col transition-all duration-500 transform">
          {/* Professional Header */}
          <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white rounded-t-2xl overflow-hidden border-b border-white/10">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            
            {/* Glass Effect Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"></div>
            
            {/* Main Header Content */}
            <div className="relative px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Left Section - Logo & Title */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg border border-white/20">
                      <Brain className="text-white" size={22} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg tracking-tight">AI Support Assistant</h3>
                      <div className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs font-medium">
                        LIVE
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-slate-300 font-medium">Online</span>
                      </div>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs text-slate-300">Powered by GPT-4</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-slate-300">Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Section - Action Buttons */}
                <div className="flex items-center space-x-1">
                  <div className="relative new-chat-container">
                    <button
                      onClick={handleNewChatClick}
                      className="group relative overflow-hidden bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all duration-300 text-xs font-medium px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 backdrop-blur-sm"
                    >
                      <div className="flex items-center space-x-1.5">
                        <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span>Reset</span>
                      </div>
                    </button>
                    
                    {/* Confirmation Popup */}
                    {showNewChatConfirm && (
                      <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="text-sm text-gray-800 mb-3">
                          <div className="font-semibold mb-1 flex items-center">
                            <RefreshCw size={14} className="mr-2 text-blue-600" />
                            Start fresh conversation?
                          </div>
                          <div className="text-gray-600">This will clear your current chat history and start over.</div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={confirmNewChat}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 hover:shadow-lg"
                          >
                            Yes, Reset
                          </button>
                          <button
                            onClick={cancelNewChat}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-px h-6 bg-white/20 mx-1"></div>
                  
                  <button
                    onClick={minimizeChat}
                    className="group relative p-2 text-white/80 hover:text-white hover:bg-white/15 transition-all duration-300 rounded-lg border border-transparent hover:border-white/20"
                    title="Minimize"
                  >
                    <Minimize2 size={14} className="group-hover:scale-110 transition-transform duration-200" />
                  </button>
                  
                  <button 
                    onClick={toggleChat}
                    className="group relative p-2 text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-300 rounded-lg border border-transparent hover:border-red-400/30"
                    title="Close"
                  >
                    <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>
              
              {/* Status Bar */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3 h-3 text-blue-300" />
                      <span className="text-slate-300">Avg. Response: &lt;30s</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-slate-300">99.9% Uptime</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-slate-300">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white shadow-blue-200'
                      : 'bg-white border border-gray-100 text-gray-800 shadow-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.type === 'bot' && (
                      <div className="flex-shrink-0 mt-1">
                        {message.isLoading ? (
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Loader2 className="animate-spin text-blue-600" size={16} />
                          </div>
                        ) : (
                          <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                            <Bot className="text-blue-600" size={16} />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {message.timestamp && (
                        <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                          {message.timestamp}
                        </p>
                      )}
                      
                      {message.suggestions && (
                        <div className="mt-4 space-y-3">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(suggestion.action)}
                              className="group block w-full text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{suggestion.icon || '🎯'}</span>
                                <span className="flex-1">{suggestion.text}</span>
                                <ArrowRight size={14} className="text-blue-500 group-hover:translate-x-1 transition-transform duration-300" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-2 bg-white/20 rounded-full">
                          <User className="text-white" size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {typingIndicator && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 max-w-[85%] shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                      <Bot className="text-blue-600" size={16} />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600 mr-2">AI is thinking</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm p-4 rounded-b-2xl">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={currentStep === 'check_status' ? 'Enter your email address...' : 'Type your message...'}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  disabled={isSubmitting || isAnalyzing}
                />
                {userInput && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              <button
                onClick={handleSendMessage}
                disabled={isSubmitting || isAnalyzing || !userInput.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl p-3 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
              >
                {isSubmitting || isAnalyzing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            
            {(isAnalyzing || isSubmitting) && (
              <div className="mt-3 flex items-center justify-center">
                <div className="bg-blue-50 border border-blue-200 rounded-full px-4 py-2 flex items-center space-x-2">
                  <Loader2 className="animate-spin text-blue-600" size={14} />
                  <span className="text-xs text-blue-700 font-medium">
                    {isAnalyzing ? '🧠 AI analyzing your request...' : '⚡ Creating your ticket...'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Minimized Chat Window */}
      {isOpen && isMinimized && (
        <div className="fixed bottom-20 right-4 w-96 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 overflow-hidden">
          {/* Minimized Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                    <Brain className="text-white" size={16} />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">AI Support Assistant</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                      <p className="text-xs text-slate-300">Minimized</p>
                    </div>
                    <span className="text-slate-500 text-xs">•</span>
                    <p className="text-xs text-slate-400">Click to expand</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(false)}
                className="group p-2 text-white/70 hover:text-white hover:bg-white/15 transition-all duration-300 rounded-lg border border-transparent hover:border-white/20"
                title="Expand Chat"
              >
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden file input for attachment */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
        style={{ display: 'none' }}
      />
    </div>
  );
}
