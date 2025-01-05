import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../redux/api";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [registered, setRegistered] = useState("INACTIVE");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileResponse, coursesResponse, paymentsResponse] =
          await Promise.all([
            api.get("/user/profile"),
            api.get("/user/enrolled"),
            api.get("/user/payments"),
          ]);

        setProfile(profileResponse.data.user);
        setMyCourses(coursesResponse.data || []);
        setPaymentHistory(paymentsResponse.data.payments || []);
        setRegistered(profileResponse.data.user.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  const getDateClasses = (date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();

    return `w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
      isSelected
        ? "bg-blue-500 text-white"
        : isToday
        ? "bg-blue-100 text-blue-600"
        : "hover:bg-gray-100"
    }`;
  };

  const generateCalendarDays = () => {
    const days = [];
    const currentDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const lastDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();

    for (let i = 1; i <= lastDay; i++) {
      days.push(new Date(currentDate.setDate(i)));
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {registered === "INACTIVE" && (
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Complete Registration
              </Link>
            )}
          </div>
        </div>

        {registered === "INACTIVE" && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Registration Required
                </h3>
                <p className="mt-2 text-sm text-red-700">
                  You need to complete registration to access all courses.
                  Please click the button above for further instructions.
                </p>
              </div>
            </div>
          </div>
        )}

        {registered === "PENDING" && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm0 6.5c1.654 0 3 1.346 3 3h-6c0-1.654 1.346-3 3-3z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Registration Pending
                </h3>
                <p className="mt-2 text-sm text-yellow-700">
                  Your registration is currently under review. Please check back
                  later or contact support if you have any questions.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg divide-y divide-gray-200">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-500 to-blue-600">
              <h2 className="text-lg font-semibold text-white">Profile</h2>
            </div>
            <div className="px-6 py-5">
              {profile ? (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          profile.image_url || "https://via.placeholder.com/150"
                        }
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {profile.first_name} {profile.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                  </div>
                  {/* NIC */}
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-32">
                      NIC:
                    </span>
                    <span className="text-sm text-gray-800">
                      {profile.nic || "Not provided"}
                    </span>
                  </div>
                  {/* Telephone */}
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-32">
                      Telephone:
                    </span>
                    <span className="text-sm text-gray-800">
                      {profile.telephone || "Not provided"}
                    </span>
                  </div>
                  {/* Edit Button */}
                  <div className="pt-2">
                    <Link
                      to="/user/profile"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full justify-center"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Profile not available</p>
              )}
            </div>
          </div>

          {/* Courses Card */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg divide-y divide-gray-200">
            <div className="px-6 py-5 bg-gradient-to-r from-purple-500 to-purple-600">
              <h2 className="text-lg font-semibold text-white">
                Recent Courses
              </h2>
            </div>
            <div className="px-6 py-5">
              {myCourses.length > 0 ? (
                <div className="space-y-4">
                  {myCourses.slice(0, 3).map((course) => (
                    <div
                      key={course.course_id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {course.name}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        ${course.price}
                      </span>
                    </div>
                  ))}
                  <Link
                    to="/user/mycourse"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 w-full justify-center"
                  >
                    View All Courses
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    No courses enrolled
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payments Card */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg divide-y divide-gray-200">
            <div className="px-6 py-5 bg-gradient-to-r from-green-500 to-green-600">
              <h2 className="text-lg font-semibold text-white">
                Recent Payments
              </h2>
            </div>
            <div className="px-6 py-5">
              {paymentHistory.length > 0 ? (
                <div className="space-y-4">
                  {paymentHistory.slice(0, 3).map((payment) => (
                    <div
                      key={payment.payment_id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {payment.payment_type}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Rs.{payment.amount}
                      </span>
                    </div>
                  ))}
                  <Link
                    to="/user/payments"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 w-full justify-center"
                  >
                    View Payment History
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    No payment history
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="mt-8 bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-700 to-gray-800">
            <h2 className="text-lg font-semibold text-white">Calendar</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.setMonth(selectedDate.getMonth() - 1)
                      )
                    )
                  }
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="text-lg font-medium text-gray-900">
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.setMonth(selectedDate.getMonth() + 1)
                      )
                    )
                  }
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="w-full max-w-3xl">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before the first of the month */}
                  {Array.from({
                    length: new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      1
                    ).getDay(),
                  }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-10" />
                  ))}

                  {/* Actual days */}
                  {generateCalendarDays().map((date) => (
                    <button
                      key={date.toString()}
                      onClick={() => setSelectedDate(date)}
                      className="flex items-center justify-center"
                    >
                      <span className={getDateClasses(date)}>
                        {date.getDate()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Date Events (placeholder) */}
              <div className="mt-8 w-full max-w-3xl">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Events for{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          No events scheduled
                        </p>
                        <p className="text-sm text-gray-500">
                          Add new events from the course schedule
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Browse Courses",
              icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              link: "/",
            },
            {
              title: "Support",
              icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
              link: "/support",
            },
            {
              title: "Settings",
              icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
              link: "/settings",
            },
          ].map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center space-x-4"
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={action.icon}
                />
              </svg>
              <span className="text-sm font-medium text-gray-900">
                {action.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
