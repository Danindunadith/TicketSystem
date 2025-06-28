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
import AllTicketsPage from "../ticket/Alltickets";
import OneTicketPage from "../ticket/Oneticket";
import AIAnalyticsDashboard from "../../components/AIAnalyticsDashboard";
import { Brain } from 'lucide-react';

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
      <div className="w-72 h-full bg-gradient-to-b from-[#1A69A7] to-[#145a92] shadow-2xl flex flex-col">
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-center border-b border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-[#1A69A7] font-bold text-xl">AZ</span>
            </div>
            <h1 className="text-2xl font-bold text-white">AssignOZ</h1>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 py-8 px-6 space-y-3 overflow-y-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Main Navigation</p>
            
            <Link to="/admin/dashboard" className={`flex items-center px-4 py-4 rounded-xl transition-all duration-300 group ${
              isActive('/admin') && !isActive('/admin/bookings') && !isActive('/admin/tickets') && !isActive('/admin/users') && !isActive('/admin/employee') 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md'
            }`}>
              <MdDashboard className={`text-2xl transition-all duration-300 ${
                isActive('/admin') && !isActive('/admin/bookings') && !isActive('/admin/tickets') && !isActive('/admin/users') && !isActive('/admin/employee') 
                  ? 'text-white' 
                  : 'text-white/70 group-hover:text-white'
              }`} />
              <span className="ml-4 font-semibold text-base">Dashboard</span>
            </Link>
            
            
            
            <Link to="/admin/tickets" className={`flex items-center px-4 py-4 rounded-xl transition-all duration-300 group ${
              isActive('/admin/tickets') 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md'
            }`}>
              <MdOutlineSpeaker className={`text-2xl transition-all duration-300 ${
                isActive('/admin/tickets') 
                  ? 'text-white' 
                  : 'text-white/70 group-hover:text-white'
              }`} />
              <span className="ml-4 font-semibold text-base">Tickets Management</span>
            </Link>

            <Link to="/admin/ai-analytics" className={`flex items-center px-4 py-4 rounded-xl transition-all duration-300 group ${
              isActive('/admin/ai-analytics') 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md'
            }`}>
              <Brain className={`text-2xl transition-all duration-300 ${
                isActive('/admin/ai-analytics') 
                  ? 'text-white' 
                  : 'text-white/70 group-hover:text-white'
              }`} />
              <span className="ml-4 font-semibold text-base">AI Analytics</span>
            </Link>
          </div>
          
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Other Sections</p>
            
            <Link to="/admin/employee" className={`flex items-center px-4 py-4 rounded-xl transition-all duration-300 group ${
              isActive('/admin/employee') 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md'
            }`}>
              <MdWorkOutline className={`text-2xl transition-all duration-300 ${
                isActive('/admin/employee') 
                  ? 'text-white' 
                  : 'text-white/70 group-hover:text-white'
              }`} />
              <span className="ml-4 font-semibold text-base">Employee Management</span>
            </Link>
            
            <Link to="/admin/users" className={`flex items-center px-4 py-4 rounded-xl transition-all duration-300 group ${
              isActive('/admin/users') 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md'
            }`}>
              <MdPeople className={`text-2xl transition-all duration-300 ${
                isActive('/admin/users') 
                  ? 'text-white' 
                  : 'text-white/70 group-hover:text-white'
              }`} />
              <span className="ml-4 font-semibold text-base">User Management</span>
            </Link>

            
          </div>
        </div>
        
        {/* User Profile Section */}
        <div className="border-t border-white/20 p-6 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <FaRegUser className="text-white text-lg" />
            </div>
            <div className="ml-4">
              <p className="text-base font-semibold text-white">Admin User</p>
              <p className="text-sm text-white/70">admin@assignoz.com</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white shadow-xl border-b border-gray-100 flex items-center justify-between px-8">
          <div className="flex items-center">
            <div className="mr-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {location.pathname.includes('/admin/bookings') ? 'Booking Management' : 
                 location.pathname.includes('/admin/items') ? 'Items Management' : 
                 location.pathname.includes('/admin/tickets') ? 'Tickets Management' : 
                 location.pathname.includes('/employee') ? 'Employee Management' : 
                 location.pathname.includes('/admin/oneticket/:id') ? 'Employee Management' : 
                 location.pathname.includes('/people') ? 'User Management' : 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Manage your system efficiently</p>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-6">
            <button className="relative p-3 rounded-full bg-gray-50 hover:bg-[#1A69A7]/10 text-gray-500 hover:text-[#1A69A7] transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-[#1A69A7] hover:bg-[#145a92] text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Log out</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <Routes path="/*">
            <Route path="/bookings" element={
              <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
                  <div className="w-12 h-12 bg-[#1A69A7]/10 rounded-xl flex items-center justify-center">
                    <FaTicketAlt className="text-[#1A69A7] text-xl" />
                  </div>
                </div>
                <div className="text-gray-600">
                  <p>Your booking management content goes here...</p>
                </div>
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
            <Route path = "/tickets" element = {<AllTicketsPage/>}/>
            <Route path ="/oneticket/:id" element = {<OneTicketPage/>}/>
            <Route path="/ai-analytics" element={<AIAnalyticsDashboard />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}