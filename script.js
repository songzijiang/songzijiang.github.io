// === Particle Background ===
(function() {
  const canvas = document.createElement('canvas');
  const container = document.getElementById('particles');
  if (!container) return;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
      ctx.fill();
    }
  }

  const count = 80;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connections
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
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.reset());
  });

  resize();
  animate();
})();

// === Publication Year Filter ===
(function() {
  const filters = document.querySelectorAll('.pub-filter');
  const items = document.querySelectorAll('.pub-item');

  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const year = btn.dataset.year;
      items.forEach(item => {
        if (year === 'all' || item.dataset.year === year) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

// === Mobile Nav Toggle ===
(function() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close nav on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
})();

// === Smooth Reveal on Scroll ===
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.pub-item, .project-card, .about-card, .research-tag, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();
