import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, Shield, Star, ArrowRight, Menu, X } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      rating: 5
    },
    {
      title: "Highly Recommended!",
      text: "The team provided a well-researched, plagiarism-free thesis that exceeded my expectations. Their timely delivery and customer support are fantastic.",
      author: "- Mariel Kalugama", 
      rating: 5
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Expert Writers & Wide Subject Coverage",
      description: "Our highly qualified professionals specialize in various academic fields, covering subjects from humanities to sciences."
    },
    {
      icon: CheckCircle,
      title: "100% Plagiarism-Free & Well-Researched Content",
      description: "We guarantee original, properly cited, and thoroughly researched academic work."
    },
    {
      icon: Clock,
      title: "Timely Delivery & Customized Solutions",
      description: "We meet deadlines, even for urgent assignments, while tailoring content to your specific academic needs."
    },
    {
      icon: Shield,
      title: "Confidential & 24/7 Support",
      description: "Your privacy is completely secure, and our support team is available anytime to assist you."
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative text-white overflow-hidden min-h-screen flex items-center">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://static.india.com/wp-content/uploads/2024/03/JEE-MAIN-Session-2.jpg?impolicy=Medium_Widthonly&w=400')`
          }}
        ></div>
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Expert Academic Writing<br />
              <span className="text-orange-300">to Help You Succeed!</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              At Assignoz Consultancy, we provide top-quality academic writing services, ensuring 100% originality, 
              plagiarism-free content, and timely delivery to help you achieve academic success with confidence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
              <button className="group bg-[#1A69A7] hover:bg-[#144d85] text-white font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-[#1A69A7]/50 flex items-center justify-center min-w-[200px]">
                Explore Services 
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button className="border-2 border-white hover:bg-white hover:text-[#1A69A7] text-white font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[200px]">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800 leading-tight">
                Why Choose <span className="text-[#1A69A7]">Us</span>
              </h2>
              <p className="text-gray-600 mb-12 text-xl leading-relaxed">
                At Assignoz Consultancy, we deliver expert, plagiarism-free 
                academic writing with timely delivery and strict confidentiality. 
                Our dedicated support team is available 24/7 to ensure 
                your success!
              </p>

              <div className="space-y-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`flex items-start space-x-6 p-6 rounded-2xl transition-all duration-500 hover:bg-white hover:shadow-xl transform hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className="bg-gradient-to-br from-[#1A69A7] to-[#144d85] w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <feature.icon className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative group">
                <div className="bg-white rounded-3xl shadow-2xl p-3 relative z-10 transform rotate-2 group-hover:rotate-0 transition-all duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Student writing and studying" 
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 rounded-3xl transform -rotate-2 group-hover:-rotate-1 transition-all duration-500"></div>
                <div className="absolute top-8 left-8 w-24 h-24 bg-gradient-to-br from-[#1A69A7]/30 to-blue-300/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-16 right-16 w-16 h-16 bg-gradient-to-br from-orange-300/40 to-pink-300/40 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Our <span className="text-[#1A69A7]">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive academic writing solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`group bg-gradient-to-br from-[#1A69A7] to-[#144d85] text-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="relative overflow-hidden">
                  <h3 className="text-xl font-bold mb-4 group-hover:text-orange-200 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-blue-100 mb-6 leading-relaxed text-sm">
                    {service.description}
                  </p>
                  <button className="text-white hover:text-orange-200 font-semibold transition-all duration-300 flex items-center group-hover:translate-x-2">
                    {service.link}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </button>
                  
                  {/* Hover Effect Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-2xl transition-opacity duration-300 ${activeCard === index ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Testimonials */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Client <span className="text-[#1A69A7]">Testimonials</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What our satisfied clients say about our services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current animate-pulse" size={24} style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-[#1A69A7] transition-colors">
                  {testimonial.title}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1A69A7] to-[#144d85] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.author.charAt(2)}
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">{testimonial.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      
    </div>
  );
}