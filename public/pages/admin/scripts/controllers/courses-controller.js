import CourseService from '../../../../services/course-service.js';
import SectionService from '../../../../services/section-service.js';
import InstructorService from '../../../../services/instructor-service.js';
import PublishedCoursesService from '../../../../services/published-courses-service.js';
import { logoutCurrentUser } from '../../../../services/logout.js';
import { convertToAmPmRange } from '../../../../services/format-time.js';

let coursesContainer;
let loadingIndicator;
let addCourseBtn;
let listViewBtn;
let calendarViewBtn;

let allFetchedCourses = [];

function isSemesterFuture(semester) {
    if (!semester) return false;
    
    const now = new Date();
    const [term, year] = semester.split(' ');
    const semesterYear = parseInt(year);
    
    if (semesterYear > now.getFullYear()) return true;
    
    if (semesterYear === now.getFullYear()) {
        const currentMonth = now.getMonth();
        const termStarts = {
            'Spring': 0,  
            'Summer': 5,  
            'Fall': 8     
        };
        return currentMonth < termStarts[term];
    }
    
    return false;
}

function isSemesterCurrent(semester) {
    if (!semester) return false;
    
    const now = new Date();
    const [term, year] = semester.split(' ');
    const semesterYear = parseInt(year);
    
    const semesterRanges = {
        'Fall': {
            start: new Date(semesterYear, 8, 1),
            end: new Date(semesterYear, 11, 31)
        },
        'Spring': {
            start: new Date(semesterYear, 0, 1),
            end: new Date(semesterYear, 4, 31)
        },
        'Summer': {
            start: new Date(semesterYear, 5, 1),
            end: new Date(semesterYear, 7, 31)
        }
    };
    
    const range = semesterRanges[term];
    if (!range) return false;
    
    return now >= range.start && now <= range.end;
}

async function loadCourses() {
    console.log('Courses-controller: Loading all courses (simplified view)...');
    if (!coursesContainer) {
        console.error("coursesContainer element not found in loadCourses.");
        if (loadingIndicator) loadingIndicator.textContent = 'Error: UI element missing.';
        return;
    }
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.textContent = 'Loading courses...';
    }

    try {
        const allCoursesData = await CourseService.getAllCourses();
        
        if (!Array.isArray(allCoursesData)) {
            console.error('Courses data is not an array:', allCoursesData);
            if (loadingIndicator) loadingIndicator.textContent = 'Error: Course data format incorrect.';
            coursesContainer.innerHTML = '<p class="error-message">Error loading course data.</p>';
            return;
        }

        if (allCoursesData.length === 0) {
            coursesContainer.innerHTML = '<p class="no-courses-msg">No courses found in the system.</p>';
        } else {
            const courseCardsHtml = await Promise.all(
                allCoursesData.map(course => createSimplifiedCourseCard(course))
            );
            coursesContainer.innerHTML = `<div class="courses-list">${courseCardsHtml.join('')}</div>`;
        }
        
        addButtonEventListeners(); 

    } catch (error) {
        console.error('Error loading courses in courses-controller:', error);
        coursesContainer.innerHTML = `<p class="error-message">Failed to load courses: ${error.message}</p>`;
    } finally {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
}

async function createSimplifiedCourseCard(course) {
    const addNewSectionButton = `<button class="add-new-section-btn" data-course-id="${course.id}">+ Add Section</button>`;

    return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-header">
                <h4>${course.name} (${course.shortName || 'N/A'})</h4>
                <span class="course-id">ID: ${course.id}</span>
                ${addNewSectionButton}
            </div>
            <div class="course-info">
                <p class="category"><strong>Category:</strong> ${course.category?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}</p>
                <p class="prerequisites"><strong>Prerequisites:</strong> ${course.prerequisites?.map(prereqId => {
                    return `ID ${prereqId}`;    
                }).join(', ') || 'None'}</p>
                <p><strong>Credit Hours:</strong> ${course.creditHours || 'N/A'}</p>
            </div>
            <div class="course-actions">
                <button class="view-btn" data-action="view" data-course-id="${course.id}">View Details & Sections</button>
                <button class="edit-btn" data-action="edit" data-course-id="${course.id}">Edit Course</button>
                <button class="delete-btn" data-action="delete" data-course-id="${course.id}">Delete Course</button>
            </div>
        </div>
    `;
}

async function navigateToCourseDetails(courseId) {
    try {
        const course = await CourseService.getCourseById(courseId);
        
        if (!course) {
            console.error('Course not found for details navigation:', courseId);
            alert('Course not found');
            return;
        }

        sessionStorage.setItem('currentCourse', JSON.stringify({
            id: course.id,
            name: course.name || 'Untitled Course',
            description: course.description || 'No description available',
            creditHours: course.creditHours || 'Not specified',
            category: course.category || 'Uncategorized',
            prerequisites: course.prerequisites || []
        }));
        window.location.href = `course-details-view.html?id=${course.id}`;
    } catch (error) {
        console.error('Error navigating to course details:', error);
        alert('Failed to load course details. Please try again.');
    }
}

function navigateToSectionDetails(sectionId, courseId) {
    if (!courseId) {
        console.error("Course ID is required to navigate to section details.");
        alert("Cannot navigate: Course context is missing.");
        return;
    }
    window.location.href = `section-details-view.html?id=${sectionId}&courseId=${courseId}`;
}

function navigateToAddCourse() {
    window.location.href = 'course-details-view.html?mode=add';
}

function addButtonEventListeners() {
    document.querySelectorAll('.course-actions button').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            const action = e.target.dataset.action;
            const courseId = e.target.dataset.courseId;

            if (!courseId) {
                console.error('No course ID found on action button');
                return;
            }

            switch(action) {
                case 'view':
                    await navigateToCourseDetails(courseId);
                    break;
                case 'edit':
                    window.location.href = `course-details-view.html?id=${courseId}&mode=edit`;
                    break;
                case 'delete':
                    if (confirm('Are you sure you want to delete this course and all its associated sections?')) {
                        try {
                            await CourseService.deleteCourse(courseId);
                            alert('Course deleted successfully.');
                            loadCourses();
                        } catch (error) {
                            console.error('Failed to delete course:', error);
                            alert(`Failed to delete course: ${error.message}`);
                        }
                    }
                    break;
            }
        });
    });

    document.querySelectorAll('.add-new-section-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const courseId = e.target.dataset.courseId;
            if (courseId) {
                window.location.href = `section-details-view.html?mode=add&courseId=${courseId}`;
            } else {
                console.error("No course ID found for adding section.");
            }
        });
    });
}

async function init() {
    coursesContainer = document.getElementById('coursesContainer');
    loadingIndicator = document.getElementById('loadingIndicator');
    addCourseBtn = document.getElementById('addCourseBtn');
    listViewBtn = document.getElementById('listViewBtn');
    calendarViewBtn = document.getElementById('calendarViewBtn');
    
    if (!coursesContainer || !listViewBtn || !calendarViewBtn) {
        console.error('One or more critical UI elements not found. Cannot initialize courses view.');
        if (loadingIndicator) loadingIndicator.textContent = 'Error: UI setup incorrect.';
        return;
    }

    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', navigateToAddCourse);
    }

    listViewBtn.addEventListener('click', () => {
        calendarViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
        renderListView();
    });

    calendarViewBtn.addEventListener('click', () => {
        listViewBtn.classList.remove('active');
        calendarViewBtn.classList.add('active');
        renderCalendarView();
    });

    await renderListView();
}

document.addEventListener('DOMContentLoaded', init);

const logoutbtn = document.querySelector("#logOutBtn"); 
if (logoutbtn) {
    logoutbtn.addEventListener("click", logoutCurrentUser);
}

async function renderListView() {
    console.log('Courses-controller: Rendering List View...');
    if (!coursesContainer) {
        console.error("coursesContainer element not found in renderListView.");
        if (loadingIndicator) loadingIndicator.textContent = 'Error: UI element missing.';
        return;
    }
    coursesContainer.className = 'courses-list-view';
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.textContent = 'Loading courses...';
    }

    try {
        const coursesData = await CourseService.getAllCourses();
        allFetchedCourses = [];

        for (const course of coursesData) {
            const sections = await SectionService.getSectionsByCourse(course.id);
            allFetchedCourses.push({...course, sections: sections || []});
        }
        
        if (!Array.isArray(allFetchedCourses) || allFetchedCourses.length === 0) {
            coursesContainer.innerHTML = '<p class="no-courses-msg">No courses found in the system.</p>';
        } else {
            const courseCardsHtml = await Promise.all(
                allFetchedCourses.map(course => createSimplifiedCourseCard(course))
            );
            coursesContainer.innerHTML = `<div class="courses-list">${courseCardsHtml.join('')}</div>`;
        }
        
        addButtonEventListeners();

    } catch (error) {
        console.error('Error loading courses for list view:', error);
        coursesContainer.innerHTML = `<p class="error-message">Failed to load courses: ${error.message}</p>`;
    } finally {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
}

async function renderCalendarView() {
    console.log('Courses-controller: Rendering Calendar View...');
    if (!coursesContainer) {
        console.error("coursesContainer element not found in renderCalendarView.");
        if (loadingIndicator) loadingIndicator.textContent = 'Error: UI element missing.';
        return;
    }
    coursesContainer.className = 'calendar-view-container';
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.textContent = 'Loading schedule...';
    }
    coursesContainer.innerHTML = '';

    try {
        if (allFetchedCourses.length === 0) {
            const coursesData = await CourseService.getAllCourses();
            allFetchedCourses = [];
            for (const course of coursesData) {
                const sections = await SectionService.getSectionsByCourse(course.id);
                allFetchedCourses.push({...course, sections: sections || []});
            }
        }

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';

        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const dayCells = {};
        daysOfWeek.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell';
            calendarGrid.appendChild(dayCell);
            dayCells[day] = dayCell;
        });

        let sectionsScheduled = 0;
        allFetchedCourses.forEach(course => {
            if (course.sections && course.sections.length > 0) {
                course.sections.forEach(section => {
                    if (section.status === 'APPROVED' && isSemesterCurrent(section.semester)) {
                        const sectionDays = section.sectionDays?.map(sd => sd.day) || [];
                        sectionDays.forEach(day => {
                            if (dayCells[day]) {
                                const sectionCardEl = createCalendarSectionCard(section, course);
                                dayCells[day].appendChild(sectionCardEl);
                                sectionsScheduled++;
                            }
                        });
                    }
                });
            }
        });
        if (sectionsScheduled === 0) {
            calendarGrid.innerHTML = '<p class="no-courses-msg">No sections currently in progress for this week.</p>';
        }
        
        coursesContainer.appendChild(calendarGrid);

    } catch (error) {
        console.error('Error rendering calendar view:', error);
        coursesContainer.innerHTML = `<p class="error-message">Failed to load schedule: ${error.message}</p>`;
    } finally {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
}

function createCalendarSectionCard(section, course) {
    const sectionCard = document.createElement('div');
    sectionCard.className = 'calendar-section-card'; 
    sectionCard.dataset.sectionId = section.id;
    sectionCard.dataset.courseId = course.id;

    const timeString = section.Time ? convertToAmPmRange(section.Time) : 'N/A';
    const instructorName = section.instructorName || (section.instructorId ? `Instructor ID: ${section.instructorId}` : 'TBD');
    const location = section.location || 'TBD';

    sectionCard.innerHTML = `
        <div class="course-name">${course.shortName || course.name} (Sec: ${section.id})</div>
        <div class="instructor-name">Instr: ${instructorName}</div>
        <div class="time">Time: ${timeString}</div>
        <div class="location">Loc: ${location}</div>
        <div class="status">Status: ${section.status}</div>
    `;

    sectionCard.addEventListener('click', () => {
        navigateToSectionDetails(section.id, course.id);
    });

    return sectionCard;
}