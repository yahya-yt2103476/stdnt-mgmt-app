import {
  createSection,
  updateSection,
  fetchAllSections,
  fetchSectionById,
  fetchSectionsByCourseId,
  fetchSectionsBySemester,
  deleteSectionById,
  addStudentToSection,
} from "../../../services/section-service.js";

import { fetchUserById } from "../../../services/user-service.js";
import { logoutCurrentUser as logoutCurrentUser } from "../../../services/logout.js";
import { convertToAmPmRange as convertToAmPmRange } from "../../../services/format-time.js";

import {
  fetchAllCourses,
  fetchCourseById,
} from "../../../services/course-service.js";

import {
  createAndSaveRegistration,
  fetchAllRegistrations,
  fetchRegistrationById,
  updateRegistrationData,
  deleteRegistrationById,
} from "../../../services/registration-service.js";

import {
  createStudent,
  updateStudent,
  fetchAllStudents,
  fetchStudentById,
  deleteStudentById,
  addCourseToRegisteredCourses,
} from "../../../services/student-service.js";

const searchBar = document.querySelector("#searchBar");
const coursesContainer = document.querySelector(".coursesContainer");
const currentUserID = sessionStorage.getItem("authenticated_user_id");

let courses = await fetchAllCourses();
let sections = await fetchAllSections();
let registrations = await fetchAllRegistrations();
let currentStudentInfo = await fetchStudentById(currentUserID);
console.log("student info: ", currentStudentInfo);
renderCourses(courses);

searchBar.addEventListener("input", handleSearch);
function handleSearch() {
  const inputSearch = searchBar.value.toLowerCase();
  if (inputSearch == "") {
    renderCourses(courses);
    return;
  }
  const searchResults = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(inputSearch) ||
      course.shortName.toLowerCase().includes(inputSearch) ||
      course.category.toLowerCase().includes(inputSearch)
  );
  renderCourses(searchResults);
}

function renderCourses(coursesToRender) {
  // clear the container first
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
              const prereqCourse = courses.find((c) => c.id == prereqId);
              return `${prereqCourse.shortName}`;
            })
            .join(", ")
        : "None";

    coursesContainer.innerHTML += `
      <div class="course-card" id="course-${course.id}">
        <div class="card-header">
          <h4 class="courseId">${course.shortName}</h4>
          <h4 class="courseId">${course.id}</h4>
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
            <button onclick="loadsections('${course.id}')" id="toggle-${course.id}">View Sections</button>
          </div>
        </div>
        <div class="sectionsContainer" id="sections-${course.id}"></div>
      </div>
      `;
  });
}

async function loadsections(courseid) {
  const courseShortName = courses.find((c) => c.id == courseid).shortName;
  let sections = await fetchSectionsByCourseId(courseid);
  // get sections for this specific course
  // const courseSections = sections.filter(
  //   (section) => section.courseId == courseid
  // );
  const sectionsContainer = document.getElementById(`sections-${courseid}`);
  const toggleButton = document.getElementById(`toggle-${courseid}`);

  // toggle visibility
  if (sectionsContainer.innerHTML.trim() !== "") {
    sectionsContainer.innerHTML = "";
    toggleButton.textContent = "View Sections";
    return;
  }

  // handle no sections available
  if (sections.length === 0) {
    sectionsContainer.innerHTML = `<b><div class="msg">No available sections for this course...</div></b>`;
    toggleButton.textContent = "View Sections";
    return;
  }

  // display each section
  for (const sec of sections) {
    // calculate remaining seats
    const enrolledCount = sec.enrolledStudents.length;
    const remainingSeats = sec.capacity - enrolledCount;

    // check if student is already registered
    const isRegistered = registrations.some(
      (r) =>
        r.studentId == currentStudentInfo.id &&
        r.sectionId == sec.id &&
        r.status !== "cancelled"
    );

    // registration availability
    let registerButton;
    if (isRegistered) {
      registerButton = `<button class="register-btn green" disabled>Already Registered</button>`;
    } else if (sec.status == "cancelled") {
      registerButton = `<button class="register-btn red" disabled>Registration Closed</button>`;
    } else if (remainingSeats == 0) {
      registerButton = `<button class="register-btn yellow" disabled>Section Full</button>`;
    } else {
      registerButton = `<button type="button" onclick="registerForSection(event, '${sec.id}', '${courseid}')" class="register-btn blue">Register</button>`;
    }

    const timeString = convertToAmPmRange(sec.Time);
    sectionsContainer.innerHTML += `
      <div class="sectionsCard">
        <div class="sectionHeader">
          <p class="section-id">Section ${sec.id}</p>
          <p class="section-instructor">Instructor: ${sec.instructorName}</p>
        </div>

        <div class="sectionInfo">
          <p><b>Course:</b> ${courseShortName}</p>
          <p><b>Semester:</b> ${sec.semester}</p>
          <p><b>Time:</b> ${timeString}</p>
          <p><b>Days:</b> ${sec.Days.join(", ")}</p>
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
}
window.loadsections = loadsections;

async function registerForSection(event, sectionId, courseId) {
  //edge case to do: a student can't register a course if he/she is already registered for that course
  // check if the student is already registered for the course, just a different section
  event.preventDefault();
  console.log(event);

  console.log("sectionId: ", sectionId);
  console.log("courseId: ", courseId);

  // condition  - check prerequisites
  const course = courses.find((c) => c.id == courseId);
  const hasPrerequisites = course.prerequisites.every((prereq) =>
    currentStudentInfo.completedCourses?.some((c) => c.courseId === prereq)
  );
  if (!hasPrerequisites) {
    alert(`You haven't completed all prerequisites for this course!
  Required: ${course.prerequisites.join(", ")}`);
    return;
  }

  // create new registration
  const newRegistration = {
    id: registrations.length + 1,
    studentId: parseInt(currentUserID),
    sectionId: parseInt(sectionId),
    status: "pending",
    Grade: "",
  };

  //   //-----------------------------------------
  try {
    await createAndSaveRegistration(newRegistration);
  } catch (err) {
    console.error("Error creating registration: ", err);
  }

  //   //-----------------------------------------

  let sectionIndex = sections.findIndex((section) => section.id == sectionId);
  sections[sectionIndex].enrolledStudents.push(currentStudentInfo.id);
  await addStudentToSection(parseInt(sectionId), parseInt(currentUserID));
  await addCourseToRegisteredCourses(
    parseInt(courseId),
    parseInt(sectionId),
    parseInt(currentUserID)
  );
  alert("You have successfully registered for this section! refreshing page");
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
window.registerForSection = registerForSection;

const logoutbtn = document.querySelector("#logOutBtn");
logoutbtn.addEventListener("click", logoutCurrentUser);
