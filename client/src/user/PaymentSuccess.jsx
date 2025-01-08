import React from 'react';
import { CheckCircle, Home, Download } from 'lucide-react';

const PaymentSuccess = () => {
  const goToHome = () => {
    window.location.href = '/dashboard';
  };

  const goToCourses = () => {
    window.location.href = '/user/mycourse';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>

        <div className="bg-green-50 rounded-lg p-4 mb-8">
          <p className="text-gray-600">
            Thank you for your purchase! Your courses are now available in My Courses.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <div className="text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">#{Math.random().toString().slice(2, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">PayHere</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Main access courses button */}
          <button
            onClick={goToCourses}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Access Your Courses
          </button>

          {/* Secondary back to home button */}
          <button
            onClick={goToHome}
            className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Return to Home
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your registered email address. If you need any assistance, please contact our support team at{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;