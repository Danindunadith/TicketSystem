import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import emailjs from '@emailjs/browser';

export default function CreateTicketPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    subject: "",
    department: "",
    relatedservice: "",
    priority: "",
    attachment: null,
    statement: ""
  });
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const navigate = useNavigate();

  // EmailJS configuration - Replace with your actual values
  const EMAILJS_SERVICE_ID = 'service_jrj10f4';
  const EMAILJS_TEMPLATE_ID = 'template_l0ctqxs';
  const EMAILJS_PUBLIC_KEY = 'KHn7-uw2zB2TcNn3K';

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
    
    // Reset sentiment analysis when important fields change
    if (["statement", "subject", "department", "relatedservice"].includes(name)) {
      setAnalysisResults(null);
    }
  };

  // Function to send confirmation email
  const sendConfirmationEmail = async (ticketId) => {
    try {
      const templateParams = {
        to_name: formData.name,
        to_email: formData.email,
        ticketId: String(ticketId),
        subject: formData.subject,
        department: formData.department,
        priority: formData.priority,
        reply_to: 'support@yourcompany.com' // Replace with your support email
      };

      console.log("Sending email with params:", templateParams);

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      toast.success("Confirmation email sent successfully!");
    } catch (error) {
      console.error('Email sending failed:', error);
      toast.error("Failed to send confirmation email, but ticket was created successfully.");
    }
  };

  // Handle AI Analysis button click
  const handleAIAnalysis = async () => {
    // Validate if required fields are filled
    if (!formData.subject || !formData.statement) {
      toast.error("Please fill in at least the subject and detailed description");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await axios.post(
        `/api/analysis/sentiment`,
        {
          subject: formData.subject,
          department: formData.department,
          relatedService: formData.relatedservice,
          description: formData.statement
        }
      );
      
      setAnalysisResults(response.data);
      
      // Automatically update the priority based on sentiment analysis
      setFormData(prev => ({
        ...prev,
        priority: response.data.priority
      }));
      
      toast.success("AI analysis completed successfully");
    } catch (error) {
      console.error("AI analysis error:", error);
      toast.error("Failed to analyze ticket content");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiUrl = "/api/tickets/";
    console.log("Sending POST request to:", apiUrl);

    try {
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
      
      // Include sentiment data if available
      if (analysisResults) {
        formDataToSend.append("sentimentScore", analysisResults.score);
        formDataToSend.append("suggestedSolution", analysisResults.suggestedSolution || "");
      }

      const response = await axios.post(apiUrl, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Ticket creation response:", response.data);

      // Extract ticket ID from response (adjust based on your API response structure)
      const ticket = response.data;
      const ticketId = ticket.ticketid || ticket._id || ticket.id || 'TK' + Date.now();
      
      console.log("Extracted Ticket ID:", ticketId);

      toast.success("Ticket created successfully!");
      
      // Send confirmation email
      await sendConfirmationEmail(ticketId);
      
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
                        <span className={`w-3 h-3 rounded-full mr-2 ${
                          formData.priority === 'Low' ? 'bg-green-500' : 
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
                
                {/* Analysis Results */}
                {analysisResults && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700">Sentiment Analysis</h4>
                      <div className="flex items-center mt-1">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          analysisResults.sentiment === 'POSITIVE' ? 'bg-green-500' : 
                          analysisResults.sentiment === 'NEGATIVE' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm text-gray-600">{analysisResults.sentiment}</span>
                      </div>
                      
                      {/* Score visualization */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            analysisResults.sentiment === 'POSITIVE' ? 'bg-green-500' : 
                            analysisResults.sentiment === 'NEGATIVE' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                          style={{width: `${analysisResults.score * 100}%`}}
                        ></div>
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-500">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700">Suggested Priority</h4>
                      <div className={`mt-1 px-3 py-2 rounded-md border ${getPriorityColor(analysisResults.priority)}`}>
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${
                            analysisResults.priority === 'Low' ? 'bg-green-500' : 
                            analysisResults.priority === 'Medium' ? 'bg-yellow-500' : 
                            analysisResults.priority === 'High' ? 'bg-orange-500' : 
                            'bg-red-500'
                          }`}></span>
                          <span>{analysisResults.priority}</span>
                        </div>
                      </div>
                    </div>
                    
                    {analysisResults.suggestedSolution && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700">Suggested Solution</h4>
                        <div className="mt-1 p-3 bg-white rounded border border-gray-200 text-sm">
                          {analysisResults.suggestedSolution}
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