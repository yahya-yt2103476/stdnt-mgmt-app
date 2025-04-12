import { logoutCurrentUser as logoutCurrentUser } from "../../../services/logout.js";
import { fetchStudentById } from "../../../services/student-service.js";

const coursesRegistrationCard = document.getElementById("coursesRegistration");
const learningPathCard = document.getElementById("learningPath");
const logoutbtn = document.querySelector("#logOutBtn");
const welcomeMessage = document.querySelector("#welcomeMsg");

const student = await fetchStudentById(
  parseInt(sessionStorage.getItem("authenticated_user_id"))
);
console.log(student);
let studentFullName = student.name.split(" ");
let studentFirstName =
  studentFullName[0].charAt(0).toUpperCase() + studentFullName[0].slice(1);
let studentLastName =
  studentFullName[1].charAt(0).toUpperCase() + studentFullName[1].slice(1);
welcomeMessage.innerHTML = `Welcome back ${studentFirstName} ${studentLastName}!`;

logoutbtn.addEventListener("click", logoutCurrentUser);

coursesRegistrationCard.addEventListener("click", function () {
  window.location.href = "../views/stdnt-registration.html";
});

learningPathCard.addEventListener("click", function () {
  window.location.href = "../views/learning-path-page.html";
});
