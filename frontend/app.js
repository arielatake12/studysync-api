const API_URL = "http://localhost:3000";

// ─────────────────────────────
// 🔐 TOKEN
// ─────────────────────────────
function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

// ─────────────────────────────
// 🌐 FETCH CON JWT
// ─────────────────────────────
async function fetchAuth(url, options = {}) {
  return fetch(API_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
      ...options.headers
    }
  });
}

// ─────────────────────────────
// 🚪 LOGOUT
// ─────────────────────────────
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}