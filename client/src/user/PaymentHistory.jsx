import React, { useEffect, useState } from "react";
import { Receipt, AlertCircle, CreditCard, Calendar, BookOpen } from "lucide-react";
import api from "../redux/api";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/user/payments");
        if (!response.status == 200) {
          throw new Error("Failed to fetch payments");
        }
        const data = await response.data;
        setPayments(data.payments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getTotalSpent = () => {
    return payments.reduce((total, payment) => total + parseFloat(payment.amount), 0);
  };

  const getPaymentTypeCount = (type) => {
    return payments.filter(payment => payment.payment_type === type).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="bg-white rounded-xl shadow-md max-w-md mx-auto p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Payment History
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Track all your course payments and transactions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-3">
              <Receipt className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{payments.length}</div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">Rs.{getTotalSpent().toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {payments.length > 0
                    ? new Date(payments[0].payment_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Latest Transaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {payments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md max-w-md mx-auto p-8 text-center">
            <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Payment History
            </h3>
            <p className="text-gray-600">
              You haven't made any payments yet. Enroll in a course to get started.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Payment ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Course Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr key={payment.payment_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        #{payment.payment_id}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                          {payment.payment_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Rs.{parseFloat(payment.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(payment.payment_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                            {payment.course_type}
                          </span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                            Batch {payment.batch}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;