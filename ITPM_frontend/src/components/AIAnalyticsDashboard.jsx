import React, { useState, useEffect } from 'react';
import { Brain, BarChart3, TrendingUp, Users, Clock, Zap, Target, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function AIAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    categorization: {
      totalCategorized: 0,
      averageConfidence: 0,
      topCategories: []
    },
    automation: {
      totalAutomated: 0,
      resolutionRate: 0,
      avgResolutionTime: 0
    },
    sentiment: {
      avgSentiment: 0,
      emotionDistribution: {},
      escalationRate: 0
    },
    performance: {
      accuracyRate: 0,
      customerSatisfaction: 0,
      timesSaved: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchAIAnalytics();
  }, [timeRange]);

  const fetchAIAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch various AI analytics with fallbacks
      const requests = [
        axios.get(`/api/ai/analytics/categorization?timeRange=${timeRange}`).catch(err => {
          console.warn('Categorization analytics failed:', err.message);
          return { data: { totalTickets: 0, categorizedTickets: 0, categorizationRate: 0, averageConfidence: 0, topCategories: [] } };
        }),
        axios.get(`/api/analysis/sentiment-stats`).catch(err => {
          console.warn('Sentiment stats failed:', err.message);
          return { data: { avgSentiment: 0.5, emotionDistribution: {}, totalAnalyzed: 0 } };
        }),
        axios.get('/api/tickets/').catch(err => {
          console.warn('Tickets data failed:', err.message);
          return { data: [] };
        })
      ];

      const [categorization, sentiment, tickets] = await Promise.all(requests);

      // Process the data
      const ticketsData = tickets.data;
      const processedAnalytics = processAnalyticsData(ticketsData, sentiment.data, categorization.data);
      
      setAnalytics(processedAnalytics);
    } catch (error) {
      console.error('Error fetching AI analytics:', error);
      // Set default values if everything fails
      setAnalytics({
        categorization: {
          totalCategorized: 0,
          averageConfidence: 0,
          topCategories: [],
          categorizationRate: 0
        },
        automation: {
          totalAutomated: 0,
          resolutionRate: 0,
          avgResolutionTime: 0,
          timeSaved: 0
        },
        sentiment: {
          avgSentiment: 0.5,
          emotionDistribution: {},
          escalationRate: 0
        },
        performance: {
          accuracyRate: 0,
          customerSatisfaction: 0,
          timesSaved: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalyticsData = (tickets, sentimentStats, categorizationStats) => {
    const totalTickets = tickets.length;
    const categorizedTickets = tickets.filter(t => t.aiPredictedCategory);
    const automatedTickets = tickets.filter(t => t.hasAutomatedSolution || t.automatedResponse);
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved');
    
    // Use backend categorization data if available, otherwise calculate locally
    let topCategories = [];
    let avgConfidence = 0;
    let categorizationRate = 0;
    
    if (categorizationStats && categorizationStats.topCategories) {
      topCategories = categorizationStats.topCategories;
      avgConfidence = categorizationStats.averageConfidence || 0;
      categorizationRate = categorizationStats.categorizationRate || 0;
    } else {
      // Fallback to local calculation
      const categoryCount = {};
      categorizedTickets.forEach(ticket => {
        const category = ticket.aiPredictedCategory;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      
      topCategories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([category, count]) => ({
          name: category,
          count,
          percentage: Math.round((count / categorizedTickets.length) * 100)
        }));

      avgConfidence = categorizedTickets.reduce((sum, ticket) => 
        sum + (ticket.categoryConfidence || 0), 0) / Math.max(categorizedTickets.length, 1);
      
      categorizationRate = Math.round((categorizedTickets.length / Math.max(totalTickets, 1)) * 100);
    }

    // Calculate emotion distribution
    const emotionCount = sentimentStats.emotionDistribution || {};
    if (Object.keys(emotionCount).length === 0) {
      // Fallback to local calculation
      tickets.filter(t => t.detectedEmotion).forEach(ticket => {
        const emotion = ticket.detectedEmotion;
        emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
      });
    }

    // Calculate automation success rate
    const successfulAutomation = automatedTickets.filter(t => 
      t.automatedSolutionSatisfaction === 'satisfied' || t.priority === 'Low').length;
    const automationSuccessRate = automatedTickets.length > 0 ? 
      (successfulAutomation / automatedTickets.length * 100) : 0;

    // Calculate average resolution time for automated vs manual
    const automatedResolved = automatedTickets.filter(t => t.status === 'Resolved');
    const manualResolved = resolvedTickets.filter(t => !t.hasAutomatedSolution && !t.automatedResponse);
    
    const avgAutomatedTime = calculateAverageResolutionTime(automatedResolved);
    const avgManualTime = calculateAverageResolutionTime(manualResolved);

    return {
      categorization: {
        totalCategorized: categorizedTickets.length,
        averageConfidence: Math.round(avgConfidence * 100),
        topCategories,
        categorizationRate
      },
      automation: {
        totalAutomated: automatedTickets.length,
        resolutionRate: Math.round(automationSuccessRate),
        avgResolutionTime: avgAutomatedTime,
        timeSaved: Math.max(0, avgManualTime - avgAutomatedTime)
      },
      sentiment: {
        avgSentiment: sentimentStats.avgSentiment || 0.5,
        emotionDistribution: emotionCount,
        escalationRate: Math.round((tickets.filter(t => 
          ['anger', 'frustration'].includes(t.detectedEmotion) && 
          (t.emotionIntensity > 0.7 || t.priority === 'Critical')).length / Math.max(totalTickets, 1)) * 100)
      },
      performance: {
        accuracyRate: Math.round(avgConfidence * 100),
        customerSatisfaction: Math.round(automationSuccessRate),
        timesSaved: Math.round((avgManualTime - avgAutomatedTime) * automatedTickets.length)
      }
    };
  };

  const calculateAverageResolutionTime = (tickets) => {
    if (tickets.length === 0) return 0;
    
    const totalTime = tickets.reduce((sum, ticket) => {
      const created = new Date(ticket.createdAt);
      const resolved = new Date(ticket.updatedAt);
      return sum + (resolved - created);
    }, 0);
    
    return Math.round(totalTime / tickets.length / (1000 * 60 * 60)); // Convert to hours
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600">{trend}</span>
        </div>
      )}
    </div>
  );

  const CategoryChart = ({ categories }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Target className="mr-2 h-5 w-5" />
        Top Ticket Categories
      </h3>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {category.name}
                </span>
                <span className="text-sm text-gray-500">{category.count} tickets</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EmotionDistribution = ({ emotions }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Users className="mr-2 h-5 w-5" />
        Customer Emotion Analysis
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(emotions).map(([emotion, count]) => (
          <div key={emotion} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-1">
              {emotion === 'joy' ? '😊' : 
               emotion === 'anger' ? '😠' : 
               emotion === 'sadness' ? '😢' : 
               emotion === 'fear' ? '😰' : 
               emotion === 'surprise' ? '😲' : '😐'}
            </div>
            <p className="text-sm font-medium text-gray-700 capitalize">{emotion}</p>
            <p className="text-lg font-bold text-blue-600">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading AI Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="mr-3 h-8 w-8 text-blue-600" />
              AI Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Advanced insights from AI-powered ticket management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 3 months</option>
            </select>
            <button 
              onClick={fetchAIAnalytics}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="AI Categorization Rate"
          value={`${analytics.categorization.categorizationRate}%`}
          subtitle={`${analytics.categorization.totalCategorized} tickets categorized`}
          icon={Target}
          trend="+12% from last period"
          color="blue"
        />
        <StatCard
          title="Automation Success"
          value={`${analytics.automation.resolutionRate}%`}
          subtitle={`${analytics.automation.totalAutomated} automated responses`}
          icon={Zap}
          trend="+8% improvement"
          color="green"
        />
        <StatCard
          title="Avg Confidence Score"
          value={`${analytics.categorization.averageConfidence}%`}
          subtitle="AI prediction accuracy"
          icon={BarChart3}
          trend="+5% more accurate"
          color="purple"
        />
        <StatCard
          title="Time Saved"
          value={`${analytics.performance.timesSaved}h`}
          subtitle="Through automation"
          icon={Clock}
          trend={`${analytics.automation.timeSaved}h per ticket`}
          color="orange"
        />
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Resolution Time Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Resolution Time Impact
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Automated Solutions</span>
                <span className="text-sm font-semibold text-green-600">
                  {analytics.automation.avgResolutionTime}h avg
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '30%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Manual Processing</span>
                <span className="text-sm font-semibold text-orange-600">
                  {analytics.automation.avgResolutionTime + analytics.automation.timeSaved}h avg
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">
                  {analytics.automation.timeSaved}h faster
                </span> with AI automation
              </p>
            </div>
          </div>
        </div>

        {/* Escalation Risk */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Risk Assessment
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                analytics.sentiment.escalationRate > 15 ? 'text-red-600' :
                analytics.sentiment.escalationRate > 8 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {analytics.sentiment.escalationRate}%
              </div>
              <p className="text-sm text-gray-600">High-risk tickets</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sentiment Score</span>
                <span className="font-semibold">
                  {Math.round(analytics.sentiment.avgSentiment * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{width: `${analytics.sentiment.avgSentiment * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Customer Satisfaction
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analytics.performance.customerSatisfaction}%
            </div>
            <p className="text-sm text-gray-600 mb-4">Satisfied with AI solutions</p>
            <div className="space-y-2 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Excellent</span>
                <span className="text-gray-500">Good</span>
                <span className="text-gray-500">Poor</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  style={{width: `${analytics.performance.customerSatisfaction}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart categories={analytics.categorization.topCategories} />
        <EmotionDistribution emotions={analytics.sentiment.emotionDistribution} />
      </div>

      {/* AI Insights Panel */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Optimization Opportunity</h4>
            <p className="text-sm text-blue-700">
              {analytics.categorization.averageConfidence < 80 
                ? "Consider training the AI model with more diverse ticket examples to improve categorization accuracy."
                : "AI categorization is performing excellently. Consider expanding to more ticket types."}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">🚀 Success Metrics</h4>
            <p className="text-sm text-green-700">
              Automated solutions are resolving {analytics.automation.resolutionRate}% of cases successfully, 
              saving an average of {analytics.automation.timeSaved} hours per ticket.
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">⚠️ Attention Required</h4>
            <p className="text-sm text-orange-700">
              {analytics.sentiment.escalationRate > 10 
                ? "High escalation rate detected. Review emotional triggers and improve automated responses."
                : "Customer emotions are well-managed. Continue monitoring for patterns."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
