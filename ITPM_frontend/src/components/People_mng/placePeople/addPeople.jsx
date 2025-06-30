import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axiosConfig';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, ArrowLeft, UserPlus } from 'lucide-react';

const AddPeople = () => {
    const initialPeopleState = {
        name: "",
        email: "",
        number: "",
        address: "",
    };

    const [people, setPeople] = useState(initialPeopleState);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setPeople({ ...people, [name]: value });
    }

    const validate = () => {
        const newErrors = {};
        if (!people.name) newErrors.name = "Name is required";
        if (!people.email) newErrors.email = "Email is required";
        if (!people.number) newErrors.number = "Contact Number is required";
        if (!people.address) newErrors.address = "Address is required";
        return newErrors;
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            await axiosInstance.post("peoples/createpeo", people)
                .then((response) => {
                    toast.success(response.data.msg, { position: "top-right" });
                    navigate("/");
                }).catch(error => console.log(error));
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <Link 
                        to="/people"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Users
                    </Link>
                </div>
                
                {/* Card Container */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                        <div className="flex items-center">
                            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                <UserPlus className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="ml-3 text-xl font-bold text-white">Add New User</h1>
                        </div>
                    </div>
                    
                    {/* Form Section */}
                    <div className="px-6 py-6">
                        <form onSubmit={submitForm}>
                            <div className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 ">
                                        Full Name
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            autoComplete="off"
                                            placeholder="Enter user's full name"
                                            onChange={inputHandler}
                                            className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            autoComplete="off"
                                            placeholder="Enter email address"
                                            onChange={inputHandler}
                                            className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>
                                
                                {/* Contact Number Field */}
                                <div>
                                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Number
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="number"
                                            id="number"
                                            autoComplete="off"
                                            placeholder="Enter contact number"
                                            onChange={inputHandler}
                                            className={`block w-full pl-10 pr-3 py-3 border ${errors.number ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                    </div>
                                    {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number}</p>}
                                </div>
                                
                                {/* Address Field */}
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="address"
                                            id="address"
                                            autoComplete="off"
                                            placeholder="Enter full address"
                                            onChange={inputHandler}
                                            className={`block w-full pl-10 pr-3 py-3 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                    </div>
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>
                                
                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                    >
                                        Add User to System
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                
                {/* Additional Note */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Users added to the system will be able to book tickets and manage their bookings.</p>
                </div>
            </div>
        </div>
    );
}

export default AddPeople;