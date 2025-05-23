import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("/api/tickets/");
        setTickets(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tickets:", err.response);
        toast.error(err?.response?.data?.message || "Failed to load tickets");
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/oneticket/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Blue header with icon */}
        <div className="bg-blue-500 p-6 flex items-center mb-8 rounded-lg shadow-lg">
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
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">All Tickets</h2>
        </div>

        {loading ? (
          <div className="text-center">
            <p className="text-gray-600">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No tickets found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Ticket: {ticket.subject}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Name:</span> {ticket.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Email:</span> {ticket.email}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Department:</span> {ticket.department}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Priority:</span> {ticket.priority}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Date:</span> {new Date(ticket.date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleViewDetails(ticket._id)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}