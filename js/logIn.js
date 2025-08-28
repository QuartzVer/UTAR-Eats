// --- Cookie helpers ---
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '');
}

function deleteCookie(name) {
  setCookie(name, '', -1);
}

// --- Login/Logout ---
function login(user) {
  setCookie('loggedInUser', user, 7);
  updateLoginUI();
  restoreUserData(user);
}

function logout() {
  clearUIData(); // visually clear hearts/stars/comments
  deleteCookie('loggedInUser');
  updateLoginUI();
}

// --- Get logged-in user ---
function getLoggedInUser() {
  return getCookie('loggedInUser') || null;
}

// --- Update login status UI ---
function updateLoginUI() {
  const user = getLoggedInUser();
  const statusEl = document.getElementById('login-status');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');

  if (user) {
    statusEl.textContent = `Logged in as: ${user}`;
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    statusEl.textContent = 'Not logged in';
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
}

// --- User-specific data ---
function getUserData() {
  const user = getLoggedInUser();
  if (!user) return { favorites: [], ratings: {}, comments: {} };
  return JSON.parse(localStorage.getItem(`userData_${user}`)) || { favorites: [], ratings: {}, comments: {} };
}

function saveUserData(data) {
  const user = getLoggedInUser();
  if (!user) return;
  localStorage.setItem(`userData_${user}`, JSON.stringify(data));
}

// --- Restore favorites/ratings/comments for logged-in user ---
function restoreUserData(user) {
  const data = getUserData();
  localStorage.setItem('favorites', JSON.stringify(data.favorites));
  localStorage.setItem('ratings', JSON.stringify(data.ratings));
  localStorage.setItem('comments', JSON.stringify(data.comments));
  if (typeof renderFoodItems === 'function') renderFoodItems();
}

// --- Clear only UI elements on logout ---
function clearUIData() {
  const foodCards = document.querySelectorAll('.food-card');
  foodCards.forEach(card => {
    // Heart button
    const favBtn = card.querySelector('.favorite-btn');
    if (favBtn) favBtn.innerHTML = '🤍';

    // Stars
    const stars = card.querySelectorAll('.star-rating .star');
    stars.forEach(s => s.innerHTML = '☆');

    // Comments
    const commentList = card.querySelector('.comments-list');
    if (commentList) commentList.innerHTML = '';
    const commentInput = card.querySelector('.comment-form input');
    if (commentInput) commentInput.value = '';
  });
}

// --- Initialize on page load ---
window.addEventListener('DOMContentLoaded', () => {
  updateLoginUI();

  document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('passwordInput');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  });

  $('#loginModal').on('shown.bs.modal', () => {
    $(document).off('focusin.modal');
    document.getElementById('usernameInput').focus();
  });

  document.getElementById('login-btn').addEventListener('click', () => {
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('loginError').style.display = 'none';
    $('#loginModal').modal('show');
    clearUIData();   // Clear hearts, stars, comments visually
    logout();
  });

  document.getElementById('loginSubmit').addEventListener('click', () => {
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    const errorEl = document.getElementById('loginError');

    if (!username) { errorEl.textContent = 'Please enter a username.'; errorEl.style.display = 'block'; return; }
    if (!password) { errorEl.textContent = 'Please enter a password.'; errorEl.style.display = 'block'; return; }

    errorEl.style.display = 'none';
    login(username);
    $('#loginModal').modal('hide');
  });

  document.getElementById('logout-btn').addEventListener('click', logout);
});
function isLoggedIn() {
    return getLoggedInUser() !== null;
}