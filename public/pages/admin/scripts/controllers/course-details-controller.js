import CourseService from '../../../../services/course-service.js';
import SectionService from '../../../../services/section-service.js';

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');
const mode = urlParams.get('mode');

// DOM elements
let courseDetails, sectionsList, viewMode, editMode;
let courseForm, prerequisitesContainer;

// Data
let currentCourse, allCourses, sections = [];

function clearCourseStorage() {
    sessionStorage.removeItem('currentCourse');
}

async function init() {
  // Get DOM elements
  courseDetails = document.getElementById('courseDetails');
  sectionsList = document.getElementById('sectionsList');
  viewMode = document.getElementById('viewMode');
  editMode = document.getElementById('editMode');
  courseForm = document.getElementById('courseForm');
  prerequisitesContainer = document.getElementById('prerequisitesContainer');
  
  // Set up event listeners
  document.getElementById('backButton').addEventListener('click', () => {
    clearCourseStorage();
    window.location.href = 'courses-view.html';
  });
  
  document.getElementById('editButton').addEventListener('click', () => {
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    fillEditForm();
  });
  
  document.getElementById('cancelBtn').addEventListener('click', () => {
    editMode.classList.add('hidden');
    viewMode.classList.remove('hidden');
  });
  
  document.getElementById('addPrereqBtn').addEventListener('click', addPrerequisiteField);

  courseForm.addEventListener('submit', saveForm);
  
  try {
    allCourses = await CourseService.getAllCourses();
    
    if (courseId) {
      const storedCourse = sessionStorage.getItem('currentCourse');
      if (storedCourse) {
        currentCourse = JSON.parse(storedCourse);
      } else {
        currentCourse = await CourseService.getCourseById(courseId);
      }
      
      sections = await SectionService.getSectionsByCourse(courseId);
      
      // Make sure sections is always an array
      if (!Array.isArray(sections)) {
        sections = [];
      }
      
      displayCourseDetails();
      displaySections();
      
      if (mode === 'edit') {
        fillEditForm();
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
      }
    } else if (mode === 'add') {
      currentCourse = {
        shortName: '',
        name: '',
        description: '',
        creditHours: 3,
        category: 'programming',
        prerequisites: []
      };
      sections = [];
      
      viewMode.classList.add('hidden');
      editMode.classList.remove('hidden');
      
      const editModeHeading = editMode.querySelector('h2');
      if (editModeHeading) {
        editModeHeading.textContent = 'Add New Course';
      }
      
      fillEditForm();
    } else {
      courseDetails.innerHTML = '<p>No course selected</p>';
    }
  } catch (error) {
    console.error('Error loading data:', error);
    courseDetails.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayCourseDetails() {
  courseDetails.innerHTML = `
    <h2>${currentCourse.name} (${currentCourse.shortName})</h2>
    <p><strong>Description:</strong> ${currentCourse.description || 'None'}</p>
    <p><strong>Credit Hours:</strong> ${currentCourse.creditHours}</p>
    <p><strong>Category:</strong> ${currentCourse.category}</p>
    <p><strong>Prerequisites:</strong> ${getPrerequisiteNames()}</p>
  `;
}

function getPrerequisiteNames() {
  if (!currentCourse.prerequisites || currentCourse.prerequisites.length === 0) {
    return 'None';
  }
  
  return currentCourse.prerequisites
    .map(prereqId => {
      const prereq = allCourses.find(c => c.id == prereqId || c.shortName === prereqId);
      return prereq ? prereq.shortName : prereqId;
    })
    .join(', ');
}

function displaySections() {
  if (!sections || sections.length === 0) {
    sectionsList.innerHTML = '<p>No sections available</p>';
    return;
  }
  
  sectionsList.innerHTML = sections.map(section => `
    <div class="section-card" data-id="${section.id}">
      <h4>Section ${section.id} - ${section.instructorName}</h4>
      <p>Schedule: ${section.Days.join(', ')} at ${section.Time}</p>
      <p>Status: ${section.status} | Enrolled: ${section.enrolledStudents.length}/${section.capacity}</p>
    </div>
  `).join('');
  
  const sectionCards = document.querySelectorAll('.section-card');
  sectionCards.forEach(card => {
    card.addEventListener('click', () => {
      const sectionId = card.getAttribute('data-id');
      window.location.href = `section-details-view.html?id=${sectionId}&courseId=${courseId}`;
    });
    card.style.cursor = 'pointer';
  });
}

function fillEditForm() {
  document.getElementById('shortName').value = currentCourse.shortName || '';
  document.getElementById('name').value = currentCourse.name || '';
  document.getElementById('description').value = currentCourse.description || '';
  document.getElementById('creditHours').value = currentCourse.creditHours || 3;
  document.getElementById('category').value = currentCourse.category || 'programming';
  
  prerequisitesContainer.innerHTML = '';
  
  if (currentCourse.prerequisites && currentCourse.prerequisites.length > 0) {
    currentCourse.prerequisites.forEach(prereqId => {
      addPrerequisiteField(prereqId);
    });
  } else {
    addPrerequisiteField();
  }
}

function addPrerequisiteField(selectedValue = '') {
  const item = document.createElement('div');
  item.style.marginBottom = '5px';
  
  const select = document.createElement('select');
  select.className = 'prereq-select';
  
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = '-- Select prerequisite --';
  select.appendChild(emptyOption);
  
  allCourses.forEach(course => {
    if (courseId && course.id == courseId) return;
    
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = `${course.shortName} - ${course.name}`;
    
    if (course.id == selectedValue || course.shortName === selectedValue) {
      option.selected = true;
    }
    
    select.appendChild(option);
  });
  
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = 'Remove';
  removeBtn.style.marginLeft = '5px';
  removeBtn.addEventListener('click', () => item.remove());
  
  item.appendChild(select);
  item.appendChild(removeBtn);
  prerequisitesContainer.appendChild(item);
}

async function saveForm(event) {
  event.preventDefault();
  
  try {
    const updatedCourse = {
      id: courseId ? parseInt(courseId) : undefined,
      shortName: document.getElementById('shortName').value,
      name: document.getElementById('name').value,
      description: document.getElementById('description').value,
      creditHours: parseInt(document.getElementById('creditHours').value),
      category: document.getElementById('category').value,
      prerequisites: Array.from(document.querySelectorAll('.prereq-select'))
        .map(select => select.value)
        .filter(val => val !== '')
    };
    
    console.log('About to save course:', updatedCourse);
    
    let savedCourse;
    if (courseId) {
      savedCourse = await CourseService.updateCourse(courseId, updatedCourse);
      sessionStorage.setItem('currentCourse', JSON.stringify(savedCourse));
    } else {
      savedCourse = await CourseService.createCourse(updatedCourse);
      sessionStorage.setItem('currentCourse', JSON.stringify(savedCourse));
    }
    
    if (savedCourse && savedCourse.id) {
      window.location.href = `course-details-view.html?id=${savedCourse.id}`;
    } else {
      window.location.href = 'courses-view.html';
    }
  } catch (error) {
    console.error('Error saving course:', error);
    alert(`Failed to save: ${error.message}`);
  }
}

document.addEventListener('DOMContentLoaded', init);
