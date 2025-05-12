async function logoutCurrentUser() {
  const confirmLogout = confirm("Are you Sure you want to logout?");
  if (confirmLogout) {
    sessionStorage.removeItem("authenticated_user_id");
    window.location.href = "/pages/login/views/login-page.html";
  }
}

export { logoutCurrentUser };
