const CoursesContainer = document.querySelector(".CoursesContainer");

async function main() {
  const coursesData = await fetchCourses();
  console.log("courses data: ", coursesData);

  const currentUserID = sessionStorage.getItem("authenticated_user_id");
  const currentStudentInfo = await fetchStudentInfo(currentUserID);
  console.log("current student user is:");
  console.log(currentStudentInfo);

  coursesData.forEach((course) => {
    CoursesContainer.innerHTML += `
        <div class="container" id="course-${course.id}">
            <div class="header"><b>${course.id} (${course.name})</b></div>
            <div class="courseDetails">
                <b>Course Details:</b>
                <p><b>Title:</b> ${course.name}</p>
                <p><b>Category:</b> ${course.category}</p>
                <p><b>Crediet Hours:</b> ${course.creditHours}</p>
            </div>
            <div class="description">
                <p>${course.Description}</p>
            </div>
            <div class="btn-container"><button onclick="loadsections('${course.id}')" id="toggle-${course.id}">View Sections</button></div>
            <div class="sectionsContainer" id="sections-${course.id}"></div>
        </div>
        `;
  });
}

async function fetchStudentInfo(userId) {
  const student = await fetch(`http://localhost:3001/api/students/${userId}`).then(r=>r.json())
  return student
}

async function fetchCourses() {
  const data = await fetch("http://localhost:3001/api/courses")
    .then((response) => response.json());
  return data;
}


// Modified loadsections function
async function loadsections(courseid) {
  const sectionsContainer = document.getElementById(`sections-${courseid}`);
  const toggleButton = document.getElementById(`toggle-${courseid}`);

  if (sectionsContainer.innerHTML.trim() !== "") {
    sectionsContainer.innerHTML = "";
    toggleButton.textContent = "View Sections";
    return;
  }

  // get all needed data
  const [sectionsData, registrationsData] = await Promise.all([
    fetch("http://localhost:3001/api/sections").then((r) => r.json()),
    fetch("http://localhost:3001/api/registration").then((r) =>
      r.json()
    ),
  ]);

  const sections = sectionsData.filter((s) => s.courseId == courseid);
  const studentId = sessionStorage.getItem("authenticated_user_id");
  const currentStudentInfo = await fetchStudentInfo(studentId);

  if (sections.length === 0 || sections == null) {
    sectionsContainer.innerHTML = `<p>No available Sections for this course...</p>`;
  } else {
    for (const sec of sections) {
      // calculate remaining seats
      const enrolledCount = sec.enrolledStudents
        ? sec.enrolledStudents.length
        : 0;
      const remainingSeats = sec.capacity - enrolledCount;

      // check if student is already registered (approved or pending)
      const isRegistered = registrationsData.some(
        (r) =>
          r.studentId == currentStudentInfo.studentId &&
          r.sectionId === sec.id &&
          r.status !== "cancelled"
      );

      // determine register button state
      let registerButton;
      if (isRegistered) {
        registerButton = `<button class="register-btn" disabled>Already Registered</button>`;
      } else if (!sec.isOpenForRegistration) {
        registerButton = `<button class="register-btn" disabled>Registration Closed</button>`;
      } else if (remainingSeats <= 0) {
        registerButton = `<button class="register-btn" disabled>Section Full</button>`;
      } else {
        registerButton = `<button onclick="registerForSection('${sec.id}', '${courseid}')" class="register-btn">Register</button>`;
      }

      sectionsContainer.innerHTML += `
        <div class="sectionsCard">
          <p class="section-id">Section ID: ${sec.id}</p>
          <p>Instructor: ${sec.instructorName}</p>
          <p>Semester: ${sec.semester}</p>
          <p>Capacity: ${sec.capacity}</p>
          <p>Enrolled: ${enrolledCount}</p>
          <p>Remaining seats: ${remainingSeats}</p>
          <p>Time: ${sec.Time}</p>
          <p>Days: ${sec.Days.join(", ")}</p>
          <p>Status: ${sec.isOpenForRegistration ? "Open" : "Closed"}</p>
          ${registerButton}
        </div>
      `;
    }
  }
  toggleButton.textContent = "Hide Sections";
}





async function registerForSection(sectionId, courseId) {
  const studentId = sessionStorage.getItem("authenticated_user_id");
  const currentStudentInfo = await fetchStudentInfo(studentId);
  let enrolledCount;
  // fetch all needed data
  const [registrations, sections, courses] = await Promise.all([
    fetch("http://localhost:3001/api/registration").then((r) =>
      r.json()
    ),
    fetch("http://localhost:3001/api/sections").then((r) => r.json()),
    fetch("http://localhost:3001/api/courses").then((r) => r.json()),
  ]);

  // condition 1 - student already logged in, fetched his respective information

  // condition 2 - check section availability

  const sectionIndex = sections.findIndex((s) => s.id == sectionId);

  if (sectionIndex === -1 || !sections[sectionIndex].isOpenForRegistration) {
    alert("Registration is closed for this section!");
    return;
  }else{
    enrolledCount = sections[sectionIndex].enrolledStudents ? sections[sectionIndex].enrolledStudents.length : 0;
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
    studentId,
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
  sections[sectionIndex].enrolledStudents.push(studentId);
  console.log("section updated");

  // updated student's registeredCourses
  if (!currentStudentInfo.registeredCourses) {
    currentStudentInfo.registeredCourses = [];
  }
  currentStudentInfo.registeredCourses.push(courseId);
  console.log("finished");
  

  
}

main();
