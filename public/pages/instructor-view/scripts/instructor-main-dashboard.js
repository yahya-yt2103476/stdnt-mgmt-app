import { logoutCurrentUser } from "../../../services/logout.js";
import InstructorService from "../../../services/instructor-service.js";

const yourCoursesCard = document.getElementById("yourCourses");
const courseInterestsCard = document.getElementById("courseInterests");
const logoutbtn = document.querySelector("#logOutBtn");
const welcomeMessage = document.querySelector("#welcomeMsg");

const userId = sessionStorage.getItem("authenticated_user_id");

async function init() {
  console.log("I am supposed to be user_Id: ", userId);

  try {
    const instructor = await InstructorService.getInstructorByUserId(userId);

    if (!instructor) {
      console.error(`No instructor found for user ID: ${userId}`);
      welcomeMessage.innerHTML = "Welcome! (Instructor profile not found)";
      yourCoursesCard.style.display = 'none';
      courseInterestsCard.style.display = 'none';
      return;
    }

    let name =  instructor.name;
    let instructorFullName =  name.split(" ");
    console.log(instructorFullName);
    let instructorFirstName =instructorFullName[0].charAt(0).toUpperCase() + instructorFullName[0].slice(1)
    let instructorLastName = instructorFullName[instructorFullName.length - 1].charAt(0).toUpperCase() + instructorFullName[instructorFullName.length - 1].slice(1);
    console.log(instructorFirstName);
    console.log(instructorLastName);
    
    welcomeMessage.innerHTML = `Welcome back ${instructorFirstName} ${instructorLastName}!`;
    
    sessionStorage.setItem("instructor_id", instructor.id);

    setupEventListeners(instructor.id);
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    welcomeMessage.innerHTML = "Welcome to Instructor Dashboard";
  }
}

function setupEventListeners(instructorId) {
  logoutbtn.addEventListener("click", logoutCurrentUser);

  yourCoursesCard.addEventListener("click", function () {
    window.location.href = "../views/instructor-courses.html";
  });

  courseInterestsCard.addEventListener("click", function () {
    window.location.href = "../views/next-sem-courses.html";
  });
}


document.addEventListener("DOMContentLoaded", init);
