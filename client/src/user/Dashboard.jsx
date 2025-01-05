import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../redux/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileResponse, coursesResponse, paymentsResponse] = await Promise.all([
          api.get("/user/profile"),
          api.get("/user/enrolled"),
          api.get("/user/payments")
        ]);

        setProfile(profileResponse.data.user);
        setMyCourses(coursesResponse.data || []);
        setPaymentHistory(paymentsResponse.data.payments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-4 text-gray-800">Profile</h2>
          {profile ? (
            <div className="space-y-2 text-sm text-gray-600">
              <p>{profile.first_name} {profile.last_name}</p>
              <p>{profile.email}</p>
              <p>{profile.telephone}</p>
              <Link to="/user/profile" className="text-blue-500 hover:text-blue-600 inline-block mt-2">
                Edit Profile →
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">Profile not available</p>
          )}
        </div>

        {/* Courses Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-4 text-gray-800">Recent Courses</h2>
          {myCourses.length > 0 ? (
            <div className="space-y-2">
              {myCourses.slice(0, 3).map((course) => (
                <div key={course.course_id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{course.name}</span>
                  <span className="text-gray-500">${course.price}</span>
                </div>
              ))}
              <Link to="/user/mycourse" className="text-blue-500 hover:text-blue-600 inline-block mt-2">
                View All Courses →
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">No courses enrolled</p>
          )}
        </div>

        {/* Payments Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-4 text-gray-800">Recent Payments</h2>
          {paymentHistory.length > 0 ? (
            <div className="space-y-2">
              {paymentHistory.slice(0, 3).map((payment) => (
                <div key={payment.payment_id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{payment.payment_type}</span>
                  <span className="text-gray-500">Rs.{payment.amount}</span>
                </div>
              ))}
              <Link to="/user/payments" className="text-blue-500 hover:text-blue-600 inline-block mt-2">
                View Payment History →
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">No payment history</p>
          )}
        </div>
      </div>

      {/* Full-width Calendar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-4 text-gray-800">Calendar</h2>
        <div className="calendar-container">
          <style>
            {`
              .calendar-container .react-calendar {
                width: 100%;
                border: none;
                background: white;
              }
              
              .calendar-container .react-calendar__month-view__days {
                display: grid !important;
                grid-template-columns: repeat(7, 1fr);
                gap: 4px;
                padding: 4px;
              }
              
              .calendar-container .react-calendar__tile {
                max-width: 100% !important;
                padding: 1.5em 0.5em;
                text-align: center;
                background: #f8f9fa;
                border-radius: 4px;
              }
              
              .calendar-container .react-calendar__tile:enabled:hover,
              .calendar-container .react-calendar__tile:enabled:focus {
                background-color: #e9ecef;
              }
              
              .calendar-container .react-calendar__tile--active {
                background: #3b82f6 !important;
                color: white;
              }
              
              .calendar-container .react-calendar__navigation {
                margin-bottom: 1em;
              }
              
              .calendar-container .react-calendar__navigation button {
                min-width: 44px;
                background: none;
                font-size: 1em;
                padding: 0.5em;
                border-radius: 4px;
              }
              
              .calendar-container .react-calendar__navigation button:enabled:hover,
              .calendar-container .react-calendar__navigation button:enabled:focus {
                background-color: #e9ecef;
              }
              
              .calendar-container .react-calendar__month-view__weekdays {
                text-align: center;
                text-transform: uppercase;
                font-weight: bold;
                font-size: 0.9em;
                margin-bottom: 0.5em;
              }
            `}
          </style>
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;