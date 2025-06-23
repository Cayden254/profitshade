// main.js

import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

import {
  doc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

// UI Elements
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

// Handle login
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Login error:', error);
    loginError.classList.remove('hidden');
  }
});

// After login
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Fetch role from Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      initDashboard(userData.role);
    } else {
      console.error('User data not found');
    }
  }
});

function initDashboard(role) {
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  const sidebar = document.getElementById('sidebar-tabs');
  sidebar.innerHTML = '';

  // Base user tabs
  const tabs = [
    { id: 'even-odd', label: 'Even/Odd' },
    { id: 'over-under', label: 'Over/Under' },
    { id: 'matches-differs', label: 'Matches/Differs' },
    { id: 'rise-fall', label: 'Rise/Fall' },
    { id: 'risk-calc', label: 'Risk Calculator' },
  ];

  // Add additional tabs based on role
  if (role === 'secondary-admin' || role === 'admin') {
    tabs.push({ id: 'account-creation', label: 'Create Accounts' });
  }
  if (role === 'admin') {
    tabs.push({ id: 'permissions', label: 'Permissions' });
    tabs.push({ id: 'user-stats', label: 'User Stats' });
  }

  // Render tabs
  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.textContent = tab.label;
    btn.dataset.tab = tab.id;
    btn.onclick = () => loadTab(tab.id);
    sidebar.appendChild(btn);
  });
}

function loadTab(tabId) {
  const content = document.getElementById('tab-content');
  content.innerHTML = `<div class="glass-card">Loading ${tabId.replace('-', ' ')}...</div>`;
  // In real usage, you would dynamically import tab modules or load HTML
}

// Optionally: Add logout, token validation, and more controls in future
