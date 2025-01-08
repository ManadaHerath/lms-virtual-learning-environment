import React, { useState, useEffect } from "react";

const ExtendSessionDialog = ({ onExtendSession, onLogout }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Session Expiring</h2>
        <p className="mt-2">Your session is about to expire. Would you like to extend it?</p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onLogout}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={onExtendSession}
          >
            Extend Session
          </button>
        </div>
      </div>
    </div>
  );
};
export default ExtendSessionDialog;