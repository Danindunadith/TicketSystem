import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, Shield, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const services = [
    {
      title: "Assignment Writing",
      description: "High-quality essays, research papers, reports, and case studies crafted to meet your academic requirements.",
      link: "Read More →"
    },
    {
      title: "Research & Thesis Writing", 
      description: "Expert Research & Thesis Writing for comprehensive academic projects.",
      link: "Read More →"
    },
    {
      title: "Case Study Writing",
      description: "We provide case study writing with detailed analysis, insights, and professional formatting.",
      link: "Read More →"
    },
    {
      title: "Online Exam Helps",
      description: "Online exam help offers expert support to improve scores and academic performance.",
      link: "Read More →"
    }
  ];

  const testimonials = [
    {
      title: "Exceptional Service!",
      text: "Assignoz Consultancy delivered my essay ahead of schedule with impeccable quality. I couldn't be happier with the outcome!",
      author: "- Kamal Jayasuriya",
      rating: 4
    },
    {
      title: "Highly Recommended!",
      text: "The team provided a well-researched, plagiarism-free thesis that exceeded my expectations. Their timely delivery and customer support are fantastic.",
      author: "- Mariel Kalugama", 
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://static.india.com/wp-content/uploads/2024/03/JEE-MAIN-Session-2.jpg?impolicy=Medium_Widthonly&w=400')`
          }}
        ></div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Expert Academic Writing<br />
              to Help You Succeed!
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              At Assignoz Consultancy, we provide top-quality academic writing services, ensuring 100% originality, 
              plagiarism-free content, and timely delivery to help you achieve academic success with confidence.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center shadow-lg">
                Explore Services <ArrowRight className="ml-2" size={20} />
              </button>
              <Link to="/contact" className="border-2 border-white hover:bg-white hover:text-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                Get Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">Why Choose Us</h2>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                At Assignoz Consultancy, we deliver expert, plagiarism-free 
                academic writing with timely delivery and strict confidentiality. 
                Our dedicated support team is available 24/7 to ensure 
                your success!
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Expert Writers & Wide Subject Coverage</h3>
                    <p className="text-gray-600">Our highly qualified professionals specialize in various academic fields, covering subjects from humanities to sciences.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">100% Plagiarism-Free & Well-Researched Content</h3>
                    <p className="text-gray-600">We guarantee original, properly cited, and thoroughly researched academic work.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Timely Delivery & Customized Solutions</h3>
                    <p className="text-gray-600">We meet deadlines, even for urgent assignments, while tailoring content to your specific academic needs.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Confidential & 24/7 Support</h3>
                    <p className="text-gray-600">Your privacy is completely secure, and our support team is available anytime to assist you.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-2 relative z-10 transform rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Student writing and studying" 
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-orange-200 rounded-2xl transform -rotate-2"></div>
              <div className="absolute top-6 left-6 w-20 h-20 bg-blue-200 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-blue-600 text-white p-8 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">{service.description}</p>
                <button className="text-white hover:text-blue-200 font-semibold transition-colors flex items-center">
                  {service.link}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Testimonials */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Client Testimonials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">"{testimonial.title}"</h3>
                <p className="text-gray-600 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <p className="text-gray-500 font-medium">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      
    </div>
  );
}