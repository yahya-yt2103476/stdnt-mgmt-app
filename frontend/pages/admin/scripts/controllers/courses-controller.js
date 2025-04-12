import { fetchAllCourses, deleteCourseById } from '../../../../services/course-service.js';
import { fetchSectionsByCourseId, createSection, deleteSectionById } from '../../../../services/section-service.js';
import { courseCard } from '../components/course-card.js';
import { sectionCard } from '../components/section-card.js';
import { fetchAllInstructors } from '../../../../services/instructor-service.js';
import { fetchAllPublishedCourses } from '../../../../services/published-courses-service.js';
import { createSectionCard } from "../controllers/publish-courses-controller.js";

let courses = [];
let coursesContainer;
let loadingIndicator;
let addCourseBtn;
let calendarViewBtn;
let hybridViewBtn;

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
    console.log('Loading courses...');
    try {
  const coursesData = await fetchAllCourses();
        console.log('Fetched courses data:', coursesData); 
        
        if (!Array.isArray(coursesData)) {
            console.error('Courses data is not an array:', coursesData);
            return;
        }
        
        courses = coursesData;
        
        let coursesWithActiveSections = [];
        let coursesWithoutActiveSections = [];
      
  for (const course of coursesData) {
    const sections = await fetchSectionsByCourseId(course.id);
            course.sections = sections;
            
            if (Array.isArray(sections)) {
                
                const activeSections = sections.filter(section => {
                    const isInProgress = isSemesterCurrent(section.semester);
                    const isPendingRegistration = isSemesterFuture(section.semester) || 
                        (isSemesterCurrent(section.semester) && !section.isRegistrationClosed);
                    
                    console.log(`Section ${section.id} status:`, {
                        semester: section.semester,
                        isInProgress,
                        isPendingRegistration
                    });

                    return isInProgress || isPendingRegistration;
                });
                
                if (activeSections.length > 0) {
                    console.log(`Course ${course.id} has active sections:`, activeSections);
                    coursesWithActiveSections.push({
                        ...course,
                        sections: activeSections
                    });
                } else {
                    console.log(`Course ${course.id} has no active sections`);
                    coursesWithoutActiveSections.push({
      ...course,
                        sections: []
                    });
                }
            }
        }
        
        console.log('Courses categorized:', {
            withActiveSections: coursesWithActiveSections,
            withoutActiveSections: coursesWithoutActiveSections
        });

        renderHybridView(coursesWithActiveSections, coursesWithoutActiveSections);
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function addDropdownHandlers() {
    document.querySelectorAll('.dropdown-header').forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.dataset.target;
            const targetList = document.getElementById(targetId);
            const toggleIcon = header.querySelector('.toggle-icon');
            
            targetList.classList.toggle('collapsed');
            toggleIcon.textContent = targetList.classList.contains('collapsed') ? '▶' : '▼';
        });
    });
}

async function renderHybridView(activeCourses, inactiveCourses) {
    const container = document.getElementById('coursesContainer');
    if (!container) {
        console.error('Courses container not found');
        return;
    }
    const activeCoursesCards = await Promise.all(
        activeCourses.map(course => createCourseCardWithButtons(course, true))
    );
    
    const inactiveCoursesCards = await Promise.all(
        inactiveCourses.map(course => createCourseCardWithButtons(course, false))
    );
    container.innerHTML = `
        <div class="courses-group active-courses">
            <div class="dropdown-header" data-target="active-courses-list">
                <h3>Active Courses (In Progress & Open Registration) (${activeCoursesCards.length})</h3>
                <span class="toggle-icon">▼</span>
            </div>
            <div class="courses-list" id="active-courses-list">
                ${activeCoursesCards.join('')}
            </div>
        </div>
        
        <div class="courses-group inactive-courses">
            <div class="dropdown-header" data-target="inactive-courses-list">
                <h3>Inactive Courses (${inactiveCoursesCards.length})</h3>
                <span class="toggle-icon">▼</span>
            </div>
            <div class="courses-list" id="inactive-courses-list">
                ${inactiveCoursesCards.join('')}
            </div>
        </div>
    `;

    addSectionStatusBadges();
    addDropdownHandlers();
    addButtonEventListeners();
}
async function isAvailableCourseForSection(courseId) {
    try {
        const publishedCourses = await fetchAllPublishedCourses();
        const instructors = await fetchAllInstructors();
        
        // Check if course is published for next semester
        const publishedCourse = publishedCourses.find(pc => pc.courseId === courseId);
        if (!publishedCourse) return false;
        
        // Check if deadline has passed
        const isDeadlinePassed = new Date() > new Date(publishedCourse.submissionDeadline);
        if (!isDeadlinePassed) return false;
        
        // Check if instructors list is not empty
        return instructors && instructors.length > 0;
    } catch (error) {
        console.error('Error checking course availability:', error);
        return false;
    }
}

async function  createCourseCardWithButtons(course, hasActiveSections) {
    console.log('Creating card for course:', course); 

    const addSectionsButton = await isAvailableCourseForSection(course.id) 
        ? `<button class="add-sections-btn" data-course-id="${course.id}">Add Sections</button>` 
        : '';
    return `
        <div class="course-card ${hasActiveSections ? 'active' : 'inactive'}" data-course-id="${course.id}">
            <div class="course-header">
                <h4>${course.name}</h4>
                <span class="course-id">${course.id}</span>
                ${addSectionsButton}
            </div>
            <div class="course-info">
                <p class="category">${course.category.charAt(0).toUpperCase() + course.category.slice(1)}</p>
                <p class="prerequisites">Prerequisites: ${course.prerequisites?.join(', ') || 'None'}</p>
            </div>
            ${hasActiveSections ? renderSections(course.sections) : ''}
            <div class="course-actions">
                <button class="view-btn" data-action="view" data-course-id="${course.id}">View</button>
                <button class="edit-btn" data-action="edit" data-course-id="${course.id}">Edit</button>
                <button class="delete-btn" data-action="delete" data-course-id="${course.id}">Delete</button>
            </div>
        </div>
    `;
}

function renderSections(sections) {
    if (!sections || sections.length === 0) return '';
    
    return `
        <div class="sections-list">
            <h5>Active Sections:</h5>
            ${sections.map(section => `
                <div class="section-item" data-section-id="${section.id}">
                    <div class="section-info">
                        <span class="section-id">Section ${section.id}</span>
                        <span class="semester">${section.semester}</span>
                        <span class="instructor">${section.instructorName}</span>
                        <span class="status-badge ${getSectionStatusClass(section)}">
                            ${getSectionStatus(section)}
                        </span>
                    </div>
                    <div class="section-actions">
                        <button class="view-btn" data-action="view" data-section-id="${section.id}">View</button>
                        <button class="delete-btn" data-action="delete" data-section-id="${section.id}">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function getSectionStatus(section) {
    if (isSemesterCurrent(section.semester)) {
        return 'In Progress';
    }
    return 'Open for Registration';
}

function getSectionStatusClass(section) {
    if (isSemesterCurrent(section.semester)) {
        return 'in-progress';
    }
    return 'open-registration';
}

function addSectionStatusBadges() {
    const styles = `
        .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        .status-badge.in-progress {
            background-color: #4CAF50;
            color: white;
        }
        .status-badge.open-registration {
            background-color: #2196F3;
            color: white;
        }
    `;
    
    if (!document.querySelector('#status-badge-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'status-badge-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
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
  
    const wrapper = document.createElement('div');
    wrapper.className = 'courses-vertical-layout';
    
    courses.forEach(course => {
    const card = courseCard(course, {
      onView: () => navigateToCourseDetails(course.id),
      onEdit: () => window.location.href = `course-details-view.html?id=${course.id}&mode=edit`,
      onDelete: () => deleteCourseById(course.id).then(() => window.location.reload())
    });
    
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'course-wrapper';
        cardWrapper.appendChild(card);
        wrapper.appendChild(cardWrapper);
  });
    
    coursesContainer.appendChild(wrapper);
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
  
  const dayColumns = {};
  days.forEach(day => {
    const dayColumn = document.createElement('div');
    dayColumn.className = 'day-column';
    coursesContainer.appendChild(dayColumn);
    dayColumns[day] = dayColumn;
  });
  
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

async function navigateToCourseDetails(courseId) {
    try {
        console.log('Fetching course details for:', courseId);
        const allCourses = await fetchAllCourses();
        console.log('All courses:', allCourses); 
        
        const numericCourseId = parseInt(courseId);
        const course = allCourses.find(c => c.id === numericCourseId || c.id === courseId);
        
        if (!course) {
            console.error('Course not found:', courseId);
            console.log('Available course IDs:', allCourses.map(c => c.id)); // Debug log
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
        console.log('Full error:', error); // Debug log
        alert('Failed to load course details. Please try again.');
    }
}

function navigateToSectionDetails(sectionId, courseId) {
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
            console.log('Button clicked:', {
                action,
                courseId,
                buttonElement: e.target,
                dataset: e.target.dataset
            });

            if (!courseId) {
                console.error('No course ID found on button');
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
                    if (confirm('Are you sure you want to delete this course?')) {
                        try {
                            await deleteCourseById(courseId);
                            window.location.reload();
                        } catch (error) {
                            console.error('Failed to delete course:', error);
                            alert('Failed to delete course. Please try again.');
                        }
                    }
                    break;
            }
        });
    });

    document.querySelectorAll('.section-actions button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.target.dataset.action;
            const sectionId = e.target.dataset.sectionId;
            console.log(`Section button clicked: ${action} for section ${sectionId}`);

            switch(action) {
                case 'view':
                    console.log('Navigating to section details:', sectionId);
                    navigateToSectionDetails(sectionId);
                    break;
                case 'edit':
                    console.log('Navigating to edit section:', sectionId);
                    window.location.href = `section-details-view.html?id=${sectionId}&mode=edit`;
                    break;
                case 'delete':
                    console.log('Attempting to delete section:', sectionId);
                    if (confirm('Are you sure you want to delete this section?')) {
                        deleteSectionById(sectionId)
                            .then(() => {
                                console.log('Section deleted successfully:', sectionId);
                                window.location.reload();
                            })
                            .catch(error => {
                                console.error('Failed to delete section:', error);
                                alert('Failed to delete section. Please try again.');
                            });
                    }
                    break;
            }
        });
    });

    document.querySelectorAll('.add-sections-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            const courseId = e.target.dataset.courseId;
        
            try {
                const publishedCourses = await fetchAllPublishedCourses();
                const course = courses.find(c => c.id.toString() === courseId);
                const publishedInfo = publishedCourses.find(pc => pc.courseId.toString() === courseId);
                
                if (!course || !publishedInfo) {
                    console.error('Course or published info not found');
                    return;
                }

                
                const overlay = document.createElement('div');
                overlay.className = 'section-form-overlay';
                
                
                const formContainer = document.createElement('div');
                formContainer.className = 'section-form-container';
                
                
                const closeButton = document.createElement('button');
                closeButton.className = 'close-overlay';
                closeButton.innerHTML = '&times;';
                closeButton.onclick = () => overlay.remove();

                
                const formHtml = await createSectionCard(course, publishedInfo);
                formContainer.innerHTML = formHtml;

                
                const form = formContainer.querySelector(`#sectionForm_${courseId}`);
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    try {
                        const selectedDays = Array.from(form.querySelectorAll(`input[name="days_${courseId}"]:checked`))
                            .map(checkbox => checkbox.value);

                        if (selectedDays.length === 0) {
                            alert('Please select at least one day');
                            return;
                        }

                        const startTime = form.querySelector(`#timeStart_${courseId}`).value;
                        const endTime = form.querySelector(`#timeEnd_${courseId}`).value;

                        if (startTime >= endTime) {
                            alert('End time must be after start time');
                            return;
                        }

                        const sectionData = {
                            courseId: parseInt(courseId),
                            instructorId: parseInt(form.querySelector(`#instructor_${courseId}`).value),
                            schedule: {
                                days: selectedDays,
                                timeStart: startTime,
                                timeEnd: endTime
                            },
                            location: form.querySelector(`#location_${courseId}`).value,
                            courseContent: form.querySelector(`#content_${courseId}`).value,
                            semester: publishedInfo.semester,
                            isRegistrationClosed: false
                        };

                        await createSection(sectionData);
                        alert('Section created successfully!');
                        overlay.remove();
                        await loadCourses();
                        renderCalendarView(); 
                    } catch (error) {
                        console.error('Error creating section:', error);
                        alert('Failed to create section. Please try again.');
                    }
                };

                
                const cancelButton = formContainer.querySelector('.cancel-btn');
                if (cancelButton) {
                    cancelButton.addEventListener('click', () => overlay.remove());
                }
                
                
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        overlay.remove();
                    }
                });
                
                
                formContainer.insertBefore(closeButton, formContainer.firstChild);
                overlay.appendChild(formContainer);
                document.body.appendChild(overlay);

                
                if (!document.querySelector('#overlay-styles')) {
                    const styles = document.createElement('style');
                    styles.id = 'overlay-styles';
                    styles.textContent = `
                        .section-form-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.5);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 1000;
                        }
                        .section-form-container {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            max-width: 500px;
                            width: 90%;
                            max-height: 80vh;
                            overflow-y: auto;
                            position: relative;
                        }
                        .close-overlay {
                            position: absolute;
                            right: 10px;
                            top: 10px;
                            background: none;
                            border: none;
                            font-size: 24px;
                            cursor: pointer;
                            padding: 5px;
                        }
                    `;
                    document.head.appendChild(styles);
                }

            } catch (error) {
                console.error('Error creating section:', error);
            }
        });
    });
}

async function init() {
  coursesContainer = document.getElementById('coursesContainer');
  loadingIndicator = document.getElementById('loadingIndicator');
    addCourseBtn = document.getElementById('addCourseBtn');
  calendarViewBtn = document.getElementById('calendarViewBtn');
    hybridViewBtn = document.getElementById('hybridViewBtn');
    
    if (!coursesContainer) {
        console.error('Courses container not found');
        return;
    }

    if (addCourseBtn) {
  addCourseBtn.addEventListener('click', navigateToAddCourse);
    }

    if (calendarViewBtn) {
        calendarViewBtn.addEventListener('click', () => {
            hybridViewBtn.classList.remove('active');
            calendarViewBtn.classList.add('active');
            coursesContainer.className = 'calendar-view';
            renderCalendarView();
        });
    }

    if (hybridViewBtn) {
        hybridViewBtn.addEventListener('click', () => {
            calendarViewBtn.classList.remove('active');
            hybridViewBtn.classList.add('active');
            coursesContainer.className = 'list-view';
            loadCourses();
        });
    }
  
  try {
    await loadCourses();
  } catch (error) {
    console.error('Failed to initialize courses view:', error);
        if (loadingIndicator) {
            loadingIndicator.textContent = 'Failed to load courses. Please try again.';
        }
  }
}

document.addEventListener('DOMContentLoaded', init);
