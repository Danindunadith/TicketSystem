import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTicketAlt, FaUsers, FaRegCalendarAlt, FaChartLine } from 'react-icons/fa';
import { MdEventAvailable, MdOutlineLocalMovies, MdMusicNote, MdSportsSoccer } from 'react-icons/md';
import TicketDepartmentChart from './TicketDepartmentChart'; // Adjust the import path as necessary

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [recentBookings, setRecentBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [highPriorityConcerns, setHighPriorityConcerns] = useState([]);
  const [loadingConcerns, setLoadingConcerns] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [empCount, setEmpCount] = useState(0);
  const stats = [
    { title: 'Total Tickets', value: '9', icon: <FaTicketAlt />, change: '+18%', color: 'bg-blue-500' },
    { title: 'Users', value: '10', icon: <FaChartLine />, change: '', color: 'bg-green-500' },
    { title: 'Active Admins', value: '6', icon: <FaUsers />, change: '', color: 'bg-purple-500' },
    { title: 'Active Admins', value: '6', icon: <FaUsers />, change: '', color: 'bg-purple-500' },

  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const response = await axios.get('http://localhost:3002/api/tickets');
        // Map your API data to the table structure
        const bookings = response.data.map(ticket => ({
          id: ticket.id || ticket._id || 'N/A',
          name: ticket.name || ticket.user || 'Unknown',
          event: ticket.event || ticket.subject || ticket.title || 'Unknown',
          date: ticket.date || ticket.createdAt || 'Unknown',
          amount: ticket.amount || '', // If you have amount in your API
          priority: ticket.priority || 'Unknown'
        }));
        setRecentBookings(bookings);
      } catch (err) {
        setRecentBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchConcerns = async () => {
      try {
        setLoadingConcerns(true);
        const response = await axios.get('http://localhost:3002/api/tickets');
        const highPriority = response.data
          .filter(ticket => ticket.priority === 'High')
          .map(ticket => ({
            id: ticket.id || ticket._id || 'N/A',
            name: ticket.name || ticket.user || 'Unknown',
            event: ticket.event || ticket.subject || ticket.title || 'Unknown',
            date: ticket.date || ticket.createdAt || 'Unknown',
            priority: ticket.priority || 'Unknown'
          }));
        setHighPriorityConcerns(highPriority);
      } catch (err) {
        setHighPriorityConcerns([]);
      } finally {
        setLoadingConcerns(false);
      }
    };
    fetchConcerns();
  }, []);

  useEffect(() => {
  axios.get('http://localhost:3002/api/users/user/count')
    .then(res => setUserCount(res.data.count))
    .catch(() => setUserCount(0));
}, []);

/**http://localhost:3002/api/employee/count */

  useEffect(() => {
  axios.get('http://localhost:3002/api/employee/count')
    .then(res => setEmpCount(res.data.count))
    .catch(() => setEmpCount(0));
}, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin! Here's what's happening with your ticket platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-8 group cursor-pointer border border-gray-100 transform-gpu perspective-1000">
          <div className="flex justify-between items-start">
            <div className="flex-1 relative">
              <p className="text-gray-500 text-base font-semibold mb-4">
                Total Tickets
              </p>

              {/* Large Clean Number */}
              <div className="relative mb-2">
                <h3 className="text-6xl font-black text-transparent bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 bg-clip-text relative z-10"
                  style={{
                    transform: 'rotateX(5deg) rotateY(-2deg)',
                    transformStyle: 'preserve-3d'
                  }}>
                  {totalTickets}
                </h3>
              </div>

            </div>

            {/* Clean Icon */}
            <div className='bg-blue-500 text-white p-3 rounded-lg transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-md'>

              <FaTicketAlt />
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-8 group cursor-pointer border border-gray-100 transform-gpu perspective-1000">
          <div className="flex justify-between items-start">
            <div className="flex-1 relative">
              <p className="text-gray-500 text-base font-semibold mb-4">
                Users
              </p>

              {/* Large Clean Number */}
              <div className="relative mb-2">
                <h3 className="text-6xl font-black text-transparent bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 bg-clip-text relative z-10"
                  style={{
                    transform: 'rotateX(5deg) rotateY(-2deg)',
                    transformStyle: 'preserve-3d'
                  }}>
                  {userCount}
                </h3>
              </div>

            </div>

            {/* Clean Icon */}
            <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white p-4 rounded-2xl relative overflow-hidden"
              style={{
                transform: 'rotateX(-5deg) rotateY(5deg)',
                transformStyle: 'preserve-3d'
              }}>

              <FaChartLine className="relative z-10 text-xl" />
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-8 group cursor-pointer border border-gray-100 transform-gpu perspective-1000">
          <div className="flex justify-between items-start">
            <div className="flex-1 relative">
              <p className="text-gray-500 text-base font-semibold mb-4">
                Employees
              </p>

              {/* Large Clean Number */}
              <div className="relative mb-2">
                <h3 className="text-6xl font-black text-transparent bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 bg-clip-text relative z-10"
                  style={{
                    transform: 'rotateX(5deg) rotateY(-2deg)',
                    transformStyle: 'preserve-3d'
                  }}>
                  {empCount}
                </h3>
              </div>

            </div>

            {/* Clean Icon */}
            <div className="bg-purple-500 text-white p-3 rounded-lg transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-md">
              <FaUsers />
            </div>
          </div>
        </div>
       
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
                  className={`text-xs font-medium px-3 py-1 rounded-md capitalize ${selectedPeriod === period ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Placeholder - In real app, use chart library like recharts */}

          <div className="flex-1 min-h-0">
            <TicketDepartmentChart onTotalTickets={setTotalTickets} />
          </div>

        </div>


        {/* Popular Events */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular concerns</h2>
          <div className="space-y-4">
            {loadingConcerns ? (
              <div className="p-4 text-gray-500">Loading...</div>
            ) : highPriorityConcerns.length === 0 ? (
              <div className="p-4 text-gray-500">No high priority concerns found.</div>
            ) : (
              highPriorityConcerns.map((concern, index) => (
                <div key={concern.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 rounded-lg bg-red-100 text-red-600">
                    <span className="font-bold">!</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-800">{concern.event}</p>
                    <p className="text-xs text-gray-500">{concern.name}</p>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      {concern.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 transition-colors duration-200">Recent Bookings</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:bg-blue-50 px-3 py-1 rounded-lg">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200 hover:text-gray-700">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200 hover:text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200 hover:text-gray-700">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200 hover:text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200 hover:text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200 hover:text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingBookings ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-gray-300 text-2xl">📋</div>
                      <span>No bookings found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent transition-all duration-300 ease-in-out group"
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 transition-all duration-200 group-hover:text-blue-700 group-hover:font-semibold">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 transition-colors duration-200 group-hover:text-gray-900">
                      {booking.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 transition-colors duration-200 group-hover:text-gray-700">
                      {booking.event}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 transition-colors duration-200 group-hover:text-gray-700">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-all duration-300 transform group-hover:scale-105 ${booking.priority === 'High' ? 'bg-red-100 text-red-800 group-hover:bg-red-200 group-hover:shadow-sm' :
                        booking.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200 group-hover:shadow-sm' :
                          booking.priority === 'Low' ? 'bg-green-100 text-green-800 group-hover:bg-green-200 group-hover:shadow-sm' :
                            'bg-gray-100 text-gray-800 group-hover:bg-gray-200 group-hover:shadow-sm'
                        }`}>
                        {booking.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <button className="text-blue-600 hover:text-blue-900 transition-all duration-200 hover:bg-blue-50 px-3 py-1 rounded-lg hover:shadow-sm transform hover:scale-105">
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}