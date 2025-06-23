import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom"; // <-- import useParams
import { toast } from "react-hot-toast";
import axios from "axios";
import emailjs from '@emailjs/browser';
import { jwtDecode } from "jwt-decode";

export default function ReplyTicket() {
    const navigate = useNavigate();
    const { id } = useParams(); // <-- get ticketId from URL params
    const location = useLocation();
    const ticket = location.state; // Get ticket data passed from previous page

    const [formData, setFormData] = useState({
        topic: ticket?.topic || "",
        reply: "",
        status: ticket?.status || "pending",
        ticketId: id // <-- store ticketId in formData
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // EmailJS configuration - Replace with your actual values
    const EMAILJS_SERVICE_ID = 'service_jrj10f4';
    const EMAILJS_TEMPLATE_ID = 'template_sgsv8w9'; // You may want a separate template to replies
    const EMAILJS_PUBLIC_KEY = 'KHn7-uw2zB2TcNn3K';

    useEffect(() => {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }, []);

    // Function to send reply confirmation email
    const sendReplyEmail = async () => {
        try {
            const templateParams = {
                to_email: formData.userSendEmail,
                ticketId: String(formData.ticketId),
                topic: formData.topic,
                reply: formData.reply
            };
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );
            toast.success("Reply confirmation email sent to user!");
        } catch (error) {
            console.error('Reply email sending failed:', error);
            toast.error("Failed to send reply confirmation email, but reply was submitted.");
        }
    };

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
        if (!formData.userSendEmail.trim()) {
            toast.error("Please enter the user's email address");
            return;
        }
        setIsSubmitting(true);

        // Get token from localStorage
        const token = localStorage.getItem("token");
        console.log("Token used for reply submission:", token); // <-- Add this line

        try {
            // Decode token to get user information (e.g., email)
            const decoded = jwtDecode(token);
            console.log("Decoded token payload:", decoded); // See all info in the token
            // Example: get firstName if present
            // const firstName = decoded.firstName;

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/reticket/replyticket`,
                {
                    ...formData,
                    firstName: decoded.firstName,
                    email: decoded.email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Reply sent successfully!");
            await sendReplyEmail();
            navigate(-1); // Go back or redirect as needed
        } catch (err) {
            toast.error("Failed to send reply");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate(-1); // Go back to previous page
    };

    console.log("ReplyTicket formData:", formData); // Debugging line
    console.log("ReplyTicket ticketId:", id); // Debugging line

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
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${ticket.status === 'finished' ? 'bg-green-100 text-green-800' :
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

                        {/* User Email Section */}
                        <div>
                            <label htmlFor="userSendEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                                User Email Address *
                            </label>
                            <input
                                type="email"
                                id="userSendEmail"
                                name="userSendEmail"
                                value={formData.userSendEmail}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter user's email address"
                            />
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
                                type="submit" // <-- use type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                disabled={isSubmitting}
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
            </div>
        </div>
    );
}