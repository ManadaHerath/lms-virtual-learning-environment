import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl shadow-2xl backdrop-blur-lg border border-gray-700 p-8 my-8">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-lg">
            At <span className="font-bold text-white">LPEDU.LK</span>, we are committed to protecting 
            the privacy and security of our users' personal information. This Privacy Policy outlines 
            how we collect, use, and safeguard your information when you visit or make a purchase 
            on our website. By using <span className="font-bold text-white">LPEDU.LK</span>, you 
            consent to the practices described in this policy.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
            <p className="mb-2">When you visit <span className="font-bold text-white">LPEDU.LK</span>, we may collect the following information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-semibold text-white">Personal Information:</span> Your name, email address, phone number, and other details voluntarily provided during course registration, account creation, or checkout.</li>
              <li><span className="font-semibold text-white">Payment Information:</span> Billing details necessary to process course purchases, such as credit/debit card information, which are securely handled by third-party payment processors.</li>
              <li><span className="font-semibold text-white">Browsing Data:</span> Information such as your IP address, browser type, device details, and interaction with our website, collected automatically through cookies and tracking technologies.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-semibold text-white">To Provide Educational Services:</span> Process course enrollments, grant course access, and manage your learning experience.</li>
              <li><span className="font-semibold text-white">To Communicate with You:</span> Send purchase confirmations, course updates, newsletters (if subscribed), and respond to inquiries.</li>
              <li><span className="font-semibold text-white">To Improve Our Website & Services:</span> Enhance user experience based on feedback and browsing behavior.</li>
              <li><span className="font-semibold text-white">To Ensure Security & Prevent Fraud:</span> Detect and prevent unauthorized access or fraudulent transactions.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Information Sharing & Third Parties</h2>
            <p className="mb-2">We respect your privacy and do <span className="font-bold text-white">not</span> sell, trade, or share your personal data with third parties, except in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-semibold text-white">Trusted Service Providers:</span> We may share data with third-party service providers that help us operate our website, process payments, or provide customer support. These providers are obligated to handle your data securely.</li>
              <li><span className="font-semibold text-white">Legal Requirements:</span> If required by law, we may disclose your information to comply with legal processes or government requests.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
            <p>
              We implement strict security measures to protect your personal information from unauthorized 
              access, alteration, or disclosure. However, no online platform can guarantee 100% security. 
              We advise users to use strong passwords and be cautious when sharing personal data online.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Cookies & Tracking Technologies</h2>
            <p className="mb-2">We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Enhance user experience by remembering preferences.</li>
              <li>Analyze website traffic and improve content delivery.</li>
              <li>Show relevant course recommendations.</li>
            </ul>
            <p className="mt-2">
              You can disable cookies through your browser settings, but some website features may not 
              function correctly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be reflected on this 
              page with a revised <span className="font-bold text-white">"last updated"</span> date. 
              We encourage you to review this policy periodically.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="mb-2">If you have any questions or concerns regarding our Privacy Policy, please contact us:</p>
            <div className="space-y-2">
              <p>&emsp; <span className="font-semibold text-white">Email:</span> lasanthakumara734@gmail.com</p>
              <p>&emsp; <span className="font-semibold text-white">Phone:</span> 0763143960</p>
              <p>&emsp; <span className="font-semibold text-white">Website:</span> https://lpedu.lk</p>
            </div>
          </div>

          <p className="text-lg">
            Your privacy is important to us, and we are committed to ensuring a secure and enjoyable 
            learning experience at <span className="font-bold text-white">LPEDU.LK</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;