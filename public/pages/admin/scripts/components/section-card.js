export function sectionCard(section, courseName, onNavigate) {
  const statusClass = section.status.toLowerCase();
  
  const cardHtml = `
    <div class="section-card" data-section-id="${section.id}" data-course-id="${section.courseId}">
      <div class="status-banner ${statusClass}" style="background-color: ${getStatusColor(section.status)}; color: white; text-align: center; padding: 5px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; border-radius: 4px;">
        ${section.status}
      </div>
      <h4>${courseName} - Section ${section.id}</h4>
      <p class="instructor">${section.instructorName || 'No instructor'}</p>
      <p class="schedule">${section.Time || 'TBA'}</p>
      <p class="enrollment"><strong>Enrollment:</strong> ${section.enrolledStudents.length}/${section.capacity}</p>
      <p class="location">${section.location || 'TBA'}</p>
    </div>
  `;
  
  const container = document.createElement('div');
  container.innerHTML = cardHtml;
  const cardElement = container.firstElementChild;
  
  // Make the entire card clickable
  cardElement.addEventListener('click', onNavigate);
  cardElement.style.cursor = 'pointer';
  
  return cardElement;
}

// Helper function to get color based on status
function getStatusColor(status) {
  switch(status.toLowerCase()) {
    case 'open':
      return '#28a745'; // Green
    case 'approved':
      return '#007bff'; // Blue
    case 'cancelled':
      return '#dc3545'; // Red
    default:
      return '#17a2b8'; // Teal
  }
}
