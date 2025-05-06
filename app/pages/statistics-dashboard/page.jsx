"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import "../../styles/statistics.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    highestFailCourse: null, // course object
    mostPrereqCourse: null, // course object
    mostRegisteredCourse: null, // course object
    totalCoursesCount: 0,
    lastAddedCourse: null, // course object
    mostRegisteredSemester: {
      mostRegisteredSemester: [], // array of { semester, count }
    },
    avgGpa: 0,
    avgCompletedCourses: { completedCourses: 0 },
    sectionsStatus: [], // array of { _count: { status }, status }
  });

  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          // ----------------------------------- path status
          fetch("/api/students/total-count"), // 1. ok
          fetch("/api/instructors/total-count"), // 2. ok
          fetch("/api/courses/highest-faliar"), // 3. ok
          fetch("/api/courses/most-prerequistes"), // 4. ok
          fetch("/api/courses/most-registered"), // 5. ok
          fetch("/api/courses/total-count"), // 6. ok
          fetch("/api/courses/last-added"), // 7. ok
          fetch("/api/sections/most-registered-semester"), // 8. ok
          fetch("/api/students/average-gpa"), // 9. ok
          fetch("/api/students/avg-completed-courses"), // 10. ok
          fetch("/api/sections/status-distribution"), // 11. ok
        ]);

        const [
          totalStudents, // object with one attribute "totalStudents"
          totalInstructors, // object with one attribute "totalInstructors"
          highestFailCourse, // course object
          mostPrereqCourse, // course object
          mostRegisteredCourse, // course object
          totalCoursesCount, // int
          lastAddedCourse, // course object
          mostRegisteredSemester, // object { "mostRegisteredSemester": [{ "semester": "SPRING2025", "count": 7 } ] }
          avgGpa, // float
          avgCompletedCourses, // object { "completedCourses": 3.7142857142857144 }
          sectionsStatus, // object
          // [ { "_count": { "status": 1 }, "status": "APPROVED" },
          // { "_count": { "status": 1 }, "status": "CANCELLED" },
          // { "_count": { "status": 16 }, "status": "OPEN" } ]
        ] = await Promise.all(responses.map((r) => r.json()));

        // console.log("registrationsBySemester:", registrationsBySemester);
        console.log("totalStudents raw:", totalStudents);

        setStats({
          totalStudents: totalStudents.totalStudents, // ok
          totalInstructors: totalInstructors.totalInstructors, // ok
          highestFailCourse, // ok
          mostPrereqCourse, // ok
          mostRegisteredCourse, // ok
          totalCoursesCount, // ok
          lastAddedCourse, // ok
          mostRegisteredSemester, // ok
          avgGpa, // ok
          avgCompletedCourses, // ok
          sectionsStatus, // ok
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
              <span className="stat-value">{stats.totalCoursesCount}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Most registered course</span>
              <span className="stat-value">
                {stats.mostRegisteredCourse?.shortName}
                {" | "}
                {stats.mostRegisteredCourse?.sections?.reduce(
                  (total, section) =>
                    total + (section?.registrations?.length || 0),
                  0
                )}{" "}
                registrations
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Most Registered Semester</span>
              <span className="stat-value">
                {Array.isArray(
                  stats.mostRegisteredSemester?.mostRegisteredSemester
                )
                  ? stats.mostRegisteredSemester.mostRegisteredSemester
                      .map(
                        (sem) => `${sem.semester} | ${sem.count} Registrations`
                      )
                      .join(", ")
                  : "Data not available"}
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">
                Course with highest failure rate
              </span>
              <span className="stat-value">
                {stats.highestFailCourse?.highestFailureRateCourse.shortName}
                {" | "}
                {stats.highestFailCourse?.highestFailureRateCourse.failureRate}
                {"%"}
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">
                Courses with most prerequisites
              </span>
              <span className="stat-value">
                {stats.mostPrereqCourse?.shortName}
                {" | "}
                {stats.mostPrereqCourse?.prerequisites.length} prereqs
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
                {stats.avgCompletedCourses?.completedCourses.toFixed(1)}
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Sections status distribution</span>
              <span className="stat-value">
                {stats.sectionsStatus
                  .map((s) => `${s.status}: ${s._count?.status ?? 0}`)
                  .join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
