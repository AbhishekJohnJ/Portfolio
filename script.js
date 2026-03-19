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
  btn.style.color = '#555';
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
const mouse = { x: -9999, y: -9999 };
const CONNECT_DIST = 150;
const MOUSE_DIST   = 120;
const COUNT        = 80;

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function mkParticle() {
  const baseAlpha = Math.random() * 0.35 + 0.08;
  return {
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  Math.random() * 1.6 + 0.4,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    baseAlpha,
    a: baseAlpha,
    // twinkle
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinkleDir: Math.random() > 0.5 ? 1 : -1,
  };
}

function initParticles() {
  particles = Array.from({ length: COUNT }, mkParticle);
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);

  // Update & draw dots
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

    // Twinkle
    p.a += p.twinkleSpeed * p.twinkleDir;
    if (p.a >= p.baseAlpha + 0.18 || p.a <= p.baseAlpha - 0.06) p.twinkleDir *= -1;

    // Mouse repulsion
    const mdx = p.x - mouse.x;
    const mdy = p.y - mouse.y;
    const md  = Math.sqrt(mdx * mdx + mdy * mdy);
    if (md < MOUSE_DIST) {
      const force = (MOUSE_DIST - md) / MOUSE_DIST;
      p.x += (mdx / md) * force * 2.5;
      p.y += (mdy / md) * force * 2.5;
    }

    // Glow for larger particles
    if (p.r > 1.2) {
      ctx.shadowBlur  = 6;
      ctx.shadowColor = `rgba(74,222,128,${p.a * 0.8})`;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34,197,94,${p.a})`;
    ctx.fill();
  });

  ctx.shadowBlur = 0;

  // Connection lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DIST) {
        const alpha = 0.18 * (1 - dist / CONNECT_DIST);
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(34,197,94,${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }

    // Lines from particle to mouse cursor
    const mdx  = particles[i].x - mouse.x;
    const mdy  = particles[i].y - mouse.y;
    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mdist < MOUSE_DIST) {
      const alpha = 0.45 * (1 - mdist / MOUSE_DIST);
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = `rgba(74,222,128,${alpha})`;
      ctx.lineWidth   = 0.8;
      ctx.stroke();
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

/* ── Projects: Click, Tilt, Ripple, Modal ── */
const projectCards = document.querySelectorAll('.project-card[data-url]');
const modal        = document.getElementById('project-modal');
const modalClose   = document.getElementById('modal-close');
const isMobile     = () => window.innerWidth < 768;

// Card click → GitHub (ignore clicks on btn-details or card-link-btn)
projectCards.forEach(card => {
  card.style.cursor = 'pointer';

  card.addEventListener('click', e => {
    if (e.target.closest('.btn-details') || e.target.closest('.card-link-btn')) return;
    window.open(card.dataset.url, '_blank');
  });

  // Ripple
  card.addEventListener('mousedown', e => {
    if (e.target.closest('.btn-details') || e.target.closest('.card-link-btn')) return;
    const rect   = card.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // 3D Tilt (desktop only)
  card.addEventListener('mousemove', e => {
    if (isMobile()) return;
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const rotX  = ((e.clientY - cy) / (rect.height / 2)) * -5;
    const rotY  = ((e.clientX - cx) / (rect.width  / 2)) *  5;
    card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.transition = 'transform 0.05s linear';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, border-color 0.3s, box-shadow 0.3s';
  });
});

// Modal open
document.querySelectorAll('.btn-details').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card     = btn.closest('.project-card');
    const features = card.dataset.features.split('|');
    const stack    = card.dataset.stack.split(',');

    document.getElementById('modal-tag').textContent   = card.querySelector('.card-tag').textContent;
    document.getElementById('modal-title').innerHTML   = card.dataset.title;
    document.getElementById('modal-desc').textContent  = card.dataset.desc;
    document.getElementById('modal-gh-btn').href       = card.dataset.url;

    const featEl = document.getElementById('modal-features');
    featEl.innerHTML = features.map(f => `<li>${f}</li>`).join('');

    const stackEl = document.getElementById('modal-stack');
    stackEl.innerHTML = stack.map(s => `<span>${s.trim()}</span>`).join('');

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

// Modal close
function closeProjectModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeProjectModal);
modal.addEventListener('click', e => { if (e.target === modal) closeProjectModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProjectModal(); });

/* ── CodeChef Badge Preview ── */
const badgeModal      = document.getElementById('badge-modal');
const badgeModalImg   = document.getElementById('badge-modal-img');
const badgeModalTitle = document.getElementById('badge-modal-title');
const badgeModalClose = document.getElementById('badge-modal-close');

document.querySelectorAll('.cc-badge[data-src]').forEach(badge => {
  badge.style.cursor = 'pointer';
  badge.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    badgeModalImg.src       = badge.dataset.src;
    badgeModalTitle.textContent = badge.dataset.title;
    badgeModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

badgeModalClose.addEventListener('click', () => {
  badgeModal.style.display = 'none';
  document.body.style.overflow = '';
});
badgeModal.addEventListener('click', e => {
  if (e.target === badgeModal) {
    badgeModal.style.display = 'none';
    document.body.style.overflow = '';
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && badgeModal.style.display === 'flex') {
    badgeModal.style.display = 'none';
    document.body.style.overflow = '';
  }
});

/* ── Cursor Trail ── */
(function () {
  const trail = [];
  const MAX   = 22;
  let   animId;

  // Off-screen canvas overlay (above particles, below content)
  const tc  = document.createElement('canvas');
  tc.id     = 'cursor-trail';
  tc.style.cssText = 'position:fixed;inset:0;z-index:2;pointer-events:none;';
  document.body.appendChild(tc);
  const tctx = tc.getContext('2d');
  let TW, TH;

  function resizeTrail() {
    TW = tc.width  = window.innerWidth;
    TH = tc.height = window.innerHeight;
  }
  resizeTrail();
  window.addEventListener('resize', resizeTrail);

  window.addEventListener('mousemove', e => {
    trail.push({ x: e.clientX, y: e.clientY, a: 1, r: Math.random() * 2.5 + 1 });
    if (trail.length > MAX) trail.shift();
  });

  function drawTrail() {
    tctx.clearRect(0, 0, TW, TH);
    for (let i = 0; i < trail.length; i++) {
      const t     = trail[i];
      const frac  = i / trail.length;          // 0 = oldest, 1 = newest
      t.a         = frac * 0.7;
      const r     = t.r * frac;

      // Glow
      tctx.shadowBlur  = 8 * frac;
      tctx.shadowColor = `rgba(74,222,128,${t.a})`;

      tctx.beginPath();
      tctx.arc(t.x, t.y, Math.max(r, 0.1), 0, Math.PI * 2);
      tctx.fillStyle = `rgba(74,222,128,${t.a})`;
      tctx.fill();
    }
    tctx.shadowBlur = 0;
    animId = requestAnimationFrame(drawTrail);
  }
  drawTrail();
})();
