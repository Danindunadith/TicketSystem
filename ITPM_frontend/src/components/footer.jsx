import { Link } from "react-router-dom";
import { Calendar, Ticket, Phone, Home, Image, Package, Search, User } from "lucide-react";
export function Footer() {
   
    return (
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white pt-12 pb-6 flex ">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/4 mb-8">
              <div className="flex items-center mb-4">
                <img 
                  src="/logo.png" 
                  alt="TicketMaster Logo" 
                  className="w-12 h-12 object-cover  shadow-md mr-3"
                />
                <h2 className="text-xl font-bold">Ticket Hub</h2>
              </div>
              <p className="text-blue-200 mb-4 text-sm">
                Your premium destination for event tickets. Book with confidence and enjoy unforgettable experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/4 mb-8">
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-blue-200 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/items" className="text-blue-200 hover:text-white transition-colors">Browse Tickets</Link></li>
                <li><Link to="/gallery" className="text-blue-200 hover:text-white transition-colors">Event Gallery</Link></li>
                <li><Link to="/contact" className="text-blue-200 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/about" className="text-blue-200 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 mb-8">
              <h3 className="font-bold text-lg mb-4">Useful Information</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Cancellation Policy</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 mb-8">
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-blue-200 mb-4 text-sm">Subscribe to our newsletter for exclusive offers and updates</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="py-2 px-3 text-sm bg-blue-900 border border-blue-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-4 rounded-r-lg transition-colors">
                  Join
                </button>
              </div>
              <div className="mt-6">
                <h4 className="font-bold mb-2">Contact Us</h4>
                <p className="text-blue-200 text-sm">No 41/A,Weliwita Road, Malabe</p>
                <p className="text-blue-200 text-sm">support@ticketshub.com</p>
                <p className="text-blue-200 text-sm">+94 72 525 3336</p>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-sm">© 2025 Tickets Hub. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <div className="flex items-center">
                
                <span className="text-blue-300 text-xs">Secure Payment</span>
              </div>
              <div className="flex items-center">
                
                <span className="text-blue-300 text-xs">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }