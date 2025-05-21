import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";

export default function ProductCard({ item }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 m-4 max-w-sm h-[470px] border border-gray-100 flex flex-col">
      {/* Event Image with Gradient Overlay */}
      <div className="relative">
        <img 
          src={item.image[0]} 
          alt={item.name} 
          className="w-full h-52 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Event Name */}
        <h2 className="text-xl font-bold text-gray-800 line-clamp-2 mb-2">{item.name}</h2>
        
        {/* Event Details */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 text-blue-600" />
            <span className="text-sm">{item.dateAdded}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2 text-blue-600" />
            <span className="text-sm">{item.timeAdded}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2 text-blue-600" />
            <span className="text-sm line-clamp-1">{item.location || "Venue TBA"}</span>
          </div>
        </div>
        
        {/* Price & CTA */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase">Price from</p>
              <p className="text-lg font-bold text-blue-600">LKR {item.price}<span className="text-sm font-normal">upwards</span></p>
            </div>
            
            {item.availability !== undefined && (
              <span className={`text-xs px-3 py-1 rounded-full ${
                item.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.availability ? "Available" : "Sold Out"}
              </span>
            )}
          </div>
          
          <Link 
            to={`/product/${item.key}`} 
            className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg transition-colors font-medium"
          >
            View Details <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}