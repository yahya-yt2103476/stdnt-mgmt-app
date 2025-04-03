const coursesRegistrationCard = document.getElementById("coursesRegistration");


const learningPathCard = document.getElementById("learningPath");

coursesRegistrationCard.addEventListener("click", function () {
  window.location.href = "../stdnt-mp/stdnt-mp.html";
});

learningPathCard.addEventListener("click", function () {
  window.location.href = "../learning-path/learning-path-page.html";
});

// logout button functionality
const logoutBtn = document.querySelector("#log-out-btn");
logoutBtn.addEventListener("click", handleDelete);

function handleDelete(){
  sessionStorage.removeItem("authenticated_user_id")
  window.location.href = "http://127.0.0.1:5500/frontend/pages/login/login_page.html";
  
}
