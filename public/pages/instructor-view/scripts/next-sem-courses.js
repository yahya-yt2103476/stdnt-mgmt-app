import { logoutCurrentUser as logoutCurrentUser } from "../../../services/logout.js";
import { fetchAllCourses } from "../../../services/course-service.js";
import {
  updatePublishedCourse,
  fetchPublishedCourse,
  fetchAllPublishedCourses,
} from "../../../services/published-courses-service.js";

let coursesContainer;
let loadingIndicator;
const instructorId = sessionStorage.getItem("authenticated_user_id");

function createCourseCard(course, publishedInfo) {
  const instructors = publishedInfo.instructors || [];
  const isInterested = instructors.includes(parseInt(instructorId));

  return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-header" onclick="this.parentElement.classList.toggle('expanded')">
                <div class="header-content">
                    <h3>${course.name}</h3>
                    <span class="course-id">ID: ${course.id}</span>
                </div>
                <span class="dropdown-arrow">▼</span>
            </div>
            <div class="course-details">
                <div class="course-info">
                    <p><strong>Category:</strong> ${course.category}</p>
                    <p><strong>Credit Hours:</strong> ${course.creditHours}</p>
                    <p><strong>Semester:</strong> ${publishedInfo.semester}</p>
                    <p><strong>Prerequisites:</strong> ${
                      course.prerequisites?.join(", ") || "None"
                    }</p>
                </div>
                <div class="instructor-list">
                    <p><strong>Interested Instructors:</strong> ${
                      instructors.length
                    }</p>
                </div>
                ${
                  isInterested
                    ? `<span class="interest-label">Interest Registered</span>`
                    : `<button 
                        class="interest-btn" 
                        data-published-course-id="${publishedInfo.id}"
                    >
                        Register Interest
                    </button>`
                }
            </div>
        </div>
    `;
}

async function registerInterest(publishedCourseId) {
  try {
    const publishedCourse = await fetchPublishedCourse(publishedCourseId);

    if (!publishedCourse.instructors) {
      publishedCourse.instructors = [];
    }

    if (!publishedCourse.instructors.includes(parseInt(instructorId))) {
      publishedCourse.instructors.push(parseInt(instructorId));
      await updatePublishedCourse(publishedCourse);
      console.log("Updated published course:", publishedCourse);
      alert("Interest registered successfully!");
      await loadCourses();
    }
  } catch (error) {
    console.error("Error registering interest:", error);
    alert("Failed to register interest. Please try again.");
  }
}

async function loadCourses() {
  try {
    const [allCourses, publishedCourses] = await Promise.all([
      fetchAllCourses(),
      fetchAllPublishedCourses(),
    ]);

    const activePublishedCourses = publishedCourses.filter((course) => {
      const deadline = new Date(course.submissionDeadline);
      return deadline > new Date();
    });

    if (
      !Array.isArray(activePublishedCourses) ||
      activePublishedCourses.length === 0
    ) {
      coursesContainer.innerHTML = `
                <div class="no-courses">
                    <p>No courses are currently available for the next semester.</p>
                </div>
            `;
      return;
    }

    const courseCards = await Promise.all(
      activePublishedCourses.map(async (publishedCourse) => {
        const course = allCourses.find(
          (c) => c.id === publishedCourse.courseId
        );
        if (!course) return "";
        return createCourseCard(course, publishedCourse);
      })
    );

    coursesContainer.innerHTML = courseCards.join("");

    document
      .querySelectorAll(".interest-btn:not([disabled])")
      .forEach((button) => {
        button.addEventListener("click", async (e) => {
          const publishedCourseId = e.target.dataset.publishedCourseId;
          await registerInterest(publishedCourseId);
        });
      });
  } catch (error) {
    console.error("Error loading courses:", error);
    coursesContainer.innerHTML = `
            <div class="error-message">
                <p>Failed to load courses. Please try again later.</p>
            </div>
        `;
  } finally {
    if (loadingIndicator) {
      loadingIndicator.classList.add("hidden");
    }
  }
}

function init() {
  console.log("Initializing with instructor ID:", instructorId);
  coursesContainer = document.getElementById("coursesContainer");
  loadingIndicator = document.getElementById("loadingIndicator");

  loadCourses();
}

document.addEventListener("DOMContentLoaded", init);
const logoutbtn = document.querySelector("#logOutBtn");
logoutbtn.addEventListener("click", logoutCurrentUser);
