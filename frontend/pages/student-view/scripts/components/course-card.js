
function createCourseCard(courseName, status, grade, semester, category) {
    const card = document.createElement('div');
    card.className = 'course-card';

    const normalizedCategory = category ? 
        (category.toLowerCase() === 'general programming' ? 'programming' : category.toLowerCase()) : 
        '';


    const displayStatus = status ? 
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 
        'Pending';


    card.dataset.category = normalizedCategory;
    card.dataset.status = status?.toLowerCase().replace(' ', '-') || 'pending';


    const displayCategory = category ? 
        (category.toLowerCase() === 'general programming' ? 'Programming' : 
            category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()) : 
        'N/A';

    card.innerHTML = `
        <div class="status-indicator"></div>
        <h2 class="course-name">${courseName || 'N/A'}</h2>
        <div class="status">${displayStatus}</div>
        <div class="grade-section">
            <div class="grade-label">Grade</div>
            <div class="grade-value">${grade || 'TBD'}</div>
        </div>
        <div class="card-footer">
            <div class="semester">
                <svg class="semester-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                ${semester || 'N/A'}
                <div class="category-tag">${displayCategory}</div>
            </div>
        </div>
    `;

    return card;
}

export { createCourseCard };
