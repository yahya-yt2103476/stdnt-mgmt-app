import {
  createUser,
  updateUser,
  fetchAllUsers,
  fetchUserById,
} from "../../../services/user-service.js";

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
  form.addEventListener("submit", handleLoginUser);

  function handleUserType(e) {
    icons.forEach((i) => {
      i.style.transform = "scale(1)";
      i.style.color = "grey";
    });

    if (e === "Student") {
      usertype = e;
      std_icn.style.transform = "scale(1.05)";
      std_icn.style.color = "Black";
    } else if (e === "Instructor") {
      usertype = e;
      Inst_icn.style.transform = "scale(1.05)";
      Inst_icn.style.color = "Black";
    } else if (e === "Admin") {
      usertype = e;
      Admin_icn.transform = "scale(1.05)";
      Admin_icn.style.color = "Black";
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
          loadPage(
            user,
            "../student-view/stdnt-main-dashboard/stdnt-main-dashboard.html"
          );
          break;
        case "Instructor":
          loadPage(
            user,
            "/frontend/pages/instructor-view/views/instructor-main-dashboard.html"
          );
          break;

        case "Admin":
          // Ayoub: Working now
          loadPage(user, "../admin/views/courses-view.html");
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
  async function handleRegisterUser(e) {
    e.preventDefault();
    const formData = new FormData(form);
    let formObject = {};

    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    console.log(formObject);

    if (formObject.password != formObject.confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    const user = {
      ...formObject,
      userType: usertype,
    };

    await createUser(user);
    alert("User created successfully");
  }
}

main();
