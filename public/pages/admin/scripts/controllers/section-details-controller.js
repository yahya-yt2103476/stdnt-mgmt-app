import SectionService from '../../../../services/section-service.js';
import CourseService from '../../../../services/course-service.js';
import InstructorService from '../../../../services/instructor-service.js';

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const sectionId = urlParams.get('id');
const courseId = urlParams.get('courseId');
const mode = urlParams.get('mode');

// DOM elements
let sectionDetails, studentsList, viewMode, editMode;
let sectionForm, instructorSelectElement;

// Data
let currentSection, currentCourse, allInstructors = [];

function getCourseFromStorage() {
    const storedCourse = sessionStorage.getItem('currentCourse');
    return storedCourse ? JSON.parse(storedCourse) : null;
}

async function init() {
  console.log("section-details-controller.js: init() started.");

    
  console.log("Document readyState:", document.readyState);
  const instructorElementFromHTML = document.getElementById('instructorId');
  console.log("Attempting to get 'instructorId' directly in init:", instructorElementFromHTML);

  if (instructorElementFromHTML) {
      console.log("Found 'instructorId'. Tag:", instructorElementFromHTML.tagName, "ID:", instructorElementFromHTML.id);
  } else {
      console.error("CRITICAL: 'instructorId' NOT found in init()! HTML content of form follows:");
      const formElementForDebug = document.getElementById('sectionForm');
      if (formElementForDebug) {
          console.log("sectionForm HTML:", formElementForDebug.innerHTML);
      } else {
          console.log("sectionForm itself also not found!");
      }
  }

  instructorSelectElement = instructorElementFromHTML;    
  
  sectionDetails = document.getElementById('sectionDetails');
  studentsList = document.getElementById('studentsList');
  viewMode = document.getElementById('viewMode');
  editMode = document.getElementById('editMode');
  sectionForm = document.getElementById('sectionForm');

  if (!sectionForm) {
      console.error("CRITICAL: 'sectionForm' not found!");
  }
  if (!instructorSelectElement && mode !== 'view') { 
       console.error("CRITICAL: 'instructorId' element is missing and needed for add/edit mode.");
  }


  // Set up event listeners
  const backButton = document.getElementById('backButton');
  if (backButton) {
      backButton.addEventListener('click', () => {
          if (mode === 'add') {
              window.location.href = 'courses-view.html';
          } else if (courseId || currentSection?.courseId){
              window.location.href = `course-details-view.html?id=${courseId || currentSection?.courseId}`;
          } else {
              window.location.href = 'courses-view.html';
          }
      });
  } else {
      console.warn("'backButton' not found");
  }
  
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
          editMode.classList.add('hidden');
          viewMode.classList.remove('hidden');
          if (mode === 'add') {
              document.getElementById('backButton').click();
          }
      });
  } else {
      console.warn("'cancelBtn' not found");
  }
  
  if (sectionForm) {
    sectionForm.addEventListener('submit', saveForm);
  } else {
    console.error("Cannot attach submit listener: 'sectionForm' not found.");
  }
  
  try {
    allInstructors = await InstructorService.getAllInstructors();
    if (instructorSelectElement) { 
        populateInstructorDropdown();
    } else {
        console.warn("Skipping populateInstructorDropdown as 'instructorId' element was not found.");
    }

    if (sectionId) {
      currentSection = await SectionService.getSectionById(sectionId);
      
      if (currentSection) {
        const effectiveCourseId = courseId || currentSection.courseId;
        currentCourse = getCourseFromStorage();
        if (!currentCourse || currentCourse.id !== effectiveCourseId) {
          currentCourse = await CourseService.getCourseById(effectiveCourseId);
          sessionStorage.setItem('currentCourse', JSON.stringify(currentCourse));
        }
        
        displaySectionDetails();
        displayStudents();
        
        setupViewModeButtons();
        
        if (mode === 'edit') {
          if (!document.getElementById('instructorId')) {
              console.error("PROBLEM: 'instructorId' is null right before calling fillEditForm in mode:", mode);
          }
          fillEditForm();
          viewMode.classList.add('hidden');
          editMode.classList.remove('hidden');
        }
      } else {
        sectionDetails.innerHTML = '<p>Section not found</p>';
      }
    } else if (mode === 'add' && courseId) {
        currentCourse = getCourseFromStorage();
        if (!currentCourse || currentCourse.id.toString() !== courseId) {
             currentCourse = await CourseService.getCourseById(courseId);
             sessionStorage.setItem('currentCourse', JSON.stringify(currentCourse));
        }
        
        currentSection = {
            courseId: parseInt(courseId),
            courseShortName: currentCourse.shortName,
            instructorId: null,
            capacity: 30,
            enrolledStudents: [],
            status: 'PENDING',
            semester: '',
            Time: '',
            Days: [],
            location: ''
        };
        
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
        
        const editModeHeading = editMode.querySelector('h2');
        if (editModeHeading) editModeHeading.textContent = `Add New Section for ${currentCourse?.shortName || `Course ${courseId}`}`;
        
        if (!document.getElementById('instructorId')) {
            console.error("PROBLEM: 'instructorId' is null right before calling fillEditForm in mode:", mode);
        }
        fillEditForm();
    } else {
      sectionDetails.innerHTML = '<p>No section selected or course ID provided for adding.</p>';
    }
  } catch (error) {
    console.error(`section-details-controller.js: Error during init's try block:`, error);
    if (sectionDetails) sectionDetails.innerHTML = `<p>Error loading section details: ${error.message}</p>`;
  }
}

function populateInstructorDropdown() {
    if (!instructorSelectElement) {
        console.warn("populateInstructorDropdown: instructorSelectElement is null, cannot populate.");
        return;
    }
    instructorSelectElement.innerHTML = '<option value="">-- Select Instructor --</option>';
    allInstructors.forEach(instructor => {
        const option = document.createElement('option');
        option.value = instructor.id;
        option.textContent = instructor.name;
        instructorSelectElement.appendChild(option);
    });
}

async function displaySectionDetails() {
    if (!currentSection) return;
    const instructor = allInstructors.find(inst => inst.id === currentSection.instructorId);
    const instructorNameDisplay = instructor ? instructor.name : (currentSection.instructorId ? `ID: ${currentSection.instructorId}` : 'Not Assigned');

    if (!currentCourse && currentSection.courseId) {
        currentCourse = await CourseService.getCourseById(currentSection.courseId);
    }
    const courseNameDisplay = currentCourse ? `${currentCourse.shortName} - ${currentCourse.name}` : `Course ID: ${currentSection.courseId}`;

    const daysToDisplay = currentSection.sectionDays?.map(sd => sd.day).join(', ') || 'Not Set';

    sectionDetails.innerHTML = `
      <h2>Section ${currentSection.id} for ${courseNameDisplay}</h2>
      <p><strong>Instructor:</strong> ${instructorNameDisplay}</p>
      <p><strong>Schedule:</strong> ${daysToDisplay} at ${currentSection.Time || 'Not Set'}</p>
      <p><strong>Location:</strong> ${currentSection.location || 'TBD'}</p>
      <p><strong>Status:</strong> <span class="status-badge ${currentSection.status?.toLowerCase()}">${currentSection.status || 'N/A'}</span></p>
      <p><strong>Capacity:</strong> ${currentSection.registrations?.length || 0}/${currentSection.capacity}</p>
      <p><strong>Semester:</strong> ${currentSection.semester}</p>
      <div class="section-actions">
        <button id="editButton" class="edit-btn">Edit Section</button>
        ${currentSection.status === 'OPEN' ? `<button id="approveButton" class="approve-btn">Approve</button>` : ''}
        ${currentSection.status === 'PENDING' || currentSection.status === 'OPEN' ? `<button id="cancelSectionButton" class="cancel-btn">Cancel Section</button>` : ''}
        <button id="deleteSectionButton" class="delete-btn">Delete Section</button>
      </div>
    `;

    setupViewModeButtons();
}

function setupViewModeButtons() {
    const editButton = document.getElementById('editButton');
    const approveButton = document.getElementById('approveButton');
    const cancelSectionButton = document.getElementById('cancelSectionButton');
    const deleteSectionButton = document.getElementById('deleteSectionButton');

    if (editButton) {
        editButton.addEventListener('click', () => {
            viewMode.classList.add('hidden');
            editMode.classList.remove('hidden');
            fillEditForm();
        });
    }
    if (approveButton) approveButton.addEventListener('click', approveSection);
    if (cancelSectionButton) cancelSectionButton.addEventListener('click', cancelSection);
    if (deleteSectionButton) deleteSectionButton.addEventListener('click', deleteSection);
}

function displayStudents() {
    if (!currentSection || !currentSection.registrations || currentSection.registrations.length === 0) {
        studentsList.innerHTML = '<p>No students currently registered.</p>';
        return;
    }
    
    studentsList.innerHTML = `
        <p><em>(Student list display requires fetching registration data)</em></p>
        <ul>
        ${currentSection.registrations.map(reg => `
            <li>Student ID: ${reg.studentId} - Status: ${reg.status} ${reg.grade ? `- Grade: ${reg.grade}`: ''}</li>
        `).join('')}
        </ul>
    `;
}

function fillEditForm() {
    if (!currentSection) {
        console.warn("fillEditForm called but currentSection is null or undefined.");
        return;
    }
    console.log("Attempting to fill edit form with section:", currentSection);

    const instructorElement = document.getElementById('instructorId');
    const capacityElement = document.getElementById('capacity');
    const statusElement = document.getElementById('status');
    const semesterElement = document.getElementById('semester');
    const timeElement = document.getElementById('time');
    const locationElement = document.getElementById('location');

    if (!instructorElement) console.error("Element with ID 'instructorId' not found!");
    if (!capacityElement) console.error("Element with ID 'capacity' not found!");
    if (!statusElement) console.error("Element with ID 'status' not found!");
    if (!semesterElement) console.error("Element with ID 'semester' not found!");
    if (!timeElement) console.error("Element with ID 'time' not found!");
    if (!locationElement) console.error("Element with ID 'location' not found!");

    if (instructorElement) instructorElement.value = currentSection.instructorId || '';
    if (capacityElement) capacityElement.value = currentSection.capacity || 30;
    if (statusElement) statusElement.value = currentSection.status || 'PENDING';
    if (semesterElement) semesterElement.value = currentSection.semester || '';
    if (timeElement) timeElement.value = currentSection.Time || '';
    if (locationElement) locationElement.value = currentSection.location || '';
    
    const dayCheckboxes = document.querySelectorAll('input[name="days"]');
    if (dayCheckboxes.length === 0) {
        console.warn("No day checkboxes found with name 'days'.");
    }
    const currentDaysArray = currentSection.sectionDays?.map(sd => sd.day) || [];
    dayCheckboxes.forEach(checkbox => {
        checkbox.checked = currentDaysArray.includes(checkbox.value);
    });
}

async function saveForm(event) {
  event.preventDefault();
  
  try {
    const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked'))
      .map(checkbox => checkbox.value);
    
    const instructorIdElementForSave = document.getElementById('instructorId');
    if (!instructorIdElementForSave) {
        console.error("saveForm: 'instructorId' element not found when trying to read value.");
        alert("Error: Instructor field is missing. Cannot save.");
        return; 
    }
    const instructorIdValue = instructorIdElementForSave.value;
    const instructorIdToSend = instructorIdValue ? parseInt(instructorIdValue) : null;

    const sectionDataPayload = {
      courseId: currentSection.courseId,
      instructorId: instructorIdToSend,
      capacity: parseInt(document.getElementById('capacity').value),
      status: document.getElementById('status').value,
      semester: document.getElementById('semester').value,
      time: document.getElementById('time').value,
      Days: selectedDays,
      location: document.getElementById('location').value
    };

    console.log('Attempting to save section:', sectionDataPayload);
    
    let savedSection;
    if (mode === 'add') {
        savedSection = await SectionService.createSection(sectionDataPayload);
        alert('Section created successfully!');
        window.location.href = `course-details-view.html?id=${currentSection.courseId}`;

    } else {
        savedSection = await SectionService.updateSection(parseInt(sectionId), sectionDataPayload);
        alert('Section updated successfully!');
        currentSection = await SectionService.getSectionById(sectionId);
        displaySectionDetails();
        displayStudents();
        editMode.classList.add('hidden');
        viewMode.classList.remove('hidden');
    }

  } catch (error) {
    console.error('Error saving section:', error);
    alert(`Failed to save section: ${error.message}`); 
  }
}

async function approveSection() {
    if (!currentSection) return;
    if (!confirm(`Are you sure you want to approve Section ${currentSection.id}? This requires sufficient student registrations.`)) return;

    try {
        const updatedSectionData = { status: 'APPROVED' };
        const savedSection = await SectionService.updateSection(currentSection.id, updatedSectionData);
        currentSection = await SectionService.getSectionById(sectionId);
        displaySectionDetails();
        alert(`Section ${currentSection.id} approved successfully!`);
    } catch (error) {
        console.error('Error approving section:', error);
        alert(`Failed to approve section: ${error.message}`); 
    }
}

async function cancelSection() {
    if (!currentSection) return;
    if (!confirm(`Are you sure you want to cancel Section ${currentSection.id}?`)) return;

    try {
        const updatedSectionData = { status: 'CANCELLED' };
        const savedSection = await SectionService.updateSection(currentSection.id, updatedSectionData);
        currentSection = await SectionService.getSectionById(sectionId);
        displaySectionDetails();
        alert(`Section ${currentSection.id} cancelled successfully!`);
    } catch (error) {
        console.error('Error cancelling section:', error);
        alert(`Failed to cancel section: ${error.message}`);
    }
}

async function deleteSection() {
    if (!currentSection || !confirm('Are you sure you want to delete this section? This cannot be undone.')) return;
    
    try {
        await SectionService.deleteSection(currentSection.id);
        alert('Section deleted successfully!');
        window.location.href = `course-details-view.html?id=${currentSection.courseId}`;
    } catch (error) {
        console.error('Error deleting section:', error);
        alert(`Failed to delete: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', init);
