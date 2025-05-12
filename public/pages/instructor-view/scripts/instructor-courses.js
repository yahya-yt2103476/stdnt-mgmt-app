import InstructorService from "../../../services/instructor-service.js";
import CourseService from "../../../services/course-service.js";
import SectionService from "../../../services/section-service.js";
import { logoutCurrentUser as logoutCurrentUser } from "../../../services/logout.js";


let instructor_Id = Number(sessionStorage.getItem('instructor_id'));
var currentInstructor = await InstructorService.getInstructorById(instructor_Id);

console.log("I am supposed to be instructor_Id: ",instructor_Id);

let instructorName = currentInstructor.name.replace(/Dr\. ?/i, "").trim();
console.log("Name: ",instructorName);

let allCourses = await CourseService.getAllCourses();
let allSections = await SectionService.getAllSections();

let instructorSections = () => {
  return allSections.filter(
    (section) => {
      return section.instructorName && typeof section.instructorName === 'string' &&
             section.instructorName.trim() === instructorName;
    }
  );
};
let instructorCourses = () => {
  const instructorSectionCourseIds = instructorSections().map((section) => section.courseId);
  return allCourses.filter((course) => instructorSectionCourseIds.includes(course.id)
  );
};

function main() {
  const backButton = document.querySelector("#backBtn");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.history.back();
    });
  }

  const mainContent = document.querySelector(".coursesContainer");
  const instructorCourseList = instructorCourses();
  const instructorSectionList = instructorSections();

  let neededInfo = filterIntoOne(instructorCourseList, instructorSectionList);

  if (neededInfo && neededInfo.length > 0) {
    console.log("Smth i wanna see");
    console.log(neededInfo[0].totalEnrolled);

    mainContent.innerHTML = loadCourses(
      neededInfo,
      instructorCourseList,
      instructorSectionList
    ).join(" ");
  } else {
    mainContent.innerHTML = "<p>No courses found for this instructor.</p>";
    console.log("No courses/sections found for the instructor after filtering.");
  }

  const searchBar = document.querySelector("#searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", () =>
      handleSearch(neededInfo, instructorCourseList, instructorSectionList)
    );
  }
}

function filterIntoOne(corList, secList) {
  const newList = [];

  for (const course of corList) {
    const matchingSections = secList.filter(
      (section) =>
        section.courseId === course.id &&
        section.instructorName.trim() === instructorName
    );

    if (matchingSections.length > 0) {
      matchingSections.forEach((section) => {
        newList.push({
          name: course.name,
          courseId: course.id,
          sectionId: section.id,
          shortName: course.shortName,
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
    const matchingCourse = instructorCourses.find(
      (ic) => ic.name == course.name
    );
    const matchingSection = instructorSections.find(
      (is) => is.courseId == matchingCourse.id
    );
    return `
      <div class="course-card">
        <div class="card-header">
          <h4 class="courseId">${course.shortName}</h4>
          <h4 class="courseId">${course.courseId}</h4>
        </div>
        <div class="card-body">
          <div class="card-section">
            <p class="category">${course.category}</p>
            <p><b>Course Name: </b>${course.name}</p>
            <p><b>Section ID: </b>${course.sectionId}</p>
            <p><b>Total Enrolled Students: </b>${course.totalEnrolled}</p>
          </div>
          <div class="card-footer">
            <a href="../views/instructor-courses-details.html?courseId=${matchingCourse.id}&sectionId=${course.sectionId}&instructorName=${instructorName}&courseShortName=${course.shortName}" class="view-course-btn">View Course</a>
          </div>
        </div>
      </div>
    `;
  });
}

function handleSearch(courseData, instructorCourses, instructorSections) {
  const searchBar = document.querySelector("#searchBar");
  const inputSearch = searchBar.value.toLowerCase();

  const searchedCourses = courseData.filter((course) => {
    const courseName = course.name.toLowerCase();
    const courseCategory = course.category.toLowerCase();
    return (
      courseName.includes(inputSearch) || courseCategory.includes(inputSearch)
    );
  });

  renderCourses(searchedCourses, instructorCourses, instructorSections);
}

function renderCourses(courses, instructorCourses, instructorSections) {
  const mainContent = document.querySelector(".coursesContainer");
  mainContent.innerHTML = loadCourses(
    courses,
    instructorCourses,
    instructorSections
  ).join(" ");
}

main();

const logoutbtn = document.querySelector("#logOutBtn");
logoutbtn.addEventListener("click", logoutCurrentUser);