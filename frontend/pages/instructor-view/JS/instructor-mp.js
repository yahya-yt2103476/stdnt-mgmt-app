//hard set variable
let instructor_Id = "I001";
let instructorName = "Dr. Khalid Al-Naimi";
// let instructorName = 'Lucas Adams'; // another test value
 // this value should be sent from the login page delete later testing values
//remove this variable later

/*
async () => {
const response =  await fetch(BASE_URL);
const data = await response.json();
localStorage.setItem("recipeList",JSON.stringify(data));
}
*/ 

let sectionsLink = "http://127.0.0.1:5500/database/sections.json";
let coursesLink = "http://127.0.0.1:5500/database/courses.json";

let courseList = localStorage.getItem("course_list");
let sectionList = localStorage.getItem("section_list");

// let courseList = null, sectionList =null; //tests delete later


if(!courseList || !sectionList)
    loadList(sectionsLink,coursesLink);

async function loadList(sec,cor){
  
    const response1 =  await fetch(sec);
    const data1 = await response1.json();
    localStorage.setItem("section_list",JSON.stringify(data1));

    const response2 =  await fetch(cor);
    const data2 = await response2.json();
    localStorage.setItem("course_list",JSON.stringify(data2));
  
}

function main(){

  const mainContent = document.querySelector(".container");
  courseList = JSON.parse(localStorage.getItem("course_list"));
  sectionList = JSON.parse(localStorage.getItem("section_list"));

  const instructorSections = sectionList.filter(
    section => section.instructorName === instructorName
  );
  const instructorCourseIds = instructorSections.map(section => section.courseId);
  const instructorCourses = courseList.filter(course => 
  instructorCourseIds.includes(course.id)
  );  
  
  let neededInfo = filterIntoOne(instructorCourses,instructorSections)

  mainContent.innerHTML = loadCourses(neededInfo).join(" ");

  const searchBar = document.querySelector("#searchBar");
  searchBar.addEventListener("input", () => handleSearch(neededInfo));
}


function filterIntoOne(corList, secList) {
  const newList = [];

  for (const course of corList) {
    const matchingSections = secList.filter(
      (section) => section.courseId === course.id && section.instructorName === instructorName
    );

    if (matchingSections.length > 0) {
      matchingSections.forEach((section) => {
        newList.push({
          name: course.name,
          category: course.category,
          totalEnrolled: section.enrolledStudents.length,
        });
      });
    }
  }

  return newList;
}

//original
// function loadCourses(courseData) {
//   return courseData.map((course) => {
//     return `
//       <div class="course-card">
//         <h3>${course.name}</h3>
//         <p>Category: ${course.category}</p>
//         <p>Total Enrolled Students: ${course.totalEnrolled}</p>
//         <a href="#" class="view-course-btn">View Course</a>
//       </div>
//     `;
//   });
// }

// use this most likely
// function loadCourses(courseData) {
//   return courseData.map((course) => {
//     return `
//       <div class="course-card">
//         <h3>${course.name}</h3>
//         <p>Category: ${course.category}</p>
//         <p>Total Enrolled Students: ${course.totalEnrolled}</p>
//         <a href="../instructor-detail-page/instructor_course_details.html?courseId=${course.courseId}" class="view-course-btn">View Course</a>
//       </div>
//     `;
//   });
// }

function loadCourses(courseData) {
  return courseData.map((course) => {
    return `
      <div class="course-card">
        <h3>${course.name}</h3>
        <p>Category: ${course.category}</p>
        <p>Total Enrolled Students: ${course.totalEnrolled}</p>
        <a href="../instructor-detail-page/instructor_course_details.html?courseId=${course.courseId}&sectionId=${course.sectionId}" class="view-course-btn">View Course</a>
      </div>
    `;
  });
}

// text example delete later
// function loadCourses(courseData) {
//   return courseData.map((course) => {
//     return `
//       <div class="course-card">
//         <h3>${course.name}</h3>
//         <p>Category: ${course.category}</p>
//         <p>Total Enrolled Students: ${course.totalEnrolled}</p>
//         <a href="../instructor-detail-page/instructor_course_details.html" class="view-course-btn">View Course</a>
//       </div>
//     `;
//   });
// }

function handleSearch(courseData) {
  const searchBar = document.querySelector("#searchBar");
  const inputSearch = searchBar.value.toLowerCase();

  const searchedCourses = courseData.filter((course) => {
    const courseName = course.name.toLowerCase();
    const courseCategory = course.category.toLowerCase();
    return courseName.includes(inputSearch) || courseCategory.includes(inputSearch);
  });

  renderCourses(searchedCourses);
}

function renderCourses(courses) {
  const mainContent = document.querySelector(".container");
  mainContent.innerHTML = loadCourses(courses).join(" ");

  // const courseCards = document.querySelectorAll(".course-card");
  // courseCards.forEach((card) => {
  //   card.addEventListener("click", () => {
  //     const courseId = card.dataset.courseId;
  //     if (courseId) {
  //       // Redirect to instructor_course_details.html with courseId as a query parameter
  //       // window.location.href = `instructor_course_details.html?courseId=${courseId}`;
  //       window.location.href = instructor_course_details.html;
  //     }
  //   });
  // });

}


main();


/*

 
      <div class="course-card">
        <h3>Web Development</h3>
        <p>Category: Programming</p>
        <p>Enrolled Students: 30</p>
        <a href="#" class="view-course-btn">View Course</a>
      </div>

*/

/*
      <div class="course-card">
        <h3>${course.name} (${course.id})</h3>
        <p>Category: ${course.category}</p>
        <p>Total Enrolled Students: ${totalEnrolled}</p>
        <a href="#" class="view-course-btn">View Course</a>
      </div>
 */