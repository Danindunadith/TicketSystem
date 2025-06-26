import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, TrendingUp, Clock, User, MessageSquare, Target, Lightbulb } from 'lucide-react';
import axios from 'axios';

export default function AgentInsightsPanel({ ticketId, onClose }) {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ticketId) {
      fetchTicketInsights();
    }
  }, [ticketId]);

  const fetchTicketInsights = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/ai/ticket-insights/${ticketId}`);
      setInsights(response.data);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError('Failed to load AI insights for this ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getEmotionEmoji = (emotion) => {
    const emojiMap = {
      'joy': '😊',
      'anger': '😠',
      'sadness': '😢',
      'fear': '😰',
      'surprise': '😲',
      'frustration': '😤',
      'neutral': '😐'
    };
    return emojiMap[emotion?.toLowerCase()] || '😐';
  };

  const getSatisfactionColor = (satisfaction) => {
    switch (satisfaction?.toLowerCase()) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600">Loading AI insights...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Insights</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-3">
              <button
                onClick={fetchTicketInsights}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="mr-3 h-6 w-6" />
              <div>
                <h2 className="text-xl font-semibold">AI Ticket Insights</h2>
                <p className="text-blue-100 text-sm">Advanced analysis for Ticket #{ticketId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Ticket Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* AI Analysis Results */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="mr-2 h-5 w-5" />
                AI Analysis Results
              </h3>
              
              <div className="space-y-4">
                {/* Category Prediction */}
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Predicted Category</span>
                    <span className="text-xs text-gray-500">
                      {Math.round(insights?.ticketAnalysis?.predictedCategory?.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {insights?.ticketAnalysis?.predictedCategory?.category || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Emotion Analysis */}
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Customer Emotion</span>
                    <span className="text-xs text-gray-500">
                      {Math.round((insights?.ticketAnalysis?.emotions?.intensity || 0) * 100)}% intensity
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">
                      {getEmotionEmoji(insights?.ticketAnalysis?.emotions?.primaryEmotion)}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
                      {insights?.ticketAnalysis?.emotions?.primaryEmotion || 'neutral'}
                    </span>
                  </div>
                </div>

                {/* Urgency Level */}
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">AI Urgency Assessment</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(insights?.ticketAnalysis?.urgencyLevel)}`}>
                      {insights?.ticketAnalysis?.urgencyLevel || 'Medium'}
                    </span>
                  </div>
                </div>

                {/* Estimated Resolution */}
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Estimated Resolution</span>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-600">
                    {insights?.ticketAnalysis?.estimatedResolution || 'Standard processing time'}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Pattern Analysis */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Customer Pattern Analysis
              </h3>
              
              <div className="space-y-4">
                {/* Customer History */}
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Tickets</span>
                    <span className="text-lg font-bold text-blue-600">
                      {insights?.customerPattern?.totalTickets || 0}
                    </span>
                  </div>
                </div>

                {/* Recent Issues */}
                <div className="bg-white p-4 rounded-lg border">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Recent Issues</span>
                  <div className="space-y-1">
                    {insights?.customerPattern?.recentIssues?.slice(0, 3).map((issue, index) => (
                      <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {issue}
                      </div>
                    )) || <div className="text-xs text-gray-500">No recent issues</div>}
                  </div>
                </div>

                {/* Repeated Issue Alert */}
                {insights?.customerPattern?.isRepeatedIssue && (
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="text-sm font-medium text-orange-800">
                        Repeated Issue Detected
                      </span>
                    </div>
                    <p className="text-xs text-orange-700 mt-1">
                      Customer has reported similar issues recently
                    </p>
                  </div>
                )}

                {/* Customer Satisfaction */}
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                    <span className={`text-sm font-bold ${getSatisfactionColor(insights?.customerPattern?.customerSatisfaction)}`}>
                      {insights?.customerPattern?.customerSatisfaction || 'Unknown'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        insights?.customerPattern?.customerSatisfaction === 'High' ? 'bg-green-500' :
                        insights?.customerPattern?.customerSatisfaction === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${
                          insights?.customerPattern?.customerSatisfaction === 'High' ? 80 :
                          insights?.customerPattern?.customerSatisfaction === 'Medium' ? 50 : 20
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              AI Recommendations for Support Agent
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights?.recommendations?.map((recommendation, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-3 ${
                      recommendation.type === 'Category' ? 'bg-blue-100' :
                      recommendation.type === 'Emotion' ? 'bg-purple-100' :
                      recommendation.type === 'Similar Cases' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {recommendation.type === 'Category' ? <Target className="h-4 w-4 text-blue-600" /> :
                       recommendation.type === 'Emotion' ? <MessageSquare className="h-4 w-4 text-purple-600" /> :
                       recommendation.type === 'Similar Cases' ? <TrendingUp className="h-4 w-4 text-green-600" /> :
                       <Brain className="h-4 w-4 text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">
                        {recommendation.type}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {recommendation.message}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        → {recommendation.action}
                      </p>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="col-span-full text-center text-gray-500 py-8">
                  <Brain className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p>No specific recommendations available for this ticket</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Apply Recommendations
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Mark as Reviewed
              </button>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={fetchTicketInsights}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Refresh Insights
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
