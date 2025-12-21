import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useEffect } from 'react';

const FAQ = () => {

      // Scroll to top when component mounts
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      category: "Product Information",
      items: [
        {
          question: "What types of supplements do you offer?",
          answer: "We offer a comprehensive range of health supplements including vitamins, minerals, protein powders, omega-3 supplements, probiotics, and antioxidants. All our products are carefully formulated to support your health and wellness goals."
        },
        {
          question: "Do you offer vegan/vegetarian options?",
          answer: "Yes, we have a wide selection of vegan and vegetarian supplements. All our products are clearly labeled with dietary information, and you can filter products by dietary preferences on our website."
        },
        {
          question: "How do I know which supplements I need?",
          answer: "We recommend consulting with a healthcare professional before starting any supplement regimen."
        }
      ]
    },
    {
      category: "Ordering & Shipping",
      items: [
        {
          question: "How long does shipping take?",
          answer: "Shipping times may vary based on your location and the shipping method you choose."
        },
        {
          question: "Do you ship internationally?",
          answer: "Currently, we ship within India. We're working on expanding our international shipping options. Please check our shipping page for the most up-to-date information."
        },
        {
          question: "What are your shipping costs?",
          answer: "Shipping costs is purely based on the distance between your delivery destination and our manufacturer"
        },
        {
          question: "Can I track my order?",
          answer: "Yes, once your order ships, you'll receive a tracking number via email. You can also track your order status in your account dashboard."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      items: [
        {
          question: "What is your return policy?",
          answer: "No return and refund policy. "
        },
      ]
    },
    {
      category: "Account & Security",
      items: [
        {
          question: "How do I create an account?",
          answer: "You can create an account by clicking the Sign Up icon at the top right of our website. You'll need to provide your name, email address, and create a password."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click on the 'Forgot Password' link on the sign-in page. Enter your email address, and we'll send you a link to reset your password. Also on profile page, there's option of 'Change Password'."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we take your privacy and security seriously. We use industry-standard encryption to protect your personal information and never share your data with third parties without your consent."
        },
        {
          question: "Can I change my account information?",
          answer: "Yes, you can update your account information, including your name, password, and address, in your profile settings. "
        }
      ]
    },
    {
      category: "Customer Service",
      items: [
        {
          question: "How can I contact customer service?",
          answer: "You can reach our customer service team via phone at +91 9307269829, email at AstraPharma.specialities@gmail.com, or through our contact form."
        },
        {
          question: "Do you offer live chat support?",
          answer: "No. Currently, we offer support via phone, email, and contact form."
        },
        {
          question: "What if I have a complaint?",
          answer: "Go to footer , click on 'Contact Us', and write your message and click on 'Send Message' button."
        },
        {
          question: "Do you have a loyalty program?",
          answer: "No, we do not have loyalty program."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-cyan-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">{category.category}</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.items.map((item, itemIndex) => {
                  const index = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems.has(index);
                  
                  return (
                    <div key={itemIndex} className="border-b border-gray-200 last:border-b-0">
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg font-medium text-gray-900 pr-4">
                          {item.question}
                        </span>
                        {isOpen ? (
                          <FaChevronUp className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                        ) : (
                          <FaChevronDown className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FAQ;
