import { LogoutCurrentUser } from "../../../services/logout.js";
import { fetchStudentById } from "../../../services/student-service.js";



const coursesRegistrationCard = document.getElementById("coursesRegistration");
const learningPathCard = document.getElementById("learningPath");
const logoutbtn = document.querySelector("#log-out-btn")
const WelcomeMessage = document.querySelector("#WelcomeMsg");


const student = await fetchStudentById(sessionStorage.getItem("authenticated_user_id"));
console.log(student);
WelcomeMessage.innerHTML = `Welcome back ${student.name}!`;





logoutbtn.addEventListener("click", LogoutCurrentUser);

coursesRegistrationCard.addEventListener("click", function () {
  window.location.href = '../stdnt-registration/stdnt-registration.html';
});

learningPathCard.addEventListener("click", function () {
  window.location.href = "../learning-path/learning-path-page.html";
});

