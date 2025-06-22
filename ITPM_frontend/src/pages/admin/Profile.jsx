import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [users, setUsers] = useState("loading");
    const [usersLoaded, setUserLoaded] = useState(false);
    const [userTickets, setUserTickets] = useState([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!usersLoaded) {
            const token = localStorage.getItem("token");
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/user`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                console.log(res.data);
                setUsers(res.data);
                setUserLoaded(true);
            })
            .catch((err) => {
                console.error(err);
            });
        }
    }, [usersLoaded]);

    // Fetch user tickets when user data is loaded
    useEffect(() => {
        if (usersLoaded && users && Array.isArray(users) && users.length > 0) {
            const lastUser = users[users.length - 1];
            if (lastUser && lastUser.email) {
                fetchUserTickets(lastUser.email);
            }
        }
    }, [usersLoaded, users]);

    const fetchUserTickets = async (email) => {
        setTicketsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/email/${encodeURIComponent(email)}`);
            setUserTickets(response.data);
        } catch (error) {
            console.error("Error fetching user tickets:", error);
            // If no tickets found, set empty array
            setUserTickets([]);
        } finally {
            setTicketsLoading(false);
        }
    };

    // Get the last registered user
    const lastUser = Array.isArray(users) && users.length > 0 ? users[users.length - 1] : null;

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

                {/* Loading Spinner */}
                {!usersLoaded && (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-b-blue-500 border-t-blue-200 rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Main Content */}
                {usersLoaded && lastUser && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Details - Takes 2/3 of the space */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { label: "Email", value: lastUser.email },
                                            { label: "Role", value: lastUser.role },
                                            { label: "First Name", value: lastUser.firstName },
                                            { label: "Last Name", value: lastUser.lastName },
                                            { label: "Address", value: lastUser.address },
                                            { label: "Phone Number", value: lastUser.phone }
                                        ].map(({ label, value }) => (
                                            <div key={label} className="bg-gray-50 p-4 rounded-lg shadow-inner">
                                                <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
                                                <div className="text-lg font-semibold text-gray-800 bg-white p-2 rounded border border-gray-200">
                                                    {value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => navigate(`/admin/users/edit`, { state: lastUser })}
                                            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 flex items-center justify-center space-x-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            <span>Edit Profile</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                                    
                                    {/* Create New Ticket Button */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => navigate('/createticket')}
                                            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span className="text-sm">Create New Ticket</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
