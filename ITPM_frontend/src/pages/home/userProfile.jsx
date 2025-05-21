import React, { useState } from 'react';
import { User, Ticket, Calendar, CreditCard, MapPin, Settings, LogOut, Bell } from 'lucide-react';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock user data - replace with your actual data fetching logic
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    joined: "March 2023",
    profileImage: "/api/placeholder/150/150",
    upcomingTickets: [
      { id: 1, event: "Concert in the Park", date: "April 5, 2025", location: "Central Park", status: "confirmed" },
      { id: 2, event: "Hamilton Musical", date: "May 12, 2025", location: "Broadway Theater", status: "pending" }
    ],
    pastTickets: [
      { id: 3, event: "Tech Conference 2025", date: "February 15, 2025", location: "Convention Center", status: "completed" },
      { id: 4, event: "Jazz Festival", date: "January 20, 2025", location: "City Hall", status: "completed" }
    ]
  };

  const renderStatusBadge = (status) => {
    const statusStyles = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-center">
          <img 
            src={userData.profileImage} 
            alt="Profile" 
            className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
          />
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h1 className="text-xl font-bold text-gray-900">{userData.name}</h1>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-sm text-gray-500">Member since {userData.joined}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">Full Name</label>
            <p className="text-gray-800">{userData.name}</p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">Email Address</label>
            <p className="text-gray-800">{userData.email}</p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">Phone Number</label>
            <p className="text-gray-800">+1 (555) 123-4567</p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
            <p className="text-gray-800">May 14, 1990</p>
          </div>
        </div>
        <div className="mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
            Edit Profile Information
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive emails about ticket updates</p>
            </div>
            <div className="relative inline-block w-12 h-6 switch">
              <div className="w-12 h-6 bg-blue-600 rounded-full"></div>
              <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full translate-x-6"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">SMS Alerts</h3>
              <p className="text-sm text-gray-500">Get text message reminders</p>
            </div>
            <div className="relative inline-block w-12 h-6 switch">
              <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
              <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTicketsTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Upcoming Events</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {userData.upcomingTickets.map(ticket => (
            <div key={ticket.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{ticket.event}</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {ticket.date}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {ticket.location}
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                  {renderStatusBadge(ticket.status)}
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Past Events</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {userData.pastTickets.map(ticket => (
            <div key={ticket.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{ticket.event}</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {ticket.date}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {ticket.location}
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:items-end">
                  {renderStatusBadge(ticket.status)}
                  <button className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium">
                    View Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Payment Methods</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 flex items-center">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white mr-4">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">•••• •••• •••• 4242</h3>
              <p className="text-sm text-gray-500">Expires 04/26</p>
            </div>
            <div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Default
              </span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 flex items-center">
            <div className="h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center text-white mr-4">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">•••• •••• •••• 8888</h3>
              <p className="text-sm text-gray-500">Expires 09/25</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
            Add Payment Method
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Feb 15, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Tech Conference 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $149.99
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                  Download
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Jan 20, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Jazz Festival
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $89.99
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                  Download
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">My Account</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </button>
                <button 
                  onClick={() => setActiveTab('tickets')}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'tickets' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Ticket className="mr-3 h-5 w-5" />
                  My Tickets
                </button>
                <button 
                  onClick={() => setActiveTab('payment')}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'payment' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="mr-3 h-5 w-5" />
                  Payment Methods
                </button>
                <button 
                  className="flex items-center px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Bell className="mr-3 h-5 w-5" />
                  Notifications
                </button>
                <button 
                  className="flex items-center px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </button>
                <button 
                  className="flex items-center px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'tickets' && renderTicketsTab()}
            {activeTab === 'payment' && renderPaymentTab()}
          </div>
        </div>
      </div>
    </div>
  );
}