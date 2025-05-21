import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserUpdatePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state with values from location state
  const [userEmail, setUserEmail] = useState(location.state.email);
  const [userRole, setUserRole] = useState(location.state.role);
  const [userFirstName, setUserFirstName] = useState(location.state.firstName);
  const [userLastName, setUserLastName] = useState(location.state.lastName);
  const [userAddress, setUserAddress] = useState(location.state.address);
  const [userPhone, setUserPhone] = useState(location.state.phone);

  async function handleUpdateUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not authorized to do this action");
      return;
    }

    try {
      const result = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userEmail}`,
        {
          role: userRole,
          firstName: userFirstName,
          lastName: userLastName,
          address: userAddress,
          phone: userPhone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (result.data) {
        toast.success("User updated successfully");
        navigate("/admin/users");
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        toast.error(err.response.data.message || "Failed to update user");
      } else if (err.request) {
        toast.error("No response from server");
      } else {
        toast.error("Error: " + err.message);
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Update User</h1>
      <div className="w-[400px] border p-4 flex flex-col gap-3 rounded-lg shadow-md">
        <input
          disabled
          onChange={(e) => setUserEmail(e.target.value)}
          value={userEmail}
          type="text"
          placeholder="User Email"
          className="border p-2 w-full rounded placeholder-gray-500 bg-gray-100"
        />
        <select
          onChange={(e) => setUserRole(e.target.value)}
          value={userRole}
          className="border p-2 w-full rounded placeholder-gray-500"
        >
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
        <input
          onChange={(e) => setUserFirstName(e.target.value)}
          value={userFirstName}
          type="text"
          placeholder="User First Name"
          className="border p-2 w-full rounded placeholder-gray-500"
        />
        <input
          onChange={(e) => setUserLastName(e.target.value)}
          value={userLastName}
          type="text"
          placeholder="User Last Name"
          className="border p-2 w-full rounded placeholder-gray-500"
        />
        <input
          onChange={(e) => setUserAddress(e.target.value)}
          value={userAddress}
          type="text"
          placeholder="User Address"
          className="border p-2 w-full rounded placeholder-gray-500"
        />
        <input
          onChange={(e) => setUserPhone(e.target.value)}
          value={userPhone}
          type="text"
          placeholder="User Phone"
          className="border p-2 w-full rounded placeholder-gray-500"
        />
        <button
          onClick={handleUpdateUser}
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Update
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-red-600 text-white p-2 w-full rounded hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
