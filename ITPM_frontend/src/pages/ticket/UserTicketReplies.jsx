import { useState, useEffect } from "react";
import axios from "axios";

export default function UserTicketReplies() {
    const [replies, setReplies] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch all replies
    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reticket/replyticket`)
            .then(res => setReplies(res.data))
            .catch(() => setReplies([]))
            .finally(() => setLoading(false));
    }, []);

    // 2. For each reply, fetch the ticket statement
    useEffect(() => {
        if (replies.length === 0) return;
        Promise.all(
            replies.map(reply =>
                axios
                    .get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${reply.ticketId}`)
                    .then(res => ({
                        ...reply,
                        statement: res.data.statement,
                        ticketStatus: res.data.status,
                        ticketSubject: res.data.subject,
                        ticketCreatedAt: res.data.date
                    }))
                    .catch(() => ({
                        ...reply,
                        statement: "Statement not found",
                        ticketStatus: "Unknown",
                        ticketSubject: "Unknown",
                        ticketCreatedAt: ""
                    }))
            )
        ).then(repliesWithStatements => setTickets(repliesWithStatements));
    }, [replies]);

    // Sort tickets by reply createdAt descending (newest first)
    const sortedTickets = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'finished':
            case 'closed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'in-process':
            case 'replied':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'pending':
            case 'open':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Helper function to get status icon
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'finished':
            case 'closed':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'in-process':
            case 'replied':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'pending':
            case 'open':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading replies...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Ticket Replies</h1>
                    <p className="text-gray-600">See all replies and their original ticket statements</p>
                </div>

                {/* Replies List */}
                <div className="space-y-6">
                    {sortedTickets.map((reply) => (
                        <div key={reply._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            {/* Ticket Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-white">
                                        <h3 className="text-lg font-semibold">{reply.ticketSubject}</h3>
                                        <p className="text-blue-100 text-sm">Ticket #{reply.ticketId}</p>
                                    </div>
                                    <div className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor(reply.ticketStatus)}`}>
                                        {getStatusIcon(reply.ticketStatus)}
                                        <span className="ml-2 text-xs font-semibold capitalize">{reply.ticketStatus}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Content */}
                            <div className="p-6">
                                {/* Original Statement */}
                                <div className="mb-6">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Ticket Statement</p>
                                            <p className="text-xs text-gray-500">{formatDate(reply.ticketCreatedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 ml-11">
                                        <p className="text-gray-700">{reply.statement}</p>
                                    </div>
                                </div>

                                {/* Reply Content */}
                                <div>
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Support Team Reply</p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(reply.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500 ml-11">
                                        <p className="text-gray-700">{reply.reply}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {tickets.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Ticket Replies</h3>
                        <p className="text-gray-500">No replies have been submitted yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}