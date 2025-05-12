import { logoutCurrentUser as logoutCurrentUser } from "../../../services/logout.js";
import CourseService from "../../../services/course-service.js";
import PublishedCoursesService from "../../../services/published-courses-service.js";

let coursesContainer;
let loadingIndicator;
const instructorId = sessionStorage.getItem("instructor_id");

let allCoursesDataGlobal = [];
let publishedCoursesDataGlobal = [];

function createCourseCard(course, publishedInfo) {
  const interestedIds = Array.isArray(publishedInfo.interestedInstructorIds) 
    ? publishedInfo.interestedInstructorIds 
    : JSON.parse(publishedInfo.interestedInstructorIds || "[]");

  const numericInstructorId = instructorId ? parseInt(instructorId) : null;
  const isInterested = numericInstructorId ? interestedIds.includes(numericInstructorId) : false;

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
                      course.prerequisites?.map(p => p.prerequisite?.shortName).join(", ") || "None"
                    }</p>
                </div>
                <div class="instructor-list">
                    <p><strong>Interested Instructors:</strong> ${
                      interestedIds.length
                    }</p>
                </div>
                ${
                  isInterested
                    ? `<span class="interest-label">Interest Registered</span>`
                    : `<button 
                        class="interest-btn" 
                        data-published-course-id="${publishedInfo.id}"
                        ${!numericInstructorId ? 'disabled title="Log in as instructor to register interest"' : ''}
                    >
                        Register Interest
                    </button>`
                }
            </div>
        </div>
    `;
}

async function registerInterest(publishedCourseId) {
  if (!instructorId) {
      alert("Could not identify instructor. Please log in again.");
      return;
  }
  try {
    const publishedCourse = await PublishedCoursesService.getPublishedCourseById(publishedCourseId);

    let currentInterestedIds = Array.isArray(publishedCourse.interestedInstructorIds)
        ? publishedCourse.interestedInstructorIds
        : JSON.parse(publishedCourse.interestedInstructorIds || "[]");

    const numericInstructorId = parseInt(instructorId);

    if (!currentInterestedIds.includes(numericInstructorId)) {
      currentInterestedIds.push(numericInstructorId);
      
      const updateData = { ...publishedCourse, interestedInstructorIds: currentInterestedIds };
      
      await PublishedCoursesService.updatePublishedCourse(publishedCourseId, updateData);
      console.log("Updated published course:", updateData);
      alert("Interest registered successfully!");
      await loadCourses(); 
    } else {
      console.log("Interest already registered.");
      await loadCourses(); 
    }
  } catch (error) {
    console.error("Error registering interest:", error);
    alert(`Failed to register interest. ${error.message || "Please try again."}`);
  }
}

async function loadCourses() {
  try {
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.textContent = 'Loading available courses...';
    }

    const [fetchedCourses, fetchedPublishedCourses] = await Promise.all([
      CourseService.getAllCourses(),
      PublishedCoursesService.getAllPublishedCourses(),
    ]);

    allCoursesDataGlobal = fetchedCourses;
    publishedCoursesDataGlobal = fetchedPublishedCourses;


    const activePublishedCourses = publishedCoursesDataGlobal.filter((course) => {
      const deadline = new Date(course.submissionDeadline);
      return !isNaN(deadline.getTime()) && deadline > new Date();
    });

    if (
      !Array.isArray(activePublishedCourses) ||
      activePublishedCourses.length === 0
    ) {
      coursesContainer.innerHTML = `
                <div class="no-courses">
                    <p>No courses are currently available for the next semester registration period.</p>
                </div>
            `;
      return;
    }

    const courseCards = await Promise.all(
      activePublishedCourses.map(async (publishedCourse) => {
        const course = allCoursesDataGlobal.find(
          (c) => c.id === publishedCourse.courseId
        );
        if (!course) {
            console.warn(`Course data not found for published course ID: ${publishedCourse.courseId}`);
            return "";
        }
        return createCourseCard(course, publishedCourse);
      })
    );

    coursesContainer.innerHTML = courseCards.join("");

    document
      .querySelectorAll(".interest-btn:not([disabled])")
      .forEach((button) => {
        button.removeEventListener('click', handleRegisterInterestClick); 
        button.addEventListener('click', handleRegisterInterestClick);
      });
  } catch (error) {
    console.error("Error loading courses:", error);
    coursesContainer.innerHTML = `
            <div class="error-message">
                <p>Failed to load courses. Please try again later.</p>
                <p><i>Error: ${error.message}</i></p>
            </div>
        `;
  } finally {
    if (loadingIndicator) {
      loadingIndicator.classList.add("hidden");
    }
  }
}

async function handleRegisterInterestClick(e) {
    const button = e.target;
    const publishedCourseId = button.dataset.publishedCourseId;

    button.disabled = true; 
    button.textContent = "Registering...";

    try {
        await registerInterest(publishedCourseId);
        // loadCourses() is called within registerInterest on success, which will re-render 
        // and thus update the button state if interest was registered.
    } catch (error) {
        // If registerInterest itself fails, re-enable the button
        // (This might be redundant if loadCourses always runs, but good for robustness)
        console.error("Handler caught error from registerInterest:", error);
        button.disabled = false;
        button.textContent = "Register Interest";
        // alert is already in registerInterest
    }
    // No finally block needed to re-enable button if loadCourses handles the UI refresh
}

function init() {
  console.log("Initializing course interests with instructor ID:", instructorId);
  coursesContainer = document.getElementById("coursesContainer");
  loadingIndicator = document.getElementById("loadingIndicator");

  if (!instructorId) {
    console.warn("Instructor ID not found in session storage. Interest registration disabled.");
    
  }

  if (loadingIndicator) {
    loadingIndicator.classList.remove('hidden');
  } else {
    console.warn("Loading indicator element not found");
  }

  if (!coursesContainer) {
      console.error("Courses container element not found!");
      if(loadingIndicator) loadingIndicator.classList.add("hidden");
      return;
  }

  loadCourses();
}

document.addEventListener("DOMContentLoaded", init);
const logoutbtn = document.querySelector("#logOutBtn");
if(logoutbtn) {
    logoutbtn.addEventListener("click", logoutCurrentUser);
} else {
    console.warn("Logout button not found");
}
