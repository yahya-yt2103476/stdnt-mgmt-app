//hard set variable
// let instructor_Id = "I001";
// let instructorName = "Dr. Khalid Al-Naimi";
// let instructorName = 'Lucas Adams'; // another test value
 // this value should be sent from the login page delete later testing values
//remove this variable later


let instructor_Id = sessionStorage.getItem('authenticated_user_id');
var instructorName;

async function initializeInstructorName() {
  if (instructor_Id) {
    instructorName = await getInstructorName(instructor_Id);
    main(instructorName);// main call
    console.log(instructorName);
  } else {
    console.error("Instructor ID not found in URL.");
  }
}

async function getInstructorName(instructorId) {
  const path = "http://127.0.0.1:5500/database/instructors.json";
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const instructors = await response.json(); // Get the object


    const instructor = instructors.find(inst => inst.id == parseInt(instructorId));
    console.log(instructor);
    
    if (instructor) {
      return instructor.name;
    } else {
      console.error(`Instructor with ID ${instructorId} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return null;
  }
}

initializeInstructorName();
console.log("Instructor Name:", instructorName);// it evaluates as undefined otherwise

function main(instructorName){
  console.log("Instructor Name:", instructorName);
  const backButton = document.querySelector("#backBtn");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.history.back();
        });
    }

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

  console.log(instructorSections);
  
  let neededInfo = filterIntoOne(instructorCourses,instructorSections)

  mainContent.innerHTML = loadCourses(neededInfo,instructorCourses,instructorSections).join(" ");

  const searchBar = document.querySelector("#searchBar");
  searchBar.addEventListener("input", () => handleSearch(neededInfo,instructorCourses,instructorSections));
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

function loadCourses(courseData, instructorCourses, instructorSections) {
  return courseData.map((course) => {
    const matchingCourse = instructorCourses.find((ic) => ic.name === course.name)
    const matchingSection = instructorSections.find((is) => is.courseId === matchingCourse.id);
    return `
      <div class="course-card">
        <h3>${course.name}</h3>
        <p>Category: ${course.category}</p>
        <p>Total Enrolled Students: ${course.totalEnrolled}</p>
        <a href="../instructor-detail-page/instructor_course_details.html?courseId=${matchingCourse.id}&sectionId=${matchingSection.id}" class="view-course-btn">View Course</a>
      </div>
    `;
  });
}


function handleSearch(courseData,instructorCourses,instructorSections) {
  const searchBar = document.querySelector("#searchBar");
  const inputSearch = searchBar.value.toLowerCase();

  const searchedCourses = courseData.filter((course) => {
    const courseName = course.name.toLowerCase();
    const courseCategory = course.category.toLowerCase();
    return courseName.includes(inputSearch) || courseCategory.includes(inputSearch);
  });

  renderCourses(searchedCourses,instructorCourses,instructorSections);
}

function renderCourses(courses,instructorCourses,instructorSections) {
  const mainContent = document.querySelector(".container");
  mainContent.innerHTML = loadCourses(courses,instructorCourses, instructorSections).join(" ");
}


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