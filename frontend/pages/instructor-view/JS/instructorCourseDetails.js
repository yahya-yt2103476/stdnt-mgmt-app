let studentsLink = "http://127.0.0.1:5500/database/students.json";
let registrationsLink = "http://127.0.0.1:5500/database/registrations.json"

let courseList = localStorage.getItem("course_list");
let sectionList = localStorage.getItem("section_list");
let studentsList = localStorage.getItem("students_list");
let registrationsList = localStorage.getItem("registration_list");
// let registrationsList = null;

if (!studentsList) loadList(studentsLink)

async function loadList(std) {
    const response = await fetch(std);
    const data = await response.json();
    localStorage.setItem("students_list", JSON.stringify(data));
}

if (!registrationsList) loadRegList(registrationsLink)

async function loadRegList(std) {
    const response = await fetch(std);
    const data = await response.json();
    localStorage.setItem("registration_list", JSON.stringify(data));
}

function main() {
    const backButton = document.querySelector("#backBtn");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.history.back();
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const sectionId = urlParams.get("sectionId");
    let instructorSection = null, instructorCourse = null;
    if (sectionList) {
        try {
            sectionList = JSON.parse(sectionList);
            if (Array.isArray(sectionList)) {
                instructorSection = sectionList.find(section => section.id === sectionId);
            } else {
                console.error("section_list from localStorage is not an array.");
            }
        } catch (error) {
            console.error("Error parsing section_list from localStorage:", error);
        }
    } else {
        console.error("section_list not found in localStorage.");
    }

    if (instructorSection) {
        console.log("Instructor Section:", instructorSection);

        const courseList = JSON.parse(localStorage.getItem("course_list"));
        const courseId = instructorSection.courseId;
        instructorCourse = courseList.find(course => course.id === courseId);

        if (instructorCourse) {
            console.log("Instructor Course:", instructorCourse);
        } else {
            console.error("Course not found for courseId:", courseId);
        }
    }

    console.log("Instructor Section:", instructorSection);
    console.log("Instructor Course:", instructorCourse);
    console.log("Instructor Section:", instructorSection.courseContent);
    //these are all tests

    const enrolledStudents = [];
    if (studentsList) {
        try {
            const parsedStudentsList = JSON.parse(studentsList);
            if (Array.isArray(parsedStudentsList) && instructorSection) {
                const studentIds = instructorSection.enrolledStudents;
                if (Array.isArray(studentIds)) {
                    studentIds.forEach((studentId) => {
                        const student = parsedStudentsList.find((s) => s.studentId === studentId);
                        if (student) {
                            enrolledStudents.push(student);
                        }
                    });
                    console.log("Enrolled Students:", enrolledStudents);
                } else {
                    console.error("enrolledStudents is not an array");
                }
            } else {
                console.error("students_list is not an array or instructorSection is null.");
            }
        } catch (error) {
            console.error("Error parsing students_list from localStorage:", error);
        }
    } else {
        console.error("students_list not found in localStorage.");
    }

    const courseInfo = document.querySelector(".courseInfoInner");
    courseInfo.innerHTML = displayCourseInfo(instructorCourse, instructorSection);
    displayEnrolledStudents(enrolledStudents);

    const assignmentForm = document.querySelector(".assignmentForm");
    if (assignmentForm) {
        assignmentForm.addEventListener("submit", (e) => handleAssignmentUpload(e, instructorSection));
    }
    displayAssignmentsExams(instructorSection);

    if (registrationsList && enrolledStudents.length > 0) {
        try {
            const parsedRegistrationsList = JSON.parse(registrationsList);
            const instructorRegistrations = parsedRegistrationsList.filter(registration => {
                return enrolledStudents.some(student => student.studentId === registration.studentId);
            });
            console.log("Instructor Registrations:", instructorRegistrations);
            populateStudentSelect(instructorRegistrations);
        } catch (error) {
            console.error("Error processing registrationsList:", error);
        }
    } else {
        console.log("registrationsList is empty or no enrolled students.");
    }
}
main();

function displayCourseInfo(cor, sec) {
    const scheduleRows = sec.Days.map(day => {
        return `
            <tr>
                <td>${day}</td>
                <td>${sec.Time}</td> 
            </tr>
        `;
    }).join("");

    return `
        <ul>
            <li>Course Name:${cor.name}</li>
            <li>Course Code: ${sec.courseId}</li>
            <li>Section number: ${sec.id}</li>
            <li>Semester: ${sec.semester}</li>
            <table>
                <caption><b>Schedule</b></caption>
                <tr>
                    <td>Day</td> <td>Time</td>
                </tr>
                ${scheduleRows}
            </table>
            <br>
            <li>Location:${sec.location}</li>
        </ul>
    `;
}

function displayEnrolledStudents(enrolledStudents) {
    const studentListTable = document.querySelector(".studentList tbody");
    if (studentListTable) {
        if (enrolledStudents && enrolledStudents.length > 0) {
            const studentRows = enrolledStudents.map(student => {
                return `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.studentId}</td>
                    </tr>
                `;
            }).join("");
            studentListTable.innerHTML = studentRows;
        } else {
            studentListTable.innerHTML = `<tr><td colspan="2">No Students Enrolled</td></tr>`;
        }
    }
}

function handleAssignmentUpload(e, instructorSection) {
    e.preventDefault();

    const title = document.querySelector("#assignmentTitle").value;
    const deadline = document.querySelector("#deadline").value;
    if (title && deadline) {
        const newAssignment = {
            title: title,
            deadline: deadline,
            status: "Open",
        };
        instructorSection.courseContent.push(newAssignment);
        updateSectionList(instructorSection);
        displayAssignmentsExams(instructorSection);
        e.target.reset();
    } else {
        alert("Please fill in all fields.");
    }
}

async function updateSectionList(instructorSection) {
  let sectionList = JSON.parse(localStorage.getItem("section_list"));
  sectionList = sectionList.map(section => {
      if (section.id === instructorSection.id) {
          return instructorSection;
      }
      return section;
  });

  localStorage.setItem("section_list", JSON.stringify(sectionList));

  // Took the help of an AI to implement this and it isn't working it says there needs to be server side components
  try { 
      const response = await fetch("http://127.0.0.1:5500/database/sections.json", {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(sectionList),
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("sections.json updated successfully");
  } catch (error) {
      console.error("Error updating sections.json:", error);
  }
}
function displayAssignmentsExams(instructorSection) {
    const assignmentsTableBody = document.querySelector(".contentTable");
    if (assignmentsTableBody) {
        if (instructorSection && instructorSection.courseContent.length > 0) {
            const assignmentRows = instructorSection.courseContent.map((assignment, index) => {
                return `
                    <tr>
                        <td>${assignment.title}</td>
                        <td>${assignment.deadline}</td>
                        <td>
                            ${assignment.status}
                            <button class="status-toggle" data-index="${index}">Toggle</button>
                        </td>
                        <td><a href="">View</a></td>
                        <td><button class="remove-assignment" data-index="${index}">Remove</button></td>
                    </tr>
                `;
            }).join("");
            assignmentsTableBody.innerHTML = assignmentRows;

            const statusButtons = document.querySelectorAll(".status-toggle");
            statusButtons.forEach(button => {
                button.addEventListener("click", (event) => toggleStatus(event, instructorSection));
            });
            const removeButtons = document.querySelectorAll(".remove-assignment");
            removeButtons.forEach(button => {
                button.addEventListener("click", (event) => removeAssignment(event, instructorSection));
            });
        } else {
            assignmentsTableBody.innerHTML = `<tr><td colspan="5">No Assignments or Exams Uploaded</td></tr>`;
        }
    }
}

function removeAssignment(event, instructorSection) {
    const index = parseInt(event.target.dataset.index);
    instructorSection.courseContent.splice(index, 1);
    updateSectionList(instructorSection);
    displayAssignmentsExams(instructorSection);
}

function toggleStatus(event, instructorSection) {
    const index = event.target.dataset.index;
    instructorSection.courseContent[index].status = instructorSection.courseContent[index].status === "Open" ? "Closed" : "Open";
    displayAssignmentsExams(instructorSection);
}

/* 
this one was weird too most of the new used techniques i learned from an ai since working with 
select boxes is different from regular HTML injections we've been using
*/
function populateStudentSelect(registrations) {
    const studentSelect = document.querySelector(".finalGradeFOrm select");
    if (studentSelect) {
        studentSelect.innerHTML = '<option selected disabled>-Select-</option>'; 
        registrations.forEach(registration => {
            const option = document.createElement("option");
            option.value = registration.studentId;
            option.textContent = registration.studentId;
            studentSelect.appendChild(option);
        });
    }
    const finalGradeForm = document.querySelector(".finalGradeFOrm");
    if (finalGradeForm) {
        finalGradeForm.addEventListener("submit", (e) => handleFinalGradeSubmit(e, registrations));
    }
}

function handleFinalGradeSubmit(e, registrations) {
    e.preventDefault();

    const studentId = document.querySelector(".finalGradeFOrm select").value;
    const grade = document.querySelector(".finalGradeFOrm input[type='number']").value;

    if (studentId && grade !== "") {
        const registration = registrations.find(reg => reg.studentId === studentId);
        if (registration) {
            registration.Grade = parseInt(grade); 
            updateRegistrationList(registrations); 
        } else {
            alert("Student registration not found.");
        }
    } else {
        alert("Please select a student and enter a grade.");
    }
}

// this uses the same logic as the one we used in updateSectionList
async function updateRegistrationList(registrations) {
    try {
        const response = await fetch("http://127.0.0.1:5500/database/registrations.json", {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registrations),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("registrations.json updated successfully");
    } catch (error) {
        console.error("Error updating registrations.json:", error);
    }
}

// /*

// <ul>
//         <li>Course Name: Deep Learning</li>
//         <li>Course Code: CMPS497</li>
//         <li>Semester: Sp25</li>
//         <li>
//             <table>
//                 <caption><b>Schedule</b></caption>

//                 <tr>
//                     <td>Day</td> <td>Time</td>
//                 </tr>

//                 <tr>
//                     <td>Sunday</td> <td>11:00-11:50 (AM)</td>
//                 </tr>

//                 <tr>
//                     <td>Tuesday</td> <td>11:00-11:50 (AM)</td>
//                 </tr>

//                 <tr>
//                     <td>Thursday</td> <td>11:00-11:50 (AM)</td>
//                 </tr>
//             </table>
//         </li>

//         <li>Location: H07-BL204</li>
//     </ul>

// */

// /*
// <div class="studentList">
//           <h2>Enrolled Students</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>QUID</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>Mamoud</td>
//                 <td>001</td>
//               </tr>
//               <tr>
//                 <td>Ahmed</td>
//                 <td>002</td>
//               </tr>
//               <tr>
//                 <td>Khalid</td>
//                 <td>003</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//  */

