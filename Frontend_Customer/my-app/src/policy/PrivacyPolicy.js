import React, { useEffect } from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <FaShieldAlt className="mx-auto text-cyan-600 text-5xl mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-12 text-gray-700 leading-relaxed text-justify text-base">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p>
              AstraPharma Nexus ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or make purchases from us.
            </p>
            <p className="mt-4">
              By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, phone number, billing and shipping addresses, and payment details (handled securely via third-party partners). We may also retain communication history when you interact with our customer service.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect to process orders, manage your account, respond to inquiries, and improve our services. This includes analyzing website usage, sending promotional offers, ensuring legal compliance, and enhancing the overall customer experience.
            </p>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
            <p>
              We do not sell or rent your personal information to third parties. However, we may share information with trusted service providers who help us operate our website, process payments, and deliver products. We may also disclose information when legally required or in case of business transfers (e.g., acquisition or merger), and only with your explicit consent.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p>
              We implement industry-standard encryption to secure your data during transmission and storage. Access to personal information is restricted to authorized personnel only. We regularly monitor our systems for vulnerabilities and ensure strong access controls to protect your data.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience on our website. Essential cookies support core site functionality. Analytics cookies help us understand visitor behavior, and marketing cookies assist in delivering personalized content and measuring ad performance.
            </p>
            <p className="mt-4">
              You can manage cookie settings through your browser. Disabling some cookies may affect how our website functions.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p>
              Our website and services are provided "as is" without warranties of any kind. AstraPharma Nexus disclaims all warranties, whether express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <p className="mt-4">
              In no event shall AstraPharma Nexus be liable for any indirect, incidental, special, consequential, or punitive damages—including loss of data, profits, or use—arising from your use of our services. Our total liability for any claims shall not exceed the amount you paid in the 12 months preceding the claim.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless AstraPharma Nexus, its team, and affiliates from any claims, losses, liabilities, or expenses arising from your use of our services or any violation of these Terms.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Severability</h2>
            <p>
              If any part of these Terms is found to be invalid or unenforceable, that portion will be limited or removed as needed, and the rest of the Terms will remain fully effective and enforceable.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We encourage you to review it periodically to stay informed about how we protect your data.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
