import sectionService from "../../../services/section-service.js";

import { logoutCurrentUser } from "../../../services/logout.js";
import { convertToAmPmRange } from "../../../services/format-time.js";

import courseService from "../../../services/course-service.js";

import registrationService from "../../../services/registration-service.js";

import studentService from "../../../services/student-service.js";

const searchBar = document.querySelector("#searchBar");
const coursesContainer = document.querySelector(".coursesContainer");
const currentUserID = sessionStorage.getItem("authenticated_user_id");

let allCourses = [];
let allSections = [];
let allRegistrations = [];
let currentStudentInfo = null;

async function initializeRegistrationPage() {
  if (!currentUserID) {
    console.error("User ID not found in session storage. Redirecting to login.");
    window.location.href = "/pages/login/views/login_page.html";
    return;
  }

  try {
    [allCourses, allSections, allRegistrations, currentStudentInfo] =
      await Promise.all([
        courseService.getAllCourses(),
        sectionService.getAllSections(),
        registrationService.getAllRegistrations(),
        studentService.getStudentById(currentUserID),
      ]);

    console.log("Student info: ", currentStudentInfo);
    renderCourses(allCourses);
  } catch (error) {
    console.error("Error initializing registration page:", error);
    coursesContainer.innerHTML = `<div class="msg"><b>Error loading course data. Please try again later.</b></div>`;
  }
}

searchBar.addEventListener("input", handleSearch);
function handleSearch() {
  const inputSearch = searchBar.value.toLowerCase();
  if (inputSearch === "") {
    renderCourses(allCourses);
    return;
  }
  const searchResults = allCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(inputSearch) ||
      (course.shortName && course.shortName.toLowerCase().includes(inputSearch)) ||
      course.category.toLowerCase().includes(inputSearch)
  );
  renderCourses(searchResults);
}

function renderCourses(coursesToRender) {
  coursesContainer.innerHTML = "";

  if (!coursesToRender || coursesToRender.length === 0) {
    coursesContainer.innerHTML = `<b><div class="msg">No courses found matching your search.</div></b>`;
    return;
  }

  coursesToRender.forEach((course) => {
    const prerequisiteNames =
      course.prerequisites && course.prerequisites.length > 0
        ? course.prerequisites
            .map((prereqId) => {
              const prereqCourse = allCourses.find((c) => c.id == prereqId);
              return prereqCourse ? prereqCourse.shortName : "Unknown Prereq";
            })
            .join(", ")
        : "None";

    coursesContainer.innerHTML += `
      <div class="course-card" id="course-${course.id}">
        <div class="card-header">
          <h4 class="courseId">${course.shortName || 'N/A'}</h4>
          <h4 class="courseId">ID: ${course.id}</h4>
        </div>
        <div class="card-body">
          <div class="card-section">
            <p class="category">${course.category}</p>
            <p><b>Course Name:</b> ${course.name}</p>
            <p><b>Credit Hours:</b> ${course.creditHours}</p>
            <p><b>Prerequisites:</b> 
              ${prerequisiteNames}
            </p>
          </div>
          <div class="card-section description">
            <p>${course.description}</p>
          </div>
          <div class="card-footer">
            <button onclick="loadSections('${course.id}')" id="toggle-${course.id}">View Sections</button>
          </div>
        </div>
        <div class="sectionsContainer" id="sections-${course.id}"></div>
      </div>
      `;
  });
}

async function loadSections(courseId) {
  const course = allCourses.find((c) => c.id == courseId);
  const courseShortName = course ? course.shortName : "Course";

  const sectionsContainer = document.getElementById(`sections-${courseId}`);
  const toggleButton = document.getElementById(`toggle-${courseId}`);

  if (sectionsContainer.innerHTML.trim() !== "") {
    sectionsContainer.innerHTML = "";
    toggleButton.textContent = "View Sections";
    return;
  }

  try {
    const sectionsForCourse = await sectionService.getSectionsByCourse(courseId);
    console.log(`Sections for course ${courseId}:`, sectionsForCourse);

    if (!sectionsForCourse || sectionsForCourse.length === 0) {
      sectionsContainer.innerHTML = `<b><div class="msg">No available sections for this course...</div></b>`;
      toggleButton.textContent = "View Sections";
      return;
    }

    sectionsContainer.innerHTML = "";
    for (const sec of sectionsForCourse) {
      const enrolledCount = sec.enrolledStudents ? sec.enrolledStudents.length : 0;
      const remainingSeats = sec.capacity - enrolledCount;

      const isRegisteredForThisSection = allRegistrations.some(
        (r) =>
          r.studentId == currentStudentInfo.id &&
          r.sectionId == sec.id &&
          r.status !== "cancelled"
      );

      const isRegisteredForThisCourseAnySection = allRegistrations.some(r => {
        const registrationSection = allSections.find(s => s.id === r.sectionId);
        return r.studentId == currentStudentInfo.id &&
               registrationSection &&
               registrationSection.courseId == courseId &&
               r.status !== "cancelled";
      });

      let registerButton;
      if (isRegisteredForThisSection) {
        registerButton = `<button class="register-btn green" disabled>Registered in this Section</button>`;
      } else if (isRegisteredForThisCourseAnySection) {
        registerButton = `<button class="register-btn grey" disabled>Registered in this Course</button>`;
      } else if (sec.status === "cancelled" || sec.status === "closed") {
        registerButton = `<button class="register-btn red" disabled>Registration Closed</button>`;
      } else if (remainingSeats <= 0) {
        registerButton = `<button class="register-btn yellow" disabled>Section Full</button>`;
      } else {
        registerButton = `<button type="button" onclick="registerForSection(event, '${sec.id}', '${courseId}')" class="register-btn blue">Register</button>`;
      }

      const timeString = sec.Time ? convertToAmPmRange(sec.Time) : "N/A";
      const daysString = sec.Days && sec.Days.length > 0 ? sec.Days.join(", ") : "N/A";

      sectionsContainer.innerHTML += `
        <div class="sectionsCard">
          <div class="sectionHeader">
            <p class="section-id">Section ${sec.id}</p>
            <p class="section-instructor">Instructor: ${sec.instructorName || 'TBD'}</p>
          </div>
          <div class="sectionInfo">
            <p><b>Course:</b> ${courseShortName}</p>
            <p><b>Semester:</b> ${sec.semester}</p>
            <p><b>Time:</b> ${timeString}</p>
            <p><b>Days:</b> ${daysString}</p>
          </div>
          <div class="sectionCapacity">
            <p><b>Capacity:</b> ${sec.capacity}</p>
            <p><b>Enrolled:</b> ${enrolledCount}</p>
            <p><b>Remaining:</b> ${remainingSeats}</p>
            <p><b>Status:</b> ${sec.status}</p>
          </div>
          <div class="registerContainer">
            ${registerButton}
          </div>
        </div>
        `;
    }
    toggleButton.textContent = "Hide Sections";
  } catch (error) {
    console.error(`Error loading sections for course ${courseId}:`, error);
    sectionsContainer.innerHTML = `<b><div class="msg">Error loading sections.</div></b>`;
  }
}
window.loadSections = loadSections;

async function registerForSection(event, sectionId, courseId) {
  event.preventDefault();

  if (!currentStudentInfo || !currentUserID) {
    alert("Error: Student information not loaded. Please refresh.");
    return;
  }

  const course = allCourses.find((c) => c.id == courseId);
  if (!course) {
    alert("Error: Course details not found.");
    return;
  }

  const isAlreadyRegisteredForCourse = allRegistrations.some(r => {
    const registrationSection = allSections.find(s => s.id === r.sectionId);
    return r.studentId == currentStudentInfo.id &&
           registrationSection &&
           registrationSection.courseId == courseId &&
           r.status !== "cancelled";
  });

  if (isAlreadyRegisteredForCourse) {
    alert("You are already registered in a section for this course or your registration is pending.");
    return;
  }

  const completedCourseIds = currentStudentInfo.completedCourses?.map(cc => cc.courseId) || [];
  const hasPrerequisites = course.prerequisites.every((prereqId) =>
    completedCourseIds.includes(prereqId)
  );

  if (!hasPrerequisites) {
    const prereqShortNames = course.prerequisites.map(prereqId => {
        const pc = allCourses.find(c => c.id === prereqId);
        return pc ? pc.shortName : `ID ${prereqId}`;
    }).join(", ");
    alert(`You haven't completed all prerequisites for this course! Required: ${prereqShortNames}`);
    return;
  }

  const newRegistrationData = {
    studentId: parseInt(currentUserID),
    sectionId: parseInt(sectionId),
    status: "pending",
  };

  try {
    const createdRegistration = await registrationService.createRegistration(newRegistrationData);
    console.log("Registration successful:", createdRegistration);
    
    allRegistrations.push(createdRegistration);

    alert("You have successfully registered for this section! The page will now refresh to reflect changes.");
    
    currentStudentInfo = await studentService.getStudentById(currentUserID);
    loadSections(courseId);

  } catch (err) {
    console.error("Error creating registration: ", err);
    alert(`Registration failed: ${err.message || "Unknown error"}`);
  }
}
window.registerForSection = registerForSection;

const logoutbtn = document.querySelector("#logOutBtn");
logoutbtn.addEventListener("click", logoutCurrentUser);

document.addEventListener("DOMContentLoaded", initializeRegistrationPage);
