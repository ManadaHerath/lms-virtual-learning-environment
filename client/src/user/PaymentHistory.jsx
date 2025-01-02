import React, { useEffect, useState } from "react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("User is not authenticated");
        }

        const response = await fetch("http://localhost:3000/user/payments", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }

        const data = await response.json();
        setPayments(data.payments);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPayments();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>
      {payments.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">Payment ID</th>
              <th className="border border-gray-200 p-2">Status</th>
              <th className="border border-gray-200 p-2">Type</th>
              <th className="border border-gray-200 p-2">Amount</th>
              <th className="border border-gray-200 p-2">Date</th>
              <th className="border border-gray-200 p-2">Course</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.payment_id} className="text-center">
                <td className="border border-gray-200 p-2">{payment.payment_id}</td>
                <td className="border border-gray-200 p-2">{payment.payment_status}</td>
                <td className="border border-gray-200 p-2">{payment.payment_type}</td>
                <td className="border border-gray-200 p-2">Rs.{payment.amount}</td>
                <td className="border border-gray-200 p-2">{new Date(payment.payment_date).toISOString().split('T')[0]}</td>
                <td className="border border-gray-200 p-2">
                  {payment.course_type} - {payment.batch} ({payment.month})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payment history available.</p>
      )}
    </div>
  );
};

export default PaymentHistory;