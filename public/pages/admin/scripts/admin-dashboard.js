import { logoutCurrentUser } from '../../../services/logout.js';

document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupCardLinks();
});

function setupNavigation() {
    const logoutBtn = document.getElementById('logOutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await logoutCurrentUser();
        });
    }
}

function setupCardLinks() {
    const courseManagementCard = document.getElementById('courseManagement');
    if (courseManagementCard) {
        courseManagementCard.addEventListener('click', () => {
            window.location.href = 'courses-view.html';
        });
    }

    const coursePlanningCard = document.getElementById('coursePlanning');
    if (coursePlanningCard) {
        coursePlanningCard.addEventListener('click', () => {
            window.location.href = 'new-courses.html';
        });
    }
}