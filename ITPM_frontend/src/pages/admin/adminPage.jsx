import { BsGraphDown } from "react-icons/bs";
import { FaRegBookmark, FaRegUser, FaTicketAlt } from "react-icons/fa";
import { MdOutlineSpeaker, MdDashboard, MdPeople, MdWorkOutline } from "react-icons/md";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminItemsPage from "./adminItems";
import AddItemPage from "./addItemPage";
import UpdateItemPage from "./updateItemPage";
import Employee from "../../components/RetriveEmployee/Employee";
import People from "../../components/People_mng/retrievePeople/people";
import Users from "./users";
import Dashboard from "./dashboard";
import UserUpdatePage from "./userUpdatePage";
import Profile from "./Profile";
import toast from "react-hot-toast";

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    toast.success("Logged out successfully");
    navigate("/login");
  };
  
  return (
    <div className="w-full h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 h-full bg-white shadow-lg flex flex-col">
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100">
          <h1 className="text-2xl font-bold text-indigo-600">Tickets Hub</h1>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-3 mb-2">Main</p>
          
          <Link to="/admin/dashboard" className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${isActive('/admin') && !isActive('/admin/bookings') && !isActive('/admin/items') && !isActive('/employee') && !isActive('/people') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdDashboard className={`text-xl ${isActive('/admin') && !isActive('/admin/bookings') && !isActive('/admin/items') && !isActive('/employee') && !isActive('/people') ? 'text-indigo-600' : 'text-gray-500'}`} />
            <span className="ml-3 font-medium">Dashboard</span>
          </Link>
          
          <Link to="/admin/profile" className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${isActive('/admin/bookings') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FaTicketAlt className={`text-xl ${isActive('/admin/bookings') ? 'text-indigo-600' : 'text-gray-500'}`} />
            <span className="ml-3 font-medium">Bookings</span>
          </Link>
          
          <Link to="/admin/items" className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${isActive('/admin/items') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdOutlineSpeaker className={`text-xl ${isActive('/admin/items') ? 'text-indigo-600' : 'text-gray-500'}`} />
            <span className="ml-3 font-medium">Items Management</span>
          </Link>
          
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-3 mb-2 mt-6">People</p>
          
          <Link to="/admin/employee" className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${isActive('/employee') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdWorkOutline className={`text-xl ${isActive('/employee') ? 'text-indigo-600' : 'text-gray-500'}`} />
            <span className="ml-3 font-medium">Employee Management</span>
          </Link>
          
          <Link to="/admin/users" className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${isActive('/people') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdPeople className={`text-xl ${isActive('/people') ? 'text-indigo-600' : 'text-gray-500'}`} />
            <span className="ml-3 font-medium">User Management</span>
          </Link>

          <Link to="/stocks" className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${isActive('/people') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdPeople className={`text-xl ${isActive('/people') ? 'text-indigo-600' : 'text-gray-500'}`} />
            <span className="ml-3 font-medium">Booking Management</span>
          </Link>


        </div>
        
        {/* User Profile Section */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <FaRegUser className="text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@ticketpro.com</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm z-10 flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {location.pathname.includes('/admin/bookings') ? 'Booking Management' : 
               location.pathname.includes('/admin/items') ? 'Items Management' : 
               location.pathname.includes('/employee') ? 'Employee Management' : 
               location.pathname.includes('/people') ? 'User Management' : 'Dashboard'}
            </h2>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </button>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <span>Log out</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Routes path="/*">
            <Route path="/bookings" element={
              <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Bookings</h1>
                {/* Content goes here */}
              </div>
            } />
            <Route path="/items" element={<AdminItemsPage />} />
            <Route path="/items/add" element={<AddItemPage />} />
            <Route path="/items/edit" element={<UpdateItemPage />} />
            <Route path="/employee" element={<Employee />} />
            <Route path = "/people" element = {<People/>}/>
            <Route path = "/users" element = {<Users/>}/>
            <Route path="/users/edit" element={<UserUpdatePage />} />
            <Route path = "/profile" element = {<Profile/>}/>
            <Route path = "/dashboard" element = {<Dashboard/>}/>
                 
                    
                
          </Routes>
        </main>
      </div>
    </div>
  );
}
