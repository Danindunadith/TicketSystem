import React, { useState, useEffect } from 'react';
import { Brain, BarChart3, TrendingUp, Users, Clock, Zap, Target, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AIAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
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
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    fetchAIAnalytics();
  }, [timeRange]);

  const fetchAIAnalytics = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    // Simulate API call with realistic data
    await new Promise(resolve => setTimeout(resolve, isRefresh ? 800 : 1500));
    
    const mockData = {
      categorization: {
        totalCategorized: 1247,
        averageConfidence: 87,
        categorizationRate: 94,
        topCategories: [
          { name: 'Technical Support', count: 342, percentage: 85 },
          { name: 'Billing Issues', count: 289, percentage: 72 },
          { name: 'Product Inquiry', count: 234, percentage: 58 },
          { name: 'Account Management', count: 198, percentage: 49 },
          { name: 'Feature Request', count: 184, percentage: 46 }
        ]
      },
      automation: {
        totalAutomated: 876,
        resolutionRate: 78,
        avgResolutionTime: 2.4,
        timeSaved: 18.6
      },
      sentiment: {
        avgSentiment: 0.72,
        emotionDistribution: {
          joy: 234,
          neutral: 567,
          sadness: 89,
          anger: 45,
          surprise: 67,
          fear: 23
        },
        escalationRate: 12
      },
      performance: {
        accuracyRate: 87,
        customerSatisfaction: 84,
        timesSaved: 16284
      }
    };
    
    setAnalytics(mockData);
    setAnimationKey(prev => prev + 1);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  const handleRefresh = () => {
    fetchAIAnalytics(true);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue", delay = 0 }) => (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 ease-out"
      style={{ animationDelay: `${delay}ms` }}
      key={`${animationKey}-${title}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="overflow-hidden">
            <p className={`text-3xl font-bold text-${color}-600 animate-fade-in-up`}>
              {value}
            </p>
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-xl bg-${color}-50 group-hover:bg-${color}-100 transition-colors duration-300`}>
          <Icon className={`h-7 w-7 text-${color}-600 transform group-hover:scale-110 transition-transform duration-300`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center animate-fade-in" style={{ animationDelay: '400ms' }}>
          <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
          <span className="text-sm text-green-600 font-medium">{trend}</span>
        </div>
      )}
    </div>
  );

  const CategoryChart = ({ categories }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <Target className="mr-3 h-6 w-6 text-blue-600" />
        Top Ticket Categories
      </h3>
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700 capitalize group-hover:text-blue-600 transition-colors duration-200">
                {category.name}
              </span>
              <span className="text-sm text-gray-500 font-medium">{category.count} tickets</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out transform origin-left"
                style={{ 
                  width: `${category.percentage}%`,
                  animationDelay: `${index * 100}ms`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EmotionDistribution = ({ emotions }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <Users className="mr-3 h-6 w-6 text-purple-600" />
        Customer Emotion Analysis
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(emotions).map(([emotion, count], index) => (
          <div 
            key={emotion} 
            className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-3xl mb-2 animate-bounce-subtle">
              {emotion === 'joy' ? '😊' : 
               emotion === 'anger' ? '😠' : 
               emotion === 'sadness' ? '😢' : 
               emotion === 'fear' ? '😰' : 
               emotion === 'surprise' ? '😲' : 
               emotion === 'neutral' ? '😐' : '🤔'}
            </div>
            <p className="text-sm font-semibold text-gray-700 capitalize mb-1">{emotion}</p>
            <p className="text-xl font-bold text-blue-600 animate-count-up">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const ProgressRing = ({ percentage, color = "blue", size = 120 }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`text-${color}-500 transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold text-${color}-600`}>{percentage}%</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <div className="flex items-center justify-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
              <span className="text-lg font-medium text-gray-700">Loading AI Analytics...</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">Analyzing your data with AI</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center mb-2">
                <Brain className="mr-4 h-10 w-10 text-blue-600 animate-pulse" />
                AI Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Advanced insights from AI-powered ticket management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 3 months</option>
              </select>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="animate-slide-in-up">
            <StatCard
              title="AI Categorization Rate"
              value={`${analytics.categorization.categorizationRate}%`}
              subtitle={`${analytics.categorization.totalCategorized} tickets categorized`}
              icon={Target}
              trend="+12% from last period"
              color="blue"
              delay={0}
            />
          </div>
          <div className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            <StatCard
              title="Automation Success"
              value={`${analytics.automation.resolutionRate}%`}
              subtitle={`${analytics.automation.totalAutomated} automated responses`}
              icon={Zap}
              trend="+8% improvement"
              color="green"
              delay={100}
            />
          </div>
          <div className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <StatCard
              title="Avg Confidence Score"
              value={`${analytics.categorization.averageConfidence}%`}
              subtitle="AI prediction accuracy"
              icon={BarChart3}
              trend="+5% more accurate"
              color="purple"
              delay={200}
            />
          </div>
          <div className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
            <StatCard
              title="Time Saved"
              value={`${analytics.performance.timesSaved}h`}
              subtitle="Through automation"
              icon={Clock}
              trend={`${analytics.automation.timeSaved}h per ticket`}
              color="orange"
              delay={300}
            />
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Resolution Time Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Clock className="mr-3 h-6 w-6 text-green-600" />
              Resolution Time Impact
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">Automated Solutions</span>
                  <span className="text-sm font-bold text-green-600">
                    {analytics.automation.avgResolutionTime}h avg
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '30%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">Manual Processing</span>
                  <span className="text-sm font-bold text-orange-600">
                    {analytics.automation.avgResolutionTime + analytics.automation.timeSaved}h avg
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '100%'}}></div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-bold text-green-600 text-lg">
                    {analytics.automation.timeSaved}h faster
                  </span>
                  <br />with AI automation
                </p>
              </div>
            </div>
          </div>

          {/* Escalation Risk */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <AlertTriangle className="mr-3 h-6 w-6 text-red-600" />
              Risk Assessment
            </h3>
            <div className="text-center">
              <ProgressRing 
                percentage={analytics.sentiment.escalationRate} 
                color={analytics.sentiment.escalationRate > 15 ? 'red' : analytics.sentiment.escalationRate > 8 ? 'yellow' : 'green'} 
              />
              <p className="text-sm text-gray-600 mt-4 font-medium">High-risk tickets</p>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sentiment Score</span>
                  <span className="font-bold text-blue-600">
                    {Math.round(analytics.sentiment.avgSentiment * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{width: `${analytics.sentiment.avgSentiment * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Users className="mr-3 h-6 w-6 text-purple-600" />
              Customer Satisfaction
            </h3>
            <div className="text-center">
              <ProgressRing percentage={analytics.performance.customerSatisfaction} color="purple" />
              <p className="text-sm text-gray-600 mt-4 font-medium">Satisfied with AI solutions</p>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>Poor</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{width: `${analytics.performance.customerSatisfaction}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-slide-in-left">
            <CategoryChart categories={analytics.categorization.topCategories} />
          </div>
          <div className="animate-slide-in-right">
            <EmotionDistribution emotions={analytics.sentiment.emotionDistribution} />
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Brain className="mr-3 h-7 w-7 text-blue-600" />
            AI Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <h4 className="font-bold text-blue-800 mb-3 text-lg">💡 Optimization Opportunity</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                {analytics.categorization.averageConfidence < 80 
                  ? "Consider training the AI model with more diverse ticket examples to improve categorization accuracy."
                  : "AI categorization is performing excellently. Consider expanding to more ticket types."}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <h4 className="font-bold text-green-800 mb-3 text-lg">🚀 Success Metrics</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                Automated solutions are resolving {analytics.automation.resolutionRate}% of cases successfully, 
                saving an average of {analytics.automation.timeSaved} hours per ticket.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <h4 className="font-bold text-orange-800 mb-3 text-lg">⚠️ Attention Required</h4>
              <p className="text-sm text-orange-700 leading-relaxed">
                {analytics.sentiment.escalationRate > 10 
                  ? "High escalation rate detected. Review emotional triggers and improve automated responses."
                  : "Customer emotions are well-managed. Continue monitoring for patterns."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in-up {
          from { 
            opacity: 0; 
            transform: translateY(40px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in-left {
          from { 
            opacity: 0; 
            transform: translateX(-40px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slide-in-right {
          from { 
            opacity: 0; 
            transform: translateX(40px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-5px); 
          }
        }
        
        @keyframes count-up {
          from { 
            opacity: 0; 
            transform: scale(0.5); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.8s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-count-up {
          animation: count-up 0.8s ease-out;
        }
        
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
        
        .group:hover .group-hover\\:bg-blue-100 {
          background-color: rgb(219 234 254);
        }
      `}</style>
    </div>
  );
}