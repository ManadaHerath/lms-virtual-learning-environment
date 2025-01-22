import React from "react";
import api from "../redux/api";// Import your API client
import { useSnackbar } from "notistack";
const PaymentCheckout = ({ cart }) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleCheckout = async () => {
    // Ensure cart exists and calculate the total amount
    const totalAmount = cart?.reduce((total, item) => {
      return total + (parseFloat(item.price) || 0); // Parse price safely
    }, 0) || 0;

    const orderDetails = {
      order_id: "12345", // Replace with dynamically generated order ID
      amount: totalAmount.toFixed(2),
      currency: "LKR",
    };

    try {
      // Send request to the backend to generate the hash
      const response = await api.post("/payments/generate-hash", orderDetails);
      
      const { merchant_id, hash } = response.data;

      // Create a form and submit it to PayHere
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payhere.lk/pay/checkout";

      const fields = [
        { name: "merchant_id", value: merchant_id },
        { name: "return_url", value: import.meta.env.VITE_RETURN_URL },
        { name: "cancel_url", value: import.meta.env.VITE_CANCEL_URL },
        { name: "notify_url", value: import.meta.env.VITE_NOTIFY_URL },
        { name: "order_id", value: orderDetails.order_id },
        { name: "items", value: "Course Purchase" },
        { name: "currency", value: orderDetails.currency },
        { name: "amount", value: orderDetails.amount },
        { name: "first_name", value: "John" }, // Replace with user data
        { name: "last_name", value: "Doe" },
        { name: "email", value: "john.doe@example.com" },
        { name: "phone", value: "0771234567" },
        { name: "address", value: "123 Main St" },
        { name: "city", value: "Colombo" },
        { name: "country", value: "Sri Lanka" },
        { name: "hash", value: hash }, // Include the hash from the backend
      ];

      // Create hidden inputs for the form
      fields.forEach(({ name, value }) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      // Append and submit the form
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error generating hash:", error);
      
      enqueueSnackbar('Failed to proceed to payment. Please try again',{variant:'error'})
    }
  };

  return (
    <button onClick={handleCheckout} className="bg-gray-500 text-white p-4 rounded" disabled={true}>
      Proceed to Payment
    </button>
  );
};

export default PaymentCheckout;
