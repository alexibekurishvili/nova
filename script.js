/**
 * NEXUS - Interactive Landing Page Logic
 * Vanilla JavaScript • High Performance • Clean Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Theme Switcher (Dark / Light Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('nexus_theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(targetTheme);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('nexus_theme', theme);
  }

  /* ==========================================================================
     2. Sticky Header & Active Navigation Spy
     ========================================================================== */
  const mainHeader = document.getElementById('mainHeader');
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('#desktopNav .nav-link');
  const mobileNavLinks = document.querySelectorAll('#mobileNav .mobile-nav-link');

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  function handleHeaderScroll() {
    const scrollPos = window.scrollY;

    // Header blur and background trigger
    if (mainHeader) {
      if (scrollPos > 30) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    // Scroll spy for current active section
    const scrollCheck = scrollPos + 150;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollCheck >= sectionTop && scrollCheck < sectionTop + sectionHeight) {
        updateActiveNavLinks(sectionId);
      }
    });
  }

  function updateActiveNavLinks(activeId) {
    desktopNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     3. Mobile Navigation Menu Toggle
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileMenuToggle.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainHeader.contains(e.target) && mobileNav.classList.contains('open')) {
        mobileMenuToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ==========================================================================
     4. Hero Visual 3D Tilt Effect
     ========================================================================== */
  const tiltContainer = document.getElementById('tiltContainer');
  if (tiltContainer && window.innerWidth > 992) {
    const parentBox = tiltContainer.parentElement;

    parentBox.addEventListener('mousemove', (e) => {
      const rect = parentBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle rotation values
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      tiltContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    parentBox.addEventListener('mouseleave', () => {
      tiltContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* ==========================================================================
     5. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ==========================================================================
     6. Stats Counter Animation (About Section)
     ========================================================================== */
  const statsSection = document.getElementById('statsSection');
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimatedStats = false;

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;
          startStatsCounters();
        }
      });
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
  }

  function startStatsCounters() {
    statNumbers.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = counter.hasAttribute('data-decimal');
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // EaseOutQuart easing
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentVal = target * ease;

        if (isDecimal) {
          counter.textContent = currentVal.toFixed(1);
        } else {
          counter.textContent = Math.floor(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = isDecimal ? target.toFixed(1) : target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  /* ==========================================================================
     7. Interactive Feature Category Tabs Filtering
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const featureCards = document.querySelectorAll('.feature-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      featureCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hide');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ==========================================================================
     8. Contact Form Validation & Async Submission Simulation
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  if (contactForm) {
    // Real-time input cleanup
    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
        const errEl = document.getElementById(`${input.name}Error`);
        if (errEl) errEl.classList.remove('visible');
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.classList.add('input-error');
        nameError.classList.add('visible');
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('input-error');
        emailError.classList.add('visible');
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 5) {
        messageInput.classList.add('input-error');
        messageError.classList.add('visible');
        isValid = false;
      }

      if (!isValid) return;

      // Enter loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate asynchronous transmission
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success alert inside form
        formSuccessAlert.style.display = 'flex';
        
        // Reset inputs
        contactForm.reset();

        // Trigger floating toast notification
        showToast('შეტყობინება წარმატებით გაიგზავნა! მალე დაგიკავშირდებით.');

        // Hide alert after 7 seconds
        setTimeout(() => {
          formSuccessAlert.style.display = 'none';
        }, 7000);
      }, 1000);
    });
  }

  /* ==========================================================================
     9. Newsletter Subscription Form
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input && input.value.trim()) {
        input.value = '';
        newsletterSuccess.style.display = 'block';
        showToast('გმადლობთ გამოწერისთვის!');
        setTimeout(() => {
          newsletterSuccess.style.display = 'none';
        }, 5000);
      }
    });
  }

  /* ==========================================================================
     10. Scroll-To-Top Button with Circular Progress Ring
     ========================================================================== */
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  const progressCircle = document.querySelector('.progress-ring-circle');
  const circumference = 2 * Math.PI * 20; // r = 20

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollToTopBtn) {
      if (scrollTop > 350) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }

    if (progressCircle && docHeight > 0) {
      const scrollPercent = Math.min(scrollTop / docHeight, 1);
      const offset = circumference - (scrollPercent * circumference);
      progressCircle.style.strokeDashoffset = offset;
    }
  }, { passive: true });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     11. Global Toast Notification System
     ========================================================================== */
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message, duration = 4000) {
    if (!toastNotification || !toastMessage) return;

    toastMessage.textContent = message;
    toastNotification.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, duration);
  }
});
