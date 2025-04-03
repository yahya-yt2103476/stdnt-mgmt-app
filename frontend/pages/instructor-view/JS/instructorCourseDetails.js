let studentsLink = "http://127.0.0.1:5500/database/students.json";

let courseList = localStorage.getItem("course_list");
let sectionList = localStorage.getItem("section_list");
let studentsList = localStorage.getItem("students_list");

if(!studentsList) loadList(studentsLink)

async function loadList(std){
    const response3 =  await fetch(std);
    const data3 = await response1.json();
    localStorage.setItem("students_list",JSON.stringify(data3));
}

function main(){
    const backButton = document.querySelector("#backBtn");
    if (backButton) {
      backButton.addEventListener("click", () => {
        // Navigate back to the previous page
        window.history.back();
      });
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const sectionId = urlParams.get("sectionId");


    //this code snippet took me more than usual i used an AI for assistance
    let instructorSection = null, instructorCourse = null;
    if (sectionList) {
    try {
        sectionList = JSON.parse(sectionList);
        if (Array.isArray(sectionList)) {
        instructorSection = sectionList.find(section => section.id === sectionId); // Find the section object
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
    console.log("Instructor Section:", instructorSection); //testing

    const courseList = JSON.parse(localStorage.getItem("course_list"));
    const courseId = instructorSection.courseId;
    instructorCourse = courseList.find(course => course.id === courseId); // Find the course object

    if (instructorCourse) {
        console.log("Instructor Course:", instructorCourse); //testing
    } else {
        console.error("Course not found for courseId:", courseId);
    }
    }

    console.log("Instructor Section:", instructorSection); //testing
    console.log("Instructor Course:", instructorCourse); //testing

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
    courseInfo.innerHTML = displayCourseInfo(instructorCourse,instructorSection);
    displayEnrolledStudents(enrolledStudents); 
}
main();

function displayCourseInfo(cor,sec){

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

/*

<ul>
        <li>Course Name: Deep Learning</li>
        <li>Course Code: CMPS497</li>
        <li>Semester: Sp25</li>
        <li>
            <table>
                <caption><b>Schedule</b></caption>

                <tr>
                    <td>Day</td> <td>Time</td>
                </tr>

                <tr>
                    <td>Sunday</td> <td>11:00-11:50 (AM)</td>
                </tr>

                <tr>
                    <td>Tuesday</td> <td>11:00-11:50 (AM)</td>
                </tr>

                <tr>
                    <td>Thursday</td> <td>11:00-11:50 (AM)</td>
                </tr>
            </table>
        </li>

        <li>Location: H07-BL204</li>
    </ul>

*/

/*
<div class="studentList">
          <h2>Enrolled Students</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>QUID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mamoud</td>
                <td>001</td>
              </tr>
              <tr>
                <td>Ahmed</td>
                <td>002</td>
              </tr>
              <tr>
                <td>Khalid</td>
                <td>003</td>
              </tr>
            </tbody>
          </table>
        </div>
 */