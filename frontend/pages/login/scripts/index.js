import { createUser, fetchAllUsers } from "../../../services/user-service.js";

import { AddStudent } from "../../../services/student-service.js";
import { updateInstructor } from "../../../services/instructor-service.js";
import { updateAdmin } from "../../../services/admin-service.js";

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
  if (window.location.pathname.includes("login_page.html")) {
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
        await AddStudent({
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
    window.location.href = "/frontend/pages/login/views/login_page.html";
  }
}

main();
