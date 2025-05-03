"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import StatsDashboard from "../../components/StatsDashboard";
import "../../../public/styles/navigation.css";
import "../../../public/styles/footer.css";

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
          <div>
            <StatsDashboard />
          </div>
        )}
      </div>
    </>
  );
}
