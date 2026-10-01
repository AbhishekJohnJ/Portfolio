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

/* ── Theme Toggle ── */
const themes = ['green', 'red', 'cyan', 'yellow'];

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'green';
if (savedTheme !== 'green') {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// Set active color on load
document.querySelectorAll('.theme-color').forEach(color => {
  if (color.dataset.theme === savedTheme) {
    color.classList.add('active');
  } else {
    color.classList.remove('active');
  }
});

// Handle color clicks
document.querySelectorAll('.theme-color').forEach(color => {
  color.addEventListener('click', (e) => {
    e.stopPropagation();
    const newTheme = color.dataset.theme;
    
    // Remove active from all
    document.querySelectorAll('.theme-color').forEach(c => c.classList.remove('active'));
    
    // Add active to clicked
    color.classList.add('active');
    
    // Apply theme
    if (newTheme === 'green') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    
    localStorage.setItem('theme', newTheme);
    console.log('Theme changed to:', newTheme);
  });
});

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

/* ── Stagger Reveal ── */
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); staggerObserver.unobserve(e.target); } });
}, { threshold: 0.08 });

document.querySelectorAll('[data-stagger]').forEach(el => staggerObserver.observe(el));

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

/* ── Particle Background (High-Performance Feather-Light) ── */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d', { alpha: true });
let W, H, particles;
const mouse = { x: -9999, y: -9999 };
const COUNT           = 38;
const CONNECT_DIST_SQ = 135 * 135;
const MOUSE_DIST_SQ   = 110 * 110;

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}, { passive: true });

window.addEventListener('mouseleave', () => {
  mouse.x = -9999;
  mouse.y = -9999;
}, { passive: true });

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function mkParticle() {
  const baseAlpha = Math.random() * 0.3 + 0.12;
  return {
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  Math.random() * 1.8 + 0.8,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    baseAlpha,
    a: baseAlpha,
    twinkleSpeed: Math.random() * 0.012 + 0.003,
    twinkleDir: Math.random() > 0.5 ? 1 : -1,
  };
}

function initParticles() {
  particles = Array.from({ length: COUNT }, mkParticle);
}

function getThemeColors() {
  const theme = document.documentElement.getAttribute('data-theme') || 'green';
  const colors = {
    green:  { rgb: '0,255,80',   rgba: '74,222,128', shadow: '74,222,128' },
    red:    { rgb: '255,80,80',  rgba: '248,113,113', shadow: '239,68,68' },
    cyan:   { rgb: '34,211,238', rgba: '34,211,238', shadow: '6,182,212' },
    yellow: { rgb: '250,204,21', rgba: '250,204,21', shadow: '234,179,8' }
  };
  return colors[theme] || colors.green;
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  const colors = getThemeColors();
  const len = particles.length;

  // 1. Update particles & draw dots in a single batch
  for (let i = 0; i < len; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;

    // Gentle twinkle
    p.a += p.twinkleSpeed * p.twinkleDir;
    if (p.a >= p.baseAlpha + 0.15 || p.a <= p.baseAlpha - 0.05) p.twinkleDir *= -1;

    // Mouse repulsion with squared check
    const mdx = p.x - mouse.x;
    const mdy = p.y - mouse.y;
    const mDistSq = mdx * mdx + mdy * mdy;
    if (mDistSq < MOUSE_DIST_SQ && mDistSq > 0) {
      const mDist = Math.sqrt(mDistSq);
      const force = (110 - mDist) / 110;
      p.x += (mdx / mDist) * force * 2;
      p.y += (mdy / mDist) * force * 2;
    }

    // Draw particle circle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 6.28318);
    ctx.fillStyle = `rgba(${colors.rgba},${p.a.toFixed(2)})`;
    ctx.fill();
  }

  // 2. Batch all connecting lines into ONE single stroke call
  ctx.beginPath();
  ctx.strokeStyle = `rgba(${colors.shadow},0.12)`;
  ctx.lineWidth   = 0.6;
  for (let i = 0; i < len; i++) {
    const pi = particles[i];
    for (let j = i + 1; j < len; j++) {
      const pj = particles[j];
      const dx = pi.x - pj.x;
      const dy = pi.y - pj.y;
      if (dx * dx + dy * dy < CONNECT_DIST_SQ) {
        ctx.moveTo(pi.x, pi.y);
        ctx.lineTo(pj.x, pj.y);
      }
    }

    // Optional mouse connector
    const mdx = pi.x - mouse.x;
    const mdy = pi.y - mouse.y;
    if (mdx * mdx + mdy * mdy < MOUSE_DIST_SQ) {
      ctx.moveTo(pi.x, pi.y);
      ctx.lineTo(mouse.x, mouse.y);
    }
  }
  ctx.stroke();

  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
resize();
initParticles();
drawParticles();

/* ── Certificate Lightbox ── */
let openedFromAllCertsModal = false;

function openCert(src, title) {
  // Check if the all-certificates modal is open
  const allCertsModal = document.getElementById('all-certs-modal');
  if (allCertsModal && allCertsModal.classList.contains('active')) {
    openedFromAllCertsModal = true;
    allCertsModal.classList.remove('active'); // Close it temporarily
  } else {
    openedFromAllCertsModal = false;
  }
  
  document.getElementById('cert-modal-img').src = src;
  document.getElementById('cert-modal-title').textContent = title;
  document.getElementById('cert-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCert(e) {
  if (e && e.target !== document.getElementById('cert-modal') && !e.target.classList.contains('cert-close')) return;
  document.getElementById('cert-modal').classList.remove('open');
  
  // If it was opened from all-certs modal, return to it
  if (openedFromAllCertsModal) {
    const allCertsModal = document.getElementById('all-certs-modal');
    allCertsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    openedFromAllCertsModal = false;
  } else {
    document.body.style.overflow = '';
  }
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
  const TRAIL_LEN = 28;
  const points    = [];
  let   cx = -999, cy = -999;
  let   isPointer = false;

  const tc = document.createElement('canvas');
  tc.id    = 'cursor-trail';
  tc.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;';
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
    cx = e.clientX;
    cy = e.clientY;
    isPointer = !!(e.target && e.target.closest && e.target.closest('a, button, [role="button"], input, textarea, label, .cert-card, .project-card, .profile-card, .cc-badge, .btn'));
  }, { passive: true });

  // Animated ring radius for smooth scale transition
  let ringR = 9;

  function getCursorColors() {
    const theme = document.documentElement.getAttribute('data-theme') || 'green';
    const colors = {
      green:  { base: '34,197,94',  bright: '74,222,128' },
      red:    { base: '239,68,68',  bright: '248,113,113' },
      cyan:   { base: '6,182,212',  bright: '34,211,238' },
      yellow: { base: '234,179,8',  bright: '250,204,21' }
    };
    return colors[theme] || colors.green;
  }

  function drawTrail() {
    points.push({ x: cx, y: cy });
    if (points.length > TRAIL_LEN) points.shift();

    const targetR = isPointer ? 16 : 9;
    ringR += (targetR - ringR) * 0.2;

    tctx.clearRect(0, 0, TW, TH);
    const colors = getCursorColors();

    // ── Comet tail ──
    if (points.length > 2) {
      tctx.beginPath();
      tctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const mx = (points[i - 1].x + points[i].x) / 2;
        const my = (points[i - 1].y + points[i].y) / 2;
        tctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, mx, my);
      }
      const grad = tctx.createLinearGradient(
        points[0].x, points[0].y,
        points[points.length - 1].x, points[points.length - 1].y
      );
      grad.addColorStop(0,   `rgba(${colors.base},0)`);
      grad.addColorStop(0.6, `rgba(${colors.bright},0.25)`);
      grad.addColorStop(1,   `rgba(${colors.bright},0.85)`);
      tctx.strokeStyle = grad;
      tctx.lineWidth   = 2.2;
      tctx.lineCap     = 'round';
      tctx.lineJoin    = 'round';
      tctx.stroke();
    }

    if (cx > 0) {
      if (isPointer) {
        // ── Pointer state: rotating diamond ──
        const t   = Date.now() * 0.003;
        const s   = 10 + Math.sin(t * 2) * 2;
        const rot = t;

        tctx.save();
        tctx.translate(cx, cy);
        tctx.rotate(rot);

        // Outer diamond
        tctx.beginPath();
        tctx.moveTo(0, -s);
        tctx.lineTo(s, 0);
        tctx.lineTo(0, s);
        tctx.lineTo(-s, 0);
        tctx.closePath();
        tctx.strokeStyle = `rgba(${colors.bright},0.95)`;
        tctx.lineWidth   = 1.5;
        tctx.stroke();

        // Inner diamond
        tctx.rotate(-rot * 2);
        const si = s * 0.45;
        tctx.beginPath();
        tctx.moveTo(0, -si);
        tctx.lineTo(si, 0);
        tctx.lineTo(0, si);
        tctx.lineTo(-si, 0);
        tctx.closePath();
        tctx.fillStyle  = `rgba(${colors.bright},0.28)`;
        tctx.fill();
        tctx.strokeStyle = `rgba(${colors.bright},0.6)`;
        tctx.lineWidth   = 1;
        tctx.stroke();

        tctx.restore();

      } else {
        // ── Default state: subtle outer glow ring + core ring + center dot ──
        tctx.beginPath();
        tctx.arc(cx, cy, ringR + 3, 0, 6.28318);
        tctx.strokeStyle = `rgba(${colors.bright},0.25)`;
        tctx.lineWidth   = 2;
        tctx.stroke();

        tctx.beginPath();
        tctx.arc(cx, cy, ringR, 0, 6.28318);
        tctx.strokeStyle = `rgba(${colors.bright},0.95)`;
        tctx.lineWidth   = 1.5;
        tctx.stroke();

        tctx.beginPath();
        tctx.arc(cx, cy, 2.5, 0, 6.28318);
        tctx.fillStyle   = `rgba(${colors.bright},1)`;
        tctx.fill();
      }
    }

    requestAnimationFrame(drawTrail);
  }
  drawTrail();
})();

/* ── Demo Button Footer Hint ── */
document.querySelectorAll('.card-link-btn[data-hint]').forEach(btn => {
  const card = btn.closest('.project-card');
  if (!card) return;
  const hint = card.querySelector('.card-footer-hint');
  if (!hint) return;
  btn.addEventListener('mouseenter', () => {
    hint.textContent = btn.dataset.hint;
    hint.classList.add('visible');
  });
  btn.addEventListener('mouseleave', () => {
    hint.classList.remove('visible');
  });
});


// ── Toggle Certificates ──
function openAllCertsModal() {
  const modal = document.getElementById('all-certs-modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAllCertsModal() {
  const modal = document.getElementById('all-certs-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  const modal = document.getElementById('all-certs-modal');
  if (e.target === modal) {
    closeAllCertsModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeAllCertsModal();
  }
});

/* ══════════════════════════════════════════════════════════════════
   PREMIUM UNIFIED MOTION & SCROLL ENGINE
   ══════════════════════════════════════════════════════════════════ */

(function initMotionEngine() {
  // Mark document ready for scroll-driven CSS states
  document.documentElement.classList.add('js-scroll-ready');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // DOM Elements
  const scrollBar     = document.getElementById('scroll-progress');
  const hero          = document.getElementById('hero');
  const heroInner     = hero ? hero.querySelector('.hero-inner') : null;
  const scrollHint    = hero ? hero.querySelector('.hero-scroll-hint') : null;
  const timelineWrap  = document.querySelector('#experience .timeline-wrap');
  const timelineLine  = document.getElementById('exp-timeline-line');
  const expItems      = document.querySelectorAll('#experience [data-exp-item]');
  const navbarEl      = document.getElementById('navbar');

  /* ── 1. Unified Master RAF Scroll Loop ── */
  let scrollTicking = false;
  let lastProgressWidth = -1;

  function onMasterScroll() {
    const sy   = window.scrollY;
    const vpH  = window.innerHeight;
    const docH = document.documentElement.scrollHeight - vpH;

    // A. Top Progress Bar
    if (scrollBar && docH > 0) {
      const progress = Math.min(100, Math.max(0, (sy / docH) * 100));
      if (Math.abs(progress - lastProgressWidth) > 0.15) {
        scrollBar.style.width = progress.toFixed(2) + '%';
        lastProgressWidth = progress;
      }
    }

    // B. Navbar scroll state
    if (navbarEl) {
      navbarEl.classList.toggle('scrolled', sy > 25);
    }

    if (!reducedMotion) {
      // C. Subtle Hero Parallax & Scroll Hint Fade (GPU Accelerated)
      if (hero && heroInner && !isTouchDevice()) {
        const heroH = hero.offsetHeight || 600;
        if (sy <= heroH) {
          const heroProgress = sy / heroH;
          heroInner.style.transform = `translate3d(0, ${(sy * 0.15).toFixed(1)}px, 0)`;
          if (scrollHint) {
            scrollHint.style.opacity = Math.max(0, 1 - heroProgress * 3.5).toFixed(2);
            scrollHint.style.transform = `translate3d(0, ${(heroProgress * 16).toFixed(1)}px, 0)`;
          }
        } else if (heroInner.style.transform !== '') {
          heroInner.style.transform = '';
        }
      }

      // D. Experience Timeline dynamic progress
      if (timelineWrap && timelineLine && expItems.length) {
        const wrapRect = timelineWrap.getBoundingClientRect();
        const wrapH    = timelineWrap.offsetHeight;
        const scrolled = Math.max(0, vpH - wrapRect.top);
        const progress = Math.min(1, scrolled / (wrapH + vpH * 0.45));
        timelineLine.style.height = (progress * 100).toFixed(1) + '%';

        expItems.forEach(item => {
          const node = item.querySelector('.timeline-node');
          if (!node) return;
          const nodeRect = node.getBoundingClientRect();
          if (nodeRect.top < vpH * 0.76) {
            item.classList.add('item-active');
          }
        });
      }
    }

    scrollTicking = false;
  }

  function requestScrollTick() {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onMasterScroll);
    }
  }

  window.addEventListener('scroll', requestScrollTick, { passive: true });
  // Initial frame
  requestScrollTick();

  /* ── 2. Smooth Anchor Navigation ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const navOffset = navbarEl ? navbarEl.offsetHeight : 70;
      const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navOffset + 2;

      window.scrollTo({
        top: Math.max(0, targetPos),
        behavior: 'smooth'
      });

      // Update URL hash without jumping
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    });
  });

  if (reducedMotion) {
    // If reduced motion is requested, activate timeline immediately
    expItems.forEach(item => item.classList.add('item-active'));
    if (timelineLine) timelineLine.style.height = '100%';
    return;
  }

  /* ── 3. Section Titles & Subtitles Reveal ── */
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('title-revealed');
      const sub = entry.target.nextElementSibling;
      if (sub && sub.classList.contains('section-sub')) {
        sub.classList.add('sub-revealed');
      }
      titleObserver.unobserve(entry.target);
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.section-title').forEach(el => titleObserver.observe(el));

  /* ── 4. About Split Parallax Reveal ── */
  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      splitObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('[data-split-left], [data-split-right]').forEach(el => {
    splitObserver.observe(el);
  });

  /* ── 5. Project Cards Scroll Entrance (Clean Stagger Cleanup) ── */
  const projectCards = document.querySelectorAll('#projects .project-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      card.classList.add('card-in-view');
      // Clear inline transition-delay after reveal so hover transitions are instantaneous
      setTimeout(() => {
        card.style.transitionDelay = '';
      }, 650);
      cardObserver.unobserve(card);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  projectCards.forEach((card, i) => {
    card.classList.add('scroll-reveal-card');
    const delay = (i % 3) * 70;
    card.style.transitionDelay = delay + 'ms';
    cardObserver.observe(card);
  });

  /* ── 6. Certificate Cards 3D Tilt & Tactile Elevation ── */
  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      if (isTouchDevice() || window.innerWidth < 768) return;
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2;
      const cy    = rect.top  + rect.height / 2;
      const rotX  = ((e.clientY - cy) / (rect.height / 2)) * -6;
      const rotY  = ((e.clientX - cx) / (rect.width / 2)) * 6;
      card.style.transform = `translateY(-7px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      card.style.transition = 'transform 0.08s ease-out';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.3s';
    });
  });

  /* ── 7. Contact Convergence Reveal ── */
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      contactObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('[data-contact-left], [data-contact-right]').forEach(el => {
    contactObserver.observe(el);
  });

})();


