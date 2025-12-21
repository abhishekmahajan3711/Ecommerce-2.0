import React, { useEffect } from 'react';
import { FaCookieBite } from 'react-icons/fa';

const CookiesPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <FaCookieBite className="mx-auto text-cyan-600 text-5xl mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Learn about how we use cookies and similar technologies to enhance your browsing experience and provide you with the best possible service.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-12 text-gray-700 leading-relaxed text-justify text-base">
          {/* What Are Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit our website. They enable us to remember your actions and preferences over time so you don't have to re-enter them whenever you come back to the site or browse from one page to another.
            </p>
            <p className="mt-4">
              Cookies do not typically contain personal information, but information stored in cookies can be linked to personal data collected elsewhere. They help make your browsing experience more convenient and personalized.
            </p>
          </section>

          {/* How We Use Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
            <p>
              We use cookies for several purposes to improve your experience: to keep you logged in, remember items in your shopping cart, and provide website security. Cookies also help us analyze user behavior to make our website more intuitive and functional.
            </p>
            <p className="mt-4">
              Marketing cookies may also be used to tailor advertising messages and deliver content that's more relevant to you, ensuring you see products and offers that match your interests.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
            <p>
              <strong>Essential Cookies:</strong> These are required for the website to function correctly. They include authentication cookies to keep you logged in, shopping cart cookies to remember your items, and security cookies to protect against fraud and ensure safe transactions.
            </p>
            <p className="mt-4">
              <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website. We use services like Google Analytics to track page views, user behavior patterns, and website performance metrics to continuously improve our services.
            </p>
            <p className="mt-4">
              <strong>Marketing Cookies:</strong> These cookies are used to deliver relevant advertisements and track marketing campaign performance. They help us show you products and offers that are most likely to interest you based on your browsing history and preferences.
            </p>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p>
              We may use cookies from trusted third-party services to help us enhance website functionality and analyze performance. These cookies are governed by the respective privacy policies of those providers and are used to improve our services.
            </p>
            <p className="mt-4">
              Some of the third-party services we use include Google Analytics for website usage statistics and behavior tracking, and payment processors for secure transaction processing. These services help us provide you with a better shopping experience and ensure the security of your transactions.
            </p>
          </section>


          {/* Legal Basis */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Basis for Cookie Use</h2>
            <p>
              Our use of cookies is based on several legal grounds: legitimate interest for essential and analytics cookies that help us provide and improve our services, and consent for marketing cookies that enhance your browsing experience with personalized content.
            </p>
            <p className="mt-4">
              We are committed to transparency about our cookie practices and provide you with clear information about how and why we use cookies. You can withdraw your consent for non-essential cookies at any time through your browser settings.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our data practices. We encourage you to review this page periodically for the latest information about how we use cookies.
            </p>
            <p className="mt-4">
              Your continued use of our website after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;
