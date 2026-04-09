/* ============================================================
   GRAVITEX PAINT — script.js
   Handles: Nav scroll/toggle, Lightbox, Form submission,
            Gallery filter, Scroll animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky Nav ──────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ── Mobile Menu ─────────────────────────────────────────── */
/* ── Mobile Menu ─────────────────────────────────────────── */
/* ── Mobile Menu ─────────────────────────────────────────── */
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    // Change this from 'active' to 'open' to match your CSS logic
    navLinks.classList.toggle('open'); 
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}
  /* ── Active Nav Link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  /* ── Lightbox ────────────────────────────────────────────── */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbClose   = document.getElementById('lightboxClose');

  if (lightbox && lbImg) {
    // Attach to all gallery clickable items
    document.querySelectorAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.lightbox || item.querySelector('img')?.src;
        if (!src) return;
        lbImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lbImg.src = ''; }, 300);
    };

    lbClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ── Gallery Filter (gallery.html) ──────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-page-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.opacity = match ? '1' : '0.25';
          item.style.pointerEvents = match ? 'auto' : 'none';
          item.style.transform = match ? 'scale(1)' : 'scale(0.95)';
          item.style.transition = 'all 0.35s ease';
        });
      });
    });
  }

  /* ── Quote Form Submission ───────────────────────────────── */
  document.querySelectorAll('.quote-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const success = form.querySelector('.form-success');
      const btn = form.querySelector('.form-submit');
      if (!btn) return;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        if (success) {
          success.style.display = 'block';
          success.textContent = '✅ Thank you! Your quote request has been received. We\'ll contact you within 24 hours.';
        }
        btn.textContent = 'Request Sent!';
        form.querySelectorAll('input, select, textarea').forEach(el => el.value = '');

        setTimeout(() => {
          if (success) success.style.display = 'none';
          btn.textContent = 'Request a Quote';
          btn.disabled = false;
        }, 5000);
      }, 1200);
    });
  });

  /* ── Scroll Reveal ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.product-card, .blog-card, .team-card, .value-card, .gallery-item, .gallery-page-item, .blog-post-card, .timeline-item'
  );

  if ('IntersectionObserver' in window && revealEls.length) {
    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.1}s, transform 0.5s ease ${(i % 4) * 0.1}s`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Smooth anchor scroll for CTA buttons ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Hero counter animation ──────────────────────────────── */
  const counters = document.querySelectorAll('.hero-stat-num[data-count]');
  if (counters.length) {
    const countUp = (el) => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * ease) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObs.observe(c));
  }

});
