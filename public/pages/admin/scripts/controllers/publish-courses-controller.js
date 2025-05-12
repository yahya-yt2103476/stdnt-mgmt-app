import CourseService from '../../../../services/course-service.js';
import InstructorService from '../../../../services/instructor-service.js';
import PublishedCoursesService from '../../../../services/published-courses-service.js';
import SectionService from '../../../../services/section-service.js';
import { convertToAmPmRange } from '../../../../services/format-time.js';
import { logoutCurrentUser } from '../../../../services/logout.js';

let selectedCoursesContainer;
let loadingIndicator;
let courseDropdown;
let addCourseBtn;
let targetSemester;
let submissionDeadlineElement;
let allCourses = [];
let publishedCourses = [];
let allInstructors = [];
let selectedCourses = new Set();
let publishedCoursesContainer;

export async function createSectionCard(course, publishedInfo) {
    const instructorIds = publishedInfo.interestedInstructorIds;
    let availableInstructorsForDropdown = allInstructors;s

    const instructorOptions = availableInstructorsForDropdown.map(inst => 
        `<option value="${inst.id}">${inst.name}</option>`
    ).join('');

    return `
        <div class="section-form-card" data-course-id="${course.id}" data-published-course-id="${publishedInfo.id}">
            <h3>Create New Section for ${course.name} (${publishedInfo.semester})</h3>
            <p><em>This form would typically be used if sections are created manually *after* an instructor is assigned.
               If sections are auto-created as PENDING, this form might be for editing them or adding more.</em></p>
            <form id="sectionForm_${course.id}_${publishedInfo.id}" class="section-form">
                <div class="form-group">
                    <label for="instructor_${course.id}">Instructor:</label>
                    <select id="instructor_${course.id}" required>
                        <option value="">Select an instructor...</option>
                        ${instructorOptions}
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
                    <button type="submit" class="create-btn">Create/Update Section</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

export async function setupSectionFormListeners(courseId, publishedCourseId) {
    const form = document.getElementById(`sectionForm_${courseId}_${publishedCourseId}`);
    if (!form) {
        console.warn(`Section form not found for course ${courseId}, published course ${publishedCourseId}`);
        return;
    }

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

        const selectedInstructorId = form.querySelector(`#instructor_${courseId}`).value;
        const sectionData = {
            courseId: parseInt(courseId),
            instructorId: parseInt(selectedInstructorId),
            schedule: {
                days: selectedDays,
                timeStart: startTime,
                timeEnd: endTime
            },
            location: form.querySelector(`#location_${courseId}`).value,
            courseContent: form.querySelector(`#content_${courseId}`).value,
            semester: publishedInfo.semester,
            status: 'OPEN'
        };

        await SectionService.createSection(sectionData);
        alert('Section action (create/update) placeholder.');
        await loadCoursesAndInstructors(); 
    });

    const cancelButton = form.querySelector('.cancel-btn');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            const formCard = form.closest('.section-form-card');
            if (formCard) formCard.remove();
        });
    }
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

async function createPublishedCourseCard(course, publishedInfo) {
    const deadlineDate = new Date(publishedInfo.submissionDeadline);
    const isDeadlinePassed = new Date() > deadlineDate;
    
    let interestedInstructorsContent = '<p>No instructors registered interest yet.</p>';
    const interestedIds = Array.isArray(publishedInfo.interestedInstructorIds)
        ? publishedInfo.interestedInstructorIds
        : JSON.parse(publishedInfo.interestedInstructorIds || "[]");

    if (interestedIds.length > 0) {
        const interestedNames = await Promise.all(
            interestedIds.map(async (id) => {
                const instructor = allInstructors.find(inst => inst.id === id);
                return instructor ? instructor.name : `ID: ${id}`;
            })
        );
        interestedInstructorsContent = `
            <p><strong>Interested Instructors (${interestedIds.length}):</strong></p>
            <ul>${interestedNames.map(name => `<li>${name}</li>`).join('')}</ul>
        `;
    }

    return `
        <div class="course-card published-course ${isDeadlinePassed ? 'deadline-passed' : ''}" data-course-id="${course.id}" data-published-id="${publishedInfo.id}">
            <div class="course-header" onclick="this.parentElement.classList.toggle('expanded')">
                <div class="header-content">
                    <h4>${course.name} (${course.shortName || 'N/A'})</h4>
                    <span class="course-id">Published ID: ${publishedInfo.id}</span>
                </div>
                <div class="card-actions">
                    <button class="edit-published-btn action-btn" data-action="edit-published">Edit Publish Settings</button>
                    <button class="delete-published-btn action-btn" data-action="delete-published">Delete Publish Entry</button>
                    <span class="dropdown-arrow">▼</span>
                </div>
            </div>
            <div class="course-details">
                <div class="course-info">
                    <p><strong>Category:</strong> ${course.category}</p>
                    <p><strong>Credit Hours:</strong> ${course.creditHours}</p>
                    <p><strong>Semester:</strong> ${publishedInfo.semester}</p>
                    <p class="deadline ${isDeadlinePassed ? 'expired' : ''}">
                        <strong>Instructor Interest Deadline:</strong> ${deadlineDate.toLocaleDateString()} ${deadlineDate.toLocaleTimeString()}
                        ${isDeadlinePassed ? '<span class="deadline-status">(Deadline Passed)</span>' : ''}
                    </p>
                </div>
                <div class="instructor-interest-section">
                    ${interestedInstructorsContent}
                </div>
                ${isDeadlinePassed ? `
                    <p style="margin-top: 10px; font-style: italic; color: #555;">Instructor interest period ended. Sections can now be created and instructors assigned via Course Management.</p>
                ` : '<p><em>Instructors can register interest until the deadline.</em></p>'}
            </div>
        </div>
    `;
}

async function handleDeletePublishedCourse(event) {
    const card = event.target.closest('.published-course');
    if (!card) return;
    const publishedId = card.dataset.publishedId;
    
    if (confirm('Are you sure you want to delete this published course entry? This will not delete the course itself or its sections if any exist.')) {
        try {
            await PublishedCoursesService.deletePublishedCourse(publishedId);
            await loadCoursesAndInstructors();
        } catch (error) {
            console.error('Error deleting published course:', error);
            alert('Failed to delete the published course. Please try again.');
        }
    }
}

async function handleEditPublishedCourse(event) {
    const card = event.target.closest('.published-course');
    if (!card) return;
    const publishedId = card.dataset.publishedId;
    const publishedCourse = publishedCourses.find(pc => pc.id.toString() === publishedId);
    
    if (!publishedCourse) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: rgba(0,0,0,0.5);display: flex;justify-content: center;align-items: center; z-index: 1001;`;

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `background: white; padding: 20px; border-radius: 5px; width: 400px;`;

    const currentSemesterValue = publishedCourse.semester;
    const semesterOptions = getNextSemesters().map(s => 
        `<option value="${s.term.toUpperCase()}${s.year}" ${currentSemesterValue === `${s.term.toUpperCase()}${s.year}` ? 'selected' : ''}>${s.term} ${s.year}</option>`
    ).join('');

    const form = document.createElement('form');
    form.innerHTML = `
        <h2>Edit Published Course Settings</h2>
        <div class="form-group">
            <label>Semester:</label>
            <select id="editSemester">${semesterOptions}</select>
        </div>
        <div class="form-group">
            <label>Instructor Interest Submission Deadline:</label>
            <input type="datetime-local" id="editDeadline" required value="${new Date(publishedCourse.submissionDeadline).toISOString().slice(0, 16)}">
        </div>
        <div class="modal-actions" style="text-align: right; margin-top: 15px;">
            <button type="button" class="cancel-btn" style="margin-right: 10px;">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
        </div>
    `;
    
    form.onsubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedCourseData = {
                semester: form.querySelector('#editSemester').value,
                submissionDeadline: new Date(form.querySelector('#editDeadline').value).toISOString()
            };
            
            await PublishedCoursesService.updatePublishedCourse(publishedCourse.id, updatedCourseData);
            await loadCoursesAndInstructors();
            modal.remove();
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Update failed: ' + error.message);
        }
    };

    form.querySelector('.cancel-btn').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modalContent.appendChild(form);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

async function renderPublishedCourses() {
    if (!publishedCoursesContainer) {
        console.warn("Published courses container not found in renderPublishedCourses");
        return;
    }
    
    if (!publishedCourses.length) {
        publishedCoursesContainer.innerHTML = `
            <h2>Published Courses (For Instructor Interest)</h2>
            <p class="no-courses">No courses have been published yet.</p>
        `;
        return;
    }

    const sortedPublishedCourses = [...publishedCourses].sort((a, b) => {
        const aDeadlinePassed = new Date() > new Date(a.submissionDeadline);
        const bDeadlinePassed = new Date() > new Date(b.submissionDeadline);
        if (aDeadlinePassed !== bDeadlinePassed) {
            return aDeadlinePassed ? 1 : -1;
        }
        return new Date(b.publishedDate) - new Date(a.publishedDate);
    });

    const publishedCourseCardsPromises = sortedPublishedCourses.map(async (publishedCourse) => {
        const course = allCourses.find(c => c.id === publishedCourse.courseId);
        if (!course) return '';
        return await createPublishedCourseCard(course, publishedCourse);
    });

    const publishedCourseCardsHtml = await Promise.all(publishedCourseCardsPromises);
    
    publishedCoursesContainer.innerHTML = `
        <style>
            .published-course .course-header { cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
            .published-course .header-content { display: flex; align-items: center; gap: 1rem; }
            .published-course .dropdown-arrow { transition: transform 0.3s ease; }
            .published-course .course-details { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; padding: 0 1rem;}
            .published-course.expanded .course-details { max-height: 500px; padding: 1rem; border-top: 1px solid #eee; margin-top: 10px;}
            .published-course.expanded .dropdown-arrow { transform: rotate(180deg); }
            .instructor-interest-section ul { list-style: none; padding-left: 0; margin-top: 5px; }
            .instructor-interest-section li { background-color: #f0f0f0; border: 1px solid #ddd; padding: 5px 8px; margin-bottom: 4px; border-radius: 4px; font-size: 0.9em; }
            .card-actions .action-btn { margin-left: 5px; padding: 4px 8px; font-size: 0.85em; }
        </style>
        <h2>Published Courses (For Instructor Interest)</h2>
        <div class="published-courses-list">
            ${publishedCourseCardsHtml.join('')}
        </div>
    `;

    document.querySelectorAll('.published-course .edit-published-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleEditPublishedCourse(e);
        });
    });

    document.querySelectorAll('.published-course .delete-published-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDeletePublishedCourse(e);
        });
    });
}

async function loadCoursesAndInstructors() {
    try {
        if (loadingIndicator) {
            loadingIndicator.classList.remove('hidden');
            loadingIndicator.textContent = 'Loading data...';
        }

        const [coursesData, pubCoursesData, instructorsData] = await Promise.all([
            CourseService.getAllCourses(),
            PublishedCoursesService.getAllPublishedCourses(),
            InstructorService.getAllInstructors()
        ]);
        
        allCourses = coursesData;
        publishedCourses = pubCoursesData;
        allInstructors = instructorsData;
        
        if (!Array.isArray(allCourses)) throw new Error("Course data format incorrect.");
        if (!Array.isArray(publishedCourses)) throw new Error("Published course data format incorrect.");
        if (!Array.isArray(allInstructors)) throw new Error("Instructors data format incorrect.");

        const publishedCourseIds = publishedCourses.map(pc => pc.courseId.toString());
        const availableCoursesForPublishing = allCourses.filter(course => 
            !publishedCourseIds.includes(course.id.toString())
        );
        
        if (courseDropdown) {
            courseDropdown.innerHTML = `
                <option value="">Select a course to add for publishing...</option>
                ${availableCoursesForPublishing.map(course => `
                    <option value="${course.id}">${course.name} (${course.shortName || 'N/A'}) - ID: ${course.id}</option>
                `).join('')}
            `;
        }
        
        renderSelectedCourses();
        renderPublishedCourses();

    } catch (error) {
        console.error('Error loading data:', error);
        if (loadingIndicator) {
            loadingIndicator.textContent = `Failed to load data: ${error.message}`;
        }
        if(selectedCoursesContainer) selectedCoursesContainer.innerHTML = `<p class="error-message">Error loading data.</p>`;
        if(publishedCoursesContainer) publishedCoursesContainer.innerHTML = `<p class="error-message">Error loading data.</p>`;

    } finally {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
}

function renderSelectedCourses() {
    if (!selectedCoursesContainer) return;
    const selectedCoursesArray = Array.from(selectedCourses)
        .map(courseId => allCourses.find(c => c.id.toString() === courseId.toString()));

    selectedCoursesContainer.innerHTML = `<h2>Courses Selected for New Publishing Action</h2>`;
    if (selectedCoursesArray.length > 0) {
        selectedCoursesContainer.innerHTML += selectedCoursesArray.map(course => createCourseCardForSelection(course)).join('');
    } else {
        selectedCoursesContainer.innerHTML += '<p class="no-courses">No courses selected for the current publishing batch.</p>';
    }
    
    document.querySelectorAll('.selected-course-card .remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseId = e.target.dataset.courseId;
            selectedCourses.delete(courseId);
            renderSelectedCourses();
        });
    });
}

function createCourseCardForSelection(course) {
    if (!course) return '<p>Error: Course data missing for selection card.</p>';
    return `
        <div class="course-card selected-course-card" data-course-id="${course.id}">
            <div class="course-header">
                <h4>${course.name} (${course.shortName || 'N/A'})</h4>
                <span class="course-id">ID: ${course.id}</span>
            </div>
            <div class="course-info">
                <p class="category">Category: ${course.category}</p>
            </div>
            <button class="remove-btn" data-course-id="${course.id}">Remove from Batch</button>
        </div>
    `;
}

function handleAddCourse() {
    if (!courseDropdown) return;
    const selectedId = courseDropdown.value;
    if (!selectedId) {
        alert('Please select a course to add to the publishing batch.');
        return;
    }

    if (selectedCourses.has(selectedId)) {
        alert('This course is already in the current publishing batch.');
        return;
    }

    selectedCourses.add(selectedId);
    renderSelectedCourses();
    courseDropdown.value = ''; 
}

function setupEventListeners() {
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', handleAddCourse);
    }
    
    const publishBtn = document.getElementById('publishCoursesBtn');
    if (publishBtn) {
        publishBtn.addEventListener('click', handlePublishCoursesBatch);
    } else {
        console.error('Publish courses button not found');
    }
}

async function handlePublishCoursesBatch() {
    if (selectedCourses.size === 0) {
        alert('Please select at least one course to publish in this batch.');
        return;
    }
    
    if (!targetSemester || !targetSemester.value) {
        alert('Please select a target semester.');
        return;
    }
    if (!submissionDeadlineElement || !submissionDeadlineElement.value) {
        alert('Please set a submission deadline for instructor interest.');
        return;
    }
    const semesterValue = targetSemester.value;
    const deadlineValue = new Date(submissionDeadlineElement.value).toISOString();

    if (new Date(submissionDeadlineElement.value) <= new Date()) {
        alert('Submission deadline must be in the future.');
        return;
    }
    
    try {
        const publishBtn = document.getElementById('publishCoursesBtn');
        if (publishBtn) {
            publishBtn.disabled = true;
            publishBtn.textContent = 'Publishing...';
        }
    
        const coursesToPublishDetails = Array.from(selectedCourses)
            .map(courseId => allCourses.find(c => c.id.toString() === courseId.toString()));
        
        const publishPromises = coursesToPublishDetails.map(course => 
            PublishedCoursesService.createPublishedCourse({
                courseId: course.id,
                semester: semesterValue,
                submissionDeadline: deadlineValue,
            })
        );
        
        const results = await Promise.all(publishPromises);
    
        selectedCourses.clear();
        submissionDeadlineElement.value = '';

        alert(`Successfully published ${results.length} courses for ${semesterValue}.`);
        await loadCoursesAndInstructors();

    } catch (error) {
        console.error('Error publishing course batch:', error);
        alert(`Failed to publish courses: ${error.message}. Please try again.`);
    } finally {
        const publishBtn = document.getElementById('publishCoursesBtn');
        if (publishBtn) {
            publishBtn.disabled = false;
            publishBtn.textContent = 'Publish Selected Courses';
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
    if (!targetSemester) return;
    
    const nextSemesters = getNextSemesters();
    console.log('Retrieved next semesters:', nextSemesters);
    
    targetSemester.innerHTML = '<option value="">-- Select Target Semester --</option>';
    nextSemesters.forEach(semester => {
        const option = document.createElement('option');
        option.value = `${semester.term.toUpperCase()}${semester.year}`;
        option.textContent = `${semester.term} ${semester.year}`;
        targetSemester.appendChild(option);
        console.log('Added semester option:', option.value);
    });
    
    console.log('Final semester select HTML:', targetSemester.innerHTML);
    console.log('Number of options added:', targetSemester.options.length);
}

async function init() {
    console.log('DOM fully loaded, init() called.'); 
    console.log('Document body:', document.body); 
    console.log('Container element direct check:', document.getElementById('container')); 

    console.log('Initializing Course Planning page (publish-courses-controller.js)');
    selectedCoursesContainer = document.getElementById('selectedCoursesContainer');
    loadingIndicator = document.getElementById('loadingIndicator');
    courseDropdown = document.getElementById('courseDropdown');
    addCourseBtn = document.getElementById('addCourseBtn');
    targetSemester = document.getElementById('targetSemester');
    submissionDeadlineElement = document.getElementById('submissionDeadline');
    publishedCoursesContainer = document.getElementById('publishedCoursesContainer');

    if (!selectedCoursesContainer || !courseDropdown || !targetSemester || !publishedCoursesContainer || !submissionDeadlineElement) {
        console.error('One or more required UI elements not found for Course Planning page.', {
            selectedCoursesContainer: !!selectedCoursesContainer,
            courseDropdown: !!courseDropdown,
            targetSemester: !!targetSemester,
            submissionDeadlineElement: !!submissionDeadlineElement,
            publishedCoursesContainer: !!publishedCoursesContainer,
        });
        if(loadingIndicator) {
            loadingIndicator.textContent = "Error: Page UI elements missing. Check console.";
            loadingIndicator.classList.remove('hidden');
        }
        return;
    }
    
    populateSemesterDropdown();
    setupEventListeners();
    await loadCoursesAndInstructors();
}

document.addEventListener('DOMContentLoaded', init);

const logoutbtn = document.querySelector("#logOutBtn");
if(logoutbtn) {
    logoutbtn.addEventListener("click", logoutCurrentUser);
}
