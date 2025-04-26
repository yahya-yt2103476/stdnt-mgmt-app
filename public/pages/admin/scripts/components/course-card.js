export function courseCard(course, { onView, onEdit, onDelete }) {
  
  // Create sections list if available
  let sectionsHtml = '';
  if (course.sections && course.sections.length > 0) {
    sectionsHtml = `
      <div class="course-sections">
        <ul>
          ${course.sections.map(section => `
            <li>
              <span class="section-status ${section.status.toLowerCase()}" style="background-color: ${getStatusColor(section.status)}; color: white; font-weight: bold; padding: 3px 8px; border-radius: 4px; margin-right: 8px; display: inline-block; text-transform: uppercase;">${section.status}</span>
              ${section.courseShortName} - ${section.instructorName || 'No instructor'} 
              <span class="section-details">
                ${section.Days.join(', ')} | ${section.Time || 'TBA'} | ${section.location || 'TBA'}
              </span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  } else {
    sectionsHtml = `<p class="no-sections">No sections available</p>`;
  }

  const cardHtml = `
    <div class="course-card" data-course-id="${course.id}">
      <h3>${course.name} - ${course.shortName}</h3>
      <p>${course.description || 'No description available'}</p>
      ${sectionsHtml}
      <div class="card-actions">
        <button class="view-btn">View Details</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  `;
  
  const container = document.createElement('div');
  container.innerHTML = cardHtml;
  const cardElement = container.firstElementChild;
  
  cardElement.querySelector('.view-btn').addEventListener('click', onView);
  cardElement.querySelector('.edit-btn').addEventListener('click', onEdit);
  cardElement.querySelector('.delete-btn').addEventListener('click', onDelete);
  
  return cardElement;
}

// Helper function to get color based on status (same as in section-card.js)
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
