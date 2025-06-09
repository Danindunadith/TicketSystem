import { useState } from "react";

export default function UserTicketReplies() {
    // Dummy data for demonstration
    const [tickets] = useState([
        {
            id: "TKT-001",
            topic: "Account Login Issue",
            originalMessage: "I'm unable to log into my account. It says my password is incorrect but I'm sure it's right. Can you please help me reset it?",
            status: "finished",
            createdAt: "2024-06-01T10:30:00Z",
            updatedAt: "2024-06-02T14:45:00Z",
            adminReply: "Hello! I've checked your account and found that it was temporarily locked due to multiple failed login attempts. I've unlocked your account and sent a password reset link to your registered email address. Please check your inbox and spam folder. If you still face issues, please let us know.",
            adminName: "Sarah Johnson",
            replyDate: "2024-06-02T14:45:00Z"
        },
        {
            id: "TKT-002",
            topic: "Payment Processing Error",
            originalMessage: "My payment failed during checkout but my card was charged. Order #12345. Please help resolve this issue urgently.",
            status: "in-process",
            createdAt: "2024-06-03T09:15:00Z",
            updatedAt: "2024-06-04T11:20:00Z",
            adminReply: "Thank you for reaching out regarding order #12345. I've located the transaction and can see the payment authorization. Our finance team is currently investigating this issue with the payment processor. We expect to have this resolved within 24-48 hours. You'll receive a full refund if the order wasn't processed successfully. I'll keep you updated on the progress.",
            adminName: "Mike Chen",
            replyDate: "2024-06-04T11:20:00Z"
        },
        {
            id: "TKT-003",
            topic: "Product Return Request",
            originalMessage: "I received the wrong item in my recent order. I ordered a blue shirt size M but received a red shirt size L. How can I return this and get the correct item?",
            status: "pending",
            createdAt: "2024-06-05T16:22:00Z",
            updatedAt: "2024-06-05T16:22:00Z",
            adminReply: null,
            adminName: null,
            replyDate: null
        },
        {
            id: "TKT-004",
            topic: "Shipping Delay Inquiry",
            originalMessage: "My order was supposed to arrive yesterday but I haven't received it yet. The tracking shows it's still in transit. When can I expect delivery?",
            status: "finished",
            createdAt: "2024-05-28T13:45:00Z",
            updatedAt: "2024-05-29T10:15:00Z",
            adminReply: "I apologize for the delay with your shipment. I've contacted our shipping partner and your package was delayed due to weather conditions in your area. Your order has now been expedited and should arrive by tomorrow evening. As compensation for the inconvenience, I've added a 15% discount to your account for your next purchase. Thank you for your patience!",
            adminName: "Emma Davis",
            replyDate: "2024-05-29T10:15:00Z"
        },
        {
            id: "TKT-005",
            topic: "Feature Request - Dark Mode",
            originalMessage: "Love your app! Would it be possible to add a dark mode option? It would be really helpful for using the app at night. Thanks for considering this!",
            status: "in-process",
            createdAt: "2024-06-04T20:10:00Z",
            updatedAt: "2024-06-06T09:30:00Z",
            adminReply: "Thank you so much for your feedback and suggestion! Dark mode is actually something we've been working on and it's currently in development. We're planning to include it in our next major update, which should be released within the next 2-3 months. I'll make sure to notify you once it's available. We really appreciate users like you who help us improve our product!",
            adminName: "Alex Rodriguez",
            replyDate: "2024-06-06T09:30:00Z"
        }
    ]);

    // Helper function to format dates
    const formatDate = (dateString) => {
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
        switch (status) {
            case 'finished':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'in-process':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'pending':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Helper function to get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'finished':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'in-process':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'pending':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Support Tickets</h1>
                    <p className="text-gray-600">Track the status and replies for your support requests</p>
                    
                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{tickets.filter(t => t.status === 'finished').length}</p>
                                    <p className="text-sm text-gray-600">Resolved</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{tickets.filter(t => t.status === 'in-process').length}</p>
                                    <p className="text-sm text-gray-600">In Progress</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{tickets.filter(t => t.status === 'pending').length}</p>
                                    <p className="text-sm text-gray-600">Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tickets List */}
                <div className="space-y-6">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            {/* Ticket Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-white">
                                        <h3 className="text-lg font-semibold">{ticket.topic}</h3>
                                        <p className="text-blue-100 text-sm">Ticket #{ticket.id}</p>
                                    </div>
                                    <div className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                                        {getStatusIcon(ticket.status)}
                                        <span className="ml-2 text-xs font-semibold capitalize">{ticket.status.replace('-', ' ')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Content */}
                            <div className="p-6">
                                {/* Original Message */}
                                <div className="mb-6">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Your Message</p>
                                            <p className="text-xs text-gray-500">{formatDate(ticket.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 ml-11">
                                        <p className="text-gray-700">{ticket.originalMessage}</p>
                                    </div>
                                </div>

                                {/* Admin Reply */}
                                {ticket.adminReply ? (
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
                                                    {ticket.adminName} • {formatDate(ticket.replyDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500 ml-11">
                                            <p className="text-gray-700">{ticket.adminReply}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Waiting for Response</h3>
                                        <p className="text-gray-600">Our support team will reply to your ticket soon. We typically respond within 24-48 hours.</p>
                                    </div>
                                )}
                            </div>

                            {/* Ticket Footer */}
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Created: {formatDate(ticket.createdAt)}</span>
                                    {ticket.updatedAt !== ticket.createdAt && (
                                        <span>Last updated: {formatDate(ticket.updatedAt)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State (when no tickets) */}
                {tickets.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Support Tickets</h3>
                        <p className="text-gray-500">You haven't submitted any support requests yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}