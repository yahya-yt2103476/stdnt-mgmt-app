"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import '../../../public/styles/navigation.css';
import '../../../public/styles/footer.css';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would eventually fetch data from your Prisma backend
    setLoading(false);
    setCourses([
      { id: 1, name: "Introduction to Computer Science", code: "COMP101" },
      { id: 2, name: "Web Development", code: "COMP301" },
      { id: 3, name: "Database Systems", code: "COMP235" }
    ]);
  }, []);

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Logging out...");
    // Redirect to login page or perform actual logout
  };

  return (
    <>
      <Head>
        <title>Course Dashboard</title>
      </Head>
      <header>
        <nav>
          <div className="nav-links">
            <Link href="/pages/admin/views/admin-dashboard.html">Dashboard</Link>
            <Link href="/pages/admin/views/courses-view.html">Course Management</Link>
            <Link href="/pages/admin/views/new-courses.html">Course Planning</Link>
            <Link href="/pages/dashboard" className="react-link">React Dashboard</Link>
          </div>
          <button className="log-out-btn" onClick={handleLogout}>
            <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M27,3V29a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V27H7v1H25V4H7V7H5V3A1,1,0,0,1,6,2H26A1,1,0,0,1,27,3ZM10.71,20.29,7.41,17H18V15H7.41l3.3-3.29L9.29,10.29l-5,5a1,1,0,0,0,0,1.42l5,5Z"
                fill="#000"
              />
            </svg>
          </button>
        </nav>
      </header>
      <div className="dashboard-container">
        <h1>Course Dashboard</h1>
        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="courses-list">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <h3>{course.name}</h3>
                <p>Course Code: {course.code}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>QU Registration Portal</h3>
            <p>Qatar University - CSE Department</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="#">Academic Calendar</Link></li>
              <li><Link href="#">University Website</Link></li>
              <li><Link href="#">CSE Department</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: cse-support@qu.edu.qa</p>
            <p>Phone: +974 4403-5555</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Qatar University. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
