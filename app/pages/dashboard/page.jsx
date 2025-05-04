"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import "../../../public/styles/statistics.css";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would eventually fetch data from your Prisma backend
    setLoading(false);
    setCourses([
      { id: 1, name: "Introduction to Computer Science", code: "COMP101" },
      { id: 2, name: "Web Development", code: "COMP301" },
      { id: 3, name: "Database Systems", code: "COMP235" },
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
        <title>Statistics Dashboard</title>
      </Head>
      <div className="dashboard-container">
        {loading ? (
          <h3>Loading courses...</h3>
        ) : (
          <div className="stats-table">
            <h2>Statistics</h2>
            <div className="stat-row">
              <span className="stat-label">Total number of students</span>
              <span className="stat-value">512</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Total number of instructors</span>
              <span className="stat-value">48</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">
                Total number of courses per category
              </span>
              <span className="stat-value">Core: 20, Elective: 35</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Most registered course</span>
              <span className="stat-value">CS101 (120 regs)</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">
                Course with highest failure rate
              </span>
              <span className="stat-value">CS101: 12%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Average GPA of students</span>
              <span className="stat-value">3.12</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">
                Completed courses per student (avg)
              </span>
              <span className="stat-value">7.5</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Sections status distribution</span>
              <span className="stat-value">
                Open: 22, Approved: 18, Pending: 5
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">
                Registrations per semester (Or "Most Registered Semester")
              </span>
              <span className="stat-value">Fall: 320, Spring: 280</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">
                Courses with most prerequisites
              </span>
              <span className="stat-value">CS401 (3 prereqs)</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
