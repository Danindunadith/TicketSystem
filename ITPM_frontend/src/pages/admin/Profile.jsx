import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [users, setUsers] = useState("loading");
    const [usersLoaded, setUserLoaded] = useState(false);
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

    // Get the last registered user
    const lastUser = Array.isArray(users) && users.length > 0 ? users[users.length - 1] : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Header with elegant gradient and icon */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mr-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h2 className="text-3xl font-bold text-white">User Profile Details</h2>
                </div>

                {/* Loading Spinner with improved design */}
                {!usersLoaded && (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-b-blue-500 border-t-blue-200 rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Profile Content */}
                {usersLoaded && lastUser && (
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

                        {/* Action Button Centered */}
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
                )}
            </div>
        </div>
    );
}
