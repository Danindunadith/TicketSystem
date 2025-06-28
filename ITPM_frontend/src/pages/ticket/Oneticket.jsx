import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaFilePdf, FaImage, FaRobot, FaBrain, FaChartBar, FaClock, FaEye, FaHeart, FaExclamationTriangle } from "react-icons/fa";
import { Brain, Zap, Target, TrendingUp, AlertCircle, Bot, Sparkles } from 'lucide-react';

export default function OneTicketPage() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`/api/tickets/${id}`);
        setTicket(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket:", err.response);
        toast.error(err?.response?.data?.message || "Failed to load ticket details");
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleBack = () => {
    navigate("/admin/tickets");
  };

  //handle reply
  const handleReply = () => {
    navigate("/admin/users");
  };



  // Function to check if the attachment is an image
  const isImage = (url) => {
    if (!url) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    const extension = url.toLowerCase().slice(url.lastIndexOf("."));
    return imageExtensions.includes(extension);
  };

  // Function to check if the attachment is a PDF
  const isPDF = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith(".pdf");
  };

  // Function to get the file name from the URL
  const getFileName = (url) => {
    if (!url) return "Download File";
    const decodedUrl = decodeURIComponent(url); // Decode URL to handle encoded characters
    return decodedUrl.split("/").pop() || "Download File";
  };

  // Function to construct the absolute URL
  const getAbsoluteUrl = (url) => {
    const baseUrl = "http://localhost:3002"; // Adjust to your backend URL
    return url.startsWith("http") ? url : `${baseUrl}${url}`;
  };

  // Fallback function to handle file download (for images and other files)
  const handleDownload = async (url, fileName, isImageFile = false) => {
    try {
      const absoluteUrl = getAbsoluteUrl(url);
      const response = await fetch(absoluteUrl, {
        method: "GET",
        headers: isImageFile
          ? { Accept: "image/*" }
          : { Accept: "application/octet-stream" },
        credentials: "include", // Include credentials if needed for authentication
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch the file: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download error:", err);
      toast.error(`Failed to download the file: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Blue header with icon */}
        <div className="bg-blue-500 p-6 flex items-center mb-8 rounded-lg">
          <div className="bg-blue-400 rounded-full p-2 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Ticket Details</h2>
        </div>

        {loading ? (
          <div className="text-center">
            <p className="text-gray-600">Loading ticket...</p>
          </div>
        ) : !ticket ? (
          <div className="text-center">
            <p className="text-gray-600">Ticket not found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Ticket: {ticket.subject}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Name:</span> {ticket.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Email:</span> {ticket.email}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(ticket.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Department:</span> {ticket.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Related Service:</span> {ticket.relatedservice}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Priority:</span> {ticket.priority}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Attachment:</span>{" "}
                    {ticket.attachment ? (
                      isImage(ticket.attachment) ? (
                        <div className="mt-2">
                          <img
                            src={getAbsoluteUrl(ticket.attachment)}
                            alt="Ticket Attachment"
                            className="max-w-full h-auto rounded-md shadow-md"
                            style={{ maxWidth: "300px" }}
                            onError={() => toast.error("Failed to load image")}
                          />
                          <div className="flex items-center mt-2">
                            <FaImage className="text-blue-500 mr-2" />
                            <a
                              href={getAbsoluteUrl(ticket.attachment)}
                              download={getFileName(ticket.attachment)}
                              className="text-blue-500 hover:underline mr-4"
                              onClick={(e) => {
                                // Fallback to handleDownload if direct download fails
                                e.preventDefault();
                                handleDownload(ticket.attachment, getFileName(ticket.attachment), true);
                              }}
                            >
                              Download Image: {getFileName(ticket.attachment)}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {isPDF(ticket.attachment) && <FaFilePdf className="text-red-500 mr-2" />}
                          <a
                            href={getAbsoluteUrl(ticket.attachment)}
                            download={getFileName(ticket.attachment)}
                            className="text-blue-500 hover:underline"
                            onClick={(e) => {
                              // Fallback to handleDownload if direct download fails
                              e.preventDefault();
                              handleDownload(ticket.attachment, getFileName(ticket.attachment));
                            }}
                          >
                            Download {isPDF(ticket.attachment) ? "PDF" : "File"}: {getFileName(ticket.attachment)}
                          </a>
                        </div>
                      )
                    ) : (
                      "None"
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Statement:</span>
                </p>
                <p className="text-sm text-gray-800 bg-gray-100 p-4 rounded-md">
                  {ticket.statement}
                </p>
              </div>

              {/* AI Generated Content Section */}
              {(ticket.aiPredictedCategory || ticket.sentimentScore || ticket.automatedResponse || ticket.detectedEmotion || ticket.aiInsights) && (
                <div className="mt-8 border-t pt-6">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 mr-3">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">AI Generated Analysis</h4>
                    <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      AI POWERED
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {/* AI Category Prediction */}
                    {ticket.aiPredictedCategory && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Target className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-semibold text-blue-800">AI Category</span>
                        </div>
                        <p className="text-blue-700 font-medium capitalize">{ticket.aiPredictedCategory}</p>
                        {ticket.categoryConfidence && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-blue-600 mb-1">
                              <span>Confidence</span>
                              <span>{Math.round(ticket.categoryConfidence * 100)}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${ticket.categoryConfidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sentiment Analysis */}
                    {ticket.sentimentScore !== undefined && ticket.sentimentScore !== null && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FaHeart className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-semibold text-green-800">Sentiment Score</span>
                        </div>
                        <p className="text-green-700 font-medium">
                          {ticket.sentimentScore > 0.7 ? 'Positive' : 
                           ticket.sentimentScore < 0.4 ? 'Negative' : 'Neutral'}
                        </p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-green-600 mb-1">
                            <span>Score</span>
                            <span>{(ticket.sentimentScore * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                ticket.sentimentScore > 0.7 ? 'bg-green-600' : 
                                ticket.sentimentScore < 0.4 ? 'bg-red-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${ticket.sentimentScore * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        {ticket.sentimentAnalyzedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Analyzed: {new Date(ticket.sentimentAnalyzedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* AI Suggested Priority */}
                    {ticket.aiSuggestedPriority && (
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                          <span className="font-semibold text-orange-800">AI Priority</span>
                        </div>
                        <div className="flex items-center">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              ticket.aiSuggestedPriority === 'Critical' ? 'bg-red-100 text-red-800' :
                              ticket.aiSuggestedPriority === 'High' ? 'bg-orange-100 text-orange-800' :
                              ticket.aiSuggestedPriority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}
                          >
                            {ticket.aiSuggestedPriority}
                          </span>
                          {ticket.priority !== ticket.aiSuggestedPriority && (
                            <span className="ml-2 text-xs text-gray-500">
                              (Manual: {ticket.priority})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Detected Emotion */}
                    {ticket.detectedEmotion && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FaEye className="h-5 w-5 text-purple-600 mr-2" />
                          <span className="font-semibold text-purple-800">Detected Emotion</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">
                            {ticket.detectedEmotion === 'joy' ? '😊' : 
                             ticket.detectedEmotion === 'anger' ? '😠' : 
                             ticket.detectedEmotion === 'sadness' ? '😢' : 
                             ticket.detectedEmotion === 'fear' ? '😰' : 
                             ticket.detectedEmotion === 'surprise' ? '😲' : '😐'}
                          </span>
                          <span className="text-purple-700 font-medium capitalize">{ticket.detectedEmotion}</span>
                        </div>
                        {ticket.emotionIntensity && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-purple-600 mb-1">
                              <span>Intensity</span>
                              <span>{(ticket.emotionIntensity * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-purple-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${ticket.emotionIntensity * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Estimated Resolution Time */}
                    {ticket.estimatedResolutionTime && (
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FaClock className="h-5 w-5 text-cyan-600 mr-2" />
                          <span className="font-semibold text-cyan-800">Est. Resolution</span>
                        </div>
                        <p className="text-cyan-700 font-medium">{ticket.estimatedResolutionTime}</p>
                      </div>
                    )}

                    {/* Automation Status */}
                    {(ticket.hasAutomatedSolution || ticket.automatedSolutionAttempted) && (
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Zap className="h-5 w-5 text-emerald-600 mr-2" />
                          <span className="font-semibold text-emerald-800">Automation</span>
                        </div>
                        <div className="space-y-1">
                          {ticket.hasAutomatedSolution && (
                            <div className="flex items-center text-emerald-700">
                              <span className="text-xs bg-emerald-100 px-2 py-1 rounded-full">Automated Solution</span>
                            </div>
                          )}
                          {ticket.automatedSolutionAttempted && (
                            <div className="flex items-center text-emerald-700">
                              <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-700">Solution Attempted</span>
                            </div>
                          )}
                          {ticket.automatedSolutionSatisfaction && (
                            <div className="flex items-center text-emerald-700">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                ticket.automatedSolutionSatisfaction === 'satisfied' ? 'bg-green-100 text-green-700' :
                                ticket.automatedSolutionSatisfaction === 'needs_more_help' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {ticket.automatedSolutionSatisfaction.replace('_', ' ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Generated Response */}
                  {ticket.automatedResponse && (
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center mb-3">
                        <Bot className="h-6 w-6 text-indigo-600 mr-2" />
                        <span className="font-semibold text-indigo-800 text-lg">AI Generated Response</span>
                        <Sparkles className="h-4 w-4 text-indigo-500 ml-2" />
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-indigo-100">
                        <p className="text-gray-800 leading-relaxed">{ticket.automatedResponse}</p>
                      </div>
                    </div>
                  )}

                  {/* AI Insights */}
                  {ticket.aiInsights && (
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-6">
                      <div className="flex items-center mb-3">
                        <FaBrain className="h-6 w-6 text-violet-600 mr-2" />
                        <span className="font-semibold text-violet-800 text-lg">AI Insights & Analysis</span>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-violet-100">
                        {typeof ticket.aiInsights === 'string' ? (
                          <p className="text-gray-800">{ticket.aiInsights}</p>
                        ) : (
                          <div className="space-y-2">
                            {Object.entries(ticket.aiInsights).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="text-gray-600">
                                  {Array.isArray(value) ? value.join(', ') : 
                                   typeof value === 'object' ? JSON.stringify(value) : 
                                   String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Support Action */}
                  {ticket.supportAction && (
                    <div className="mt-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <FaExclamationTriangle className="h-5 w-5 text-amber-600 mr-2" />
                        <span className="font-semibold text-amber-800">Recommended Action</span>
                      </div>
                      <p className="text-amber-700">{ticket.supportAction}</p>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={handleBack}
                className="mt-6 w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Back to Tickets
              </button>
              

              <button 
    onClick={() => navigate(`/admin/tickets/reply/${id}`, {state: ticket})}
    className="mt-6 w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
>
    Reply to ticket
</button>


            </div>
          </div>
        )}
      </div>
    </div>
  );
}