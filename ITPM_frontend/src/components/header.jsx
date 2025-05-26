import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
      const handleAuthChange = () => {
        setIsAuthenticated(!!localStorage.getItem("token"));
      };
      window.addEventListener("storage", handleAuthChange); // Listen for auth changes

      return () => {
        window.removeEventListener("storage", handleAuthChange);
      };
    }, []);

    function handleLogout() {
      localStorage.removeItem("token"); // Remove token
      localStorage.removeItem("userEmail"); // Remove user email
      setIsAuthenticated(false);
      navigate("/"); // Redirect to home page
    }

    return (
      <header className="w-full h-[100px] shadow-xl flex justify-center items-center relative bg-gradient-to-r from-white to-blue-50 text-blue-800">
        <div className="absolute left-4">
  <div className="relative">
    <img 
      src="logo.png" 
      alt="logo" 
      className="w-[100px] h-[100px] object-cover   transition-transform hover:scale-105"
    />
    
  </div>
</div>
        
        <nav className="flex space-x-8">
          <Link 
            to="/" 
            className="text-[22px] font-bold py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-300 flex items-center"
          >
            HOME
          </Link>
          <Link 
            to="/contact" 
            className="text-[22px] font-bold py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-300 flex items-center"
          >
            CONTACT
          </Link>
          <Link 
            to="/profile" 
            className="text-[22px] font-bold py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-300 flex items-center"
          >
            PROFILE
          </Link>
          <Link 
            to="/items" 
            className="text-[22px] font-bold py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-300 flex items-center"
          >
            EVENT
          </Link>

          <Link 
            to="/createticket" 
            className="text-[22px] font-bold py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-300 flex items-center"
          >
            Raise Ticket
          </Link>


        </nav>

        <div className="absolute right-5 flex items-center space-x-4">
          

          <div className="auth-buttons">
            {!isAuthenticated ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-colors duration-300 flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-white border border-red-500 hover:bg-red-50 text-red-600 font-medium py-2 px-5 rounded-lg transition-colors duration-300 flex items-center space-x-2 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>
    );
}
