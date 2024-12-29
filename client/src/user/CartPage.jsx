import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when the component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Remove item from cart
  const removeFromCart = (courseId) => {
    const updatedCart = cart.filter(item => item.course_id !== courseId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length > 0 ? (
        <div>
          {cart.map(item => (
            <div key={item.course_id} className="flex justify-between items-center border-b py-4">
              <div className="flex items-center">
                <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p>{item.course_type} - Batch {item.batch}</p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.course_id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default CartPage;
