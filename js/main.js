/* ===================================================================
   ORIONIS AUTOMOTIVE PVT LTD - CORE INTERACTIVE ENGINE
   Handles Theme Switching, Glasurit Paint Visualizer, Before/After Slider,
   Cost Estimator, Modal Dialogs & Form Actions
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initMobileNav();
  initGlasuritVisualizer();
  initBeforeAfterSlider();
  initCostEstimator();
  initArtefactFilter();
  initFaqAccordion();
  initModalAndForms();
});

/* --------------------------------------------------
   1. Theme Switching Engine (Apex Dark, OEM Clean, Cyber Velocity)
-------------------------------------------------- */
function initThemeEngine() {
  const themeBtns = document.querySelectorAll('.theme-pill-btn');
  const body = document.body;
  const currentThemeLabel = document.getElementById('current-theme-label');

  // Load saved theme or default to apex-dark
  const savedTheme = localStorage.getItem('orionis_theme') || 'apex-dark';
  applyTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTheme = btn.dataset.theme;
      applyTheme(targetTheme);
      showToast(`Switched to: ${btn.textContent.trim()} Design`);
    });
  });

  function applyTheme(themeKey) {
    if (themeKey === 'apex-dark') {
      body.removeAttribute('data-theme');
    } else {
      body.setAttribute('data-theme', themeKey);
    }

    localStorage.setItem('orionis_theme', themeKey);

    themeBtns.forEach(btn => {
      if (btn.dataset.theme === themeKey) {
        btn.classList.add('active');
        if (currentThemeLabel) {
          currentThemeLabel.textContent = btn.dataset.name || btn.textContent.trim();
        }
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------
   2. Mobile Navigation Toggle
-------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }
}

/* --------------------------------------------------
   3. Glasurit Paint Customizer (Interactive Color & Finish Lab)
-------------------------------------------------- */
function initGlasuritVisualizer() {
  const swatches = document.querySelectorAll('.swatch-btn');
  const finishBtns = document.querySelectorAll('.finish-btn');
  const carBodyPath = document.getElementById('car-body-fill');
  const paintNameLabel = document.getElementById('current-paint-name');
  const paintCodeLabel = document.getElementById('current-paint-code');
  const carCanvas = document.querySelector('.car-canvas-display');

  if (!carBodyPath) return;

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const color = swatch.dataset.color;
      const name = swatch.dataset.name;
      const code = swatch.dataset.code;

      carBodyPath.setAttribute('fill', color);
      if (paintNameLabel) paintNameLabel.textContent = name;
      if (paintCodeLabel) paintCodeLabel.textContent = code;
    });
  });

  finishBtns.forEach(fBtn => {
    fBtn.addEventListener('click', () => {
      finishBtns.forEach(b => b.classList.remove('active'));
      fBtn.classList.add('active');

      const finishType = fBtn.dataset.finish;
      if (carCanvas) {
        carCanvas.classList.remove('finish-gloss', 'finish-matte', 'finish-pearl', 'finish-metallic');
        carCanvas.classList.add(`finish-${finishType}`);
      }
    });
  });
}

/* --------------------------------------------------
   4. Before & After Restoration Slider
-------------------------------------------------- */
function initBeforeAfterSlider() {
  const rangeInput = document.querySelector('.ba-range-input');
  const beforeDiv = document.querySelector('.ba-before');
  const handle = document.querySelector('.ba-handle');

  if (rangeInput && beforeDiv && handle) {
    const updateSlider = () => {
      const val = rangeInput.value;
      beforeDiv.style.width = `${val}%`;
      handle.style.left = `${val}%`;
    };

    rangeInput.addEventListener('input', updateSlider);
    rangeInput.addEventListener('change', updateSlider);
  }
}

/* --------------------------------------------------
   5. Interactive Service Cost & Time Estimator
-------------------------------------------------- */
function initCostEstimator() {
  const vehicleSelect = document.getElementById('est-vehicle');
  const serviceSelect = document.getElementById('est-service');
  const addonCheckboxes = document.querySelectorAll('.est-addon');
  const costOutput = document.getElementById('estimated-cost-val');
  const timeOutput = document.getElementById('estimated-time-val');
  const bookEstimateBtn = document.getElementById('btn-book-estimate');

  if (!vehicleSelect || !serviceSelect) return;

  function calculateEstimate() {
    const vehicleMultiplier = parseFloat(vehicleSelect.value) || 1.0;
    const baseServicePrice = parseFloat(serviceSelect.value) || 4500;
    const baseServiceTime = parseInt(serviceSelect.selectedOptions[0]?.dataset.time || 6);

    let addonsTotal = 0;
    let extraHours = 0;

    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonsTotal += parseFloat(cb.value);
        extraHours += parseInt(cb.dataset.hours || 2);
      }
    });

    const totalCost = Math.round((baseServicePrice * vehicleMultiplier) + addonsTotal);
    const totalTimeHours = baseServiceTime + extraHours;

    let timeString = `${totalTimeHours} Hours`;
    if (totalTimeHours >= 24) {
      const days = Math.round(totalTimeHours / 24);
      timeString = `${days} Business Days`;
    }

    if (costOutput) {
      costOutput.textContent = `₹${totalCost.toLocaleString('en-IN')}`;
    }
    if (timeOutput) {
      timeOutput.textContent = timeString;
    }
  }

  vehicleSelect.addEventListener('change', calculateEstimate);
  serviceSelect.addEventListener('change', calculateEstimate);
  addonCheckboxes.forEach(cb => cb.addEventListener('change', calculateEstimate));

  // Initial calculation
  calculateEstimate();

  if (bookEstimateBtn) {
    bookEstimateBtn.addEventListener('click', () => {
      const vehicleText = vehicleSelect.options[vehicleSelect.selectedIndex].text;
      const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
      const costText = costOutput ? costOutput.textContent : '';

      openBookingModal(`Booking: ${vehicleText} - ${serviceText} (Approx ${costText})`);
    });
  }
}

/* --------------------------------------------------
   6. Artefacts Filter
-------------------------------------------------- */
function initArtefactFilter() {
  const filterBtns = document.querySelectorAll('.artefact-tab-btn');
  const cards = document.querySelectorAll('.artefact-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;

      cards.forEach(card => {
        if (filterVal === 'all' || card.dataset.category === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------
   7. FAQ Accordion
-------------------------------------------------- */
function initFaqAccordion() {
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const question = card.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        // Close all others
        faqCards.forEach(c => c.classList.remove('open'));
        if (!isOpen) {
          card.classList.add('open');
        }
      });
    }
  });
}

/* --------------------------------------------------
   8. Modal, Form Handlers & WhatsApp Quick Action
-------------------------------------------------- */
function initModalAndForms() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const openTriggers = document.querySelectorAll('.trigger-modal-btn');
  const modalServiceField = document.getElementById('modal-service-input');
  const contactForm = document.getElementById('main-contact-form');
  const modalForm = document.getElementById('modal-booking-form');

  // Open modal triggers
  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.dataset.service || 'General Service & Upkeep';
      openBookingModal(serviceName);
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Handle Main Contact Form
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('input[name="name"]')?.value || 'Client';
      const phone = contactForm.querySelector('input[name="phone"]')?.value || '';
      const service = contactForm.querySelector('select[name="service"]')?.value || 'Service';

      showToast(`Thank you, ${name}! Your request has been logged. Our workshop team will contact you at ${phone}.`);
      contactForm.reset();
    });
  }

  // Handle Modal Form
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modalForm.querySelector('input[name="m_name"]')?.value || 'Client';
      showToast(`Appointment confirmed for ${name}. Confirmation SMS sent to your number!`);
      if (modal) modal.classList.remove('active');
      modalForm.reset();
    });
  }
}

function openBookingModal(serviceContext) {
  const modal = document.getElementById('booking-modal');
  const modalServiceField = document.getElementById('modal-service-input');
  if (modal) {
    if (modalServiceField && serviceContext) {
      modalServiceField.value = serviceContext;
    }
    modal.classList.add('active');
  }
}

/* --------------------------------------------------
   Toast Notification Helper
-------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--accent-primary)"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
