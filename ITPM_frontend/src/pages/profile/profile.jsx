import axios from "axios";
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
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to view your profile");
            navigate("/login");
            return;
        }

        // Get the logged-in user's email from localStorage
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            toast.error("User information not found");
            navigate("/login");
            return;
        }

        // Fetch the specific user's details
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userEmail}`, {
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

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.email}`,
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-b-blue-500 border-t-blue-200 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Profile not found</h2>
                    <p className="text-gray-600">Please try logging in again</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center justify-between">
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
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
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
                                        {value || "Not set"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
