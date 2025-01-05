import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length > 0 ? (
        <div className="space-y-6">
          <div className="space-y-4">
            {reverseCart.map((item) => (
              <div
                key={item.course_id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                      <p className="text-lg font-medium">
                        Rs:{parseFloat(item.price).toFixed(2)}
                      </p>
                    <button
                      onClick={() => removeFromCart(item.image_url)}
                      className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold">
                Rs:{totalPrice.toFixed(2)}
              </span>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
