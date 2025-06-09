import React, { useState } from 'react';
import { FaTicketAlt, FaUsers, FaRegCalendarAlt, FaChartLine } from 'react-icons/fa';
import { MdEventAvailable, MdOutlineLocalMovies, MdMusicNote, MdSportsSoccer } from 'react-icons/md';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  
  
  const stats = [
    { title: 'Total Tickets', value: '9', icon: <FaTicketAlt />, change: '+18%', color: 'bg-blue-500' },
    { title: 'Users', value: '10', icon: <FaChartLine />, change: '', color: 'bg-green-500' },
    { title: 'Active Admins', value: '6', icon: <FaUsers />, change: '', color: 'bg-purple-500' },
    
  ];
  
  const recentBookings = [
    { id: '#7B1A52', customer: 'MALA', event: 'Login Issue', date: 'May 21, 2025', amount: '$89.00', status: 'High' },
    { id: '#E6491B', customer: 'Nilmini Nanayakkara', event: 'Cant verify email address', date: 'May 24, 2025', amount: '$120.00', status: 'Medium' },
    { id: '#E64927', customer: 'Danindu nadith', event: 'Cant verify email address', date: 'May 25, 2025', amount: '$175.00', status: 'High' },
    { id: '#E64941', customer: 'Danindu Hewapathirana', event: 'Cant verify email address', date: 'May 22, 2025', amount: '$210.00', status: 'Low' },
    { id: '#E64947', customer: 'Pasindu withana', event: 'Cant verify email address', date: 'May 25, 2025', amount: '$45.00', status: 'Medium' },
  ];
  
  const popularEvents = [
    { name: 'Taylor Swift: Eras Tour', category: 'Concert', sold: 92, total: 100, icon: <MdMusicNote /> },
    { name: 'Champions League Final', category: 'Sports', sold: 88, total: 100, icon: <MdSportsSoccer /> },
    { name: 'Avengers: Secret Wars', category: 'Movie', sold: 75, total: 100, icon: <MdOutlineLocalMovies /> },
    { name: 'Broadway: The Lion King', category: 'Theater', sold: 68, total: 100, icon: <MdEventAvailable /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin! Here's what's happening with your ticket platform.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                <span className="inline-block mt-2 text-sm font-medium text-green-600">{stat.change} </span>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['weekly', 'monthly', 'yearly'].map((period) => (
                <button 
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`text-xs font-medium px-3 py-1 rounded-md capitalize ${
                    selectedPeriod === period ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chart Placeholder - In real app, use chart library like recharts */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-2">Sales Chart Visualization</div>
              <div className="text-sm text-gray-500">Showing {selectedPeriod} data trend</div>
            </div>
          </div>
        </div>
        
        {/* Popular Events */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular concerns</h2>
          <div className="space-y-4">
            {popularEvents.map((event, index) => (
              <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg ${
                  index === 0 ? 'bg-blue-100 text-blue-600' : 
                  index === 1 ? 'bg-green-100 text-green-600' : 
                  index === 2 ? 'bg-purple-100 text-purple-600' : 
                  'bg-amber-100 text-amber-600'
                }`}>
                  {event.icon}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-800">{event.name}</p>
                  <p className="text-xs text-gray-500">{event.category}</p>
                </div>
                <div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 
                        index === 2 ? 'bg-purple-500' : 
                        'bg-amber-500'
                      }`} 
                      style={{width: `${(event.sold / event.total) * 100}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-right text-gray-500 mt-1">{event.sold}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{booking.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.event}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.date}</td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <button className="text-blue-600 hover:text-blue-900">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}