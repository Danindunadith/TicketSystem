import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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
    navigate("/tickets");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
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
                Ticket #{ticket.ticketid}: {ticket.subject}
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
                      <a
                        href={ticket.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Attachment
                      </a>
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
              <button
                onClick={handleBack}
                className="mt-6 w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Back to Tickets
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}