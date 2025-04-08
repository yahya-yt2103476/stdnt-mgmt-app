import {fetchInstructorById} from '../../../services/instructor-service.js'
import {fetchAllCourses} from '../../../services/course-service.js'
import {fetchAllSections} from '../../../services/section-service.js'

// test value for instructor ID
let instructor_Id = 2

// let instructor_Id = sessionStorage.getItem('authenticated_user_id');
var currentInstructor = await fetchInstructorById(instructor_Id);
let instructorName = currentInstructor.name;
let allCourses = await fetchAllCourses();
let allSections = await fetchAllSections();
let instructorSections = () => {
  return allSections.filter(section => section.instructorName === instructorName);
};
let instructorCourses = () => {
  const instructorSectionCourseIds = instructorSections().map(section => section.courseId);
  return allCourses.filter(course => instructorSectionCourseIds.includes(course.id));
};

//delete TESTING
console.log(instructorSections());
console.log(instructorCourses());
console.log(currentInstructor); 
//delete

function main(){

  const backButton = document.querySelector("#backBtn");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.history.back();
        });
    }

  const mainContent = document.querySelector(".container");
  let neededInfo = filterIntoOne(instructorCourses(),instructorSections())
  mainContent.innerHTML = loadCourses(neededInfo,instructorCourses(),instructorSections()).join(" ");

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