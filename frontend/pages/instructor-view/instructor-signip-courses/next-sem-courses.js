import { fetchAllCourses } from '../../../services/course-service.js';

let coursesContainer;
let loadingIndicator;
const instructorId = sessionStorage.getItem('authenticated_user_id');

async function fetchPublishedCourses() {
    try {
        const response = await fetch('/backend/database/published-courses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching published courses:', error);
        return [];
    }
}

function createCourseCard(course, publishedInfo) {
    const isInterested = publishedInfo.instructors.includes(parseInt(instructorId));
    
    return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-header">
                <h3>${course.name}</h3>
                <span class="course-id">ID: ${course.id}</span>
            </div>
            <div class="course-info">
                <p><strong>Category:</strong> ${course.category}</p>
                <p><strong>Credit Hours:</strong> ${course.creditHours}</p>
                <p><strong>Semester:</strong> ${publishedInfo.semester}</p>
                <p><strong>Prerequisites:</strong> ${course.prerequisites?.join(', ') || 'None'}</p>
            </div>
            <div class="instructor-list">
                <p><strong>Interested Instructors:</strong> ${publishedInfo.instructors.length}</p>
            </div>
            <button 
                class="interest-btn ${isInterested ? 'interested' : ''}" 
                data-course-id="${course.id}"
                ${isInterested ? 'disabled' : ''}
            >
                ${isInterested ? 'Interest Registered' : 'Register Interest'}
            </button>
        </div>
    `;
}

async function registerInterest(courseId) {
    try {
        const publishedCourses = await fetchPublishedCourses();
        const courseIndex = publishedCourses.findIndex(c => c.courseId === parseInt(courseId));
        
        if (courseIndex === -1) {
            throw new Error('Course not found in published courses');
        }

        if (!publishedCourses[courseIndex].instructors.includes(parseInt(instructorId))) {
            publishedCourses[courseIndex].instructors.push(parseInt(instructorId));
            
            console.log('Updated published courses:', publishedCourses);
            alert('Interest registered successfully!');
            
            await loadCourses();
        }
    } catch (error) {
        console.error('Error registering interest:', error);
        alert('Failed to register interest. Please try again.');
    }
}

async function loadCourses() {
    try {
        const [allCourses, publishedCourses] = await Promise.all([
            fetchAllCourses(),
            fetchPublishedCourses()
        ]);

        if (!Array.isArray(publishedCourses) || publishedCourses.length === 0) {
            coursesContainer.innerHTML = `
                <div class="no-courses">
                    <p>No courses are currently available for the next semester.</p>
                </div>
            `;
            return;
        }

        const courseCards = await Promise.all(publishedCourses.map(async (publishedCourse) => {
            const course = allCourses.find(c => c.id === publishedCourse.courseId);
            if (!course) return '';
            return createCourseCard(course, publishedCourse);
        }));

        coursesContainer.innerHTML = courseCards.join('');

        document.querySelectorAll('.interest-btn:not([disabled])').forEach(button => {
            button.addEventListener('click', async (e) => {
                const courseId = e.target.dataset.courseId;
                await registerInterest(courseId);
            });
        });

    } catch (error) {
        console.error('Error loading courses:', error);
        coursesContainer.innerHTML = `
            <div class="error-message">
                <p>Failed to load courses. Please try again later.</p>
            </div>
        `;
    } finally {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
}

function init() {
    console.log('Initializing with instructor ID:', instructorId);
    coursesContainer = document.getElementById('coursesContainer');
    loadingIndicator = document.getElementById('loadingIndicator');

    loadCourses();
}

document.addEventListener('DOMContentLoaded', init);
