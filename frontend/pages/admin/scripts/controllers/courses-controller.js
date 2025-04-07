import { fetchAllCourses, deleteCourseById } from '../../../../services/course-service.js';
import { fetchSectionsByCourseId } from '../../../../services/section-service.js';
import { courseCard } from '../components/course-card.js';
import { sectionCard } from '../components/section-card.js';

let courses = [];
let coursesContainer;
let loadingIndicator;
let listViewBtn;
let calendarViewBtn;
let addCourseBtn;

async function loadCourses() {
  const coursesData = await fetchAllCourses();
  
  // Process courses one by one
  courses = [];
  for (const course of coursesData) {
    const sections = await fetchSectionsByCourseId(course.id);
    courses.push({
      ...course,
      sections: Array.isArray(sections) ? sections : []
    });
  }
  
  loadingIndicator.classList.add('hidden');
}

function clearCoursesContainer() {
  while (coursesContainer.firstChild) {
    coursesContainer.removeChild(coursesContainer.firstChild);
  }
  
  if (courses.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No courses available.';
    coursesContainer.appendChild(emptyMessage);
    return true;
  }
  return false;
}

function renderListView() {
  if (clearCoursesContainer()) return;
  
  coursesContainer.className = 'list-view';
  
  courses.map(course => {
    const card = courseCard(course, {
      onView: () => navigateToCourseDetails(course.id),
      onEdit: () => window.location.href = `course-details-view.html?id=${course.id}&mode=edit`,
      onDelete: () => deleteCourseById(course.id).then(() => window.location.reload())
    });
    
    coursesContainer.appendChild(card);
  });
}

function renderCalendarView() {
  if (clearCoursesContainer()) return;
  
  coursesContainer.className = 'calendar-view';
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  days.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.textContent = day;
    dayHeader.className = 'day-header';
    coursesContainer.appendChild(dayHeader);
  });
  
  // Create day columns
  const dayColumns = {};
  days.forEach(day => {
    const dayColumn = document.createElement('div');
    dayColumn.className = 'day-column';
    coursesContainer.appendChild(dayColumn);
    dayColumns[day] = dayColumn;
  });
  
  // Distribute sections by day
  courses.forEach(course => {
    if (course.sections && course.sections.length > 0) {
      course.sections.forEach(section => {
        if (section.Days && section.Days.length > 0) {
          section.Days.forEach(day => {
            if (dayColumns[day]) {
              const sectionElement = sectionCard(
                section, 
                course.shortName || course.name,
                () => navigateToSectionDetails(section.id, course.id)
              );
              dayColumns[day].appendChild(sectionElement);
            }
          });
        }
      });
    }
  });
}

// Navigate to course details page
function navigateToCourseDetails(courseId) {
  window.location.href = `course-details-view.html?id=${courseId}`;
}

// Navigate to section details page
function navigateToSectionDetails(sectionId, courseId) {
  window.location.href = `section-details-view.html?id=${sectionId}&courseId=${courseId}`;
}

// Navigate to add course page
function navigateToAddCourse() {
  window.location.href = 'course-details-view.html?mode=add';
}

async function init() {
  coursesContainer = document.getElementById('coursesContainer');
  loadingIndicator = document.getElementById('loadingIndicator');
  listViewBtn = document.getElementById('listViewBtn');
  calendarViewBtn = document.getElementById('calendarViewBtn');
  addCourseBtn = document.getElementById('addCourseBtn');
  
  listViewBtn.addEventListener('click', renderListView);
  calendarViewBtn.addEventListener('click', renderCalendarView);
  addCourseBtn.addEventListener('click', navigateToAddCourse);
  
  try {
    await loadCourses();
    renderListView(); // Default to list view
  } catch (error) {
    console.error('Failed to initialize courses view:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);
