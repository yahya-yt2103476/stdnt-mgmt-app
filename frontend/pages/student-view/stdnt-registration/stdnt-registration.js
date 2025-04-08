import {
  createSection,
  updateSection,
  fetchAllSections,
  fetchSectionById,
  fetchSectionsByCourseId,
  fetchSectionsBySemester,
  deleteSectionById,
} from "../../../services/section-service.js";

import { fetchUserById } from "../../../services/user-service.js";

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

async function main() {
  const searchBar = document.querySelector("#searchBar");
  const coursesContainer = document.querySelector(".coursesContainer");
  const currentUserID = sessionStorage.getItem("authenticated_user_id");

  let courses = await fetchAllCourses();
  let sections = await fetchAllSections();
  let registrations = await fetchAllRegistrations();
  let currentStudentInfo = await fetchUserById(currentUserID);

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
      coursesContainer.innerHTML =
        "<p><b>No courses found matching your search.</b></p>";
      return;
    }

    coursesToRender.forEach((course) => {
      coursesContainer.innerHTML += `
      <div class="course-card" id="course-${course.id}">
        <div class="card-header">
          <h4>${course.shortName} - ${course.id}</h2>
        </div>
        <div class="card-body">
          <div class="card-section">
            <p><strong>Title:</strong> ${course.name}</p>
            <p><strong>Category:</strong> ${course.category}</p>
            <p><strong>Credit Hours:</strong> ${course.creditHours}</p>
            <p><strong>Prerequisites:</strong> 
              ${
                course.prerequisites && course.prerequisites.length > 0
                  ? course.prerequisites.join(", ")
                  : "None"
              }
            </p>
          </div>

          <div class="card-section description">
            <p>${course.description}</p>
          </div>

          <div class="card-footer">
            <button onclick="loadsections('${course.id}')" id="toggle-${
        course.id
      }">View Sections</button>
          </div>
        </div>
        <div class="sectionsContainer" id="sections-${course.id}"></div>
      </div>
      `;
    });
  }

  async function loadsections(courseid) {
    // get sections for this specific course
    const courseSections = sections.filter(
      (section) => section.courseId == courseid
    );
    const sectionsContainer = document.getElementById(`sections-${courseid}`);
    const toggleButton = document.getElementById(`toggle-${courseid}`);

    // toggle visibility
    if (sectionsContainer.innerHTML.trim() !== "") {
      sectionsContainer.innerHTML = "";
      toggleButton.textContent = "View Sections";
      return;
    }

    // handle no sections available
    if (courseSections.length === 0) {
      sectionsContainer.innerHTML = `<p>No available sections for this course...</p>`;
      toggleButton.textContent = "View Sections";
      return;
    }

    // display each section
    for (const sec of courseSections) {
      // Calculate remaining seats
      const enrolledCount = sec.enrolledStudents
        ? sec.enrolledStudents.length
        : 0;
      const remainingSeats = sec.capacity - enrolledCount;

      // check if student is already registered
      const isRegistered = registrations.some(
        (r) =>
          r.studentId == currentStudentInfo.studentId &&
          r.sectionId === sec.id &&
          r.status !== "cancelled"
      );

      // registration availability
      let registerButton;
      if (isRegistered) {
        registerButton = `<button class="register-btn" disabled>Already Registered</button>`;
      } else if (sec.status !== "approved") {
        registerButton = `<button class="register-btn" disabled>Registration Closed</button>`;
      } else if (remainingSeats <= 0) {
        registerButton = `<button class="register-btn" disabled>Section Full</button>`;
      } else {
        registerButton = `<button onclick="registerForSection('${sec.id}', '${courseid}')" class="register-btn">Register</button>`;
      }

      sectionsContainer.innerHTML += `
      <div class="sectionsCard">
        <div class="sectionHeader">
          <p class="section-id">Section ${sec.id}</p>
          <p class="section-instructor">${sec.instructorName}</p>
        </div>

        <div class="sectionInfo">
          <p><strong>Course:</strong> ${sec.courseShortName}</p>
          <p><strong>Semester:</strong> ${sec.semester}</p>
          <p><strong>Time:</strong> ${sec.Time}</p>
          <p><strong>Days:</strong> ${sec.Days.join(", ")}</p>
        </div>

        <div class="sectionCapacity">
          <p><strong>Capacity:</strong> ${sec.capacity}</p>
          <p><strong>Enrolled:</strong> ${enrolledCount}</p>
          <p><strong>Remaining:</strong> ${remainingSeats}</p>
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

  async function registerForSection(sectionId, courseId) {
    let enrolledCount;

    const sectionIndex = sections.findIndex((s) => s.id == sectionId);

    if (sectionIndex === -1 || !sections[sectionIndex].isOpenForRegistration) {
      alert("Registration is closed for this section!");
      return;
    } else {
      enrolledCount = sections[sectionIndex].enrolledStudents
        ? sections[sectionIndex].enrolledStudents.length
        : 0;
    }
    console.log("testing");
    console.log(enrolledCount);

    // check remaining seats

    if (enrolledCount >= sections[sectionIndex].capacity) {
      alert("This section is already full!");
      return;
    }

    // check existing registrations
    const existingRegistration = registrations.find(
      (r) =>
        r.studentId === currentStudentInfo.studentId &&
        r.sectionId === sectionId &&
        r.status !== "cancelled"
    );
    if (existingRegistration) {
      alert("You are already registered for this section!");
      return;
    }

    // condition 3 - check prerequisites
    const course = courses.find((c) => c.id === courseId);
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
      id: `REG${Date.now().toString().slice(-6)}`,
      studentId: currentUserID,
      sectionId,
      status: "pending",
      Grade: "",
    };

    // update local copies of data
    registrations.push(newRegistration);

    //-----------------------------------------
    // json update logic
    //StudentsRepo.AddRegistration(newRegistartion);
    //-----------------------------------------

    console.log("new registeration: ", newRegistration);
    console.log("new registartion list:\n");
    console.log(registrations);

    // add student to enrolledStudents
    if (!sections[sectionIndex].enrolledStudents) {
      sections[sectionIndex].enrolledStudents = [];
    }
    sections[sectionIndex].enrolledStudents.push(currentStudentInfo.id);
    console.log("section updated");

    // updated student's registeredCourses
    if (!currentStudentInfo.registeredCourses) {
      currentStudentInfo.registeredCourses = [];
    }
    currentStudentInfo.registeredCourses.push(courseId);
    console.log("finished");
  }
  window.registerForSection = registerForSection;

  async function FilterCourses(query) {}
}

main();
