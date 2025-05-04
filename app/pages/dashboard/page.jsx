"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import "../../../public/styles/statistics.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    highestFailCourse: { name: "", rate: 0 },
    mostPrereqCourse: { name: "", count: 0 },
    mostRegisteredSemester: "",
    registrationsBySemester: [],
    sectionStatus: { open: 0, approved: 0, pending: 0 },
    avgGpa: 0,
    avgCompletedCourses: 0,
    coursesPerCategory: { core: 0, elective: 0 },
    mostRegisteredCourse: { name: "", count: 0 },
  });
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch("/api/students/total-count"),
          fetch("/api/instructors/total-count"),
          fetch("/api/course/highest-failar"),
          fetch("/api/course/most-prerequisites"),
          fetch("/api/course/most-registered-semester"),
          fetch("/api/registrations/registrations-by-semester"),
          fetch("/api/sections/status-distribution"),
          fetch("/api/students/average-gpa"),
          fetch("/api/students/avg-completed-courses"),
        ]);

        const [
          totalStudents,
          totalInstructors,
          highestFailCourse,
          mostPrereqCourse,
          mostRegisteredSemester,
          registrationsBySemester,
          sectionStatus,
          avgGpa,
          avgCompletedCourses,
        ] = await Promise.all(responses.map((r) => r.json()));

        console.log("registrationsBySemester:", registrationsBySemester);
        console.log("totalStudents raw:", totalStudents);

        setStats({
          totalStudents: totalStudents.totalStudents,
          totalInstructors: totalInstructors.totalInstructors,
          highestFailCourse,
          mostPrereqCourse,
          mostRegisteredSemester,
          registrationsBySemester,
          sectionStatus,
          avgGpa: Number(avgGpa.avgGpa) || 0,
          avgCompletedCourses:
            Number(avgCompletedCourses.avgCompletedCourses) || 0,
          coursesPerCategory: { core: 20, elective: 35 }, // TODO: Replace with real data
          mostRegisteredCourse: { name: "CS101", count: 120 }, // TODO: Replace with real data
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load statistics");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Statistics Dashboard</title>
        <meta name="description" content="University statistics dashboard" />
      </Head>
      <div className="dashboard-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading statistics...</p>
          </div>
        ) : (
          <div className="stats-table">
            <h2>Statistics</h2>

            <div className="stat-row">
              <span className="stat-label">Total number of students</span>
              <span className="stat-value">{stats.totalStudents}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Total number of instructors</span>
              <span className="stat-value">{stats.totalInstructors}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Total courses offered</span>
              <span className="stat-value">
                [placeholder value] [{stats.coursesPerCategory.core}]
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Most registered course</span>
              <span className="stat-value">
                [placeholder value]
                {stats.mostRegisteredCourse.name} (
                {stats.mostRegisteredCourse.count} registrations)
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Most Registered Semester</span>
              <span className="stat-value">
                {Array.isArray(stats.registrationsBySemester)
                  ? stats.registrationsBySemester
                      .map((sem) => `${sem.semester}: ${sem.count}`)
                      .join(", ")
                  : "Data not available"}
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">
                Course with highest failure rate
              </span>
              <span className="stat-value">
                {stats.highestFailCourse.name}: {stats.highestFailCourse.rate}%
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">
                Courses with most prerequisites
              </span>
              <span className="stat-value">
                {stats.mostPrereqCourse.name} ({stats.mostPrereqCourse.count}{" "}
                prereqs)
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Average GPA of students</span>
              <span className="stat-value">{stats.avgGpa.toFixed(2)}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">
                Avg Completed courses per student
              </span>
              <span className="stat-value">
                {stats.avgCompletedCourses.toFixed(1)}
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Sections status distribution</span>
              <span className="stat-value">
                Open: {stats.sectionStatus.open}, Approved:{" "}
                {stats.sectionStatus.approved}, Pending:{" "}
                {stats.sectionStatus.pending}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
