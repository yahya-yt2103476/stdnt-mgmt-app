import { fetchAllCourses } from '../../../../services/course-service.js';
import { createPublishedCourse, fetchAllPublishedCourses } from '../../../../services/published-courses-service.js';
let selectedCoursesContainer;
let loadingIndicator;
let courseDropdown;
let addCourseBtn;
let targetSemester;
let allCourses = [];
let selectedCourses = new Set();

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

async function loadCourses() {
    try {
        allCourses = await fetchAllCourses();
        
        if (!Array.isArray(allCourses)) {
            console.error('Courses data is not an array:', allCourses);
            return;
        }

        
        courseDropdown.innerHTML = `
            <option value="">Select a course to add...</option>
            ${allCourses.map(course => `
                <option value="${course.id}">${course.name} (ID: ${course.id})</option>
            `).join('')}
        `;

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

    if (!selectedCoursesContainer || !courseDropdown || !targetSemester) {
        console.error('Required elements not found:', {
            selectedCoursesContainer: !!selectedCoursesContainer,
            courseDropdown: !!courseDropdown,
            targetSemester: !!targetSemester
        });
        return;
    }
    let allPublishedCourses=await  fetchAllPublishedCourses();
    console.log(allPublishedCourses);
    console.log('All required elements found, proceeding with initialization');
    populateSemesterDropdown();
    setupEventListeners();
    await loadCourses();
}

document.addEventListener('DOMContentLoaded', init);