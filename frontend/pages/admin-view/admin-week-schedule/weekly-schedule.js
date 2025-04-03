// document.addEventListener("DOMContentLoaded", () => {
//   async function fetchClasses() {
// let classes = [];
// classes = await fetch("http://127.0.0.1:5500/database/sections.json")
//   .then((response) => response.json())
//   .then((data) => {
//     return data;
//   });
// return classes;
//   }
//   let classes = fetchClasses();
// });
//
//
document.addEventListener("DOMContentLoaded", async () => {
  const classes = await fetchClasses();
  //   let classes = [];

  const classesByDay = groupClassesByDay(classes);

  displayClasses(classesByDay);
});

async function fetchClasses() {
  let classes = [];
  classes = await fetch("http://127.0.0.1:5500/database/sections.json")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return classes;
}

function groupClassesByDay(classes) {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
  const classesByDay = {};

  // initialize empty arrays for each day
  days.forEach((day) => {
    classesByDay[day] = [];
  });

  // group classes by their days
  classes.forEach((classItem) => {
    if (classItem.Days && classItem.Days.length > 0) {
      // process the Days array (assuming format like ["Sunday,Tuesday,Thursday"])
      const classDays = classItem.Days[0]
        .split(",")
        .map((day) => day.trim().toLowerCase());

      classDays.forEach((day) => {
        if (days.includes(day)) {
          classesByDay[day].push(classItem);
        }
      });
    }
  });

  return classesByDay;
}

function displayClasses(classesByDay) {
  for (const [day, classes] of Object.entries(classesByDay)) {
    const dayElement = document.getElementById(day);
    if (!dayElement) continue;

    const coursesList = dayElement.querySelector(".courses-list");
    coursesList.innerHTML = "";

    if (classes.length === 0) {
      coursesList.innerHTML = '<p class="no-classes">No classes scheduled</p>';
      continue;
    }

    classes.forEach((classItem) => {
      const courseCard = createCourseCard(classItem);
      coursesList.appendChild(courseCard);
    });
  }
}

function createCourseCard(classItem) {
  const card = document.createElement("div");
  card.className = "course-card";

  const timeParts = classItem.Time.split(" ");
  const startTime = formatTime(timeParts[0]);
  const endTime = formatTime(timeParts[1]);

  card.innerHTML = `
      <h4>${classItem.courseId}</h4>
      <p><b>Section ID:</b> ${classItem.id}</p>
      <p><b>Instructor:</b> ${classItem.instructorName}</p>
      <p><b>Enrolled:</b> ${classItem.enrolledStudents.length}/${classItem.capacity}</p>
      <p><b>Time:</b> ${startTime} - ${endTime}</p>
      <p><b>Semester:</b> ${classItem.semester}</p>
      <button class="view-course-btn" data-section-id="${classItem.id}">View Course</button>
    `;
  return card;
}

function formatTime(timeStr) {
  // to convert "10:00" to "10:00 AM" format
  if (!timeStr) return "";

  const [hours, minutes] = timeStr.split(":");
  const hourNum = parseInt(hours);
  const period = hourNum >= 12 ? "PM" : "AM";
  const displayHour = hourNum % 12 || 12;

  return `${displayHour}:${minutes} ${period}`;
}
