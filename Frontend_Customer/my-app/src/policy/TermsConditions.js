import React, { useEffect } from 'react';
import { FaGavel } from 'react-icons/fa';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <FaGavel className="mx-auto text-cyan-600 text-5xl mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our services.
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-12 text-gray-700 leading-relaxed text-justify text-base">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              These Terms and Conditions ("Terms") govern your use of the AstraPharma Nexus website and services. By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our services.
            </p>
            <p className="mt-4">
              AstraPharma Nexus ("we," "us," or "our") reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Account Registration</h2>
            <p>
              To access certain features of our website, you must create an account. You agree to provide accurate, current, and complete information during registration, maintain and update your account information, keep your credentials secure, accept responsibility for all activities under your account, and notify us of any unauthorized access. We reserve the right to terminate accounts at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Product Information and Orders</h2>
            <p>
              We strive for accurate product descriptions, images, and pricing, but do not guarantee that content is error-free. Orders are subject to availability and acceptance. We may refuse or cancel orders due to errors, stock issues, or fraud concerns. Prices may change without notice and exclude taxes and shipping charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
            <p>
              By placing an order, you authorize us to charge your payment method for the full amount, including taxes and shipping. Payment is required at order time. We accept various payment methods securely through our partners. Failed payments may result in cancellation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Shipping and Delivery</h2>
            <p>
              We aim to process and ship orders promptly, though delivery times may vary. Risk of loss and ownership transfer upon delivery. We are not liable for delays due to shipping carriers or customs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
            <p>
              No return or refund policy is offered.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Uses</h2>
            <p>
              You agree not to use our services for unlawful purposes or to harm, disable, or impair our website. Prohibited actions include unauthorized access, spreading malware, fraudulent activities, and sending spam.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p>
              All content on our site—including text, graphics, images, and software—is owned by AstraPharma Nexus or licensors and protected by law. You may not reproduce or modify any content without written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers</h2>
            <p>
              Our products are dietary supplements and not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare provider before use.
            </p>
            <p className="mt-4">
              Our website and services are provided "as is" without warranties of any kind. We disclaim all express or implied warranties including merchantability, fitness, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p>
              AstraPharma Nexus is not liable for indirect, incidental, or consequential damages including loss of data, profits, or use. Our total liability will not exceed the amount you paid to us in the 12 months before the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless AstraPharma Nexus and its personnel from any claims or liabilities arising from your use of our services or violations of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p>
              These Terms are governed by Indian law. Any disputes will be resolved in the courts of Mumbai, Maharashtra, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Severability</h2>
            <p>
              If any provision is found unenforceable, it will be limited or removed as needed while the rest of the Terms remain in effect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;