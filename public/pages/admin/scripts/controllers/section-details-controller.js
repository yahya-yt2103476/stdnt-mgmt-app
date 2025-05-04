import SectionService from '../../../../services/section-service.js';
import CourseService from '../../../../services/course-service.js';

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const sectionId = urlParams.get('id');
const courseId = urlParams.get('courseId');
const mode = urlParams.get('mode');

// DOM elements
let sectionDetails, studentsList, viewMode, editMode;
let sectionForm;

// Data
let currentSection, currentCourse;

function getCourseFromStorage() {
    const storedCourse = sessionStorage.getItem('currentCourse');
    return storedCourse ? JSON.parse(storedCourse) : null;
}

async function init() {
  // Get DOM elements
  sectionDetails = document.getElementById('sectionDetails');
  studentsList = document.getElementById('studentsList');
  viewMode = document.getElementById('viewMode');
  editMode = document.getElementById('editMode');
  sectionForm = document.getElementById('sectionForm');
  
  // Set up event listeners
  document.getElementById('backButton').addEventListener('click', () => {
    window.location.href =`courses-view.html?id=${courseId}`;
  });
  
  document.getElementById('cancelBtn').addEventListener('click', () => {
    editMode.classList.add('hidden');
    viewMode.classList.remove('hidden');
  });
  
  sectionForm.addEventListener('submit', saveForm);
  
  // Load data
  try {
    if (sectionId) {
      currentSection = await SectionService.getSectionById(sectionId);
      
      if (currentSection) {
        // Try to get course from storage first
        currentCourse = getCourseFromStorage();
        if (!currentCourse) {
          // Fallback to fetching from API
          currentCourse = await CourseService.getCourseById(courseId || currentSection.courseId);
        }
        
        displaySectionDetails();
        displayStudents();
        
        // Add event listeners for approve, cancel and delete buttons
        const approveButton = document.getElementById('approveButton');
        const cancelSectionButton = document.getElementById('cancelSectionButton');
        const deleteSectionButton = document.getElementById('deleteSectionButton');
        
        if (approveButton) {
          approveButton.addEventListener('click', approveSection);
        }
        
        if (cancelSectionButton) {
          cancelSectionButton.addEventListener('click', cancelSection);
        }
        
        if (deleteSectionButton) {
          deleteSectionButton.addEventListener('click', deleteSection);
        }
        
        if (mode === 'edit') {
          fillEditForm();
          viewMode.classList.add('hidden');
          editMode.classList.remove('hidden');
        }
      } else {
        sectionDetails.innerHTML = '<p>Section not found</p>';
      }
    } else if (mode === 'add' && courseId) {
      // Try to get course from storage first
      currentCourse = getCourseFromStorage();
      if (!currentCourse) {
        currentCourse = await CourseService.getCourseById(courseId);
      }
      
      currentSection = {
        courseId: parseInt(courseId),
        courseShortName: currentCourse.shortName,
        instructorName: '',
        capacity: 30,
        enrolledStudents: [],
        status: 'open',
        semester: '',
        Time: '',
        Days: [],
        location: ''
      };
      
      // Hide view mode and show edit mode
      viewMode.classList.add('hidden');
      editMode.classList.remove('hidden');
      
      // Update heading for add mode
      const editModeHeading = editMode.querySelector('h2');
      if (editModeHeading) {
        editModeHeading.textContent = 'Add New Section';
      }
      
      fillEditForm();
    } else {
      sectionDetails.innerHTML = '<p>No section selected</p>';
    }
  } catch (error) {
    console.error('Error loading data:', error);
    sectionDetails.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

async function displaySectionDetails() {
  let course = await CourseService.getCourseById(currentSection.courseId);
  sectionDetails.innerHTML = `
    <h2>Section for ${course.shortName} - ${course.name}</h2>
    <p><strong>Instructor:</strong> ${currentSection.instructorName}</p>
    <p><strong>Schedule:</strong> ${currentSection.Days.join(', ')} at ${currentSection.Time}</p>
    <p><strong>Location:</strong> ${currentSection.location || 'TBD'}</p>
    <p><strong>Status:</strong> ${currentSection.status}</p>
    <p><strong>Capacity:</strong> ${currentSection.enrolledStudents.length}/${currentSection.capacity}</p>
    <p><strong>Semester:</strong> ${currentSection.semester}</p>
    <div class="section-actions">
      <button id="editButton" class="edit-btn">Edit Section</button>
      <button id="approveButton" class="approve-btn">Approve</button>
      <button id="cancelSectionButton" class="cancel-btn">Cancel Section</button>
      <button id="deleteSectionButton" class="delete-btn">Delete</button>
    </div>
  `;
  
  // Add event listener to the edit button after it's created
  document.getElementById('editButton').addEventListener('click', () => {
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    fillEditForm();
  });
}

function displayStudents() {
  if (!currentSection.enrolledStudents || currentSection.enrolledStudents.length === 0) {
    studentsList.innerHTML = '<p>No students enrolled</p>';
    return;
  }
  
  studentsList.innerHTML = `
    <ul>
      ${currentSection.enrolledStudents.map(studentId => `
        <li>Student ID: ${studentId}</li>
      `).join('')}
    </ul>
  `;
}

function fillEditForm() {
  document.getElementById('instructorName').value = currentSection.instructorName || '';
  document.getElementById('capacity').value = currentSection.capacity || 30;
  document.getElementById('status').value = currentSection.status || 'open';
  document.getElementById('semester').value = currentSection.semester || '';
  document.getElementById('time').value = currentSection.Time || '';
  document.getElementById('location').value = currentSection.location || '';
  
  // Set days checkboxes
  const dayCheckboxes = document.querySelectorAll('input[name="days"]');
  dayCheckboxes.forEach(checkbox => {
    checkbox.checked = currentSection.Days && currentSection.Days.includes(checkbox.value);
  });
}

async function saveForm(event) {
  event.preventDefault();
  
  try {
    const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked'))
      .map(checkbox => checkbox.value);
    
    const updatedSection = {
      id: sectionId ? parseInt(sectionId) : undefined,
      courseId: currentSection.courseId,
      courseShortName: currentSection.courseShortName,
      instructorName: document.getElementById('instructorName').value,
      capacity: parseInt(document.getElementById('capacity').value),
      enrolledStudents: currentSection.enrolledStudents || [],
      status: document.getElementById('status').value,
      semester: document.getElementById('semester').value,
      Time: document.getElementById('time').value,
      Days: selectedDays,
      location: document.getElementById('location').value
    };
    
    console.log('About to save section:', updatedSection);
    
    // Determine if we're creating a new section or updating an existing one
    let savedSection;
    if (sectionId) {
      // Update existing section
      savedSection = await SectionService.updateSection(parseInt(sectionId), updatedSection);
    } else {
      // Create new section
      savedSection = await SectionService.createSection(updatedSection);
    }
    
    console.log('Section saved, response:', savedSection);
    
    if (savedSection && savedSection.id) {
      window.location.href = `course-details-view.html?id=${currentSection.courseId}`;
    } else {
      window.location.href = 'courses-view.html';
    }
  } catch (error) {
    console.error('Error saving section:', error);
    alert(`Failed to save: ${error.message}`);
  }
}

async function approveSection() {
  if (!currentSection) return;
  
  try {
    // Check if the number of enrolled students equals the section capacity
    if (currentSection.enrolledStudents.length < currentSection.capacity) {
      alert('Error: Cannot approve section. The number of enrolled students must equal the section capacity.');
      return;
    }
    
    const updatedSection = {
      ...currentSection,
      status: 'approved'
    };
    
    const savedSection = await SectionService.updateSection(currentSection.id, updatedSection);
    
    if (savedSection && savedSection.id) {
      currentSection = savedSection;
      displaySectionDetails();
    } else {
    }
  } catch (error) {
    console.error('Error approving section:', error);
    alert(`Failed to approve: ${error.message}`);
  }
}

// New function to handle section deletion
async function deleteSection() {
  if (!currentSection || !confirm('Are you sure you want to delete this section?')) return;
  
  try {
    // Delete the section
    await SectionService.deleteSection(currentSection.id);
    
    // Navigate back to the course details page
    window.location.href = `course-details-view.html?id=${currentSection.courseId}`;
  } catch (error) {
    console.error('Error deleting section:', error);
    alert(`Failed to delete: ${error.message}`);
  }
}

// New function to handle section cancellation
async function cancelSection() {
  if (!currentSection) return;
  
  if (!confirm('Are you sure you want to cancel this section?')) return;
  
  try {
    // Create a copy of the current section with updated status
    const updatedSection = {
      ...currentSection,
      status: 'cancelled'
    };
    
    // Save the updated section - pass the section ID and the updatedSection data
    await SectionService.updateSection(currentSection.id, updatedSection);
    
    // Since the server doesn't return the updated section,
    // update the currentSection locally
    currentSection.status = 'cancelled';
    
    // Refresh the displayed details
    displaySectionDetails();
    alert('Section has been cancelled!');
  } catch (error) {
    console.error('Error cancelling section:', error);
    alert(`Failed to cancel: ${error.message}`);
  }
}

document.addEventListener('DOMContentLoaded', init);
