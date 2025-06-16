import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Users() {
    const [users,setUsers] = useState("loading")
    const [usersloaded, setUserLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!usersloaded){
            const token = localStorage.getItem("token");
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                console.log(res.data);
                setUsers(res.data);
                setUserLoaded(true);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load users");
            });
        }
    }, [usersloaded]);

    //delete handle
    const handleDelete = (email) => {
        if(window.confirm("Are you sure You want to delete this user ?")){
            const token = localStorage.getItem("token");
            axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/${email}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                console.log(res.data);
                // Update the UI only after successful deletion
                setUsers(users.filter((user) => user.email !== email));
                toast.success("User deleted successfully");
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to delete user");
            });
        }
    };

    return (
        <div className="w-full h-full p-6 flex items-center flex-col">
            {!usersloaded && <div className="border-4 my-4 border-b-green-500 rounded-full animate-spin w-[100px] h-[100px]"></div>}
            {usersloaded && <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3 border">email</th>
                            <th className="p-3 border">role</th>
                            <th className="p-3 border">first Name</th>
                            <th className="p-3 border">Last name</th>
                            <th className="p-3 border">address</th>
                            <th className="p-3 border">phone Number</th>
                            <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.email} className="hover:bg-gray-50">
                                <td className="p-3 border text-center">{user.email}</td>
                                <td className="p-3 border text-center">{user.role}</td>
                                <td className="p-3 border text-center">{user.firstName}</td>
                                <td className="p-3 border text-center">{user.lastName}</td>
                                <td className="p-3 border text-center">{user.address}</td>
                                <td className="p-3 border text-center">{user.phone}</td>
                                <td className="p-3 border text-center space-x-2">
                                    <button 
                                        onClick={() => navigate(`/admin/users/edit`, {state: user})}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.email)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
        </div>
    );
}
