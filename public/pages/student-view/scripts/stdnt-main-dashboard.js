import { logoutCurrentUser } from "../../../services/logout.js";
import studentService from "../../../services/student-service.js";

const coursesRegistrationCard = document.getElementById("coursesRegistration");
const learningPathCard = document.getElementById("learningPath");
const logoutbtn = document.querySelector("#logOutBtn");
const welcomeMessage = document.querySelector("#welcomeMsg");

async function initializeDashboard() {
  const userId = parseInt(sessionStorage.getItem("authenticated_user_id"));

  if (!userId) {
    console.error("User ID not found in session storage.");
    window.location.href = "/pages/login/views/login_page.html";
    return;
  }

  try {
    const student = await studentService.getStudentById(userId);
    console.log(student);
    if (student && student.name) {
      let studentFullName = student.name.split(" ");
      let studentFirstName =
        studentFullName[0].charAt(0).toUpperCase() + studentFullName[0].slice(1);
      let studentLastName =
        studentFullName[studentFullName.length - 1].charAt(0).toUpperCase() +
        studentFullName[studentFullName.length - 1].slice(1);
      welcomeMessage.innerHTML = `Welcome back ${studentFirstName} ${studentLastName}!`;
    } else {
      welcomeMessage.innerHTML = `Welcome back!`;
      console.warn("Student data or name missing:", student);
    }
  } catch (error) {
    console.error("Failed to fetch student data:", error);
    welcomeMessage.innerHTML = `Welcome back! Error loading name.`;
  }
}

logoutbtn.addEventListener("click", logoutCurrentUser);

coursesRegistrationCard.addEventListener("click", function () {
  window.location.href = "../views/stdnt-registration.html";
});

learningPathCard.addEventListener("click", function () {
  window.location.href = "../views/learning-path-page.html";
});

document.addEventListener('DOMContentLoaded', initializeDashboard);
