import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import {
  submitContactQuery,
  fetchUserQueries,
  clearError,
  clearSuccess
} from '../store/slices/contactSlice';

const ContactUs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { userQueries, loading, error, success } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [showQueries, setShowQueries] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/contact' } });
      return;
    }
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
    dispatch(fetchUserQueries());
  }, [dispatch, isAuthenticated, navigate, user]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

    // Scroll to top when component mounts
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    else if (formData.subject.trim().length < 5) newErrors.subject = 'Minimum 5 characters';

    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Minimum 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await dispatch(submitContactQuery(formData));
    if (submitContactQuery.fulfilled.match(result)) {
      setFormData((prev) => ({ ...prev, subject: '', message: '' }));
      dispatch(fetchUserQueries());
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 border-yellow-600';
      case 'in-progress': return 'text-cyan-700 border-cyan-700';
      case 'resolved': return 'text-green-600 border-green-600';
      case 'closed': return 'text-gray-600 border-gray-600';
      default: return 'text-gray-600 border-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 border-red-600';
      case 'medium': return 'text-yellow-600 border-yellow-600';
      case 'low': return 'text-green-600 border-green-600';
      default: return 'text-gray-600 border-gray-600';
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 bg-white p-8 rounded-lg shadow-md"> {/* Added bg-white, padding, rounded corners, shadow */}
            <h1 className="text-3xl font-bold text-cyan-700 mb-4">Contact Us</h1>
            <p className="text-sm text-gray-600 mb-6">We’d love to hear from you. Send us a message using the form below.</p>

            {error && (
              <div className="bg-red-100 border border-red-400 p-3 rounded-md text-sm text-red-700 flex items-center mb-4">
                <FaExclamationTriangle className="mr-2" /> {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 p-3 rounded-md text-sm text-green-700 flex items-center mb-4">
                <FaCheckCircle className="mr-2" /> Message sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {['name', 'email', 'subject'].map((field) => (
                <div key={field}>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={handleChange}
                    // Adjusted focus ring and placeholder color
                    className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 ${errors[field] ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors[field] && <p className="text-xs text-red-600 mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <textarea
                  name="message"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  // Adjusted focus ring and placeholder color
                  className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
                ></textarea>
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 text-white py-3 px-4 rounded-md hover:bg-cyan-700 transition duration-200 text-lg font-semibold" // Increased padding and font size
              >
                {loading ? 'Sending...' : <span className="flex items-center justify-center"><FaPaperPlane className="mr-2" /> Send Message</span>}
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-cyan-700 mb-4">Contact Information</h2> 
            <div className="space-y-5 text-base"> 
              <div className="flex items-center place-content-center space-x-4"> 
                <FaMapMarkerAlt className="text-cyan-600 flex-shrink-0 mt-1 text-2xl" /> 
                <div>
                  <p className="font-semibold text-gray-900">Location</p> 
                  <p className="text-gray-700">Mumbai, Maharashtra, India</p>
                </div>
              </div>
              <div className="flex items-center place-content-center space-x-4">
                <FaPhone className="text-cyan-600 flex-shrink-0 mt-1 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <a href="tel:+919307269829" className="text-cyan-700 hover:underline">
                    +91 9307269829
                  </a>
                </div>
              </div>
              <div className="flex items-center place-content-center space-x-4">
                <FaEnvelope className="text-cyan-600 flex-shrink-0 mt-1 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <a href="mailto:AstraPharma.Nexus@gmail.com" className="text-cyan-700 hover:underline">
                    AstraPharma.Nexus@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Queries Section */}
        {userQueries.length > 0 && (
          <div className="space-y-6 bg-white p-8 rounded-lg shadow-md mt-10"> {/* Added bg-white, padding, rounded corners, shadow, increased mt */}
            <div className="flex items-center justify-between border-b pb-4 mb-4"> {/* Added border-b, padding, margin */}
              <h2 className="text-2xl font-bold text-cyan-700">Your Previous Queries</h2> {/* Increased font size */}
              <button
                onClick={() => setShowQueries(!showQueries)}
                className="text-base text-cyan-600 hover:underline flex items-center transition-colors duration-200" // Increased font size, added transition
              >
                {showQueries ? <FaEyeSlash className="mr-2 text-lg" /> : <FaEye className="mr-2 text-lg" />} {/* Larger icon */}
                {showQueries ? 'Hide Queries' : 'Show Queries'} {/* More descriptive text */}
              </button>
            </div>

            {showQueries && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {/* Increased gap */}
                {userQueries.map((query) => (
                  <div key={query._id} className="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm space-y-3"> {/* Added bg-gray-50, more padding, rounded-lg */}
                    {/* Row 1: Date, Subject, Status, Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm"> {/* Added gap-y and gap-x */}
                      <div className="flex items-center"> {/* Use flex for consistent vertical alignment */}
                        <span className="font-semibold text-gray-800 mr-2">Date:</span>
                        <span className="text-gray-700">{formatDate(query.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-800 mr-2">Subject:</span>
                        <span className="text-gray-700">{query.subject}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-800 mr-2">Status:</span>
                        <span className={`inline-block px-3 py-1 border rounded-full text-xs font-medium ${getStatusColor(query.status)}`}> {/* Increased padding, font-medium */}
                          {query.status.charAt(0).toUpperCase() + query.status.slice(1).replace('-', ' ')} {/* Capitalize and replace hyphen */}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-800 mr-2">Priority:</span>
                        <span className={`inline-block px-3 py-1 border rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                          {query.priority.charAt(0).toUpperCase() + query.priority.slice(1)} {/* Capitalize */}
                        </span>
                      </div>
                    </div>
                    
                    {/* Row 2: Message */}
                    <div className="pt-3 border-t border-gray-100"> {/* Added top border for separation */}
                      <p className="font-semibold text-gray-800 text-sm mb-1">Message:</p>
                      <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-100 p-3 rounded-md border border-gray-200"> {/* Added bg, padding, border */}
                        {query.message}
                      </p>
                    </div>
                    
                    {/* Row 3: Admin Response */}
                    {query.adminNotes && (
                      <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded-md mt-3"> {/* Increased padding, slightly lighter border */}
                        <p className="text-xs font-semibold text-cyan-800 mb-1">Admin Response:</p>
                        <p className="text-sm text-cyan-700 whitespace-pre-line">
                          {query.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;