import {fetchInstructorById} from '../../../services/instructor-service.js' // not used
import {fetchAllCourses} from '../../../services/course-service.js'
import {fetchAllSections,updateSection} from '../../../services/section-service.js'
import {fetchAllRegistrations,updateRegistrationData} from '../../../services/registration-service.js'
import {fetchAllStudents,fetchStudentById} from '../../../services/student-service.js'

const urlParams = new URLSearchParams(window.location.search);
const instructorName = urlParams.get("instructorName"); // not used
const courseId = urlParams.get("courseId");
const sectionId = urlParams.get("sectionId");
const courseShortName = urlParams.get("courseShortName");

let allCourses = await fetchAllCourses();
let allSections = await fetchAllSections();
let allStudents = await fetchAllStudents();
let allRegistrations = await fetchAllRegistrations();

let instructorSections = () => {
    return allSections.find(section => section.id == sectionId);
};

let instructorCourses = () => {
    return allCourses.find(course => course.id == courseId);
};

let enrolledStudents = () =>{
    return allStudents.filter(
        student => student.registeredCourses && student.registeredCourses.includes(courseShortName)
      );
};

let instructorRegistrations = () =>{
    return allRegistrations.filter(registration => registration.sectionId === Number(sectionId));
};


console.log((courseShortName))
console.log(enrolledStudents());

function main() {
    const backButton = document.querySelector("#backBtn");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.history.back();
        });
    }

    const courseInfo = document.querySelector(".courseInfoInner");
    courseInfo.innerHTML = displayCourseInfo(instructorCourses(), instructorSections());
    displayEnrolledStudents(enrolledStudents());

    const assignmentForm = document.querySelector(".assignmentForm");
    if (assignmentForm) {
        assignmentForm.addEventListener("submit", (e) => handleAssignmentUpload(e, instructorSections()));
    }
    displayAssignmentsExams(instructorSections());

    populateStudentSelect(instructorRegistrations(),enrolledStudents())
}
main();

function displayCourseInfo(cor, sec) {
    console.log(cor);
    console.log("I am location: ",sec.location);
    
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
                        <td>${student.id}</td>
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

// we'll need to change
async function updateSectionList(instructorSection) {
    updateSection(sectionId,instructorSection)   
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
// function populateStudentSelect(registrations,enrolledStudentsList) {    
    
//     const studentFinalGradeDiv = document.querySelector('.finalGradeFOrm');
//     if (!studentFinalGradeDiv) {
//         console.error("Error: .studentFinalGrade div not found in the HTML.");
//         return;
//     }

//     // studentFinalGradeDiv.innerHTML = '<h3>Submit Students Final Grade</h3>';

//     if (registrations && registrations.length > 0) {
//         const table = document.createElement('table');
//         table.innerHTML = `
//         <thead>
//             <tr>
//             <th>Student ID</th>
//             <th>Student Name</th>
//             <th>Final Grade</th>
//             </tr>
//         </thead>
//         <tbody></tbody>
//         `;
//         const tbody = table.querySelector('tbody');

//         enrolledStudentsList.map(student => {
//           const row = document.createElement('tr');
//           row.innerHTML = `
//             <td>${student.id}</td>
//             <td>${student.name}</td>
//             <td><input type="number class="grade"" min="0" max="110" data-student-id="${student.id}" /></td>
//           `;
//           return row;
//         }).forEach(row => tbody.appendChild(row));

//         // Append the table to the div
//         studentFinalGradeDiv.appendChild(table);

//         const submitButton = studentFinalGradeDiv.querySelector('.finalGradeSubmitBtn');
//     if (submitButton) {
//       studentFinalGradeDiv.insertBefore(table, submitButton);
//     } else {
//       studentFinalGradeDiv.appendChild(table);
//     }
//     submitButton.addEventListener('click', (e) => {handleFinalGradeSubmit(e,allRegistrations)});
//     } else {
//         studentFinalGradeDiv.innerHTML += '<p>No students registered for this section.</p>';
//     }
// }



function populateStudentSelect(registrations, enrolledStudentsList) {

    const studentFinalGradeDiv = document.querySelector('.finalGradeFOrm');
    if (!studentFinalGradeDiv) {
        console.error("Error: .studentFinalGrade div not found in the HTML.");
        return;
    }
    
    if (registrations && registrations.length > 0) {
        const table = document.createElement('table');
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
        const tbody = table.querySelector('tbody');

        enrolledStudentsList.map(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td><input type="number" class="grade" min="0" max="110" data-student-id="${student.id}" /></td>
            `;
            tbody.appendChild(row);
            return row;
        }).forEach(row => tbody.appendChild(row));

        
        studentFinalGradeDiv.appendChild(table);

        const submitButton = studentFinalGradeDiv.querySelector('.finalGradeSubmitBtn');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => { handleFinalGradeSubmit(e, allRegistrations); });
            studentFinalGradeDiv.insertBefore(table, submitButton);
        } 
    } else {
        studentFinalGradeDiv.innerHTML += '<p>No students registered for this section.</p>';
    }
}


function handleFinalGradeSubmit(e, registrations) {
    e.preventDefault();

    const studentFinalGradeDiv = document.querySelector('.finalGradeFOrm');
    if (!studentFinalGradeDiv) {
        console.error("Error: .studentFinalGrade div not found in the HTML.");
        return;
    }

    const gradeInputs = studentFinalGradeDiv.querySelectorAll('input.grade'); //input.grade will select all inpuys with class grades
    console.log("Found grade input elements:", gradeInputs);

    gradeInputs.forEach(input => {
        const studentId = parseInt(input.dataset.studentId);
        const finalGrade = parseInt(input.value);
        console.log(`Processing student ID: ${studentId}, Final Grade entered: ${finalGrade}`);

        // Find the matching registration and update the grade
        const registrationToUpdate = registrations.find(reg => reg.studentId === studentId);

        if (registrationToUpdate) {
            registrationToUpdate.grade = finalGrade;
            console.log(`Updated grade for student ID ${studentId} to ${finalGrade} in registrations.`);//testing
        } else {
            console.warn(`No matching registration found for student ID ${studentId}.`);
        }
    });

    console.log("Updated registrations:", registrations);
    updateRegistrationList(registrations);
    
}
  

// this uses the same logic as the one we used in updateSectionList
async function updateRegistrationList(registrations) {
    updateRegistrationData(registrations)
    alert("Grades have been submitted");
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

