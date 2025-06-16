import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket,  Star, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Experience Unforgettable Events</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10">Book tickets for concerts, sports, theater, and more with just a few clicks.</p>
            <div className="flex justify-center gap-4">
              <Link to="/items" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center">
                Get Started <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/how-it-works" className="border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Why Choose Tickets Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Ticket className="text-blue-800" size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Secure Booking</h3>
            <p className="text-gray-600 text-center">Book your tickets with confidence using our secure payment system and verification process.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Calendar className="text-blue-800" size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Wide Selection</h3>
            <p className="text-gray-600 text-center">Access thousands of events across multiple categories, from concerts to sports and theater shows.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Star className="text-blue-800" size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Exclusive Deals</h3>
            <p className="text-gray-600 text-center">Get access to special offers, pre-sales, and member-only discounts on premium events.</p>
          </div>
        </div>
      </div>

      {/* Event Categories */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Discover Events</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

               <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow group">
  <div className="h-40 bg-purple-500 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
    <img src="/test.png" alt="Drama" className="h-full w-full object-cover" />
  </div>
  <div className="p-4">
    <h3 className="font-bold text-lg text-center">Exhibitions</h3>
  </div>
</div>


            <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow group">
  <div className="h-40 bg-purple-500 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
    <img src="/concert-image.png" alt="Drama" className="h-full w-full object-cover" />
  </div>
  <div className="p-4">
    <h3 className="font-bold text-lg text-center">Concerts</h3>
  </div>
</div>


            <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow group">
  <div className="h-40 bg-purple-500 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
    <img src="/movie.png" alt="Drama" className="h-full w-full object-cover" />
  </div>
  <div className="p-4">
    <h3 className="font-bold text-lg text-center">Movies</h3>
  </div>
</div>



            <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow group">
  <div className="h-40 bg-purple-500 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
    <img src="/drama.png" alt="Drama" className="h-full w-full object-cover" />
  </div>
  <div className="p-4">
    <h3 className="font-bold text-lg text-center">Stage Drama</h3>
  </div>
</div>


            
          </div>
          <div className="text-center mt-12">
            <Link to="/events" className="inline-flex items-center bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              View All Categories <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Next Event?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who book their tickets through TicketMaster. 
            Fast, secure, and hassle-free.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/register" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-colors">
              Create Account
            </Link>
            <Link to="/items" className="border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
              Browse Events
            </Link>
          </div>
        </div>
      </div>
      
      {/* Testimonials section could be added here */}
      
    </div>
  );
}