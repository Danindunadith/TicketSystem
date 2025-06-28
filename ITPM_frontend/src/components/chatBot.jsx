import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Paperclip, Bot, User, Sparkles, Loader2, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { sendTicketConfirmationEmail, EMAILJS_CONFIG } from '../config/emailjs';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      content: 'Hi there! 👋 Need help with something? I can create a support ticket for you. Just click the button below to get started!' 
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('initial');
  const [userInput, setUserInput] = useState('');
  const [ticketData, setTicketData] = useState({
    name: '',
    email: '',
    date: new Date().toISOString().split('T')[0], // Today's date by default
    subject: '',
    department: '',
    relatedservice: '',
    priority: '',
    attachment: null,
    statement: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [sentimentResults, setSentimentResults] = useState(null); // Added for sentiment analysis results
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Animation effect when opening chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setAnimation(true);
      }, 100);
    } else {
      setAnimation(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Reset chat function
  const resetChat = () => {
    setMessages([
      { 
        type: 'bot', 
        content: 'Hi there! 👋 Need help with something? I can create a support ticket for you. Just click the button below to get started!' 
      }
    ]);
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
      statement: ''
    });
    setSentimentResults(null); // Reset sentiment results
    setUserInput('');
  };

  // Helper for sentiment color
  const getSentimentColor = (sentiment) => {
    if (!sentiment) return 'bg-gray-300';
    switch(sentiment) {
      case 'POSITIVE': return 'bg-green-500';
      case 'NEGATIVE': return 'bg-red-500';
      default: return 'bg-yellow-500'; // NEUTRAL
    }
  };

  // Helper for priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get priority dot color
  const getPriorityDotColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  // Simulated typing effect
  const simulateTyping = (callback) => {
    setTypingIndicator(true);
    setTimeout(() => {
      setTypingIndicator(false);
      callback();
    }, 1000 + Math.random() * 500); // Random delay between 1-1.5 seconds
  };

  const handleStartTicket = () => {
    setCurrentStep('name');
    simulateTyping(() => {
      setMessages([
        ...messages,
        { type: 'bot', content: "Let's create a support ticket! First, what's your full name?" }
      ]);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTicketData({
        ...ticketData,
        attachment: file
      });
      
      setMessages([
        ...messages,
        { type: 'user', content: `Uploaded: ${file.name}` },
        { type: 'bot', content: `✅ Thanks for uploading ${file.name}.` }
      ]);
      
      // After the file is uploaded, proceed to AI analysis
      runAIAnalysis([
        ...messages, 
        { type: 'user', content: `Uploaded: ${file.name}` },
        { type: 'bot', content: `✅ Thanks for uploading ${file.name}.` }
      ]);
    }
  };

  const promptForAttachment = () => {
    setMessages([
      ...messages, 
      { 
        type: 'bot', 
        content: 'Would you like to upload an attachment? (optional)',
        options: [
          { label: '📎 Upload a file', action: 'upload' },
          { label: '⏩ Skip this step', action: 'skip' }
        ]
      }
    ]);
    setCurrentStep('attachment');
  };

  const handleOptionClick = (action) => {
    if (currentStep === 'department') {
      setTicketData({
        ...ticketData,
        department: action
      });
      
      simulateTyping(() => {
        setMessages([
          ...messages,
          { type: 'user', content: `Department: ${action}` },
          { type: 'bot', content: 'What service is this related to? (e.g., Email, VPN, Software, etc.)' }
        ]);
      });
      
      setCurrentStep('relatedservice');
      return;
    }
    
    if (currentStep === 'attachment') {
      if (action === 'upload') {
        fileInputRef.current.click();
      } else if (action === 'skip') {
        setMessages([
          ...messages,
          { type: 'user', content: 'Skip attachment' }
        ]);
        // Run AI analysis after skipping attachment
        runAIAnalysis([
          ...messages,
          { type: 'user', content: 'Skip attachment' }
        ]);
      }
      return;
    }
    
    if (currentStep === 'confirmation' && action === 'submit') {
      submitTicket();
      return;
    }
    
    if (currentStep === 'confirmation' && action === 'cancel') {
      simulateTyping(() => {
        setMessages([
          ...messages,
          { type: 'user', content: 'Cancel ticket' },
          { type: 'bot', content: 'Ticket creation canceled. Is there anything else I can help you with?' }
        ]);
      });
      setCurrentStep('initial');
      return;
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };
  
  // Method to run AI analysis
  const runAIAnalysis = async (updatedMessages) => {
    updatedMessages.push({ 
      type: 'bot', 
      content: 'Analyzing your ticket...',
      isLoading: true 
    });
    setMessages(updatedMessages);
    
    setIsAnalyzing(true);
    try {
      const response = await axios.post(
        `/api/analysis/sentiment`,
        {
          subject: ticketData.subject,
          department: ticketData.department,
          relatedService: ticketData.relatedservice,
          description: ticketData.statement
        }
      );
      
      // Update with analysis results
      setTicketData({
        ...ticketData,
        priority: response.data.priority
      });
      
      // Store sentiment analysis results
      setSentimentResults(response.data);
      
      // Remove loading message
      updatedMessages.pop();
      
      // Create sentiment analysis display
      const sentimentHtml = `
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-gray-700">Sentiment Analysis</h4>
          <div class="flex items-center mt-1">
            <div class="w-3 h-3 rounded-full mr-2 ${getSentimentColor(response.data.sentiment)}"></div>
            <span class="text-sm text-gray-600">${response.data.sentiment || 'NEUTRAL'}</span>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div class="${getSentimentColor(response.data.sentiment)} h-2.5 rounded-full" 
                 style="width: ${(response.data.score || 0.5) * 100}%"></div>
          </div>
          <div class="mt-1 flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
        
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-gray-700">Suggested Priority</h4>
          <div class="mt-1 px-3 py-2 rounded-md border ${getPriorityColor(response.data.priority)}">
            <div class="flex items-center">
              <span class="w-3 h-3 rounded-full mr-2 ${getPriorityDotColor(response.data.priority)}"></span>
              <span>${response.data.priority}</span>
            </div>
          </div>
        </div>
      `;
      
      updatedMessages.push({ 
        type: 'bot', 
        content: `✨ <div class="mb-2">Based on my analysis:</div>${sentimentHtml}
        ${response.data.suggestedSolution ? 
          `<div class="mt-2 border-t border-gray-200 pt-2"><span class="font-medium">Suggested solution:</span> ${response.data.suggestedSolution}</div>` : ''}`,
        isHTML: true
      });
      
      simulateTyping(() => {
        updatedMessages.push({ 
          type: 'bot', 
          content: 'Your ticket is ready to be submitted. Would you like to create this ticket?',
          options: [
            { label: '✅ Create Ticket', action: 'submit' },
            { label: '❌ Cancel', action: 'cancel' }
          ]
        });
        setMessages(updatedMessages);
        setCurrentStep('confirmation');
      });
      
    } catch (error) {
      console.error("AI analysis error:", error);
      
      // Remove loading message
      updatedMessages.pop();
      
      simulateTyping(() => {
        updatedMessages.push({ 
          type: 'bot', 
          content: 'I couldn\'t analyze your ticket, but you can still submit it. Would you like to create this ticket?',
          options: [
            { label: '✅ Create Ticket', action: 'submit' },
            { label: '❌ Cancel', action: 'cancel' }
          ]
        });
        setMessages(updatedMessages);
        setCurrentStep('confirmation');
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    // Add user message to chat
    const updatedMessages = [...messages, { type: 'user', content: userInput }];
    setMessages(updatedMessages);
    
    // Process based on current step
    switch (currentStep) {
      case 'initial':
        handleStartTicket();
        break;
        
      case 'name':
        setTicketData({ ...ticketData, name: userInput });
        simulateTyping(() => {
          setMessages([...updatedMessages, { type: 'bot', content: 'Great! What\'s your email address?' }]);
        });
        setCurrentStep('email');
        break;
        
      case 'email':
        if (!userInput.includes('@') || !userInput.includes('.')) {
          simulateTyping(() => {
            setMessages([...updatedMessages, { type: 'bot', content: 'That doesn\'t look like a valid email. Please provide a valid email address.' }]);
          });
        } else {
          setTicketData({ ...ticketData, email: userInput });
          simulateTyping(() => {
            setMessages([...updatedMessages, { type: 'bot', content: 'What\'s the subject of your ticket?' }]);
          });
          setCurrentStep('subject');
        }
        break;
        
      case 'subject':
        setTicketData({ ...ticketData, subject: userInput });
        simulateTyping(() => {
          setMessages([...updatedMessages, { 
            type: 'bot', 
            content: 'Which department is this for?',
            options: [
              { label: '💻 IT Support', action: 'IT' },
              { label: '👥 Human Resources', action: 'HR' },
              { label: '💰 Finance', action: 'Finance' },
              { label: '🛟 General Support', action: 'Support' }
            ]
          }]);
        });
        setCurrentStep('department');
        break;
        
      case 'relatedservice':
        setTicketData({ ...ticketData, relatedservice: userInput });
        // Now ask for issue description instead of attachment
        simulateTyping(() => {
          setMessages([...updatedMessages, { type: 'bot', content: 'Please describe your issue in detail.' }]);
        });
        setCurrentStep('statement');
        break;
        
      case 'statement':
        // Save the statement then ask about attachments
        setTicketData({ ...ticketData, statement: userInput });
        simulateTyping(() => {
          setMessages([...updatedMessages, { 
            type: 'bot', 
            content: 'Would you like to upload an attachment? (optional)',
            options: [
              { label: '📎 Upload a file', action: 'upload' },
              { label: '⏩ Skip this step', action: 'skip' }
            ]
          }]);
        });
        setCurrentStep('attachment');
        break;
        
      case 'attachment':
        // Handle if user types "yes" or "no" instead of using buttons
        if (userInput.toLowerCase().includes('yes') || userInput.toLowerCase().includes('upload')) {
          fileInputRef.current.click();
        } else {
          // Run AI analysis after declining attachment
          runAIAnalysis([...updatedMessages, { type: 'user', content: 'No attachment needed' }]);
        }
        break;
        
      case 'confirmation':
        if (userInput.toLowerCase().includes('yes') || userInput.toLowerCase().includes('create') || userInput.toLowerCase().includes('submit')) {
          submitTicket();
        } else {
          simulateTyping(() => {
            setMessages([...updatedMessages, { type: 'bot', content: 'Ticket creation canceled. Is there anything else I can help you with?' }]);
          });
          setCurrentStep('initial');
        }
        break;
    }
    
    setUserInput('');
  };

  const submitTicket = async () => {
    setIsSubmitting(true);
    
    const updatedMessages = [...messages, { 
      type: 'bot', 
      content: 'Creating your ticket...',
      isLoading: true
    }];
    setMessages(updatedMessages);
    
    try {
      const formDataToSend = new FormData();
      Object.keys(ticketData).forEach(key => {
        if (key === 'attachment' && ticketData[key]) {
          formDataToSend.append(key, ticketData[key]);
        } else if (key !== 'attachment') {
          formDataToSend.append(key, ticketData[key]);
        }
      });
      
      // Include sentiment data if available
      if (sentimentResults) {
        formDataToSend.append("sentimentScore", sentimentResults.score || 0);
        formDataToSend.append("suggestedSolution", sentimentResults.suggestedSolution || "");
        formDataToSend.append("sentiment", sentimentResults.sentiment || "NEUTRAL");
      }
      
      const response = await axios.post('/api/tickets/', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      const ticket = response.data;
      const ticketId = ticket.ticketid || ticket._id || ticket.id || 'TK' + Date.now();
      
      // Send confirmation email using centralized function
      try {
        const emailResult = await sendTicketConfirmationEmail({
          email: ticketData.email,
          name: ticketData.name,
          ticketId: ticketId,
          subject: ticketData.subject,
          department: ticketData.department,
          priority: ticketData.priority,
          date: ticketData.date,
          statement: ticketData.statement,
          aiPredictedCategory: sentimentResults?.predictedCategory || 'General',
          automatedResponse: sentimentResults?.suggestedSolution || 'Standard support response'
        });
        
        if (!emailResult.success) {
          console.error('Email sending failed:', emailResult.error);
        }
      } catch (emailError) {
        console.error('Email confirmation failed:', emailError);
      }
      
      // Remove loading message
      updatedMessages.pop();
      
      updatedMessages.push({ 
        type: 'bot', 
        content: `
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
            <CheckCircle2 class="text-green-500" size={24} />
          </div>
          <div class="text-center mb-2 font-semibold">Ticket Created Successfully!</div>
          <div class="text-center mb-2">Ticket ID: <span class="font-mono bg-gray-100 px-2 py-1 rounded">${ticketId}</span></div>
          <div class="text-center text-sm text-gray-500">A confirmation email has been sent to ${ticketData.email}</div>
        `,
        isHTML: true,
        isSuccess: true
      });
      
      simulateTyping(() => {
        updatedMessages.push({ 
          type: 'bot', 
          content: 'Is there anything else I can help you with today?'
        });
        setMessages(updatedMessages);
      });
      
      // Reset sentiment and go to initial state
      setSentimentResults(null);
      setCurrentStep('initial');
      toast.success("Ticket created successfully!");
      
    } catch (error) {
      console.error("Error creating ticket:", error);
      
      // Remove loading message
      updatedMessages.pop();
      
      updatedMessages.push({ 
        type: 'bot', 
        content: 'Sorry, there was an error creating your ticket. Please try again or contact support directly.',
        isError: true
      });
      setCurrentStep('initial');
      toast.error("Failed to create ticket");
    } finally {
      setIsSubmitting(false);
      setMessages(updatedMessages);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Interface */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className={`mb-4 bg-white rounded-2xl shadow-2xl w-[90%] max-w-md flex flex-col max-h-[80vh] 
            border border-gray-200 overflow-hidden transition-all duration-300 transform
            ${animation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {/* Header - Fixed height and better alignment with FIXED SPACING */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-16 px-4 flex justify-between items-center text-white relative overflow-hidden">
            <div className="flex items-center z-10">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3 flex-shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex flex-col leading-tight">
                <h3 className="font-medium text-sm md:text-base truncate leading-none mb-0.5">Support Assistant</h3>
                <div className="flex items-center text-xs text-blue-100">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-1 flex-shrink-0"></div>
                  <span className="truncate">Online</span>
                </div>
              </div>
            </div>
            
            {/* Action buttons in header */}
            <div className="flex items-center gap-2 z-10">
              {/* New Chat button */}
              <button 
                onClick={() => {
                  if(currentStep !== 'initial') {
                    if(confirm("Are you sure you want to start a new conversation? Current progress will be lost.")) {
                      resetChat();
                    }
                  } else {
                    resetChat();
                  }
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors flex items-center justify-center"
                title="New Chat"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              
              {/* Close button */}
              <button 
                onClick={toggleChat}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors flex items-center justify-center"
                title="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Decorative elements - with proper z-index */}
            <div className="absolute top-10 right-12 w-16 h-16 bg-white bg-opacity-10 rounded-full z-0"></div>
            <div className="absolute bottom-0 left-12 w-8 h-8 bg-white bg-opacity-10 rounded-full z-0"></div>
          </div>
          
          {/* Messages - with stacking context to prevent layout shift */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white relative"
            style={{ maxHeight: '60vh' }}
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}
                  transition-all duration-300 transform animate-fadeIn`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm 
                    ${message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : message.isError 
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : message.isSuccess
                          ? 'bg-green-50 text-gray-800 border border-green-200'
                          : 'bg-white text-gray-800 border border-gray-100'
                    }
                    ${message.isLoading ? 'animate-pulse' : ''}
                  `}
                >
                  {message.type !== 'user' && !message.options && !message.isHTML && (
                    <div className="flex items-center mb-1">
                      <Bot className="h-4 w-4 mr-1 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-blue-600 truncate">Assistant</span>
                    </div>
                  )}
                  
                  {message.isHTML ? (
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
                  ) : message.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                  
                  {message.options && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(option.action)}
                          className="px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 
                            rounded-full text-sm font-medium hover:shadow-md transition-all duration-200 
                            transform hover:scale-105"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {typingIndicator && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white text-gray-500 px-4 py-3 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></div>
                    </div>
                    <span className="text-xs">Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area - with fixed height */}
          <div className="border-t border-gray-200 p-4 bg-white flex flex-col">
            {currentStep === 'initial' ? (
              <button
                onClick={handleStartTicket}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 
                  text-white rounded-xl font-medium flex items-center justify-center
                  hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Create Support Ticket
              </button>
            ) : (
              <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-inner">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                {currentStep === 'attachment' && (
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors flex-shrink-0"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                )}
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 py-2 px-3 bg-transparent focus:outline-none min-w-0"
                  disabled={isSubmitting || isAnalyzing}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isSubmitting || isAnalyzing}
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    userInput.trim() && !isSubmitting && !isAnalyzing
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            )}
            
            {/* Footer with conversation actions */}
            <div className="flex items-center justify-between mt-3">
              {/* Branding */}
              <div className="text-xs text-gray-400 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" /> 
                <span className="truncate">Powered by Support AI</span>
              </div>
              
              {/* Reset button when in conversation */}
              {currentStep !== 'initial' && (
                <button 
                  onClick={() => {
                    if(confirm("Are you sure you want to start a new conversation? Current progress will be lost.")) {
                      resetChat();
                    }
                  }}
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  New Chat
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`
          bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3.5 rounded-full shadow-lg
          flex items-center justify-center transition-all duration-300 hover:shadow-xl
          ${isOpen ? 'rotate-180' : 'hover:scale-110'}
        `}
        aria-label="Chat support"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        
        {/* Animated pulse ring when closed */}
        {!isOpen && (
          <span className="absolute w-full h-full rounded-full animate-ping bg-blue-400 opacity-75"></span>
        )}
      </button>
    </div>
  );
}