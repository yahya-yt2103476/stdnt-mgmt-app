import studentService from "../../../services/student-service.js";
import courseService from "../../../services/course-service.js";
import sectionService from "../../../services/section-service.js";
import { createCourseCard } from "./components/course-card.js";
import { logoutCurrentUser } from "../../../services/logout.js";

const studentId = sessionStorage.getItem("authenticated_user_id");


const courseCategoriesEnum = {
  MATH: "Math",
  SCIENCE: "Science",
  COMPUTER_SCIENCE: "Computer Science",
  ENGINEERING: "Engineering",
  BUSINESS: "Business",
  ARTS: "Arts",
  HUMANITIES: "Humanities",
  SOCIAL_SCIENCES: "Social Sciences",
  HEALTH: "Health",
  OTHER: "Other",
};
const uniqueCategories = Object.values(courseCategoriesEnum).sort();



function normalizeCategory(category) {
  if (!category) return "";
  return String(category).toLowerCase().replace(/_/g, " ").trim();
}

function getDisplayCategory(categoryEnum) {
    return courseCategoriesEnum[categoryEnum] || categoryEnum; 
}

function isSemesterCurrent(semester) {

  if (!semester) return false;

  const match = semester.match(/([A-Z]+)(\d{4})/i);
  if (!match) return false;
  let term = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
  const year = parseInt(match[2]);

  const now = new Date();
  const semesterYear = year;

  const semesterRanges = {
    Fall: { start: new Date(semesterYear, 8, 1), end: new Date(semesterYear, 11, 31) }, // Sept 1 - Dec 31
    Spring: { start: new Date(semesterYear, 0, 1), end: new Date(semesterYear, 4, 31) }, // Jan 1 - May 31
    Summer: { start: new Date(semesterYear, 5, 1), end: new Date(semesterYear, 7, 31) }, // June 1 - Aug 31
  };

  const range = semesterRanges[term];
  if (!range) return false;

  return now >= range.start && now <= range.end;
}

function isSemesterFuture(semester) {
  if (!semester) return false;

  const match = semester.match(/([A-Z]+)(\d{4})/i);
  if (!match) return false;
  let term = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
  const year = parseInt(match[2]);

  const now = new Date();
  const semesterYear = year;

  if (semesterYear > now.getFullYear()) return true;

  if (semesterYear === now.getFullYear()) {
    const currentMonth = now.getMonth(); // 0-11
    const termStarts = { Spring: 0, Summer: 5, Fall: 8 }; // Month index
    return currentMonth < termStarts[term];
  }

  return false;
}

async function processCourses(student) {
  console.log("Processing courses for student:", student);
  const completedCourses = [];
  const inProgressCourses = [];
  const pendingCourses = [];
  const failedFetches = []; 

  const registrationDetails = student.registrations || [];
  console.log("Processing registrations:", registrationDetails);

  for (const registration of registrationDetails) {
    if (registration.status === 'CANCELLED' || registration.grade) {
        continue;
    }

    try {
      const sectionDetails = await sectionService.getSectionById(registration.sectionId);
      if (!sectionDetails) {
          console.warn(`Section ${registration.sectionId} not found.`);
          failedFetches.push(`Section ${registration.sectionId}`);
          continue;
      }

      const courseDetails = await courseService.getCourseById(sectionDetails.courseId);
       if (!courseDetails) {
          console.warn(`Course ${sectionDetails.courseId} not found.`);
          failedFetches.push(`Course ${sectionDetails.courseId}`);
          continue;
      }

      console.log("Fetched course details:", courseDetails);
      console.log("Fetched section details:", sectionDetails);

      const course = {
        name: courseDetails.name,
        grade: registration.grade || "Registered",
        semester: sectionDetails.semester || "Unknown",
        categoryEnum: courseDetails.category,
        categoryDisplay: getDisplayCategory(courseDetails.category),
        normalizedCategory: normalizeCategory(courseDetails.category),
      };

      if (sectionDetails.semester && isSemesterCurrent(sectionDetails.semester)) {
        course.status = "in progress";
        inProgressCourses.push(course);
      } else if (sectionDetails.semester && isSemesterFuture(sectionDetails.semester)) {
        course.status = "pending";
        pendingCourses.push(course);
      } else {
         course.status = "in progress";
         console.warn(`Course ${course.name} in section ${sectionDetails.id} has an undetermined registration status based on semester ${sectionDetails.semester}. Defaulting to 'in progress'.`);
         inProgressCourses.push(course);
      }

    } catch (error) {
      console.error(`Error processing registration ID ${registration.id}:`, error);
      failedFetches.push(`Registration ${registration.id}`);
    }
  }

  const completedCourseRecords = student.completedCourses || [];
  console.log("Processing completed courses:", completedCourseRecords);
  for (const completed of completedCourseRecords) {
    try {
      const courseDetails = await courseService.getCourseById(completed.courseId);
      if (!courseDetails) {
          console.warn(`Completed Course ${completed.courseId} not found.`);
          failedFetches.push(`Completed Course ${completed.courseId}`);
          continue;
      }
      console.log("Fetched completed course details:", courseDetails);

      completedCourses.push({
        name: courseDetails.name,
        status: "completed",
        grade: completed.grade || "N/A",
        semester: "N/A",
        categoryEnum: courseDetails.category,
        categoryDisplay: getDisplayCategory(courseDetails.category),
        normalizedCategory: normalizeCategory(courseDetails.category),
      });

    } catch (error) {
      console.error(`Error processing completed course ID ${completed.courseId}:`, error);
       failedFetches.push(`Completed Course ${completed.courseId}`);
    }
  }

   if (failedFetches.length > 0) {
        console.warn("Failed to fetch details for:", failedFetches.join(', '));
   }


  console.log("Final processed courses:", { completedCourses, inProgressCourses, pendingCourses });
  return { completedCourses, inProgressCourses, pendingCourses };
}

function renderCoursesByStatus(courses, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found`);
    return;
  }
  container.innerHTML = "";

  if (!courses || courses.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No courses in this category";
    emptyMessage.style.color = "#666";
    emptyMessage.style.textAlign = "center";
    container.appendChild(emptyMessage);
    return;
  }

  courses.forEach((course) => {
    const card = createCourseCard(
      course.name,
      course.status,
      course.grade,
      course.semester,
      course.categoryDisplay,
      course.normalizedCategory
    );
    container.appendChild(card);
  });
}




function setupSectionToggles() {
  // (Keep existing logic)
  const toggleButtons = document.querySelectorAll(".toggle-section");
  toggleButtons.forEach((button) => {
    button.setAttribute("aria-expanded", "true");
    button.addEventListener("click", () => {
      const sectionId = button.dataset.section;
      const coursesGrid = document.getElementById(`${sectionId}-courses`);
      if (coursesGrid) { // Check if element exists
          const isExpanded = button.getAttribute("aria-expanded") === "true";
          button.setAttribute("aria-expanded", !isExpanded);
          coursesGrid.classList.toggle("collapsed");
      } else {
          console.warn(`Courses grid not found for section: ${sectionId}-courses`);
      }
    });
  });
}

function filterCourses(searchTerm, category) {
  console.log("Filtering with:", { searchTerm, category });
  const cards = document.querySelectorAll(".course-card");
  const normalizedFilterCategory = category.toLowerCase();

  console.log("Normalized filter category:", normalizedFilterCategory);

  cards.forEach((card) => {
    const courseName = card.querySelector(".course-name")?.textContent.toLowerCase() || "";
    const cardNormalizedCategory = card.dataset.category || "";

    console.log("Card normalized category:", cardNormalizedCategory);

    const matchesSearch = courseName.includes(searchTerm.toLowerCase());
    const matchesCategory =
      normalizedFilterCategory === "all" ||
      cardNormalizedCategory === normalizedFilterCategory;

    console.log(`Card: ${courseName}, Category: ${cardNormalizedCategory}, Search Term: ${searchTerm}, Filter Category: ${normalizedFilterCategory}`, { matchesSearch, matchesCategory });

    card.style.display = matchesSearch && matchesCategory ? "block" : "none";
  });

  ['completed', 'in-progress', 'pending'].forEach(status => {
    const container = document.getElementById(`${status}-courses`);
    const section = container?.closest('.course-section');
    if (container && section) {
        const visibleCards = container.querySelectorAll('.course-card[style*="display: block"]');
        const allHidden = visibleCards.length === 0 && container.children.length > 0; // Check if cards exist but none are visible
        const emptyMessage = container.querySelector('p');

        if (allHidden && !emptyMessage) {
             if (!container.querySelector('.no-filter-match')) {
                 const noMatchMsg = document.createElement('p');
                 noMatchMsg.textContent = 'No courses match the current filter in this section.';
                 noMatchMsg.classList.add('no-filter-match');
                 noMatchMsg.style.color = '#666';
                 noMatchMsg.style.textAlign = 'center';
                 container.appendChild(noMatchMsg);
             }
        } else {
            const noMatchMsg = container.querySelector('.no-filter-match');
            if (noMatchMsg) {
                noMatchMsg.remove();
            }
        }
    }
  });
}


async function init() {
  if (!studentId) {
    console.error("Student ID not found in session storage. Redirecting to login.");
    window.location.href = "/pages/login/views/login_page.html";
    return;
  }

  try {
    
    const categoryFilter = document.getElementById("category-filter");
    if (categoryFilter) {
      categoryFilter.innerHTML = `<option value="all" selected>All</option>`; 
      uniqueCategories.forEach(categoryDisplay => {
        const option = document.createElement('option');
        option.value = normalizeCategory(categoryDisplay);
        option.textContent = categoryDisplay;
        categoryFilter.appendChild(option);
      });
       console.log("Populated categories:", uniqueCategories);
    } else {
        console.warn("Category filter dropdown not found.");
    }


    const student = await studentService.getStudentById(studentId);
    console.log("Fetched student:", student);
    if (!student) {
      console.error("No student data found for ID:", studentId);
      
       document.getElementById('learning-path-container').innerHTML = '<p class="error">Could not load student data. Please try again later.</p>';
      return;
    }

    
    const { completedCourses, inProgressCourses, pendingCourses } = await processCourses(student);

    renderCoursesByStatus(completedCourses, "completed-courses");
    renderCoursesByStatus(inProgressCourses, "in-progress-courses");
    renderCoursesByStatus(pendingCourses, "pending-courses");

    setupSectionToggles();

    const searchInput = document.getElementById("course-search");
    if (searchInput && categoryFilter) {
      searchInput.addEventListener("input", () => {
        filterCourses(searchInput.value, categoryFilter.value);
      });
      categoryFilter.addEventListener("change", () => {
        filterCourses(searchInput.value, categoryFilter.value);
      });
    } else {
         console.warn("Search input or category filter not found. Filtering disabled.");
    }

  } catch (error) {
    console.error("Error initializing learning path:", error);
     document.getElementById('learning-path-container').innerHTML = `<p class="error">An error occurred while loading the learning path: ${error.message}. Please try again later.</p>`;
  }
}


document.addEventListener("DOMContentLoaded", init);

const logoutbtn = document.querySelector("#logOutBtn");
if (logoutbtn) {
    logoutbtn.addEventListener("click", logoutCurrentUser);
} else {
    console.warn("Logout button not found.");
}
