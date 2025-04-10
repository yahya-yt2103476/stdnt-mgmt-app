import { fetchStudentById } from "../../../../services/student-service.js";
import { createCourseCard } from './components/course-card.js';
import { LogoutCurrentUser } from '../../../../services/logout.js';

let studentId = sessionStorage.getItem("authenticated_user_id");
let student;

async function fetchCourseDetails(courseId) {
    try {
        const response = await fetch('/backend/database/courses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const courses = await response.json();
        const course = courses.find(c => c.id === parseInt(courseId));
        console.log('Found course:', course, 'for ID:', courseId);
        return course;
    } catch (error) {
        console.error('Error fetching course details:', error);
        return null;
    }
}

async function fetchSectionDetails(sectionId) {
    try {
        if (!sectionId) {
            console.warn('Section ID is undefined or null');
            return null;
        }

        const response = await fetch('/backend/database/sections.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const sections = await response.json();
        
        const section = sections.find(s => s.id === parseInt(sectionId));
        console.log('Found section:', section, 'for ID:', sectionId);
        return section;
    } catch (error) {
        console.error('Error fetching section details:', error);
        return null;
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const courses = await response.json();
        // Extract unique categories from courses
        const categories = [...new Set(courses.map(course => course.category))];
        console.log('Extracted categories:', categories);
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

function normalizeCategory(category) {
    if (!category) return '';
    const normalized = category.toLowerCase().trim();
    return normalized === 'general programming' ? 'programming' : normalized;
}

function isSemesterCurrent(semester) {
    if (!semester) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    
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

async function processCourses(student) {
    console.log('Processing courses for student:', student);
    const completedCourses = [];
    const inProgressCourses = [];
    const pendingCourses = [];

    // Process registered courses
    if (student.registeredCourses && student.registeredCourses.length > 0) {
        console.log('Processing registered courses:', student.registeredCourses);
        for (const registeredCourse of student.registeredCourses) {
            try {
                console.log('Processing course ID:', registeredCourse.courseId, 'Section ID:', registeredCourse.SectionId);
                const courseDetails = await fetchCourseDetails(registeredCourse.courseId);
                const sectionDetails = await fetchSectionDetails(registeredCourse.SectionId);
                
                console.log('Fetched course details:', courseDetails);
                console.log('Fetched section details:', sectionDetails);

                if (courseDetails) {
                    const course = {
                        name: courseDetails.name,
                        grade: 'TBD',
                        semester: sectionDetails?.semester || 'Unknown',
                        category: normalizeCategory(courseDetails.category)
                    };

                    if (sectionDetails && isSemesterCurrent(sectionDetails.semester)) {
                        course.status = 'in progress';
                        inProgressCourses.push(course);
                    } else if (sectionDetails && isSemesterFuture(sectionDetails.semester)) {
                        course.status = 'pending';
                        pendingCourses.push(course);
                    } else {
                        course.status = 'in progress';
                        inProgressCourses.push(course);
                    }
                }
            } catch (error) {
                console.error('Error processing registered course:', error);
            }
        }
    }

    // Process completed courses
    if (student.completedCourses && student.completedCourses.length > 0) {
        console.log('Processing completed courses:', student.completedCourses);
        for (const completedCourse of student.completedCourses) {
            try {
                const courseDetails = await fetchCourseDetails(completedCourse.courseId);
                console.log('Fetched completed course details:', courseDetails);
                
                if (courseDetails) {
                    completedCourses.push({
                        name: courseDetails.name,
                        status: 'completed',
                        grade: completedCourse.grade || 'N/A',
                        semester: completedCourse.semester || 'N/A',
                        category: normalizeCategory(courseDetails.category)
                    });
                }
            } catch (error) {
                console.error('Error processing completed course:', error);
            }
        }
    }

    console.log('Final processed courses:', {
        completedCourses,
        inProgressCourses,
        pendingCourses
    });

    return { completedCourses, inProgressCourses, pendingCourses };
}

function renderCoursesByStatus(courses, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }

    container.innerHTML = '';
    
    if (courses.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No courses in this category';
        emptyMessage.style.color = '#666';
        emptyMessage.style.textAlign = 'center';
        container.appendChild(emptyMessage);
        return;
    }

    courses.forEach(course => {
        const card = createCourseCard(
            course.name,
            course.status,
            course.grade,
            course.semester,
            course.category
        );
        container.appendChild(card);
    });
}

function setupSectionToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-section');
    
    toggleButtons.forEach(button => {
        button.setAttribute('aria-expanded', 'true');
        
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            const coursesGrid = document.getElementById(`${sectionId}-courses`);
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            button.setAttribute('aria-expanded', !isExpanded);
            coursesGrid.classList.toggle('collapsed');
        });
    });
}


function setupNavigation() {
    const profileBtn = document.getElementById('userBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = '../../../student-view/stdnt-main-dashboard/stdnt-main-dashboard.html';
        });
    }

    const logoutBtn = document.getElementById('logOutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await LogoutCurrentUser();
        });
    }
}


async function init() {
    try {
        setupNavigation();
        
        const categories = await fetchCategories();
        console.log('Fetched categories:', categories); 
        
        const normalizedCategories = categories.map(category => {
            const normalized = normalizeCategory(category);
            return normalized.charAt(0).toUpperCase() + normalized.slice(1);
        });
        
        console.log('Normalized categories:', normalizedCategories); 
        
        const uniqueCategories = [...new Set(normalizedCategories)].sort();
        console.log('Unique categories:', uniqueCategories); 
        
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.innerHTML = `
                <option value="all" selected>All</option>
                ${uniqueCategories.map(category => `
                    <option value="${normalizeCategory(category)}">${category}</option>
                `).join('')}
            `;
        }

        student = await fetchStudentById(studentId);
        console.log("Fetched student:", student); 

        if (!student) {
            console.error("No student data found");
            return;
        }

        const { completedCourses, inProgressCourses, pendingCourses } = await processCourses(student);
        
        console.log("Processed courses:", { completedCourses, inProgressCourses, pendingCourses }); // Debug log

        renderCoursesByStatus(completedCourses, 'completed-courses');
        renderCoursesByStatus(inProgressCourses, 'in-progress-courses');
        renderCoursesByStatus(pendingCourses, 'pending-courses');

        setupSectionToggles();

        
        const searchInput = document.getElementById('course-search');
        
        if (searchInput && categoryFilter) {
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value;
                filterCourses(searchTerm, categoryFilter.value);
            });

            categoryFilter.addEventListener('change', () => {
                const searchTerm = searchInput.value;
                filterCourses(searchTerm, categoryFilter.value);
            });
        }

    } catch (error) {
        console.error('Error initializing learning path:', error);
    }
}

function filterCourses(searchTerm, category) {
    console.log('Filtering with:', { searchTerm, category }); 
    
    const cards = document.querySelectorAll('.course-card');
    const normalizedFilterCategory = normalizeCategory(category);
    
    console.log('Normalized filter category:', normalizedFilterCategory);
    
    cards.forEach(card => {
        const courseName = card.querySelector('.course-name')?.textContent.toLowerCase() || '';
        const courseCategory = card.dataset.category || '';
        
        console.log('Card category:', courseCategory);
        
        const matchesSearch = courseName.includes(searchTerm.toLowerCase());
        const matchesCategory = normalizedFilterCategory === 'all' || 
                              courseCategory === normalizedFilterCategory;
        
        console.log('Matches:', { matchesSearch, matchesCategory });
        
        card.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
    });
}

document.addEventListener("DOMContentLoaded", init);
