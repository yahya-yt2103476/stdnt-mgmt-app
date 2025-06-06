import { getAllCourses } from "../../../services/course-service.js";
import { getAllSections, updateSection } from "../../../services/section-service.js";
import { getAllRegistrations, updateRegistration } from "../../../services/registration-service.js";
import { getAllStudents } from "../../../services/student-service.js";
import { logoutCurrentUser as logoutCurrentUser } from "../../../services/logout.js";
import { convertToAmPmRange as convertToAmPmRange } from "../../../services/format-time.js";

//for phase 2 MEQ added this import statement
import { submitFinalGrades } from "../../../../app/actions/server-actions.js";

var gradesOutPut = null;

const urlParams = new URLSearchParams(window.location.search);
const courseId = Number(urlParams.get("courseId"));
const sectionId = Number(parseInt(urlParams.get("sectionId")));
const courseShortName = urlParams.get("courseShortName").replace(/\s/g, "").trim();

let allCourses = await getAllCourses();
let allSections = await getAllSections();
let allStudents = await getAllStudents();
let allRegistrations = await getAllRegistrations();

let instructorSections = () => {
  return allSections.find((section) => section.id === sectionId);
};

let instructorCourses = () => {
  return allCourses.find((course) => course.id === courseId);
};

let enrolledStudents = () => {
  return allStudents.filter(
    (student) =>
      student.registeredCourses &&
      student.registeredCourses.find((e) => e.SectionId === sectionId)
  );
};

let instructorRegistrations = () => {
  return allRegistrations.filter(
    (registration) => registration.sectionId === Number(sectionId)
  );
};

let instructorRegistrationsList = instructorRegistrations();

function main() {
  const backButton = document.querySelector("#backBtn");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.history.back();
    });
  }

  const courseInfo = document.querySelector(".courseInfoInner");
  courseInfo.innerHTML = displayCourseInfo(
    instructorCourses(),
    instructorSections()
  );

  displayEnrolledStudents(enrolledStudents());

  const assignmentForm = document.querySelector(".assignmentForm");
  if (assignmentForm) {
    assignmentForm.addEventListener("submit", (e) =>
      handleAssignmentUpload(e, instructorSections())
    );
  }
  displayAssignmentsExams(instructorSections());

  populateStudentSelect(instructorRegistrationsList, enrolledStudents());
}
main();

function displayCourseInfo(cor, sec) {
  console.log(cor);
  console.log("I am location: ", sec.location);

  const scheduleRows = sec.Days.map((day) => {
    const timeString = convertToAmPmRange(sec.Time);
    return `
            <tr>
                <td>${day}</td>
                <td>${timeString}</td> 
            </tr>
        `;
  }).join("");

  return `
        <ul>
            <li><b>Course Name:&nbsp;</b> ${cor.name}</li>
            <li><b>Course Code:&nbsp;</b> ${sec.courseId}</li>
            <li><b>Section number:&nbsp;</b> ${sec.id}</li>
            <li><b>Semester:&nbsp;</b> ${sec.semester}</li>
            <table>
                <caption><b>Schedule</b></caption>
                <tr>
                    <td><b>Day</b></td> <td><b>Time</b></td>
                </tr>
                ${scheduleRows}
            </table>
            <br>
            <li><b>Location:&nbsp;</b>${sec.location}</li>
        </ul>
    `;
}

function displayEnrolledStudents(enrolledStudents) {
  const studentListTable = document.querySelector(".studentList tbody");
  if (studentListTable) {
    if (enrolledStudents && enrolledStudents.length > 0) {
      const studentRows = enrolledStudents
        .map((student) => {
          return `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.id}</td>
                    </tr>
                `;
        })
        .join("");
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
    alert("Assignment Uploaded sucessfully");
  } else {
    alert("Please fill in all fields.");
  }
}

async function updateSectionList(instructorSection) {
  updateSection(sectionId, instructorSection);
}

function displayAssignmentsExams(instructorSection) {
  const assignmentsTableBody = document.querySelector(".contentTable");
  if (assignmentsTableBody) {
    if (instructorSection && instructorSection.courseContent.length > 0) {
      const assignmentRows = instructorSection.courseContent
        .map((assignment, index) => {
          return `
                    <tr>
                        <td>${assignment.title}</td>
                        <td>${assignment.deadline}</td>
                        <td>
                            ${assignment.status}
                            <button class="status-toggle" data-index="${index}">Toggle</button>
                        </td>
                        <td><button class="remove-assignment" data-index="${index}">Remove</button></td>
                    </tr>
                `;
        })
        .join("");
      assignmentsTableBody.innerHTML = assignmentRows;

      const statusButtons = document.querySelectorAll(".status-toggle");
      statusButtons.forEach((button) => {
        button.addEventListener("click", (event) =>
          toggleStatus(event, instructorSection)
        );
      });
      const removeButtons = document.querySelectorAll(".remove-assignment");
      removeButtons.forEach((button) => {
        button.addEventListener("click", (event) =>
          removeAssignment(event, instructorSection)
        );
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
  alert("Assignment Removed sucessfully");
}

function toggleStatus(event, instructorSection) {
  const index = event.target.dataset.index;
  instructorSection.courseContent[index].status =
    instructorSection.courseContent[index].status === "Open"
      ? "Closed"
      : "Open";
  displayAssignmentsExams(instructorSection);
}

function populateStudentSelect(registrations, enrolledStudentsList) {
  const studentFinalGradeDiv = document.querySelector(".finalGradeForm");
  if (!studentFinalGradeDiv) {
    console.error("Error: .studentFinalGrade div not found in the HTML.");
    return;
  }

  if (registrations && registrations.length > 0) {
    const table = document.createElement("table");
    table.innerHTML = `
            <thead>
                <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Final Grade</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
    const tbody = table.querySelector("tbody");

    enrolledStudentsList
      .map((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td><input type="number" class="grade" min="0" max="110" data-student-id="${student.id}" /></td>
            `;
        tbody.appendChild(row);
        return row;
      })
      .forEach((row) => tbody.appendChild(row));

    studentFinalGradeDiv.appendChild(table);

    const submitButton = studentFinalGradeDiv.querySelector(
      ".finalGradeSubmitBtn"
    );
    if (submitButton) {
      submitButton.addEventListener("click", (e) => {
        handleFinalGradeSubmit(e, instructorRegistrationsList);
      });
      studentFinalGradeDiv.insertBefore(table, submitButton);
    }
  } else {
    studentFinalGradeDiv.innerHTML +=
      "<p>No students registered for this section.</p>";
  }
}

// function handleFinalGradeSubmit(e, registrations) {
//   e.preventDefault();

//   const studentFinalGradeDiv = document.querySelector(".finalGradeForm");
//   if (!studentFinalGradeDiv) {
//     console.error("Error: .studentFinalGrade div not found in the HTML.");
//     return registrations;
//   }

//   const gradeInputs = studentFinalGradeDiv.querySelectorAll("input.grade");
//   console.log("Found grade input elements:", gradeInputs); //tetsing

//   const updatedRegistrations = registrations.map((reg) => {
//     const inputElement = Array.from(gradeInputs).find(
//       (input) => parseInt(input.dataset.studentId) === reg.studentId
//     );

//     if (inputElement) {
//       const finalGrade = parseInt(inputElement.value);
//       if (!isNaN(finalGrade) && finalGrade <= 110 && finalGrade >= 0) {
//         return { ...reg, grade: finalGrade }; // i am keeping everything the same and updating the grade
//       }
//     }
//     return reg; // if the condition evaluates to false i'm keeping the object the same
//   });

//   instructorRegistrationsList = updatedRegistrations;
  
//   gradesOutPut = compareAndUpdateLists(
//     allRegistrations,
//     instructorRegistrationsList
//   ); 
//   console.log("I am testingSmth :", gradesOutPut); 
//   gradesOutPut.forEach((e) => updateRegistrationList(e));
//   alert("Grades have been submitted");
// }
//Old implementation not using server action

// the change for phase 2


async function handleFinalGradeSubmit(e, registrations) {
  e.preventDefault();

  const studentFinalGradeDiv = document.querySelector(".finalGradeForm");
  if (!studentFinalGradeDiv) {
    console.error("Error: .studentFinalGrade div not found in the HTML.");
    return;
  }

  const gradeInputs = studentFinalGradeDiv.querySelectorAll("input.grade");
  const gradeUpdates = [];

  Array.from(gradeInputs).forEach(input => {
    const studentId = parseInt(input.dataset.studentId);
    const finalGrade = parseInt(input.value);
    
    if (!isNaN(finalGrade)) {
      gradeUpdates.push({
        studentId,
        sectionId, 
        grade: finalGrade
      });
    }
  });

  try {
    const result = await submitFinalGrades(gradeUpdates);
    
    if (result.success) {
      alert("Grades submitted successfully!");
      window.location.reload();
    } else {
      throw new Error(result.error || "Failed to submit grades");
    }
  } catch (error) {
    console.error("Grade submission error:", error);
    alert(`Error: ${error.message}`);
  }
}

function compareAndUpdateLists(list1, list2) {
  return list1.map((obj1) => {
    const matchingObj2 = list2.find((obj2) => obj1.id === obj2.id);
    if (matchingObj2 && obj1.grade !== matchingObj2.grade) {
      return matchingObj2;
    }
    return obj1;
  });
}

// this uses the same logic as the one we used in updateSectionList
async function updateRegistrationList(registrations) {
  // This function appears unused after introducing server actions.
  // The call below is incorrect as updateRegistration expects (id, data).
  // updateRegistrationData(registrations);
}

const logoutbtn = document.querySelector("#logOutBtn");
logoutbtn.addEventListener("click", logoutCurrentUser);

