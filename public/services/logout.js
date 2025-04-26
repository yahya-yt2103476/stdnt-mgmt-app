async function logoutCurrentUser() {
  const confirmLogout = confirm("Are you Sure you want to logout?");
  if (confirmLogout) {
    sessionStorage.removeItem("authenticated_user_id");
    window.location.href = "/frontend/pages/login/views/login_page.html";
  }
}

export { logoutCurrentUser };
