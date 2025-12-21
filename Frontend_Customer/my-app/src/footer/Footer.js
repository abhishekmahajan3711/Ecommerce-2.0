import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center justify-center mb-4">
              <img src="/logo.png" alt="AstraPharma Nexus" className="h-10 w-auto mb-1" />
              <span className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 via-orange-400 to-purple-500 bg-clip-text text-transparent" style={{letterSpacing: '0.1em'}}>AstraPharma Nexus</span>
            </div>
            <p className="text-gray-400 mb-4 text-center">
              Your trusted partner for premium health supplements. We're committed to providing high-quality products that support your wellness journey.
            </p>
            <div className="flex space-x-4 justify-center">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/contact');
                    } else {
                      navigate('/signin');
                    }
                  }}
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-cyan-400 mr-3" />
                <span className="text-gray-400">Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-cyan-400 mr-3" />
                <span className="text-gray-400">+91 9307269829</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-cyan-400 mr-3" />
                <span className="text-gray-400">AstraPharma.Nexus@gmail.com</span>
              </div>
            </div>
            

          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 AstraPharma Nexus. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
