document.addEventListener('DOMContentLoaded', function() {
    const instructorId = sessionStorage.getItem('authenticated_user_id');
    
    if (!instructorId) {
        window.location.href = '../../login/login.html';
        return;
    }

    // Rest of your dashboard initialization code
}); 