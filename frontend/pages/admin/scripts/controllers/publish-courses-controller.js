import { fetchAllCourses } from '../../../../services/course-service.js';
import { fetchInstructorById } from '../../../../services/instructor-service.js';
import { 
    createPublishedCourse, 
    fetchAllPublishedCourses,
    deletePublishedCourse,
    updatePublishedCourse,
} from '../../../../services/published-courses-service.js';
import { createSection } from '../../../../services/section-service.js';
let selectedCoursesContainer;
let loadingIndicator;
let courseDropdown;
let addCourseBtn;
let targetSemester;
let allCourses = [];
let publishedCourses = [];
let selectedCourses = new Set();
let publishedCoursesContainer;

export async function createSectionCard(course, publishedInfo) {
    const instructorIds = await publishedInfo.instructors;
    const instructor=await fetchInstructorById(instructorIds[0]);
    console.log("Instructor: ",instructor);
    return `
        <div class="section-form-card" data-course-id="${course.id}">
            <h3>Create New Section for ${course.name}</h3>
            <form id="sectionForm_${course.id}" class="section-form">
                <div class="form-group">
                    <label for="instructor_${course.id}">Instructor:</label>
                    <select id="instructor_${course.id}" required>
                        <option value="">Select an instructor...</option>
                        ${`
                            <option value="${instructor.id}">${instructor.name}</option>
                        `}
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Class Days:</label>
                    <div class="days-group">
                        <label><input type="checkbox" name="days_${course.id}" value="Monday"> Monday</label>
                        <label><input type="checkbox" name="days_${course.id}" value="Tuesday"> Tuesday</label>
                        <label><input type="checkbox" name="days_${course.id}" value="Wednesday"> Wednesday</label>
                        <label><input type="checkbox" name="days_${course.id}" value="Thursday"> Thursday</label>
                        <label><input type="checkbox" name="days_${course.id}" value="Friday"> Friday</label>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="timeStart_${course.id}">Start Time:</label>
                        <input type="time" id="timeStart_${course.id}" required>
                    </div>
                    <div class="form-group">
                        <label for="timeEnd_${course.id}">End Time:</label>
                        <input type="time" id="timeEnd_${course.id}" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="location_${course.id}">Location:</label>
                    <input type="text" id="location_${course.id}" placeholder="Building and Room Number" required>
                </div>

                <div class="form-group">
                    <label for="content_${course.id}">Course Content:</label>
                    <textarea id="content_${course.id}" rows="4" placeholder="Enter course content and description" required></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" class="create-btn">Create Section</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    `;
}
export async function setupSectionFormListeners(courseId, publishedInfo) {
    const form = document.getElementById(`sectionForm_${courseId}`);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

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

        try {
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
            await loadCourses(); 
        } catch (error) {
            console.error('Error creating section:', error);
            alert('Failed to create section. Please try again.');
        }
    });

    form.querySelector('.cancel-btn').addEventListener('click', () => {
        form.reset();
    });
}
function createCourseCard(course) {
    return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-header">
                <h4>${course.name}</h4>
                <span class="course-id">ID: ${course.id}</span>
            </div>
            <div class="course-info">
                <p class="category">Category: ${course.category.charAt(0).toUpperCase() + course.category.slice(1)}</p>
                <p class="prerequisites">Prerequisites: ${course.prerequisites?.join(', ') || 'None'}</p>
                <p class="credit-hours">Credit Hours: ${course.creditHours}</p>
            </div>
            <button class="remove-btn" data-course-id="${course.id}">Remove</button>
        </div>
    `;
}

function createPublishedCourseCard(course, publishedInfo) {
    const deadlineDate = new Date(publishedInfo.submissionDeadline);
    const isDeadlinePassed = new Date() > deadlineDate;
    
    return `
        <div class="course-card published-course ${isDeadlinePassed ? 'deadline-passed' : ''}" data-course-id="${course.id}" data-published-id="${publishedInfo.id}">
            <div class="course-header" onclick="this.parentElement.classList.toggle('expanded')">
                <div class="header-content">
                    <h4>${course.name}</h4>
                    <span class="course-id">ID: ${course.id}</span>
                </div>
                <div class="card-actions">
                    <button class="edit-btn action-btn" onclick="event.stopPropagation()">Edit</button>
                    <button class="delete-btn action-btn" onclick="event.stopPropagation()">Delete</button>
                    <span class="dropdown-arrow">▼</span>
                </div>
            </div>
            <div class="course-details">
                <div class="course-info">
                    <p class="category">Category: ${course.category.charAt(0).toUpperCase() + course.category.slice(1)}</p>
                    <p class="prerequisites">Prerequisites: ${course.prerequisites?.join(', ') || 'None'}</p>
                    <p class="credit-hours">Credit Hours: ${course.creditHours}</p>
                    <p class="semester"><strong>Published for:</strong> ${publishedInfo.semester}</p>
                    <p class="published-date"><strong>Published on:</strong> ${new Date(publishedInfo.publishedDate).toLocaleDateString()}</p>
                    <p class="deadline ${isDeadlinePassed ? 'expired' : ''}">
                        <strong>Submission Deadline:</strong> ${deadlineDate.toLocaleDateString()} ${deadlineDate.toLocaleTimeString()}
                        ${isDeadlinePassed ? '<span class="deadline-status">(Expired)</span>' : ''}
                    </p>
                </div>
            </div>
        </div>
    `;
}

async function handleDeletePublishedCourse(event) {
    const card = event.target.closest('.published-course');
    const publishedId = card.dataset.publishedId;
    
    if (confirm('Are you sure you want to delete this published course?')) {
        try {
            await deletePublishedCourse(publishedId);
            await loadCourses(); // Refresh the list
        } catch (error) {
            console.error('Error deleting published course:', error);
            alert('Failed to delete the published course. Please try again.');
        }
    }
}

async function handleEditPublishedCourse(event) {
    const card = event.target.closest('.published-course');
    const publishedId = card.dataset.publishedId;
    const publishedCourse = publishedCourses.find(pc => pc.id.toString() === publishedId);
    
    if (!publishedCourse) return;

    // Create modal elements dynamically
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: rgba(0,0,0,0.5);display: flex;justify-content: center;align-items: center;`;

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 5px;
        width: 400px;
    `;

    const form = document.createElement('form');
    form.innerHTML = `
        <h2>Edit Published Course</h2>
        <div class="form-group">
            <label>Semester:</label>
            <input type="text" id="editSemester" required>
        </div>
        <div class="form-group">
            <label>Submission Deadline:</label>
            <input type="datetime-local" id="editDeadline" required>
        </div>
        <div class="modal-actions">
            <button type="button" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
        </div>
    `;

    // Set initial values
    const semesterInput = form.querySelector('#editSemester');
    const deadlineInput = form.querySelector('#editDeadline');
    
    const deadline = new Date(publishedCourse.submissionDeadline);
    const formattedDate = deadline.toISOString().slice(0, 16);
    
    semesterInput.value = publishedCourse.semester;
    deadlineInput.value = formattedDate;

    // Handle form submission
    form.onsubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedCourse = {
                ...publishedCourse,
                semester: semesterInput.value,
                submissionDeadline: new Date(deadlineInput.value).toISOString()
            };
            
            await updatePublishedCourse(updatedCourse);
            await loadCourses();
            modal.remove();
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Update failed: ' + error.message);
        }
    };

    // Handle cancellation
    form.querySelector('.cancel-btn').onclick = () => modal.remove();

    // Close modal on outside click
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    modalContent.appendChild(form);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function renderPublishedCourses() {
    if (!publishedCoursesContainer) return;
    
    if (!publishedCourses.length) {
        publishedCoursesContainer.innerHTML = `
            <h2>Published Courses</h2>
            <p class="no-courses">No courses have been published yet.</p>
        `;
        return;
    }
    
    const publishedCourseCards = publishedCourses.map(publishedCourse => {
        const course = allCourses.find(c => c.id === publishedCourse.courseId);
        if (!course) return '';
        return createPublishedCourseCard(course, publishedCourse);
    }).join('');
    
    publishedCoursesContainer.innerHTML = `
        <style>
            .course-header {
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .header-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .dropdown-arrow {
                transition: transform 0.3s ease;
            }
            
            .course-details {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
            }
            
            .published-course.expanded .course-details {
                max-height: 500px;
                padding: 1rem;
            }
            
            .published-course.expanded .dropdown-arrow {
                transform: rotate(180deg);
            }
        </style>
        <h2>Published Courses</h2>
        <div class="published-courses-list">
            ${publishedCourseCards}
        </div>
    `;

    document.querySelectorAll('.published-course .edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEditPublishedCourse);
    });

    document.querySelectorAll('.published-course .delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeletePublishedCourse);
    });
}

async function loadCourses() {
    try {
        allCourses = await fetchAllCourses();
        publishedCourses = await fetchAllPublishedCourses();
        
        if (!Array.isArray(allCourses)) {
            console.error('Courses data is not an array:', allCourses);
            return;
        }

        const publishedCourseIds = publishedCourses.map(pc => pc.courseId.toString());
        console.log('Published course IDs:', publishedCourseIds);
        
        const availableCourses = allCourses.filter(course => 
            !publishedCourseIds.includes(course.id.toString())
        );
        
        courseDropdown.innerHTML = `
            <option value="">Select a course to add...</option>
            ${availableCourses.map(course => `
                <option value="${course.id}">${course.name} (ID: ${course.id})</option>
            `).join('')}
        `;
        renderPublishedCourses();

        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }

        renderSelectedCourses();
    } catch (error) {
        console.error('Error loading courses:', error);
        if (loadingIndicator) {
            loadingIndicator.textContent = 'Failed to load courses. Please try again.';
        }
    }
}

function renderSelectedCourses() {
    const selectedCoursesArray = Array.from(selectedCourses)
        .map(courseId => allCourses.find(c => c.id.toString() === courseId.toString()));

    selectedCoursesContainer.innerHTML = selectedCoursesArray.length > 0 
        ? selectedCoursesArray.map(course => createCourseCard(course)).join('')
        : '<p class="no-courses">No courses selected yet</p>';

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseId = e.target.dataset.courseId;
            selectedCourses.delete(courseId);
            renderSelectedCourses();
        });
    });
}

function handleAddCourse() {
    const selectedId = courseDropdown.value;
    if (!selectedId) {
        alert('Please select a course to add');
        return;
    }

    if (selectedCourses.has(selectedId)) {
        alert('This course is already selected');
        return;
    }

    selectedCourses.add(selectedId);
    renderSelectedCourses();
    courseDropdown.value = ''; 
}

function setupEventListeners() {
    addCourseBtn.addEventListener('click', handleAddCourse);
    
    const publishBtn = document.getElementById('publishCoursesBtn');
    if (publishBtn) {
        publishBtn.addEventListener('click', handlePublishCourses);
    } else {
        console.error('Publish courses button not found');
    }
}

async function handlePublishCourses() {
    if (selectedCourses.size === 0) {
        alert('Please select at least one course to publish');
        return;
    }
    
    const semester = targetSemester.value;
    if (!semester) {
        alert('Please select a target semester');
        return;
    }
    
    try {
        const publishBtn = document.getElementById('publishCoursesBtn');
        if (publishBtn) {
            publishBtn.disabled = true;
            publishBtn.textContent = 'Publishing...';
        }
    
        const coursesToPublish = Array.from(selectedCourses)
            .map(courseId => allCourses.find(c => c.id.toString() === courseId.toString()));
        
        const publishPromises = coursesToPublish.map(course => 
            createPublishedCourse({
                courseId: course.id,
                semester: semester,
                publishedDate: new Date().toISOString()
            })
        );
        
        const results = await Promise.all(publishPromises);
    
        selectedCourses.clear();
        renderSelectedCourses();
        
        alert(`Successfully published ${results.length} courses for ${semester}`);
    } catch (error) {
        console.error('Error publishing courses:', error);
        alert('Failed to publish courses. Please try again.');
    } finally {
       
        const publishBtn = document.getElementById('publishCoursesBtn');
        if (publishBtn) {
            publishBtn.disabled = false;
            publishBtn.textContent = 'Publish Courses';
        }
    }
}

function getCurrentSemester() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    
    console.log('Current date:', now);
    console.log('Current month:', month);
    console.log('Current year:', year);
    
    let currentSemester;
   
    if (month >= 8) {
        currentSemester = { term: 'Fall', year };
    } else if (month >= 5) {
        currentSemester = { term: 'Summer', year };
    } else {
        currentSemester = { term: 'Spring', year };
    }
    
    console.log('Determined current semester:', currentSemester);
    return currentSemester;
}

function getNextSemesters() {
    const current = getCurrentSemester();
    const semesters = [];
    
    console.log('Getting next semesters based on current semester:', current);
    
    switch(current.term) {
        case 'Fall':
            
            semesters.push(
                { term: 'Spring', year: current.year + 1 },
                { term: 'Summer', year: current.year + 1 }
            );
            console.log('Fall case - Adding Spring and Summer of next year');
            break;
            
        case 'Spring':
            
            semesters.push(
                { term: 'Summer', year: current.year },
                { term: 'Fall', year: current.year }
            );
            console.log('Spring case - Adding Summer and Fall of current year');
            break;
            
        case 'Summer':
            
            semesters.push(
                { term: 'Fall', year: current.year },
                { term: 'Spring', year: current.year + 1 }
            );
            console.log('Summer case - Adding Fall and next Spring');
            break;
            
        default:
           
            semesters.push({ term: 'Spring', year: current.year + 1 });
            console.log('Default case - Adding next Spring as fallback');
    }
    
    
    if (semesters.length === 0) {
        const nextYear = current.year + 1;
        semesters.push({ term: 'Spring', year: nextYear });
        console.log('No semesters found - Adding fallback Spring semester');
    }
    
    console.log('Final list of available semesters:', semesters);
    return semesters;
}

function populateSemesterDropdown() {
    console.log('Starting semester dropdown population');
    const semesterSelect = document.getElementById('targetSemester');
    
    if (!semesterSelect) {
        console.error('Semester select element not found in DOM');
        return;
    }
    
    const nextSemesters = getNextSemesters();
    console.log('Retrieved next semesters:', nextSemesters);
    
    
    semesterSelect.innerHTML = '';
    console.log('Cleared existing semester options');
    
   
    nextSemesters.forEach(semester => {
        const option = document.createElement('option');
        option.value = `${semester.term} ${semester.year}`;
        option.textContent = `${semester.term} ${semester.year}`;
        semesterSelect.appendChild(option);
        console.log('Added semester option:', option.value);
    });
    
    console.log('Final semester select HTML:', semesterSelect.innerHTML);
    console.log('Number of options added:', semesterSelect.options.length);
}

async function init() {
    console.log('Initializing course planning page');
    selectedCoursesContainer = document.getElementById('selectedCoursesContainer');
    loadingIndicator = document.getElementById('loadingIndicator');
    courseDropdown = document.getElementById('courseDropdown');
    addCourseBtn = document.getElementById('addCourseBtn');
    targetSemester = document.getElementById('targetSemester');
    publishedCoursesContainer = document.getElementById('publishedCoursesContainer');

    if (!selectedCoursesContainer || !courseDropdown || !targetSemester) {
        console.error('Required elements not found:', {
            selectedCoursesContainer: !!selectedCoursesContainer,
            courseDropdown: !!courseDropdown,
            targetSemester: !!targetSemester
        });
        return;
    }
    
    console.log('All required elements found, proceeding with initialization');
    populateSemesterDropdown();
    setupEventListeners();
    await loadCourses();
}

document.addEventListener('DOMContentLoaded', init);
