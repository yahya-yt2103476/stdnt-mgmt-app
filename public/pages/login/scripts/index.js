import userService from "../../../services/user-service.js";

import studentService from "../../../services/student-service.js";
import instructorService from "../../../services/instructor-service.js";
import adminService from "../../../services/admin-service.js";

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
  const userTypeIndicator = document.querySelector("#usertype");
  if (window.location.pathname.includes("signup.html")) {
    const registerBtn = document.querySelector("#registerButton");
    registerBtn.addEventListener("click", handleRegisterUser);
  }
  let selectedUserType;

  std_icn.addEventListener("click", () => handleUserTypeSelection("Student"));
  Inst_icn.addEventListener("click", () => handleUserTypeSelection("Instructor"));
  Admin_icn.addEventListener("click", () => handleUserTypeSelection("Admin"));
  if (window.location.pathname.includes("login-page.html")) {
    form.addEventListener("submit", handleLoginUser);
  } else {
    console.log("Not on login page, login handler not attached.");
  }

  function handleUserTypeSelection(type) {
    icons.forEach((i) => {
      i.style.transform = "scale(1)";
      i.style.color = "grey";
    });

    selectedUserType = type;

    if (type === "Student") {
      std_icn.style.transform = "scale(1.05)";
      std_icn.style.color = "Black";
      if (window.location.pathname.includes("signup.html")) {
        document.querySelector("#Major").style.display = "block";
        document.querySelector("label[for='Major']").style.display = "block";
      }
    } else if (type === "Instructor") {
      Inst_icn.style.transform = "scale(1.05)";
      Inst_icn.style.color = "Black";
      if (window.location.pathname.includes("signup.html")) {
        document.querySelector("#Major").style.display = "none";
        document.querySelector("label[for='Major']").style.display = "none";
      }
    } else if (type === "Admin") {
      Admin_icn.style.transform = "scale(1.05)";
      Admin_icn.style.color = "Black";
      if (window.location.pathname.includes("signup.html")) {
        document.querySelector("#Major").style.display = "none";
        document.querySelector("label[for='Major']").style.display = "none";
      }
    }
    userTypeIndicator.style.display = "none";
  }

  async function handleLoginUser(e) {
    e.preventDefault();
    indicator.style.display = "none";
    userTypeIndicator.style.display = "none";

    if (!selectedUserType) {
      userTypeIndicator.textContent = "Please select a user type!";
      userTypeIndicator.style.display = "block";
      return;
    }

    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
       indicator.textContent = "Please enter both email and password.";
       indicator.style.display = "block";
       return;
    }

    try {
      console.log(`Attempting login for ${email} as ${selectedUserType}`);
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email, 
          password: password, 
          userType: selectedUserType
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Login successful, received data:", userData);

        if (userData && userData.id && userData.profile) {
           sessionStorage.setItem("authenticated_user_id", userData.id.toString());
           sessionStorage.setItem("authenticated_user_type", userData.userType.toUpperCase());
           
           switch (userData.userType.toUpperCase()) { 
              case "STUDENT":
                window.location.href = "/pages/student-view/views/stdnt-main-dashboard.html";
                break;
              case "INSTRUCTOR":
                 window.location.href = "/pages/instructor-view/views/instructor-main-dashboard.html";
                break;
              case "ADMIN":
                 window.location.href = "/pages/admin/views/admin-dashboard.html";
                break;
              default:
                  console.error("Unknown user type received from server:", userData.userType);
                  indicator.textContent = "Login failed: Unknown user role.";
                  indicator.style.display = "block";
            }
        } else {
             console.error("Login failed: User ID or profile data missing from server response.", userData);
             indicator.textContent = "Login failed. Please try again (profile data missing).";
             indicator.style.display = "block";
        }

      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Login failed: ${response.status} ${response.statusText}`, errorData);
        indicator.textContent = errorData.error || "Incorrect Email/Password or User Type.";
        indicator.style.display = "block";
      }

    } catch (error) {
      console.error("Network or unexpected error during login:", error);
      indicator.textContent = "An error occurred during login. Please check connection.";
      indicator.style.display = "block";
    } finally {
       // Optionally clear password field after attempt
       // form.querySelector('#password').value = ''; 
    }
  }

  async function handleRegisterUser(event) {
    event.preventDefault();
    const formData = new FormData(form);

    let formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Validation
    if (formObject.password !== formObject.confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }
    if (!selectedUserType) {
      alert("Please select a user type");
      return;
    }
    if (!formObject.email || !formObject.password || !formObject.name) {
      alert("Please fill all the fields");
      return;
    }
    if (selectedUserType == "Student" && !formObject.Major) {
      alert("Please Choose a major");
      return;
    }

    // 1. Create the user with only valid fields
    const userPayload = {
      email: formObject.email,
      password: formObject.password,
      userType: selectedUserType.toUpperCase(),
    };
    
    try {
      const createdUser = await userService.createUser(userPayload);

      // 2. Create the related entity
      if (selectedUserType == "Student") {
        await studentService.createStudent({
          name: formObject.name,
          gpa: 0.0,
          major: formObject.Major,
          userId: createdUser.id,
        });
      } else if (selectedUserType == "Instructor") {
        await instructorService.createInstructor({
          name: formObject.name,
          userId: createdUser.id,
        });
      } else if (selectedUserType == "Admin") {
        await adminService.createAdmin({
          name: formObject.name,
          userId: createdUser.id,
        });
      }

      alert("User created successfully, click OK to go to login page");
      window.location.href = "/pages/login/views/login-page.html";
    } catch (error) {
      console.error("Registration error:", error);
      const errorDetails = error.response ? await error.response.json().catch(() => ({})) : {};
      alert(`Error creating user: ${errorDetails.details || error.message}`);
    }
  }
}

main();
