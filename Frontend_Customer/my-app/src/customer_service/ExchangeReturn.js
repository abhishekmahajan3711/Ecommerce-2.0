import React from 'react';
import { useEffect } from 'react';

const ExchangeReturn = () => {
    // Scroll to top when component mounts
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No Return and Exchange Policy. Contact us if any issue with the product.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExchangeReturn;
