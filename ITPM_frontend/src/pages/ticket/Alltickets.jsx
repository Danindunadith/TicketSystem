import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAdmin, setFilterAdmin] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketsAndReplies = async () => {
      try {
        // Fetch tickets and replies in parallel
        const [ticketsRes, repliesRes] = await Promise.all([
          axios.get("/api/tickets/"),
          axios.get("/api/reticket/replyticket")
        ]);
        const ticketsData = ticketsRes.data;
        const repliesData = repliesRes.data;

        // Map ticketId to firstName from replies (first reply found for each ticket)
        const ticketIdToFirstName = {};
        repliesData.forEach(reply => {
          if (reply.ticketId && reply.firstName && !ticketIdToFirstName[reply.ticketId]) {
            ticketIdToFirstName[reply.ticketId] = reply.firstName;
          }
        });

        // Add firstName to each ticket if available
        const ticketsWithFirstName = ticketsData.map(ticket => ({
          ...ticket,
          firstName: ticketIdToFirstName[ticket._id] || ""
        }));

        setTickets(ticketsWithFirstName);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tickets or replies:", err.response);
        toast.error(err?.response?.data?.message || "Failed to load tickets");
        setLoading(false);
      }
    };

    fetchTicketsAndReplies();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/oneticket/${id}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to group tickets by date
  const groupTicketsByDate = (tickets) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    tickets.forEach(ticket => {
      const ticketDate = new Date(ticket.date);
      const ticketDateOnly = new Date(ticketDate.getFullYear(), ticketDate.getMonth(), ticketDate.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

      if (ticketDateOnly.getTime() === todayOnly.getTime()) {
        groups.today.push(ticket);
      } else if (ticketDateOnly.getTime() === yesterdayOnly.getTime()) {
        groups.yesterday.push(ticket);
      } else if (ticketDateOnly >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)) {
        groups.thisWeek.push(ticket);
      } else {
        groups.older.push(ticket);
      }
    });

    return groups;
  };

  // Function to get date group label
  const getDateGroupLabel = (groupKey) => {
    switch (groupKey) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'thisWeek':
        return 'This Week';
      case 'older':
        return 'Older';
      default:
        return '';
    }
  };

  // Function to get date group styling
  const getDateGroupStyling = (groupKey) => {
    switch (groupKey) {
      case 'today':
        return 'bg-green-400 border-green-200 text-green-800';
      case 'yesterday':
        return 'bg-blue-400 border-blue-200 text-blue-800';
      case 'thisWeek':
        return 'bg-yellow-400 border-yellow-400 text-yellow-400';
      case 'older':
        return 'bg-gray-400 border-gray-200 text-gray-600';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  // Get unique admin names for filter dropdown
  const getUniqueAdmins = () => {
    const admins = tickets
      .map(ticket => ticket.firstName)
      .filter(name => name && name.trim() !== "")
      .filter((name, index, arr) => arr.indexOf(name) === index)
      .sort();
    return admins;
  };

  // Filter tickets based on selected admin
  const getFilteredTickets = () => {
    if (filterAdmin === "all" || filterAdmin.trim() === "") {
      return tickets;
    }
    return tickets.filter(ticket => 
      ticket.firstName && 
      ticket.firstName.toLowerCase().includes(filterAdmin.toLowerCase())
    );
  };

  // Get grouped tickets (now using filtered tickets)
  const groupedTickets = groupTicketsByDate(getFilteredTickets());

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-2 sm:px-4 lg:px-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A69A7] to-[#145a92] p-4 sm:p-6 flex items-center mb-6 rounded-xl shadow-lg">
          <div className="bg-white/20 rounded-full p-2 sm:p-3 mr-3 sm:mr-4 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">All Tickets</h2>
            <p className="text-white/80 mt-1 text-sm sm:text-base">Manage and track all support tickets</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#1A69A7]/10 rounded-full mb-4">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#1A69A7]"></div>
            </div>
            <p className="text-gray-600 text-base sm:text-lg">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No tickets found</h3>
            <p className="text-gray-600">There are currently no tickets to display.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Filter Section */}
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Tickets Overview ({getFilteredTickets().length} of {tickets.length})
                </h3>
                <div className="flex items-center gap-3">
                  <label htmlFor="adminFilter" className="text-sm font-medium text-gray-700">
                    Filter by Admin:
                  </label>
                  <input
                    type="text"
                    id="adminFilter"
                    value={filterAdmin === "all" ? "" : filterAdmin}
                    onChange={(e) => setFilterAdmin(e.target.value)}
                    placeholder="Type admin name..."
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1A69A7] focus:border-[#1A69A7] bg-white min-w-48"
                  />
                  {filterAdmin !== "all" && filterAdmin.trim() !== "" && (
                    <button
                      onClick={() => setFilterAdmin("all")}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors duration-200"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Responsive Table Container */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16 sm:w-20">
                        ID
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-32 sm:min-w-40">
                        Subject
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20 sm:w-24">
                        Name
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-32 sm:min-w-40">
                        Email
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20 sm:w-24">
                        Dept
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16 sm:w-20">
                        Priority
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20 sm:w-24">
                        Date
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20 sm:w-24">
                        Actions
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20 sm:w-24">
                        The Admin who replied
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(groupedTickets).map(([groupKey, groupTickets]) => {
                      if (groupTickets.length === 0) return null;

                      return (
                        <React.Fragment key={groupKey}>
                          {/* Date Group Header */}
                          <tr className={`${getDateGroupStyling(groupKey)}`}>
                            <td colSpan="9" className="px-2 sm:px-4 py-2 sm:py-3">
                              <div className="flex items-center">
                                <span className="text-xs sm:text-sm font-semibold">
                                  {getDateGroupLabel(groupKey)} ({groupTickets.length} {groupTickets.length === 1 ? 'ticket' : 'tickets'})
                                </span>
                              </div>
                            </td>
                          </tr>
                          {/* Tickets in this group */}
                          {groupTickets.map((ticket, index) => (
                            <tr
                              key={ticket._id}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                <div className="text-xs sm:text-sm font-medium text-[#1A69A7]">
                                  #{ticket._id.slice(-6).toUpperCase()}
                                </div>
                              </td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3">
                                <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-32 sm:max-w-40" title={ticket.subject}>
                                  {ticket.subject}
                                </div>
                              </td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                <div className="text-xs sm:text-sm text-gray-900 truncate max-w-20 sm:max-w-24" title={ticket.name}>
                                  {ticket.name}
                                </div>
                              </td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3">
                                <div className="text-xs sm:text-sm text-gray-600 truncate max-w-32 sm:max-w-40" title={ticket.email}>
                                  {ticket.email}
                                </div>
                              </td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                <div className="text-xs sm:text-sm text-gray-900 truncate max-w-20 sm:max-w-24" title={ticket.department}>
                                  {ticket.department}
                                </div>
                              </td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                                  {ticket.priority || 'Normal'}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                <div className="text-xs sm:text-sm text-gray-600">
                                  {new Date(ticket.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              </td>
                              <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                <button
                                  onClick={() => handleViewDetails(ticket._id)}
                                  className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 bg-[#1A69A7] hover:bg-[#145a92] text-white text-xs sm:text-sm font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1A69A7] focus:ring-offset-2"
                                  title="View ticket details"
                                >
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  <span className="hidden sm:inline">View</span>
                                </button>
                              </td>
                              {/* First Name column */}
                              <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                <div className="text-xs sm:text-sm text-gray-900 truncate max-w-20 sm:max-w-24" title={ticket.firstName}>
                                  {ticket.firstName}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-xs sm:text-sm text-gray-600">
                  Showing {getFilteredTickets().length} of {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
                  {filterAdmin !== "all" && filterAdmin.trim() !== "" && (
                    <span className="ml-2 text-[#1A69A7] font-medium">
                      (Filtered by: "{filterAdmin}")
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Total tickets in system: {tickets.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}