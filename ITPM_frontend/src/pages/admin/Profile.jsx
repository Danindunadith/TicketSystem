import axiosInstance from '../../config/axiosConfig';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [userTickets, setUserTickets] = useState([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        let email = localStorage.getItem("userEmail");
        if (!email) {
            // fallback: try to get from token if possible
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                email = payload.email;
            } catch {}
        }
        if (!email) {
            // fallback: fetch all users and use the last one
            axiosInstance.get('/api/users/user', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    const lastUser = res.data[res.data.length - 1];
                    setUser(lastUser);
                    fetchUserTickets(lastUser.email);
                }
            })
            .catch((err) => {
                console.error(err);
            });
        } else {
            axiosInstance.get(`/api/users/${email}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUser(res.data);
                fetchUserTickets(email);
            })
            .catch((err) => {
                console.error(err);
            });
        }
    }, []);

    const fetchUserTickets = async (email) => {
        setTicketsLoading(true);
        try {
            const response = await axiosInstance.get(`/api/tickets/email/${encodeURIComponent(email)}`);
            setUserTickets(response.data);
        } catch (error) {
            setUserTickets([]);
        } finally {
            setTicketsLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl mb-6">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mr-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h2 className="text-3xl font-bold text-white">User Profile Details</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user && (
                        [
                            { label: "Email", value: user.email },
                            { label: "Role", value: user.role },
                            { label: "First Name", value: user.firstName },
                            { label: "Last Name", value: user.lastName },
                            { label: "Address", value: user.address },
                            { label: "Phone Number", value: user.phone }
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-gray-50 p-4 rounded-lg shadow-inner">
                                <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
                                <div className="text-lg font-semibold text-gray-800 bg-white p-2 rounded border border-gray-200">
                                    {value || "Not provided"}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Side Panel - Previous Tickets */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden h-fit">
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="text-lg font-bold text-white">My Previous Tickets</h3>
                            </div>
                        </div>
                        <div className="p-4">
                            {ticketsLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="w-8 h-8 border-2 border-b-green-500 border-t-green-200 rounded-full animate-spin"></div>
                                </div>
                            ) : userTickets.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-600 text-sm">No tickets found</p>
                                    <p className="text-gray-500 text-xs mt-1">You haven't created any tickets yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {userTickets.map((ticket) => (
                                        <div key={ticket._id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/oneticket/${ticket._id}`)}>
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">
                                                    {ticket.subject}
                                                </h4>
                                                <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                {ticket.statement}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{ticket.department}</span>
                                                <span>{formatDate(ticket.date)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
