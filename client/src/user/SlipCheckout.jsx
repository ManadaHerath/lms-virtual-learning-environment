import { useState } from "react";
import PropTypes from "prop-types";

const SlipUploadButton = ({ cartItems, user }) => {
  const [loading, setLoading] = useState(false);

  const handleSlipUpload = () => {
    setLoading(true);

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );

    // Prepare cart items information
    const coursesInfo = cartItems
      .map((item) => `${item.batch} (${item.course_type}) ${item.month}`)
      .join(", ");

    // Google Script URL with query parameters
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyTGboaLNypezg-Of4XskKxC2wAcTeWIj69kmB0dvPw0maMbt5DWUQDROJm5rKdKONhAA/exec";

    // Create URL with parameters
    const slipUploadUrl =
      `${GOOGLE_SCRIPT_URL}?` +
      new URLSearchParams({
        userName: user.first_name + " " + user.last_name,
        email: user.email,
        courses: coursesInfo,
        totalAmount: totalAmount,
        origin: window.location.origin,
      }).toString();

    // Open Google Script in a centered popup window
    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const uploadWindow = window.open(
      slipUploadUrl,
      "Slip Upload",
      `width=${width},height=${height},top=${top},left=${left},status=yes`
    );

    // Message handler with debugging
    const messageHandler = (event) => {
      // Debug logging
      console.log('Message received:', {
        eventOrigin: event.origin,
        expectedOrigin: new URL(GOOGLE_SCRIPT_URL).origin,
        messageData: event.data,
        googleScriptURL: GOOGLE_SCRIPT_URL
      });

      // Verify the origin matches your Google Apps Script URL
      const scriptOrigin = new URL(GOOGLE_SCRIPT_URL).origin;
      if (event.origin === scriptOrigin) {
        try {
          const data = event.data;
          console.log('Processing message data:', data);
          if (data.status === "upload_complete" && data.success) {
            console.log('Upload complete, clearing cart');
            localStorage.removeItem("cart");
            alert("Payment slip uploaded successfully!");
            window.location.reload();
          }
          window.removeEventListener("message", messageHandler);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      } else {
        console.warn('Origin mismatch:', {
          received: event.origin,
          expected: scriptOrigin
        });
      }
    };

    // Add message listener
    window.addEventListener("message", messageHandler);

    // Check upload status via localStorage
    const checkUploadStatus = () => {
      const statusData = localStorage.getItem('payment_upload_status');
      if (statusData) {
        try {
          const status = JSON.parse(statusData);
          const isRecent = (new Date().getTime() - status.timestamp) < 30000;
          
          if (isRecent && status.success) {
            console.log('Upload completed via localStorage check');
            localStorage.removeItem('payment_upload_status');
            localStorage.removeItem('cart');
            alert("Payment slip uploaded successfully!");
            window.location.reload();
          }
        } catch (e) {
          console.error('Error checking upload status:', e);
        }
      }
    };

    // Start polling
    const statusCheck = setInterval(checkUploadStatus, 1000);

    // Window close handler
    const checkWindow = setInterval(() => {
      if (uploadWindow && uploadWindow.closed) {
        clearInterval(checkWindow);
        clearInterval(statusCheck);
        setLoading(false);
        localStorage.removeItem('cart');
        window.removeEventListener("message", messageHandler);
        window.location.reload();
      }
    }, 1000);
  };

  return (
    <button
      onClick={handleSlipUpload}
      disabled={loading || cartItems.length === 0}
      className={`px-4 py-2 text-white rounded-md transition-colors ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        "Upload Payment Slip"
      )}
    </button>
  );
};

SlipUploadButton.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      batch: PropTypes.string.isRequired,
      course_type: PropTypes.string.isRequired,
      month: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  user: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default SlipUploadButton;