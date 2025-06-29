import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import '@emailjs/browser';


// EmailJS Configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_jrj10f4',
  TEMPLATE_ID: 'template_l0ctqxs',
  PUBLIC_KEY: 'KHn7-uw2zB2TcNn3K'
};

// Email confirmation function
const sendTicketConfirmationEmail = async (ticketData) => {
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
      ai_category: ticketData.aiPredictedCategory || 'Not specified',
      automated_response: ticketData.automatedResponse || 'No automated response available',
      reply_to: 'support@yourcompany.com'
    };

    const result = await emailjs.default.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Email sent successfully:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

export default function CreateTicketPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: new Date().toISOString().split('T')[0],
    subject: "",
    department: "",
    relatedservice: "",
    priority: "",
    attachment: null,
    statement: "",
    aiPredictedCategory: "",
    automatedResponse: ""
  });
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: files ? files[0] : value
    };

    // Auto-detect department and related service when subject or statement changes
    if (name === 'subject' || name === 'statement') {
      const subject = name === 'subject' ? value : formData.subject;
      const statement = name === 'statement' ? value : formData.statement;

      if (subject && statement) {
        const detectedDepartment = detectDepartment(subject, statement);
        const detectedService = detectRelatedService(subject, statement, detectedDepartment);

        updatedFormData = {
          ...updatedFormData,
          department: detectedDepartment,
          relatedservice: detectedService
        };
      }
    }

    setFormData(updatedFormData);

    // Reset sentiment analysis when important fields change
    if (["statement", "subject", "department", "relatedservice"].includes(name)) {
      setAnalysisResults(null);
    }
  };

  // Handle comprehensive AI Analysis with all features matching chatbot
  const handleAIAnalysis = async () => {
    // Validate if required fields are filled
    if (!formData.subject || !formData.statement) {
      toast.error("Please fill in at least the subject and detailed description");
      return;
    }

    setIsAnalyzing(true);

    try {
      const fullMessage = `${formData.subject}. ${formData.statement}`;

      // Run comprehensive AI analysis using the new endpoint
      const analysisResponse = await axios.post(`http://localhost:3002/api/ai/analyze-ticket`, {
        title: formData.subject,
        description: formData.statement,
        priority: formData.priority
      });

      if (analysisResponse.data.success) {
        const aiResults = analysisResponse.data;

        // Set the comprehensive results directly from the new endpoint
        const comprehensiveResults = {
          // Basic sentiment analysis
          sentiment: aiResults.sentiment,
          sentimentScore: aiResults.sentimentScore,

          // Category prediction
          predictedCategory: {
            category: aiResults.predictedCategory,
            confidence: aiResults.categoryConfidence
          },

          // Priority and urgency
          aiSuggestedPriority: aiResults.aiSuggestedPriority,
          urgency: aiResults.urgency,

          // Emotion analysis
          detectedEmotion: aiResults.detectedEmotion,
          emotionIntensity: aiResults.emotionIntensity,
          emotions: aiResults.emotions,

          // AI-generated content
          automatedResponse: aiResults.automatedResponse,
          estimatedResolutionTime: aiResults.estimatedResolutionTime,
          supportAction: aiResults.supportAction,

          // Additional insights
          chatbotSuggestions: aiResults.chatbotSuggestions,
          shouldEscalate: aiResults.shouldEscalate,

          // AI insights
          aiInsights: aiResults.aiInsights
        };

        setAnalysisResults(comprehensiveResults);

        // Update the priority based on AI analysis
        setFormData(prev => ({
          ...prev,
          priority: comprehensiveResults.aiSuggestedPriority
        }));

        toast.success("Comprehensive AI analysis completed successfully");
      } else {
        throw new Error('AI analysis failed');
      }

    } catch (error) {
      console.error("AI analysis error:", error);

      // Fallback to original analysis endpoints
      try {
        const [sentimentResponse, categoryResponse] = await Promise.all([
          axios.post(`http://localhost:3002/api/analysis/sentiment`, {
            subject: formData.subject,
            department: formData.department,
            relatedService: formData.relatedservice,
            description: formData.statement
          }),
          axios.post(`http://localhost:3002/api/ai/predict-category`, {
            subject: formData.subject,
            description: formData.statement,
            department: formData.department
          })
        ]);

        // Combine fallback results
        const fallbackResults = {
          sentiment: sentimentResponse.data.sentiment || 'NEUTRAL',
          sentimentScore: sentimentResponse.data.score || 0.5,
          predictedCategory: categoryResponse.data.predictions[0] || { category: 'general inquiry', confidence: 0.5 },
          aiSuggestedPriority: sentimentResponse.data.priority || 'Medium',
          automatedResponse: categoryResponse.data.automatedResponse,
          estimatedResolutionTime: categoryResponse.data.estimatedResolutionTime,
          detectedEmotion: 'neutral',
          emotionIntensity: 0.5,
          supportAction: 'Standard support response',
          aiInsights: {
            fallbackMode: true,
            analysisTimestamp: new Date().toISOString()
          }
        };

        setAnalysisResults(fallbackResults);

        setFormData(prev => ({
          ...prev,
          priority: fallbackResults.aiSuggestedPriority
        }));

        toast.success("Fallback AI analysis completed");
      } catch (fallbackError) {
        console.error("Fallback analysis error:", fallbackError);
        toast.error("Failed to analyze ticket content");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to map urgency levels to priority
  const mapUrgencyToPriority = (urgency) => {
    switch (urgency) {
      case 'High': return 'Critical';
      case 'Medium': return 'High';
      case 'Low': return 'Medium';
      default: return 'Medium';
    }
  };

  // Smart department detection based on subject and statement
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

    // Default to Support for general inquiries
    return 'Support';
  };

  // Smart related service detection
  const detectRelatedService = (subject, statement, department) => {
    const text = `${subject} ${statement}`.toLowerCase();

    if (department === 'IT') {
      if (text.includes('email') || text.includes('outlook') || text.includes('gmail')) return 'Email';
      if (text.includes('password') || text.includes('login') || text.includes('access')) return 'Authentication';
      if (text.includes('network') || text.includes('wifi') || text.includes('internet')) return 'Network';
      if (text.includes('software') || text.includes('application') || text.includes('program')) return 'Software';
      if (text.includes('hardware') || text.includes('computer') || text.includes('laptop')) return 'Hardware';
      if (text.includes('printer') || text.includes('print')) return 'Printer';
      if (text.includes('phone') || text.includes('mobile') || text.includes('telephone')) return 'Phone';
      return 'General IT';
    }

    if (department === 'HR') {
      if (text.includes('payroll') || text.includes('salary')) return 'Payroll';
      if (text.includes('benefits') || text.includes('insurance')) return 'Benefits';
      if (text.includes('leave') || text.includes('vacation')) return 'Leave Management';
      if (text.includes('training') || text.includes('development')) return 'Training';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get token and decode user id
    const token = localStorage.getItem("token");
    console.log("🔑 Token used for ticket creation:", token);
    let userId = null;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("🔓 Decoded token:", decoded);
        userId = decoded?._id || decoded.userId || decoded.id || decoded.sub || null;
        console.log("👤 Extracted userId:", userId);
        console.log("🔍 userId type:", typeof userId);
      } catch (err) {
        console.error("❌ Failed to decode token:", err);
      }
    } else {
      console.warn("⚠️ No token found in localStorage");
    }

    const apiUrl = "http://localhost:3002/api/tickets/";
    console.log("Sending POST request to:", apiUrl);

    try {
      // ALWAYS run AI analysis before ticket submission to ensure fresh data
      let currentAnalysisResults = null;
      if (formData.subject && formData.statement) {
        console.log("Running AI analysis before ticket submission...");
        try {
          const analysisResponse = await axios.post(`http://localhost:3002/api/ai/analyze-ticket`, {
            title: formData.subject,
            description: formData.statement,
            priority: formData.priority
          });

          if (analysisResponse.data && analysisResponse.data.success) {
            currentAnalysisResults = {
              sentiment: analysisResponse.data.sentiment,
              sentimentScore: analysisResponse.data.sentimentScore,
              predictedCategory: {
                category: analysisResponse.data.predictedCategory,
                confidence: analysisResponse.data.categoryConfidence
              },
              aiSuggestedPriority: analysisResponse.data.aiSuggestedPriority,
              urgency: analysisResponse.data.urgency,
              detectedEmotion: analysisResponse.data.detectedEmotion,
              emotionIntensity: analysisResponse.data.emotionIntensity,
              emotions: analysisResponse.data.emotions,
              automatedResponse: analysisResponse.data.automatedResponse,
              estimatedResolutionTime: analysisResponse.data.estimatedResolutionTime,
              supportAction: analysisResponse.data.supportAction,
              chatbotSuggestions: analysisResponse.data.chatbotSuggestions,
              shouldEscalate: analysisResponse.data.shouldEscalate,
              aiInsights: analysisResponse.data.aiInsights
            };
            setAnalysisResults(currentAnalysisResults);
            console.log("✅ AI analysis completed successfully");
            console.log("AI analysis results:", {
              sentiment: currentAnalysisResults.sentiment,
              category: currentAnalysisResults.predictedCategory?.category,
              shouldEscalate: currentAnalysisResults.shouldEscalate,
              hasAutomatedResponse: !!currentAnalysisResults.automatedResponse
            });
          } else {
            console.warn("AI analysis response missing success field");
          }
        } catch (analysisError) {
          console.error("AI analysis failed:", analysisError.response?.data || analysisError.message);
          console.warn("Proceeding without AI analysis");
        }
      } else {
        console.warn("Missing subject or statement - skipping AI analysis");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("relatedservice", formData.relatedservice);
      formDataToSend.append("priority", formData.priority);
      if (formData.attachment) {
        formDataToSend.append("attachment", formData.attachment);
      }
      formDataToSend.append("statement", formData.statement);
      if (userId) {
        formDataToSend.append("userId", userId);
        console.log("✅ Successfully appended userId to FormData:", userId);
        console.log("🚀 Ready to send userId to backend:", {
          userId: userId,
          userIdType: typeof userId,
          userIdLength: userId.toString().length
        });
      } else {
        console.warn("⚠️ No userId found in token - proceeding without userId");
      }

      // Include comprehensive AI analysis data if available (same as chatbot)
      if (currentAnalysisResults) {
        // Basic sentiment and category
        formDataToSend.append("sentiment", currentAnalysisResults.sentiment);
        formDataToSend.append("sentimentScore", currentAnalysisResults.sentimentScore);
        formDataToSend.append("aiPredictedCategory", currentAnalysisResults.predictedCategory?.category || "");
        formDataToSend.append("categoryConfidence", currentAnalysisResults.predictedCategory?.confidence || "");

        // AI-suggested priority and urgency
        formDataToSend.append("aiSuggestedPriority", currentAnalysisResults.aiSuggestedPriority);
        formDataToSend.append("urgency", currentAnalysisResults.urgency);

        // Emotion detection
        if (currentAnalysisResults.detectedEmotion) {
          formDataToSend.append("detectedEmotion", currentAnalysisResults.detectedEmotion);
        }
        if (currentAnalysisResults.emotionIntensity) {
          formDataToSend.append("emotionIntensity", currentAnalysisResults.emotionIntensity);
        }
        if (currentAnalysisResults.emotions) {
          formDataToSend.append("emotions", JSON.stringify(currentAnalysisResults.emotions));
        }

        // AI-generated content
        if (currentAnalysisResults.automatedResponse) {
          formDataToSend.append("automatedResponse", currentAnalysisResults.automatedResponse);
        }
        if (currentAnalysisResults.estimatedResolutionTime) {
          formDataToSend.append("estimatedResolutionTime", currentAnalysisResults.estimatedResolutionTime);
        }
        if (currentAnalysisResults.supportAction) {
          formDataToSend.append("supportAction", currentAnalysisResults.supportAction);
        }

        // AI insights and metadata
        if (currentAnalysisResults.chatbotSuggestions) {
          formDataToSend.append("chatbotSuggestions", JSON.stringify(currentAnalysisResults.chatbotSuggestions));
        }
        formDataToSend.append("shouldEscalate", currentAnalysisResults.shouldEscalate);
        if (currentAnalysisResults.aiInsights) {
          formDataToSend.append("aiInsights", JSON.stringify(currentAnalysisResults.aiInsights));
        }

        // Automation flags
        formDataToSend.append("hasAutomatedSolution", "true");
        formDataToSend.append("automatedSolutionAttempted", "true");

        // Add timestamp for AI analysis
        formDataToSend.append("sentimentAnalyzedAt", new Date().toISOString());

        // Log comprehensive AI data being sent
        console.log("Comprehensive AI analysis data being sent:", {
          sentiment: currentAnalysisResults.sentiment,
          sentimentScore: currentAnalysisResults.sentimentScore,
          aiPredictedCategory: currentAnalysisResults.predictedCategory?.category,
          categoryConfidence: currentAnalysisResults.predictedCategory?.confidence,
          aiSuggestedPriority: currentAnalysisResults.aiSuggestedPriority,
          detectedEmotion: currentAnalysisResults.detectedEmotion,
          emotionIntensity: currentAnalysisResults.emotionIntensity,
          estimatedResolutionTime: currentAnalysisResults.estimatedResolutionTime,
          shouldEscalate: currentAnalysisResults.shouldEscalate,
          hasAutomatedSolution: true,
          automatedSolutionAttempted: true
        });
      }

      const response = await axios.post(apiUrl, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Ticket creation response:", response.data);

      // Extract ticket ID from response
      const ticket = response.data;
      const ticketId = ticket.ticketid || ticket._id || ticket.id || 'TK' + Date.now();

      console.log("Extracted Ticket ID:", ticketId);

      toast.success("Ticket created successfully!");

      // Send confirmation email using EmailJS
      try {
        const emailResult = await sendTicketConfirmationEmail({
          email: formData.email,
          name: formData.name,
          ticketId: ticketId,
          subject: formData.subject,
          department: formData.department,
          priority: formData.priority,
          date: formData.date,
          statement: formData.statement,
          aiPredictedCategory: formData.aiPredictedCategory,
          automatedResponse: formData.automatedResponse
        });

        if (emailResult.success) {
          toast.success("Confirmation email sent successfully!");
        } else {
          throw new Error(emailResult.error);
        }
      } catch (emailError) {
        console.warn('EmailJS confirmation failed:', emailError);

        // Check if it's a configuration issue
        const configTest = testEmailJSConfig();
        if (!configTest.isConfigured) {
          console.warn('EmailJS not configured:', configTest.issues);
          toast.warning("Email confirmation is not configured. Please check the setup guide.");
        } else {
          toast.error("Failed to send confirmation email, but ticket was created successfully.");
        }
      }

      navigate("/");

    } catch (err) {
      console.error("Error details:", err.response);
      toast.error(err?.response?.data?.message || "An error occurred while creating the ticket");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h3a2 2 0 002-2v-2h1a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">Help Desk</h1>
                <p className="text-sm text-gray-500">Create Support Ticket</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Tickets
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Create New Support Ticket</h2>
                <p className="text-sm text-gray-600">Please provide detailed information about your issue</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Contact Information Section */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your.email@company.com"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Details Section */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ticket Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                {/* Priority Display (Read-Only) - Now determined by AI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  {formData.priority ? (
                    <div className={`px-3 py-2 rounded-md border ${getPriorityColor(formData.priority)}`}>
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${formData.priority === 'Low' ? 'bg-green-500' :
                          formData.priority === 'Medium' ? 'bg-yellow-500' :
                            formData.priority === 'High' ? 'bg-orange-500' :
                              'bg-red-500'
                          }`}></span>
                        <span>{formData.priority}</span>
                        {analysisResults && <span className="text-xs text-gray-500 ml-auto">AI determined</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-2 rounded-md border border-gray-300 text-gray-500">
                      Will be determined by AI analysis
                    </div>
                  )}
                  <input type="hidden" name="priority" value={formData.priority} />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select department</option>
                    <option value="IT">💻 IT Support</option>
                    <option value="HR">👥 Human Resources</option>
                    <option value="Finance">💰 Finance</option>
                    <option value="Support">🛟 General Support</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="relatedservice" className="block text-sm font-medium text-gray-700 mb-2">
                    Related Service <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="relatedservice"
                    name="relatedservice"
                    placeholder="e.g., Email, VPN, Software, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    value={formData.relatedservice}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Issue Description Section */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Issue Description
              </h3>
              <div className="mb-6">
                <label htmlFor="statement" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="statement"
                  name="statement"
                  placeholder="Please provide a detailed description of the issue, including steps to reproduce, error messages, and any relevant context..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="6"
                  required
                  value={formData.statement}
                  onChange={handleChange}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Tip: Include error messages, screenshots, and steps you've already tried
                </p>
              </div>

              <div>
                <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">
                  Attachment (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="attachment" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          id="attachment"
                          name="attachment"
                          type="file"
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          className="sr-only"
                          onChange={handleChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC up to 10MB</p>
                  </div>
                </div>
                {formData.attachment && (
                  <div className="mt-2 text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {formData.attachment.name}
                  </div>
                )}
              </div>

              {/* AI Analysis Button - Added below attachment section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Generated Analysis
                </h3>
                <button
                  type="button"
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing || !formData.subject || !formData.statement}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Ticket...
                    </div>
                  ) : (
                    "Generate AI Analysis"
                  )}
                </button>

                {/* Comprehensive AI Analysis Results - Matching Chatbot Features */}
                {analysisResults && (
                  <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 mr-3">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">AI Generated Analysis</h4>
                        <div className="flex items-center">
                          <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            AI POWERED
                          </div>
                          <span className="ml-2 text-xs text-gray-500">Same AI technology as our chatbot</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {/* Sentiment Analysis */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="font-semibold text-green-800">Sentiment Score</span>
                        </div>
                        <p className="text-green-700 font-medium">
                          {analysisResults.sentiment ||
                            (analysisResults.sentimentScore > 0.7 ? 'POSITIVE' :
                              analysisResults.sentimentScore < 0.4 ? 'NEGATIVE' : 'NEUTRAL')}
                        </p>
                        <div className="mt-2">
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${(analysisResults.sentimentScore || analysisResults.score) > 0.7 ? 'bg-green-600' :
                                (analysisResults.sentimentScore || analysisResults.score) < 0.4 ? 'bg-red-500' : 'bg-yellow-500'
                                }`}
                              style={{ width: `${(analysisResults.sentimentScore || analysisResults.score || 0.5) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-green-600 mt-1">
                            <span>Score: {((analysisResults.sentimentScore || analysisResults.score || 0.5) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Category Prediction */}
                      {analysisResults.predictedCategory && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="font-semibold text-blue-800">AI Category</span>
                          </div>
                          <p className="text-blue-700 font-medium capitalize">{analysisResults.predictedCategory.category}</p>
                          {analysisResults.predictedCategory.confidence && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-blue-600 mb-1">
                                <span>Confidence</span>
                                <span>{Math.round(analysisResults.predictedCategory.confidence * 100)}%</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${analysisResults.predictedCategory.confidence * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Priority Suggestion */}
                      {analysisResults.aiSuggestedPriority && (
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold text-orange-800">AI Priority</span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${analysisResults.aiSuggestedPriority === 'Critical' ? 'bg-red-100 text-red-800' :
                              analysisResults.aiSuggestedPriority === 'High' ? 'bg-orange-100 text-orange-800' :
                                analysisResults.aiSuggestedPriority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                              }`}
                          >
                            {analysisResults.aiSuggestedPriority}
                          </span>
                        </div>
                      )}

                      {/* Emotion Detection */}
                      {analysisResults.detectedEmotion && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="font-semibold text-purple-800">Detected Emotion</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">
                              {analysisResults.detectedEmotion === 'joy' ? '😊' :
                                analysisResults.detectedEmotion === 'anger' ? '😠' :
                                  analysisResults.detectedEmotion === 'sadness' ? '😢' :
                                    analysisResults.detectedEmotion === 'fear' ? '😰' :
                                      analysisResults.detectedEmotion === 'surprise' ? '😲' : '😐'}
                            </span>
                            <span className="text-purple-700 font-medium capitalize">{analysisResults.detectedEmotion}</span>
                          </div>
                          {analysisResults.emotionIntensity && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-purple-600 mb-1">
                                <span>Intensity</span>
                                <span>{(analysisResults.emotionIntensity * 100).toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-purple-200 rounded-full h-2">
                                <div
                                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${analysisResults.emotionIntensity * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Estimated Resolution Time */}
                      {analysisResults.estimatedResolutionTime && (
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <svg className="h-5 w-5 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold text-cyan-800">Est. Resolution</span>
                          </div>
                          <p className="text-cyan-700 font-medium">{analysisResults.estimatedResolutionTime}</p>
                        </div>
                      )}

                      {/* Support Action */}
                      {analysisResults.supportAction && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <svg className="h-5 w-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold text-amber-800">Recommended Action</span>
                          </div>
                          <p className="text-amber-700 text-sm">{analysisResults.supportAction}</p>
                        </div>
                      )}
                    </div>

                    {/* AI Generated Response */}
                    {analysisResults.automatedResponse && (
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6 mb-4">
                        <div className="flex items-center mb-3">
                          <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                          </svg>
                          <span className="font-semibold text-indigo-800 text-lg">AI Generated Response</span>
                          <svg className="h-4 w-4 text-indigo-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                          </svg>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-indigo-100">
                          <p className="text-gray-800 leading-relaxed">{analysisResults.automatedResponse}</p>
                        </div>
                      </div>
                    )}

                    {/* AI Insights */}
                    {analysisResults.aiInsights && (
                      <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <svg className="h-5 w-5 text-violet-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="font-semibold text-violet-800">AI Insights & Analysis</span>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-violet-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Analysis Completed:</span>
                              <span className="text-gray-800">✓</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Automation Attempted:</span>
                              <span className="text-gray-800">✓</span>
                            </div>
                            {analysisResults.shouldEscalate && (
                              <div className="flex justify-between col-span-full">
                                <span className="text-gray-600">Escalation Recommended:</span>
                                <span className="text-orange-600 font-medium">Yes</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    "Create Ticket"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Need Help?</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>If you're experiencing technical difficulties or need immediate assistance, you can also:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Call our support hotline: <span className="font-semibold">072 525 5555</span></li>
                  <li>Email us directly: <span className="font-semibold">support@residue.com</span></li>
                  <li>Check our <button className="underline hover:text-blue-600">knowledge base</button> for common solutions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}