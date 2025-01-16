import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl shadow-2xl backdrop-blur-lg border border-gray-700 p-8 my-8">
        <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-lg">
            Thank you for shopping at <span className="font-bold text-white">LPEDU.LK</span>. 
            We value your satisfaction and strive to provide you with the best online learning 
            experience possible. If, for any reason, you are not completely satisfied with your 
            purchase, we are here to help.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Refund Eligibility</h2>
            <p className="mb-2">We offer refunds under the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>If you experience technical issues that prevent you from accessing the purchased course and we are unable to resolve the issue.</li>
              <li>If the course content is significantly different from what was described on the website.</li>
              <li>If you accidentally purchased the wrong course and notify us within <span className="font-semibold text-white">2 days</span> of purchase.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Non-Refundable Items</h2>
            <p className="mb-2">Certain items and services are <span className="font-semibold text-white">non-refundable</span>, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-semibold text-white">Downloaded Course Materials:</span> Once course materials (videos, PDFs, or other resources) have been accessed or downloaded, they are non-refundable.</li>
              <li><span className="font-semibold text-white">Partially Completed Courses:</span> If you have completed more than <span className="font-semibold text-white">10% of the course</span>, a refund request will not be considered.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Refund Process</h2>
            <p className="mb-2">Once your refund request is reviewed and approved:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>We will process the refund to your original payment method.</li>
              <li>Refund processing time is <span className="font-semibold text-white">5-7 business days</span>, depending on your bank or payment provider.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Course Transfers & Exchanges</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>If you mistakenly purchased the wrong course, you may request a course <span className="font-semibold text-white">exchange</span> within <span className="font-semibold text-white">3 days</span> of purchase.</li>
              <li>Course transfers to another student are <span className="font-semibold text-white">not allowed</span>.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="mb-2">If you have any questions or concerns regarding our refund policy, please contact us at:</p>
            <div className="space-y-2">
              <p> &emsp;<span className="font-semibold text-white">Email:</span> lasanthakumara734@gmail.com</p>
              <p> &emsp;<span className="font-semibold text-white">Phone:</span> 0763143960</p>
              <p> &emsp;<span className="font-semibold text-white">Website:</span> https://lpedu.lk</p>
            </div>
          </div>

          <p className="text-lg">
            We are here to assist you and ensure your learning experience with us is smooth and beneficial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;