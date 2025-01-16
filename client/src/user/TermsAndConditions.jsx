import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-3xl shadow-2xl backdrop-blur-lg border border-gray-700 p-8 my-8">
        <h1 className="text-4xl font-bold text-white mb-8">Terms and Conditions</h1>
        
        <div className="space-y-8 text-gray-300">
          <p className="text-lg">
            Welcome to <span className="font-bold text-white">LPEDU.LK</span>. These Terms and 
            Conditions govern your use of our website and the purchase of online courses from our 
            platform. By accessing and using <span className="font-bold text-white">LPEDU.LK</span>, 
            you agree to comply with these terms. Please read them carefully before proceeding with 
            any transactions.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Use of the Website</h2>
            <div className="space-y-2 pl-4">
              <p>a. You must be at least 16 years old or have parental/guardian consent to use our website or purchase courses.</p>
              <p>b. You are responsible for maintaining the confidentiality of your account information, including your username and password.</p>
              <p>c. You agree to provide accurate, current, and complete information during the registration and checkout process.</p>
              <p>d. You may not use our website for any unlawful or unauthorized purposes, including sharing purchased course materials without permission.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Course Information & Pricing</h2>
            <div className="space-y-2 pl-4">
              <p>a. We strive to provide accurate course descriptions, images, and pricing information. However, we do not guarantee the absolute accuracy of such information.</p>
              <p>b. Prices for courses are subject to change without prior notice. Any promotions or discounts are valid for a limited time and may be subject to additional terms and conditions.</p>
              <p>c. Course access durations may vary depending on the course type and purchase plan. Some courses may have lifetime access, while others may have a fixed validity period.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Orders & Payments</h2>
            <div className="space-y-2 pl-4">
              <p>a. By purchasing a course on LPEDU.LK, you are making an offer to enroll in the selected course(s).</p>
              <p>b. We reserve the right to refuse or cancel any order for any reason, including but not limited to technical issues, pricing errors, or suspected fraudulent activity.</p>
              <p>c. You agree to provide valid and up-to-date payment information and authorize us to charge the total order amount, including applicable taxes, to your chosen payment method.</p>
              <p>d. Payments are processed securely through trusted third-party payment gateways. We do not store or have access to your full payment details.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Course Access & Delivery</h2>
            <div className="space-y-2 pl-4">
              <p>a. Upon successful payment, course access will be granted instantly or within 24 hours, depending on the course type.</p>
              <p>b. Courses are delivered in the form of pre-recorded video lectures, study materials, and/or live sessions, depending on the course specifications.</p>
              <p>c. You are strictly prohibited from sharing, distributing, or reselling course content in any form. Any violation may result in termination of access without a refund.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Refund & Cancellation Policy</h2>
            <div className="space-y-2 pl-4">
              <p>a. Our Refund Policy governs the conditions for course refunds. Please refer to the Refund Policy on our website for detailed information.</p>
              <p>b. Refunds are not applicable once a course has been accessed or partially completed.</p>
              <p>c. If you accidentally purchase the wrong course, you may request a transfer to the correct course within 3 days of purchase.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property Rights</h2>
            <div className="space-y-2 pl-4">
              <p>a. All content and materials on LPEDU.LK, including but not limited to video lectures, study notes, images, logos, and graphics, are protected by copyright and intellectual property laws.</p>
              <p>b. You may not reproduce, distribute, modify, or resell any content from our website without prior written consent from LPEDU.LK.</p>
              <p>c. Any unauthorized use of course materials may result in legal action.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
            <div className="space-y-2 pl-4">
              <p>a. LPEDU.LK and its instructors, directors, employees, or affiliates shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use of our website or courses.</p>
              <p>b. The effectiveness of the courses depends on the student's dedication and effort.</p>
              <p>c. While we strive to provide an uninterrupted learning experience, we are not responsible for technical issues, internet disruptions, or third-party service failures.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Amendments & Termination</h2>
            <div className="space-y-2 pl-4">
              <p>a. We reserve the right to modify, update, or terminate these Terms and Conditions at any time without prior notice.</p>
              <p>b. It is your responsibility to review these terms periodically for any changes. Continued use of LPEDU.LK after modifications implies acceptance of the updated terms.</p>
              <p>c. If you violate any of these Terms and Conditions, we reserve the right to suspend or terminate your account without a refund.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;