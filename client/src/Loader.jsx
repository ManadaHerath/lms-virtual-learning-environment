import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="relative w-24 h-24 animate-spin">
        {/* Circles */}
        <div className="absolute w-5 h-5 bg-blue-500 rounded-full top-0 left-0 animate-bounce"></div>
        <div className="absolute w-5 h-5 bg-green-500 rounded-full top-0 right-0 animate-bounce delay-[100ms]"></div>
        <div className="absolute w-5 h-5 bg-yellow-500 rounded-full bottom-0 left-0 animate-bounce delay-[200ms]"></div>
        <div className="absolute w-5 h-5 bg-red-500 rounded-full bottom-0 right-0 animate-bounce delay-[300ms]"></div>

        {/* Center circle */}
        <div className="absolute w-8 h-8 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loader;
