import React from 'react';
import { XCircle, RefreshCcw, ArrowLeft } from 'lucide-react';

const PaymentFailure = () => {
  const handleRetry = () => {
    // Navigate back to cart/checkout
    window.history.back();
  };

  const goToHome = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>

        <p className="text-gray-600 mb-8">
          We couldn't process your payment. This could be due to insufficient funds,
          incorrect card details, or a temporary issue with your payment method.
        </p>

        <div className="space-y-4">
          {/* Main retry button */}
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <RefreshCcw className="h-5 w-5 mr-2" />
            Try Payment Again
          </button>

          {/* Secondary back to home button */}
          <button
            onClick={goToHome}
            className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Home
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            If you continue to experience issues, please contact our support team
            at <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;