const CoursesContainer = document.querySelector(".CoursesContainer");

async function main() {
  async function fetchCourses() {
    const data = await fetch("http://127.0.0.1:5500/database/courses.json")
      .then((r) => r.json())
      .then((d) => {
        return d;
      });
    return data;
  }
  const data = await fetchCourses();
  console.log(data);

  data.forEach((course) => {
    CoursesContainer.innerHTML += `
        <div class="container" id="course-${course.id}">
            <div class="header">${course.id} (${course.name})</div>
            <div class="courseDetails">
                <b>Course Details:</b>
                <p>Title: ${course.name}</p>
                <p>Category: ${course.category}</p>
                <p>Crediet Hours: ${course.creditHours}</p>
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

async function loadsections(courseid) {
  const sectionsContainer = document.getElementById(`sections-${courseid}`);
  const toggleButton = document.getElementById(`toggle-${courseid}`);

  // If sections are already visible, hide them and return
  if (sectionsContainer.innerHTML.trim() !== "") {
    sectionsContainer.innerHTML = "";
    toggleButton.textContent = "View Sections";
    return;
  }

  let data = [];
  data = await fetch("http://127.0.0.1:5500/database/sections.json")
    .then((r) => r.json())
    .then((d) => {
      return d;
    });

  const sections = data.filter((s) => s.courseId == courseid);
  const sectionsArray = Array.isArray(sections) ? sections : [sections];

  if (sectionsArray.length === 0) {
    sectionsContainer.innerHTML = `<p>No available Sections for this course...</p>`;
  } else {
    sectionsArray.forEach((sec) => {
      sectionsContainer.innerHTML += `
        <div class="sectionsCard">
          <p class="section-id">Section ID: ${sec.id}</p>
          <p>Instructor: ${sec.instructorName}</p>
          <p>Semester: ${sec.semester}</p>
          <p>capacity: ${sec.capacity}</p>
          <p>remaining seats: 18</p>
          <p>Time: ${sec.Time}</p>
          <p>Days: ${sec.Days}</p>
          <button id="Register-sections">Register</button>
        </div>
      `;
    });
  }

  // Update button text after showing sections
  toggleButton.textContent = "Hide Sections";
}

main();
