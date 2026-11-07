/* ===================================================================
   MAHAD AZIZ — CINEMATIC 4K PORTFOLIO JAVASCRIPT
   Interactive Engine: Audio Synth, Constellation Canvas, Modal Lightbox, Cursor
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initSoundEngine();
  initScrollEffects();
  initConstellationCanvas();
  initLightbox();
  initServicesFilter();
  initContactInteractions();
});

/* ===================================================================
   1. CUSTOM CURSOR
   =================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  // Don't enable on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Hover expansion on interactive elements
  const interactiveTargets = document.querySelectorAll('a, button, input, textarea, select, .vault-item, .service-card, .project-item-card, .pillar-card');
  interactiveTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '55px';
      ring.style.height = '55px';
      ring.style.borderColor = 'rgba(255, 34, 51, 0.9)';
      ring.style.backgroundColor = 'rgba(229, 9, 20, 0.08)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(229, 9, 20, 0.6)';
      ring.style.backgroundColor = 'transparent';
    });
  });
}

/* ===================================================================
   2. SOUND ENGINE (Web Audio API Synthesizer)
   =================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initSoundEngine() {
  const toggleBtn = document.getElementById('soundToggleBtn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    soundEnabled = !soundEnabled;
    toggleBtn.classList.toggle('active', soundEnabled);
    const label = toggleBtn.querySelector('.sound-label');
    if (label) {
      label.textContent = soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
    }

    if (soundEnabled) {
      playTone(520, 0.12, 'sine', 0.15);
      showToast('Cinematic Audio Atmosphere Enabled');
    } else {
      showToast('Audio Muted');
    }
  });

  // Sound cues on button clicks
  document.querySelectorAll('.btn-primary, .btn-secondary, .service-tab-btn, .visual-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (soundEnabled) {
        playTone(440, 0.08, 'triangle', 0.1);
        setTimeout(() => playTone(880, 0.06, 'sine', 0.08), 40);
      }
    });
  });
}

function playTone(freq, duration, type = 'sine', gainVal = 0.1) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/* ===================================================================
   3. SCROLL EFFECTS & NAVBAR
   =================================================================== */
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (navbar) {
      if (currentScroll > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // ScrollSpy active link
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   4. CONSTELLATION CANVAS (MY TECHNOLOGY UNIVERSE)
   =================================================================== */
function initConstellationCanvas() {
  const canvas = document.getElementById('constellationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const numParticles = 45;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1.2;
      this.isRed = Math.random() > 0.4;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isRed ? '#ff2233' : 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = this.isRed ? 8 : 4;
      ctx.shadowColor = this.isRed ? '#e50914' : '#ffffff';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = 1 - dist / 110;
          ctx.strokeStyle = `rgba(229, 9, 20, ${alpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ===================================================================
   5. LIGHTBOX MODAL (4K VISUAL VIEWER)
   =================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalCaption = document.getElementById('lightboxCaption');
  const modalClose = document.getElementById('lightboxClose');
  const modalDownload = document.getElementById('lightboxDownload');

  if (!modal || !modalImg) return;

  function openLightbox(src, title, caption) {
    modalImg.src = src;
    modalTitle.textContent = title || '4K Cinematic Portfolio Master Visual';
    modalCaption.textContent = caption || 'High-Resolution Editorial Portfolio Asset — IMPACT Enterprise';
    if (modalDownload) {
      modalDownload.href = src;
      modalDownload.setAttribute('download', src.split('/').pop());
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (soundEnabled) playTone(650, 0.1, 'sine', 0.1);
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Trigger buttons with data-visual attributes
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-visual-src') || el.querySelector('img')?.src;
      const title = el.getAttribute('data-visual-title') || 'Master Portfolio Visual';
      const caption = el.getAttribute('data-visual-caption') || '';
      if (src) openLightbox(src, title, caption);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ===================================================================
   6. SERVICES FILTER
   =================================================================== */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-category');

      serviceCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   7. CONTACT & CLIPBOARD INTERACTIONS
   =================================================================== */
function initContactInteractions() {
  // Copy to clipboard for contact placeholders
  document.querySelectorAll('[data-copy]').forEach(item => {
    item.addEventListener('click', () => {
      const textToCopy = item.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to Clipboard: ${textToCopy}`);
          if (soundEnabled) playTone(780, 0.08, 'sine', 0.12);
        }).catch(() => {
          showToast(`Value: ${textToCopy}`);
        });
      }
    });
  });

  // Contact Form Submission Handler
  const contactForm = document.getElementById('portfolioContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>TRANSMITTING INQUIRY...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<span>INQUIRY TRANSMITTED SUCCESSFULLY ✓</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        showToast("Thank you! Your message has been sent to Mahad Aziz & IMPACT Enterprise.");
        if (soundEnabled) {
          playTone(523, 0.1, 'sine', 0.1);
          setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 100);
          setTimeout(() => playTone(783, 0.15, 'sine', 0.12), 200);
        }
        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3500);
      }, 1200);
    });
  }
}

/* Toast Notification Utility */
function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
