// ── THEME ─────────────────────────────────────────
const themeBtn = document.querySelector('.theme-btn');
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  if (themeBtn) themeBtn.textContent = t === 'dark' ? '🌙' : '☀️';
  try { localStorage.setItem('ps_theme', t); } catch(e) {}
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  setTheme(cur === 'dark' ? 'light' : 'dark');
}
try {
  const s = localStorage.getItem('ps_theme');
  if (s) setTheme(s);
} catch(e) {}

// ── NAV SCROLL ────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('solid', window.scrollY > 10);
}, { passive: true });

// ── HAMBURGER ─────────────────────────────────────
function toggleMob() {
  const ham = document.getElementById('ham');
  const mobNav = document.getElementById('mob-nav');
  if (ham) ham.classList.toggle('open');
  if (mobNav) mobNav.classList.toggle('open');
}

// ── WORK ACCORDION ────────────────────────────────
function toggleWork(head) {
  const item = head.closest('.work-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.work-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── SCROLL REVEAL ─────────────────────────────────
function runReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ── CONTACT FORM ─────────────────────────────────
async function sendMsg(e) {
  e.preventDefault();
  const form = document.getElementById('cForm');
  const success = document.getElementById('fSuccess');
  const btn = form ? form.querySelector('.f-sub') : null;
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      if (form) form.style.display = 'none';
      if (success) success.style.display = 'block';
    } else {
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
      alert('Something went wrong. Please email me at prajwalsingh196@gmail.com');
    }
  } catch (err) {
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
    alert('Network error. Please email me at prajwalsingh196@gmail.com');
  }
}

// ── SMOOTH ANCHOR LINKS ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// Run reveal on page load
document.addEventListener('DOMContentLoaded', runReveal);
runReveal();
