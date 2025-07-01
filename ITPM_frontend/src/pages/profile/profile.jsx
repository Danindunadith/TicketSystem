import axiosInstance from '../../config/axiosConfig';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: ""
    });
    const [userTickets, setUserTickets] = useState([]); // Initialize as empty array
    const [ticketsLoading, setTicketsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to view your profile");
            navigate("/login");
            return;
        }

        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            toast.error("User information not found");
            navigate("/login");
            return;
        }

        axiosInstance.get(`/api/users/${userEmail}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            if (res.data) {
                const userData = res.data;
                setUser(userData);
                setFormData({
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    address: userData.address || ""
                });
            } else {
                toast.error("User data not found");
            }
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            if (err.response?.status === 401) {
                toast.error("Please login again");
                navigate("/login");
            } else if (err.response?.status === 404) {
                toast.error("User not found");
            } else {
                toast.error("Failed to load profile");
            }
            setLoading(false);
        });
    }, [navigate]);

    useEffect(() => {
        if (user && user.email) {
            fetchUserTickets(user.email);
        }
    }, [user]);

    const fetchUserTickets = async (email) => {
        setTicketsLoading(true);
        try {
            console.log("🔄 Fetching tickets for email:", email);
            const response = await axiosInstance.get(`/api/tickets/by-email/${encodeURIComponent(email)}`);
            console.log("✅ Tickets response:", response.data);
            
            // Ensure we always set an array
            if (Array.isArray(response.data)) {
                setUserTickets(response.data);
            } else if (response.data && Array.isArray(response.data.tickets)) {
                // Handle case where tickets are nested
                setUserTickets(response.data.tickets);
            } else if (response.data && typeof response.data === 'object') {
                // Handle case where single ticket is returned
                setUserTickets([response.data]);
            } else {
                console.warn("⚠️ Unexpected response format:", response.data);
                setUserTickets([]);
            }
        } catch (error) {
            console.error("❌ Error fetching user tickets:", error);
            if (error.response?.status === 404) {
                console.log("📝 No tickets found for user");
                setUserTickets([]); // Set empty array for 404
            } else {
                toast.error("Could not load your tickets.");
                setUserTickets([]); // Set empty array on other errors
            }
        } finally {
            setTicketsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again");
                navigate("/login");
                return;
            }

            const response = await axiosInstance.put(
                `/api/users/${user.email}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data) {
                toast.success("Profile updated successfully");
                setUser(prev => ({ ...prev, ...formData }));
                setIsEditing(false);
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                toast.error("Please login again");
                navigate("/login");
            } else if (error.response?.status === 403) {
                toast.error("You are not authorized to update this profile");
            } else if (error.response?.status === 404) {
                toast.error("User not found");
            } else {
                toast.error("Failed to update profile");
            }
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
            case 'urgent':
            case 'critical':
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
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-b-blue-500 border-t-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile not found</h2>
                    <p className="text-gray-600 mb-4">Please try logging in again</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center justify-between mb-6 rounded-2xl shadow-xl">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mr-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h2 className="text-3xl font-bold text-white">My Profile</h2>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-white text-blue-500 rounded-lg hover:bg-blue-50 transition-all duration-300"
                    >
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                            <div className="p-8 space-y-6">
                                {isEditing ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
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
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

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
                                        <span className="ml-2 text-gray-600">Loading tickets...</span>
                                    </div>
                                ) : !Array.isArray(userTickets) || userTickets.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-gray-600 text-sm">No tickets found</p>
                                        <p className="text-gray-500 text-xs mt-1">You haven't created any tickets yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                        {userTickets.map((ticket, index) => (
                                            <div 
                                                key={ticket._id || ticket.id || index} 
                                                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50" 
                                                onClick={() => navigate(`/oneticket/${ticket._id || ticket.id}`)}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-sm text-gray-800 line-clamp-2 flex-grow pr-2">
                                                        {ticket.subject || 'No Subject'}
                                                    </h4>
                                                    <span className={`px-2 py-1 text-xs rounded-full border flex-shrink-0 ${getPriorityColor(ticket.priority)}`}>
                                                        {ticket.priority || 'N/A'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                    {ticket.statement || 'No description available'}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span className="flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        {ticket.department || 'N/A'}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-9 4h14l-1 9H8l-1-9z" />
                                                        </svg>
                                                        {formatDate(ticket.date || ticket.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
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
            </div>
        </div>
    );
}