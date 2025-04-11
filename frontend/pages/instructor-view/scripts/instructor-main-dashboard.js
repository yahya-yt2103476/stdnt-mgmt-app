import { logoutCurrentUser as logoutCurrentUser } from "../../../services/logout.js";
import { fetchInstructorById } from "../../../services/instructor-service.js";

const yourCoursesCard = document.getElementById("yourCourses");
const courseInterestsCard = document.getElementById("courseInterests");
const logoutbtn = document.querySelector("#logOutBtn");
const welcomeMessage = document.querySelector("#welcomeMsg");

const indtructorId = sessionStorage.getItem("authenticated_user_id");

console.log("I am supposed to be instructor_Id: ",indtructorId);


const instructor = await fetchInstructorById(
  sessionStorage.getItem("authenticated_user_id")
);
console.log(instructor);
let instructorFullName = instructor.name.split(" ");
let instructorFirstName =
  instructorFullName[0].charAt(0).toUpperCase() +
  instructorFullName[0].slice(1);
let instructorLastName =
  instructorFullName[1].charAt(0).toUpperCase() +
  instructorFullName[1].slice(1);
welcomeMessage.innerHTML = `Welcome back ${instructorFirstName} ${instructorLastName}!`;

logoutbtn.addEventListener("click", logoutCurrentUser);

yourCoursesCard.addEventListener("click", function () {
  window.location.href = "../views/instructor-courses.html";
  sessionStorage.setItem("instructor_id", `${indtructorId}`);
});

courseInterestsCard.addEventListener("click", function () {
  window.location.href = "../instructor-signip-courses/next-sem-courses.html";
});
