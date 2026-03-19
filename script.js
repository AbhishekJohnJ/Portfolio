/* ── Typing Animation ── */
const phrases = [
  'Aspiring Developer',
  'AI Enthusiast',
  'Problem Solver',
  'Open Source Contributor'
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = phrases[pi];
  typedEl.textContent = deleting
    ? current.slice(0, --ci)
    : current.slice(0, ++ci);

  let delay = deleting ? 50 : 90;
  if (!deleting && ci === current.length) { delay = 1800; deleting = true; }
  else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
  setTimeout(type, delay);
}
type();

/* ── Sticky Navbar ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Active Nav Link ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── Hamburger Menu ── */
const hamburger = document.querySelector('.hamburger');
const navList   = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navList.classList.toggle('open'));
navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navList.classList.remove('open')));

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });

document.querySelectorAll('[data-aos]').forEach(el => revealObserver.observe(el));

/* ── Contact Form ── */
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Message Sent ✓';
  btn.disabled = true;
  btn.style.background = '#1a1a1a';
  btn.style.color = '#888';
  setTimeout(() => {
    btn.textContent = 'Send Message ✉';
    btn.disabled = false;
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 3500);
});

/* ── Particle Background ── */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, particles;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function initParticles() {
  particles = Array.from({ length: 80 }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  Math.random() * 1.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    a:  Math.random() * 0.5 + 0.1
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.a})`;
    ctx.fill();
  });

  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
resize();
initParticles();
drawParticles();

/* ── Certificate Lightbox ── */
function openCert(src, title) {
  document.getElementById('cert-modal-img').src = src;
  document.getElementById('cert-modal-title').textContent = title;
  document.getElementById('cert-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCert(e) {
  if (e && e.target !== document.getElementById('cert-modal') && !e.target.classList.contains('cert-close')) return;
  document.getElementById('cert-modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCert({ target: document.getElementById('cert-modal') });
});
