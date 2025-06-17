import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function ReplyTicket() {
    const navigate = useNavigate();
      //handle reply
  const handleReply = () => {
    navigate("/admin/tickets");
  };

    
    const location = useLocation();
    const ticket = location.state; // Get ticket data passed from previous page
    
    const [formData, setFormData] = useState({
        topic: ticket?.topic || "",
        reply: "",
        status: ticket?.status || "pending"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.reply.trim()) {
            toast.error("Please enter a reply message");
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Create reply data object
            const replyData = {
                id: `TKT-${Date.now()}`,
                topic: formData.topic,
                originalMessage: ticket?.statement || ticket?.originalMessage || "Original ticket message",
                status: formData.status,
                createdAt: ticket?.date || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                adminReply: formData.reply,
                adminName: "Support Team",
                replyDate: new Date().toISOString()
            };

            // Get existing replies from localStorage
            const existingReplies = JSON.parse(localStorage.getItem('ticketReplies') || '[]');
            
            // Add new reply to the beginning of the array
            const updatedReplies = [replyData, ...existingReplies];
            
            // Save back to localStorage
            localStorage.setItem('ticketReplies', JSON.stringify(updatedReplies));
            
            toast.success("Reply submitted successfully!");
            
            // Navigate to UserTicketReplies page
            navigate("/replies");
            
        } catch (error) {
            console.error("Error submitting reply:", error);
            toast.error("Failed to submit reply. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate(-1); // Go back to previous page
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={handleCancel}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Reply to Ticket</h1>
                    <p className="text-gray-600">Respond to customer inquiry and update ticket status</p>
                </div>

                {/* Ticket Information Card */}
                {ticket && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <h2 className="text-xl font-semibold">Ticket #{ticket.id}</h2>
                                    <p className="text-blue-100 text-sm">From: {ticket.customerEmail || "Customer"}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                        ticket.status === 'finished' ? 'bg-green-100 text-green-800' :
                                        ticket.status === 'in-process' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {ticket.originalMessage && (
                            <div className="p-6">
                                <h3 className="font-semibold text-gray-800 mb-2">Original Message:</h3>
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                                    <p className="text-gray-700">{ticket.originalMessage}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Reply Form */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Send Reply</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Topic Section */}
                        <div>
                            <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2">
                                Topic *
                            </label>
                            <input
                                type="text"
                                id="topic"
                                name="topic"
                                value={formData.topic}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter ticket topic or subject"
                            />
                        </div>

                        {/* Reply Section */}
                        <div>
                            <label htmlFor="reply" className="block text-sm font-semibold text-gray-700 mb-2">
                                Reply Message *
                            </label>
                            <textarea
                                id="reply"
                                name="reply"
                                value={formData.reply}
                                onChange={handleInputChange}
                                required
                                rows={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                                placeholder="Type your reply message here..."
                            />
                            <div className="mt-2 text-sm text-gray-500">
                                {formData.reply.length} characters
                            </div>
                        </div>

                        {/* Status Section */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                                Ticket Status *
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-process">In Process</option>
                                <option value="finished">Finished</option>
                            </select>
                            <div className="mt-2 text-sm text-gray-500">
                                Update the status based on the current state of the ticket
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                onClick={handleReply}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                Send Reply
              </button>
                        </div>
                    </form>
                </div>

                {/* Help Section */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-semibold text-blue-800 mb-1">Tips for effective replies:</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Be clear and professional in your response</li>
                                <li>• Update the status appropriately (Pending → In Process → Finished)</li>
                                <li>• Include any relevant information or next steps</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* View All Replies Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/replies")}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                        View All Replies
                    </button>
                </div>
            </div>
        </div>
    );
}