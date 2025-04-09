import { LogoutCurrentUser } from "../../../services/logout.js";
const coursesRegistrationCard = document.getElementById("coursesRegistration");

//logout functionality
const logoutbtn = document.querySelector("#log-out-btn")
logoutbtn.addEventListener("click", LogoutCurrentUser);


const learningPathCard = document.getElementById("learningPath");

coursesRegistrationCard.addEventListener("click", function () {
  window.location.href = '../stdnt-registration/stdnt-registration.html';
});

learningPathCard.addEventListener("click", function () {
  window.location.href = "../learning-path/pages/learning-path-page.html";
});



function handleDelete() {
  sessionStorage.removeItem("authenticated_user_id")
  window.location.href = "http://127.0.0.1:5500/frontend/pages/login/login_page.html";

}
