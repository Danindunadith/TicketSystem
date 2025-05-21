import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import { ShoppingCart, Clock, MapPin, Calendar, ArrowLeft, Share2, Heart } from "lucide-react";

export default function ProductOverview() {
    const navigate = useNavigate();
    const params = useParams();
    const key = params.key;
   
    const [loadingStatus, setLoadingStatus] = useState("loading");
    const [product, setProduct] = useState({});
    
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${key}`)
            .then((res) => {
                setProduct(res.data);
                setLoadingStatus("loaded");
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
                setLoadingStatus("error");
            });
    }, [key]);
    
    return (
        <div className="w-full flex relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 md:px-8">
            {loadingStatus === "loading" && (
                <div className="flex flex-col items-center justify-center w-full h-64">
                    <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 animate-spin rounded-full"></div>
                    <p className="mt-4 text-gray-600">Loading event details...</p>
                </div>
            )}
            
            {loadingStatus === "error" && (
                <div className="flex flex-col items-center justify-center w-full h-64 bg-red-50 rounded-lg border border-red-200 p-6">
                    <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h1 className="text-2xl font-bold text-red-600">Error Loading Event</h1>
                    <p className="text-gray-600 mt-2">We couldn't load the event details. Please try again later.</p>
                    <button className="mt-4 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </button>
                </div>
            )}
            
            {loadingStatus === "loaded" && (
                <div className="max-w-6xl mx-auto ">
                    {/* Breadcrumb */}
                    <nav className="flex mb-6 text-sm text-gray-500">
                        <a href="/" className="hover:text-blue-600">Home</a>
                        <span className="mx-2">/</span>
                        <a href="/events" className="hover:text-blue-600">Events</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-800 font-medium">{product.name}</span>
                    </nav>
                    
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                        {/* Main content */}
                        <div className="md:flex">
                            {/* Left: Image slider */}
                            <div className="md:w-1/2 relative">
                                <div className="relative aspect-video md:aspect-square w-full overflow-hidden">
                                    <ImageSlider images={product.image} />
                                </div>
                                <div className="absolute top-4 left-4 flex space-x-2">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {product.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button className="bg-white/80 hover:bg-white p-2 rounded-full text-gray-700 transition-colors backdrop-blur-sm">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button className="bg-white/80 hover:bg-white p-2 rounded-full text-gray-700 transition-colors backdrop-blur-sm">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Right: Event Details */}
                            <div className="md:w-1/2 p-6 md:p-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
                                
                                <div className="flex flex-wrap items-center mb-6">
                                    <div className="flex items-center mr-6 mb-2">
                                        <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-gray-700">{product.dimension || "Venue"}</span>
                                    </div>
                                    <div className="flex items-center mr-6 mb-2">
                                        <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-gray-700">{product.dateAdded || "Date"}</span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-gray-700">{product.timeAdded || "Time"} PM</span>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">LKR {product.price}</div>
                                    <div className="text-sm text-gray-500">per ticket (including all taxes)</div>
                                </div>
                                
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                                    <div className="text-gray-600 leading-relaxed">
                                        {product.description}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                                    <button onClick ={()=>{navigate("/addstocks")}}  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex justify-center items-center transition-colors">
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Book Now
                                    </button>
                                    <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-lg font-medium transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Event details/highlights section */}
                        <div className="p-6 md:p-8 border-t border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Event Highlights</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 mb-2">Event Type</h3>
                                    <p className="text-gray-700">{product.category || "Concert"}</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 mb-2">Duration</h3>
                                    <p className="text-gray-700">3 hours</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 mb-2">Age Restriction</h3>
                                    <p className="text-gray-700">All ages</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 mb-2">Language</h3>
                                    <p className="text-gray-700">English</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Map placeholder */}
                        <div className="p-6 md:p-8 border-t border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Event Location</h2>
                            <div className="bg-gray-200 rounded-lg overflow-hidden h-64 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-gray-500">Map loading...</span>
                                </div>
                            </div>
                            <div className="mt-4 text-gray-600">
                                <p className="font-medium">{product.dimension || "Event Venue"}</p>
                                <p>123 Event Street, Colombo</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}