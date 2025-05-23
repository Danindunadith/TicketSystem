import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateTicketPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    subject: "",
    department: "",
    relatedservice: "",
    priority: "",
    attachment: null, // Changed to store file object
    statement: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value // Store file object for attachment
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiUrl = "/api/tickets/";
    console.log("Sending POST request to:", apiUrl); // Debug log to verify URL

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("relatedservice", formData.relatedservice);
      formDataToSend.append("priority", formData.priority);
      if (formData.attachment) {
        formDataToSend.append("attachment", formData.attachment); // Append file
      }
      formDataToSend.append("statement", formData.statement);

      const response = await axios.post(apiUrl, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Ticket created successfully!");
      navigate("/tickets");
    } catch (err) {
      console.error("Error details:", err.response); // Log detailed error
      toast.error(err?.response?.data?.message || "An error occurred while creating the ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Blue header with icon */}
        <div className="bg-blue-500 p-6 flex items-center">
          <div className="bg-blue-400 rounded-full p-2 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Create New Ticket</h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Enter ticket subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="department" className="block text-gray-700 text-sm font-medium mb-2">
                Department
              </label>
              <select
                id="department"
                name="department"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={formData.department}
                onChange={handleChange}
              >
                <option value="" disabled>Select department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="relatedservice" className="block text-gray-700 text-sm font-medium mb-2">
                Related Service
              </label>
              <input
                type="text"
                id="relatedservice"
                name="relatedservice"
                placeholder="Enter related service"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={formData.relatedservice}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="priority" className="block text-gray-700 text-sm font-medium mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="" disabled>Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="attachment" className="block text-gray-700 text-sm font-medium mb-2">
                Attachment (Optional)
              </label>
              <input
                type="file"
                id="attachment"
                name="attachment"
                accept="image/*,.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="statement" className="block text-gray-700 text-sm font-medium mb-2">
                Statement
              </label>
              <textarea
                id="statement"
                name="statement"
                placeholder="Describe the issue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
                value={formData.statement}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {loading ? "Creating Ticket..." : "Submit Ticket"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              View existing tickets?{" "}
              <button
                type="button"
                onClick={() => navigate("/tickets")}
                className="font-medium text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                Go to Tickets
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}