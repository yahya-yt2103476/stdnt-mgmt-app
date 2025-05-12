import { createUser, fetchAllUsers } from "../../../services/user-service.js";

import studentService from "../../../services/student-service.js";
import { createUser, updateInstructor } from "../../../services/instructor-service.js";
import { createAdmin, updateAdmin } from "../../../services/admin-service.js";

async function main() {
  const icons = [];

  const form = document.querySelector("#form");
  const std_icn = document.querySelector("#Student-icon");
  icons.push(std_icn);
  const Inst_icn = document.querySelector("#Instructor-icon");
  icons.push(Inst_icn);
  const Admin_icn = document.querySelector("#Admin-icon");
  icons.push(Admin_icn);
  const indicator = document.querySelector("#indicator");
  const userType = document.querySelector("#usertype");
  if (window.location.pathname.includes("signup.html")) {
    const registerBtn = document.querySelector("#registerButton");
    registerBtn.addEventListener("click", handleRegisterUser);
  }
  let usertype;

  std_icn.addEventListener("click", () => handleUserType("Student"));
  Inst_icn.addEventListener("click", () => handleUserType("Instructor"));
  Admin_icn.addEventListener("click", () => handleUserType("Admin"));
  if (window.location.pathname.includes("login-page.html")) {
    form.addEventListener("submit", handleLoginUser);
  } else {
    console.log("not login page");
  }

  function handleUserType(e) {
    icons.forEach((i) => {
      i.style.transform = "scale(1)";
      i.style.color = "grey";
    });

    if (e === "Student") {
      usertype = e;
      std_icn.style.transform = "scale(1.05)";
      std_icn.style.color = "Black";
      if (window.location.pathname.includes("signup.html")) {
        document.querySelector("#Major").style.display = "block";
        document.querySelector("label[for='Major']").style.display = "block";
      }
    } else if (e === "Instructor") {
      usertype = e;
      Inst_icn.style.transform = "scale(1.05)";
      Inst_icn.style.color = "Black";
      if (window.location.pathname.includes("signup.html")) {
        document.querySelector("#Major").style.display = "none";
        document.querySelector("label[for='Major']").style.display = "none";
      }
    } else if (e === "Admin") {
      usertype = e;
      Admin_icn.transform = "scale(1.05)";
      Admin_icn.style.color = "Black";
      if (window.location.pathname.includes("signup.html")) {
        document.querySelector("#Major").style.display = "none";
        document.querySelector("label[for='Major']").style.display = "none";
      }
    }
  }

  async function handleLoginUser(e) {
    e.preventDefault();

    const formData = new FormData(form);
    let formObject = {};

    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    let users = await fetchAllUsers();
    console.log("used the new method");
    console.log(users);

    let user = users.find((u) => {
      return u.email == formObject.email && u.password == formObject.password;
    });

    if (user && usertype != undefined && user.userType == usertype) {
      console.log(`user have been found`);
      indicator.style.display = "none";

      switch (user.userType) {
        case "Student":
          loadPage(user, "../../student-view/views/stdnt-main-dashboard.html");
          break;
        case "Instructor":
          loadPage(
            user,
            "/frontend/pages/instructor-view/views/instructor-main-dashboard.html"
          );
          break;

        case "Admin":
          loadPage(user, "/frontend/pages/admin/views/admin-dashboard.html");
          break;
      }
    } else if (usertype == undefined) {
      userType.style.display = "block";
      await new Promise((resolve) => setTimeout(resolve, 4000));
      userType.style.display = "none";
    } else {
      indicator.style.display = "block";
    }
    form.reset();
  }

  async function loadPage(user, page) {
    window.location.href = page;
    sessionStorage.setItem("authenticated_user_id", `${user.id}`);
  }

  async function handleRegisterUser(event) {
    event.preventDefault();
    const formData = new FormData(form);

    let formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    const randomId = Math.floor(Math.random() * 10000);
    const user = {
      id: randomId,
      ...formObject,
      userType: usertype,
    };

    if (formObject.password !== formObject.confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    if (!usertype) {
      alert("Please select a user type");
      return;
    }

    if (!formObject.email || !formObject.password || !formObject.name) {
      alert("Please fill all the fields");
      return;
    }

    if (user.userType == "Student" && !formObject.Major) {
      alert("Please Choose a major");
      return;
    }
    switch (user.userType) {
      case "Student":
        await studentService.createStudent({
          id: randomId,
          name: user.name,
          gpa: "0.0",
          major: user.Major,
          completedCourses: [],
          registeredCourses: [],
        });
        break;

      case "Instructor":
        await updateInstructor(
          {
            id: randomId,
            name: user.name,
          },
          "POST"
        );
        break;

      case "Admin":
        await updateAdmin(
          {
            id: randomId,
            name: user.name,
          },
          "POST"
        );
        break;
    }

    await createUser(user);
    alert("User created successfully, click OK to go to login page");
    window.location.href = "/frontend/pages/login/views/login-page.html";
  }
}

main();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Get selected user type
    const userType = document.querySelector('#usertype').textContent.includes('Student') ? 'Student' : 
                     document.querySelector('#usertype').textContent.includes('Instructor') ? 'Instructor' : 'Admin';
    
    try {
      let redirectPage = '';
      
      if (userType === 'Student') {
        redirectPage = '/pages/student-view/views/stdnt-main-dashboard.html';
      } else if (userType === 'Instructor') {
        redirectPage = '/pages/instructor-view/views/instructor-main-dashboard.html';
      } else if (userType === 'Admin') {
        redirectPage = '/pages/admin/views/admin-dashboard.html';
      }
      
      window.location.href = redirectPage;
      
    } catch (error) {
      document.getElementById('indicator').style.display = 'block';
    }
  });
  
  document.getElementById('Student-icon').addEventListener('click', () => {
    document.getElementById('usertype').textContent = 'Student';
  });
  
  document.getElementById('Instructor-icon').addEventListener('click', () => {
    document.getElementById('usertype').textContent = 'Instructor';
  });
  
  document.getElementById('Admin-icon').addEventListener('click', () => {
    document.getElementById('usertype').textContent = 'Admin';
  });
});
