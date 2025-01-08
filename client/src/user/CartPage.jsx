import React, { useEffect, useState } from "react";
import { Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import PaymentCheckout from "./PaymentCheckout"; // Import the PaymentCheckout component

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const reverseCart = [...cart].reverse();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeFromCart = (image_url) => {
    const updatedCart = cart.filter((item) => item.image_url !== image_url);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload();
  };

  const totalPrice = cart.reduce((total, item) => {
    return total + (parseFloat(item.price) || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-500 mt-2">
              {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <ShoppingCart className="h-8 w-8 text-gray-400" />
        </div>

        {cart.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    {reverseCart.map((item, index) => (
                      <div
                        key={item.course_id}
                        className={`flex items-center justify-between py-6 ${
                          index !== reverseCart.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="h-24 w-24 object-cover rounded-lg shadow-sm"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg"></div>
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                              {item.title}
                            </h2>
                            <p className="text-lg font-medium text-blue-600 mt-1">
                              Rs. {parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.image_url)}
                          className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>Rs. {totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Processing Fee</span>
                        <span>Rs. 0.00</span>
                      </div>
                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span className="text-blue-600">
                            Rs. {totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-8">
                        {/* Add the PaymentCheckout component here */}
                        <PaymentCheckout cart={cart} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="inline-block bg-white rounded-xl shadow-md p-3 mt-8">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <AlertCircle className="h-4 w-4 mr-2" />
                Secure payment powered by PayHere
              </div>
              <div className="flex justify-center mt-4">
                <a
                  href="https://www.payhere.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <img
                    src="https://www.payhere.lk/downloads/images/payhere_long_banner.png"
                    alt="PayHere"
                    className="w-full h-auto"
                  />
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md text-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <ShoppingCart className="h-16 w-16 text-gray-300" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Your cart is empty
              </h2>
              <p className="text-gray-500">
                Add items to your cart to proceed with checkout
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
