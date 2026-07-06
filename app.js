/**
 * Sri Shakthi Agros - Application Architecture Script
 * Handles Interactive UI, 360° Tractor Viewer, Modals, Forms, and Integrations
 */

document.addEventListener("DOMContentLoaded", () => {
  // Check if configuration exists
  if (!window.dealershipData) {
    console.error("Dealership configuration not found!");
    return;
  }

  // Initialize UI Controllers
  initNavbar();
  initHero();
  init360Viewer();
  initTractorCatalog();
  initServicesSection();
  initPartsSection();
  initBookingForm();
  initGalleryLightbox();
  initScrollReveal();
  initWhatsAppActions();
  initMobileActionBarPadding();
});

/* ==========================================================================
   HELPER UTILITIES
   ========================================================================== */

/**
 * Format message strings for WhatsApp API redirection
 * @param {string} text - Message template
 * @returns {string} Encoded URL string
 */
function getWhatsAppUrl(text) {
  const phone = window.dealershipData.business.whatsappClean;
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
}

/**
 * Safe lock/unlock for background document scrolling
 * @param {boolean} shouldLock 
 */
function togglePageScroll(shouldLock) {
  if (shouldLock) {
    document.body.classList.add("modal-open");
  } else {
    document.body.classList.remove("modal-open");
  }
}

/* ==========================================================================
   NAVIGATION AND HEADER CONTROLLER
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMobileOverlay = document.getElementById("nav-mobile-overlay");
  const navLinks = document.querySelectorAll(".nav-link, .nav-cta, .logo");

  if (!navbar) return;

  // Transform Navbar style on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.remove("navbar-transparent");
      navbar.classList.add("navbar-sticky");
    } else {
      navbar.classList.remove("navbar-sticky");
      navbar.classList.add("navbar-transparent");
    }
  });

  // Mobile menu toggle
  if (hamburger && navMobileOverlay) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("open");
      navMobileOverlay.classList.toggle("open", isOpen);
      togglePageScroll(isOpen);
    });

    // Close mobile menu when clicking navigation links
    navMobileOverlay.addEventListener("click", (e) => {
      if (e.target.closest("a") || e.target.closest("button")) {
        hamburger.classList.remove("open");
        navMobileOverlay.classList.remove("open");
        togglePageScroll(false);
      }
    });
  }

  // Set active page scroll highlight using IntersectionObserver
  const sections = document.querySelectorAll("section[id], header[id]");
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // Trigger when section occupies center screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   HERO LOAD CONTROLLER
   ========================================================================== */
function initHero() {
  const hero = document.getElementById("home");
  if (hero) {
    // Slight delay to trigger scale animation smoothly after thread clears
    setTimeout(() => {
      hero.classList.add("loaded");
    }, 100);
  }
}

/* ==========================================================================
   360° TRACTOR IMAGE VIEWER CONTROLLER (Pointer Events)
   ========================================================================== */
function init360Viewer() {
  const display = document.getElementById("viewer-display");
  const trackFill = document.getElementById("viewer-track-fill");
  const loadingOverlay = document.getElementById("viewer-loading");
  const btnPrev = document.getElementById("viewer-prev");
  const btnNext = document.getElementById("viewer-next");

  if (!display) return;

  const images = window.dealershipData.images360 || [];
  const totalFrames = images.length;
  if (totalFrames === 0) return;

  // Refs-equivalent state container for high-frequency pointer interaction
  const state = {
    currentFrameIndex: 0,
    requestedFrameIndex: 0,
    isDragging: false,
    dragStartPosX: 0,
    sensitivity: 35, // Pixels of drag required to advance 1 frame
    frameElements: [],
    animationFrameId: null
  };

  // Create image DOM elements inside the display viewport
  images.forEach((src, idx) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Tractor Frame ${idx + 1}`;
    img.className = "viewer-frame";
    img.setAttribute("loading", "eager"); // Force preload 360 frames
    if (idx === 0) img.classList.add("active");
    
    // Track load events
    img.onload = () => {
      checkPreloadProgress();
    };

    display.appendChild(img);
    state.frameElements.push(img);
  });

  let loadedCount = 0;
  function checkPreloadProgress() {
    loadedCount++;
    if (loadedCount >= totalFrames) {
      if (loadingOverlay) {
        loadingOverlay.style.opacity = "0";
        setTimeout(() => {
          loadingOverlay.style.display = "none";
        }, 500);
      }
    }
  }

  // Fallback timer for loading screen in case image cache fires instantly
  setTimeout(() => {
    if (loadingOverlay && loadingOverlay.style.display !== "none") {
      loadingOverlay.style.opacity = "0";
      setTimeout(() => loadingOverlay.style.display = "none", 500);
    }
  }, 1200);

  // Update DOM frame rendering inside requestAnimationFrame
  function renderFrame() {
    if (state.currentFrameIndex !== state.requestedFrameIndex) {
      // Deactivate current, activate requested
      state.frameElements[state.currentFrameIndex].classList.remove("active");
      state.frameElements[state.requestedFrameIndex].classList.add("active");
      state.currentFrameIndex = state.requestedFrameIndex;

      // Update track indicator percentage
      if (trackFill) {
        const percentage = ((state.currentFrameIndex + 1) / totalFrames) * 100;
        trackFill.style.width = `${percentage}%`;
      }
    }
    state.animationFrameId = null;
  }

  function requestFrameUpdate(newIndex) {
    // Modulo math for continuous infinite looping
    let targetIndex = newIndex % totalFrames;
    if (targetIndex < 0) targetIndex += totalFrames;

    state.requestedFrameIndex = targetIndex;

    if (!state.animationFrameId) {
      state.animationFrameId = requestAnimationFrame(renderFrame);
    }
  }

  // Pointer event interactions (Drag and Swipe)
  display.addEventListener("pointerdown", (e) => {
    state.isDragging = true;
    state.dragStartPosX = e.clientX;
    display.releasePointerCapture(e.pointerId); // Support proper capturing
  });

  window.addEventListener("pointermove", (e) => {
    if (!state.isDragging) return;
    
    const deltaX = e.clientX - state.dragStartPosX;
    
    // Check if drag exceeded sensitivity threshold
    if (Math.abs(deltaX) >= state.sensitivity) {
      const frameStep = Math.round(deltaX / state.sensitivity);
      
      // Negative delta rotates forward, positive rotates backward
      requestFrameUpdate(state.currentFrameIndex - frameStep);
      
      // Update anchor point to maintain movement pacing
      state.dragStartPosX = e.clientX;
    }
  });

  window.addEventListener("pointerup", () => {
    state.isDragging = false;
  });

  window.addEventListener("pointercancel", () => {
    state.isDragging = false;
  });

  // Manual button clicks
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      requestFrameUpdate(state.currentFrameIndex - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      requestFrameUpdate(state.currentFrameIndex + 1);
    });
  }

  // Keyboard navigation when hovered/focused
  display.tabIndex = 0; // Make element focusable
  display.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      requestFrameUpdate(state.currentFrameIndex - 1);
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      requestFrameUpdate(state.currentFrameIndex + 1);
      e.preventDefault();
    }
  });

  // Set initial track indicator
  if (trackFill) {
    trackFill.style.width = `${(1 / totalFrames) * 100}%`;
  }
}

/* ==========================================================================
   FEATURED TRACTORS CATALOG CONTROLLER
   ========================================================================== */
function initTractorCatalog() {
  const filterContainer = document.getElementById("catalog-filters");
  const grid = document.getElementById("tractor-grid");

  if (!grid) return;

  const dataTractors = window.dealershipData.tractors || [];

  // Populate tractor cards inside the grid
  dataTractors.forEach((tractor) => {
    const card = document.createElement("div");
    card.className = "tractor-card reveal";
    card.setAttribute("data-category", tractor.category);
    card.id = `card-${tractor.id}`;

    card.innerHTML = `
      <div class="tractor-card-image-box">
        <span class="tractor-tag">${tractor.category}</span>
        <img src="${tractor.image}" alt="${tractor.name}" class="tractor-card-image" loading="lazy">
      </div>
      <div class="tractor-card-accent"></div>
      <div class="tractor-card-content">
        <h3 class="tractor-card-title">${tractor.name}</h3>
        <div class="tractor-card-meta">
          <span class="meta-item">
            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>
            ${tractor.hpCategory}
          </span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            ${tractor.driveType}
          </span>
        </div>
        <p class="tractor-card-desc">${tractor.description}</p>
        <div class="tractor-card-actions">
          <button class="btn btn-outline-dark view-details-btn" data-id="${tractor.id}">View details</button>
          <button class="btn btn-primary enquire-tractor-btn" data-id="${tractor.id}">Enquire Now</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Filter functionality
  if (filterContainer) {
    filterContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      // Toggle active states
      filterContainer.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");
      const cards = grid.querySelectorAll(".tractor-card");

      cards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        if (filterValue === "all" || cat === filterValue) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  }

  // Delegate clicks for modal opening (View details & Enquire)
  grid.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view-details-btn");
    const enqBtn = e.target.closest(".enquire-tractor-btn");

    if (viewBtn) {
      const id = viewBtn.getAttribute("data-id");
      openTractorDetailsModal(id);
    }

    if (enqBtn) {
      const id = enqBtn.getAttribute("data-id");
      openTractorEnquiryModal(id);
    }
  });
}

/* ==========================================================================
   SERVICES SECTION CONTROLLER
   ========================================================================== */
function initServicesSection() {
  const container = document.getElementById("services-container");
  if (!container) return;

  const services = window.dealershipData.services || [];
  
  services.forEach((service, index) => {
    const row = document.createElement("div");
    row.className = "service-row reveal";
    
    // Build features checklist markup
    const featuresList = service.details.map(feat => `
      <div class="service-feature-item">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        ${feat}
      </div>
    `).join('');

    row.innerHTML = `
      <div class="service-image-box">
        <img src="${service.image}" alt="${service.title}" class="service-image" loading="lazy">
      </div>
      <div class="service-content">
        <span class="section-label">Sri Shakthi Agros Service</span>
        <h3 class="service-title">${service.title}</h3>
        <p class="service-desc">${service.description}</p>
        <div class="service-features">
          ${featuresList}
        </div>
        <button class="btn btn-outline-dark service-action-btn" data-type="${service.id}">
          ${service.id === 'service' ? 'Book a Service' : service.id === 'spare-parts' ? 'Enquire Parts' : 'Enquire Now'}
        </button>
      </div>
    `;

    container.appendChild(row);
  });

  // Action button triggers
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".service-action-btn");
    if (!btn) return;

    const type = btn.getAttribute("data-type");
    if (type === "service") {
      const section = document.getElementById("booking");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else if (type === "spare-parts") {
      const section = document.getElementById("spare-parts");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      // Open general enquiry modal
      openTractorEnquiryModal("general");
    }
  });
}

/* ==========================================================================
   SPARE PARTS SECTION CONTROLLER
   ========================================================================== */
function initPartsSection() {
  const grid = document.getElementById("parts-grid");
  if (!grid) return;

  const parts = window.dealershipData.spareParts || [];

  parts.forEach((item) => {
    const card = document.createElement("div");
    card.className = "parts-card reveal";
    
    card.innerHTML = `
      <div class="parts-image-box">
        <img src="${item.image}" alt="${item.name}" class="parts-image" loading="lazy">
      </div>
      <div class="parts-content">
        <h3 class="parts-title">${item.name}</h3>
        <p class="parts-desc">${item.description}</p>
        <button class="btn btn-primary enquire-parts-btn" data-category="${item.name}">Enquire for Parts</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Action triggers
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".enquire-parts-btn");
    if (!btn) return;

    const categoryName = btn.getAttribute("data-category");
    openPartsEnquiryModal(categoryName);
  });
}

/* ==========================================================================
   MODAL CONTROLLERS & DETAILS VIEWS
   ========================================================================== */

// Base helper to spawn and return a modal container structure dynamically
function createModalFrame(id, contentHtml) {
  // Remove existing if any
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const backdrop = document.createElement("div");
  backdrop.id = id;
  backdrop.className = "modal-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");

  backdrop.innerHTML = `
    <div class="modal-container glass-card-light">
      <button class="modal-close-btn" aria-label="Close modal">
        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
      <div class="modal-body-wrapper">
        ${contentHtml}
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  // Setup close events
  const closeBtn = backdrop.querySelector(".modal-close-btn");
  
  function closeModal() {
    backdrop.classList.remove("open");
    togglePageScroll(false);
    // Remove from DOM after transition finishes
    setTimeout(() => backdrop.remove(), 400);
    document.removeEventListener("keydown", handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
    }
  }

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", handleKeydown);

  // Open modal animation trigger
  setTimeout(() => {
    backdrop.classList.add("open");
    togglePageScroll(true);
    // Trap focus on close button initially
    closeBtn.focus();
  }, 50);

  return { backdrop, closeModal };
}

/**
 * Open Tractor Details Modal
 * @param {string} tractorId 
 */
function openTractorDetailsModal(tractorId) {
  const tractor = window.dealershipData.tractors.find(t => t.id === tractorId);
  if (!tractor) return;

  const specRows = Object.entries(tractor.specs).map(([label, value]) => `
    <div class="modal-spec-row">
      <span class="modal-spec-name">${label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1')}</span>
      <span class="modal-spec-value">${value}</span>
    </div>
  `).join('');

  const content = `
    <div class="tractor-detail-modal">
      <div class="modal-header-image-box">
        <img src="${tractor.image}" alt="${tractor.name}" class="modal-header-image">
      </div>
      <div class="modal-body-content">
        <span class="section-label">Powertrac Tractor</span>
        <h2 class="modal-title">${tractor.name}</h2>
        <div class="modal-subtitle">${tractor.hpCategory} Category · ${tractor.driveType}</div>
        <p class="modal-desc">${tractor.description}</p>
        
        <h3 class="modal-specs-title">Technical Specifications</h3>
        <div class="modal-specs-list">
          ${specRows}
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-primary enquire-from-details" data-id="${tractor.id}">Enquire About Model</button>
          <a href="tel:${window.dealershipData.business.phoneClean}" class="btn btn-outline-dark">Call Dealership</a>
        </div>
      </div>
    </div>
  `;

  const { backdrop, closeModal } = createModalFrame("tractor-details-modal", content);

  // Hook details button click to transition directly to enquiry modal
  const enquireBtn = backdrop.querySelector(".enquire-from-details");
  if (enquireBtn) {
    enquireBtn.addEventListener("click", () => {
      closeModal();
      setTimeout(() => {
        openTractorEnquiryModal(tractorId);
      }, 350);
    });
  }
}

/**
 * Open Tractor Enquiry Form Modal
 * @param {string} tractorId 
 */
function openTractorEnquiryModal(tractorId) {
  const tractors = window.dealershipData.tractors || [];
  const selectedTractor = tractors.find(t => t.id === tractorId);

  // Build select option menu
  const options = tractors.map(t => `
    <option value="${t.name}" ${selectedTractor && selectedTractor.id === t.id ? 'selected' : ''}>${t.name}</option>
  `).join('');

  const content = `
    <div class="modal-body-content" style="padding-top: 50px;">
      <span class="section-label">Dealership Enquiry</span>
      <h2 class="modal-title" style="margin-bottom: 24px;">TRACTOR ENQUIRY</h2>
      
      <form id="tractor-enquiry-form" novalidate>
        <div class="form-group">
          <label class="form-label" for="enq-name">Full Name *</label>
          <input type="text" id="enq-name" class="form-control" placeholder="Enter your full name" required>
          <span class="form-error-msg">Please enter your name.</span>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="enq-phone">Phone Number *</label>
          <input type="tel" id="enq-phone" class="form-control" placeholder="Enter 10-digit mobile number" required>
          <span class="form-error-msg">Please enter a valid 10-digit Indian mobile number.</span>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="enq-model">Tractor Model *</label>
          <select id="enq-model" class="form-control" required>
            <option value="" disabled ${!selectedTractor ? 'selected' : ''}>Select tractor model</option>
            <option value="General Query" ${tractorId === 'general' ? 'selected' : ''}>General Enquiry / Multiple Models</option>
            ${options}
          </select>
          <span class="form-error-msg">Please select a model.</span>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="enq-desc">Message / Requirements <span class="form-label-optional">(Optional)</span></label>
          <textarea id="enq-desc" class="form-control" placeholder="Write your requirements (e.g., pricing details, implement compatibility)"></textarea>
        </div>
        
        <div id="enq-form-error" style="color: var(--red-primary); font-size: 0.9rem; margin-bottom: 16px; display: none;"></div>
        
        <button type="submit" class="btn btn-primary btn-block" style="margin-top: 16px;">
          <span>Submit Enquiry</span>
        </button>
      </form>
    </div>
  `;

  const { backdrop, closeModal } = createModalFrame("tractor-enquiry-modal", content);
  
  const form = backdrop.querySelector("#tractor-enquiry-form");
  const errorAlert = backdrop.querySelector("#enq-form-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorAlert.style.display = "none";

    const nameInput = form.querySelector("#enq-name");
    const phoneInput = form.querySelector("#enq-phone");
    const modelSelect = form.querySelector("#enq-model");
    const descInput = form.querySelector("#enq-desc");
    const submitBtn = form.querySelector("button[type='submit']");

    // Clear previous states
    nameInput.classList.remove("invalid");
    phoneInput.classList.remove("invalid");
    modelSelect.classList.remove("invalid");

    let hasErrors = false;

    if (!nameInput.value.trim()) {
      nameInput.classList.add("invalid");
      hasErrors = true;
    }

    const cleanPhone = phoneInput.value.replace(/[\s\-()]/g, "");
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      phoneInput.classList.add("invalid");
      hasErrors = true;
    }

    if (!modelSelect.value) {
      modelSelect.classList.add("invalid");
      hasErrors = true;
    }

    if (hasErrors) return;

    // Trigger state locks during backend simulation
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "<span>Processing...</span>";

    try {
      const data = {
        name: nameInput.value.trim(),
        phone: cleanPhone,
        type: "tractor",
        tractorModel: modelSelect.value,
        description: descInput.value.trim()
      };

      // Call enquiryService abstraction
      await window.enquiryService.createEnquiry(data);

      // Generate formatted WhatsApp message for tractor enquiry
      const waMessage = `Hello Sri Shakthi Agros,

I would like to enquire about a Powertrac tractor.

Name: ${data.name}
Phone: ${data.phone}
Tractor Model: ${data.tractorModel}

Details / Requirements:
${data.description || "No additional details provided"}

Please let me know the pricing and options.`;

      // Encode and launch WhatsApp click-to-chat in a new tab
      const waUrl = `https://api.whatsapp.com/send?phone=919840930913&text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, "_blank", "noopener");

      // Transition to Success State screen inside modal
      const bodyWrapper = backdrop.querySelector(".modal-body-wrapper");
      bodyWrapper.innerHTML = `
        <div class="form-success-overlay" style="display: flex;">
          <div class="success-icon-box">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
          <h2 class="success-title">Enquiry Submitted</h2>
          <p class="success-desc">Thank you for your enquiry about the <strong>${data.tractorModel}</strong>. Our team will contact you shortly.</p>
          <div class="success-actions">
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-accent" style="background-color: #25D366;">
              <span>Enquire on WhatsApp</span>
            </a>
            <button class="btn btn-outline-dark close-success-modal">Close</button>
          </div>
        </div>
      `;

      bodyWrapper.querySelector(".close-success-modal").addEventListener("click", () => {
        closeModal();
      });

    } catch (err) {
      errorAlert.textContent = err.message;
      errorAlert.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/**
 * Open Spare Parts Enquiry Modal
 * @param {string} partsCategoryName 
 */
function openPartsEnquiryModal(partsCategoryName) {
  const content = `
    <div class="modal-body-content" style="padding-top: 50px;">
      <span class="section-label">Parts Enquiry</span>
      <h2 class="modal-title" style="margin-bottom: 24px;">GENUINE PARTS ENQUIRY</h2>
      
      <form id="parts-enquiry-form" novalidate>
        <div class="form-group">
          <label class="form-label" for="parts-name">Full Name *</label>
          <input type="text" id="parts-name" class="form-control" placeholder="Enter your full name" required>
          <span class="form-error-msg">Please enter your name.</span>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="parts-phone">Phone Number *</label>
          <input type="tel" id="parts-phone" class="form-control" placeholder="Enter 10-digit mobile number" required>
          <span class="form-error-msg">Please enter a valid 10-digit Indian mobile number.</span>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="parts-category">Parts Category *</label>
          <select id="parts-category" class="form-control" required>
            <option value="" disabled>Select parts category</option>
            <option value="Automotive Spare Parts" ${partsCategoryName === 'Automotive Spare Parts' ? 'selected' : ''}>Automotive Spare Parts</option>
            <option value="Tractor Spare Parts" ${partsCategoryName === 'Tractor Spare Parts' ? 'selected' : ''}>Tractor Spare Parts</option>
            <option value="Automotive Plastic Components" ${partsCategoryName === 'Automotive Plastic Components' ? 'selected' : ''}>Automotive Plastic Components</option>
            <option value="Automotive Components" ${partsCategoryName === 'Automotive Components' ? 'selected' : ''}>Automotive Components</option>
          </select>
          <span class="form-error-msg">Please select a category.</span>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="parts-tractor">Tractor Model <span class="form-label-optional">(Optional)</span></label>
          <input type="text" id="parts-tractor" class="form-control" placeholder="e.g. Powertrac Euro 50">
        </div>
        
        <div class="form-group">
          <label class="form-label" for="parts-desc">Description of parts needed *</label>
          <textarea id="parts-desc" class="form-control" placeholder="Please list specific part names, quantities, or serial numbers" required></textarea>
          <span class="form-error-msg">Please provide a description of the spare parts required.</span>
        </div>
        
        <div id="parts-form-error" style="color: var(--red-primary); font-size: 0.9rem; margin-bottom: 16px; display: none;"></div>
        
        <button type="submit" class="btn btn-primary btn-block" style="margin-top: 16px;">
          <span>Submit Parts Enquiry</span>
        </button>
      </form>
    </div>
  `;

  const { backdrop, closeModal } = createModalFrame("parts-enquiry-modal", content);

  const form = backdrop.querySelector("#parts-enquiry-form");
  const errorAlert = backdrop.querySelector("#parts-form-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorAlert.style.display = "none";

    const nameInput = form.querySelector("#parts-name");
    const phoneInput = form.querySelector("#parts-phone");
    const catSelect = form.querySelector("#parts-category");
    const tractorInput = form.querySelector("#parts-tractor");
    const descInput = form.querySelector("#parts-desc");
    const submitBtn = form.querySelector("button[type='submit']");

    nameInput.classList.remove("invalid");
    phoneInput.classList.remove("invalid");
    catSelect.classList.remove("invalid");
    descInput.classList.remove("invalid");

    let hasErrors = false;

    if (!nameInput.value.trim()) {
      nameInput.classList.add("invalid");
      hasErrors = true;
    }

    const cleanPhone = phoneInput.value.replace(/[\s\-()]/g, "");
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      phoneInput.classList.add("invalid");
      hasErrors = true;
    }

    if (!catSelect.value) {
      catSelect.classList.add("invalid");
      hasErrors = true;
    }

    if (!descInput.value.trim()) {
      descInput.classList.add("invalid");
      hasErrors = true;
    }

    if (hasErrors) return;

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "<span>Processing...</span>";

    try {
      const data = {
        name: nameInput.value.trim(),
        phone: cleanPhone,
        type: "parts",
        partsCategory: catSelect.value,
        tractorModel: tractorInput.value.trim(),
        description: descInput.value.trim()
      };

      // Call enquiryService storage abstraction
      await window.enquiryService.createEnquiry(data);

      // Generate formatted WhatsApp message for spare parts
      const waMessage = `Hello Sri Shakthi Agros,

I would like to enquire about tractor spare parts.

Name: ${data.name}
Phone: ${data.phone}
Parts Category: ${data.partsCategory}
Tractor Model: ${data.tractorModel || "Not provided"}

Part Details / Requirements:
${data.description}

Please let me know the availability and pricing.`;

      // Encode and launch WhatsApp click-to-chat in a new tab
      const waUrl = `https://api.whatsapp.com/send?phone=919840930913&text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, "_blank", "noopener");

      // Reveal Success State inside modal
      const bodyWrapper = backdrop.querySelector(".modal-body-wrapper");
      bodyWrapper.innerHTML = `
        <div class="form-success-overlay" style="display: flex;">
          <div class="success-icon-box">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
          <h2 class="success-title">Enquiry Submitted</h2>
          <p class="success-desc">Thank you. Your enquiry for <strong>${data.partsCategory}</strong> has been received. Our team will contact you regarding spare parts availability.</p>
          <div class="success-actions">
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-accent" style="background-color: #25D366;">
              <span>Enquire on WhatsApp</span>
            </a>
            <button class="btn btn-outline-dark close-success-modal">Close</button>
          </div>
        </div>
      `;

      bodyWrapper.querySelector(".close-success-modal").addEventListener("click", () => {
        closeModal();
      });

    } catch (err) {
      errorAlert.textContent = err.message;
      errorAlert.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/* ==========================================================================
   TRACTOR SERVICE BOOKING FORM CONTROLLER
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById("booking-form");
  const successState = document.getElementById("booking-success");
  const errorAlert = document.getElementById("booking-form-error");

  if (!form) return;

  // Add dynamic select tractor options from global data
  const modelSelect = document.getElementById("book-model");
  if (modelSelect && window.dealershipData.tractors) {
    window.dealershipData.tractors.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.name;
      opt.textContent = t.name;
      modelSelect.appendChild(opt);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorAlert) errorAlert.style.display = "none";

    const nameInput = document.getElementById("book-name");
    const phoneInput = document.getElementById("book-phone");
    const emailInput = document.getElementById("book-email");
    const regInput = document.getElementById("book-reg");
    const typeSelect = document.getElementById("book-type");
    const dateInput = document.getElementById("book-date");
    const timeSelect = document.getElementById("book-time");
    const descInput = document.getElementById("book-desc");
    const submitBtn = form.querySelector("button[type='submit']");

    // Clean states
    [nameInput, phoneInput, modelSelect, typeSelect, dateInput, timeSelect].forEach(input => {
      if (input) input.classList.remove("invalid");
    });

    let hasErrors = false;

    if (!nameInput.value.trim()) {
      nameInput.classList.add("invalid");
      hasErrors = true;
    }

    const cleanPhone = phoneInput.value.replace(/[\s\-()]/g, "");
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      phoneInput.classList.add("invalid");
      hasErrors = true;
    }

    if (!modelSelect.value) {
      modelSelect.classList.add("invalid");
      hasErrors = true;
    }

    if (!typeSelect.value) {
      typeSelect.classList.add("invalid");
      hasErrors = true;
    }

    if (!dateInput.value) {
      dateInput.classList.add("invalid");
      hasErrors = true;
    }

    if (!timeSelect.value) {
      timeSelect.classList.add("invalid");
      hasErrors = true;
    }

    if (hasErrors) return;

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "<span>Booking Service...</span>";

    try {
      const data = {
        fullName: nameInput.value.trim(),
        phone: cleanPhone,
        email: emailInput ? emailInput.value.trim() : "",
        tractorModel: modelSelect.value,
        registrationNumber: regInput ? regInput.value.trim() : "",
        serviceType: typeSelect.value,
        preferredDate: dateInput.value,
        preferredTime: timeSelect.value,
        description: descInput ? descInput.value.trim() : ""
      };

      // Call appointmentService storage abstraction
      await window.appointmentService.createAppointment(data);

      // Generate formatted WhatsApp message
      const waMessage = `Hello Sri Shakthi Agros,

I would like to book a tractor service.

Name: ${data.fullName}
Phone: ${data.phone}
Email: ${data.email || "Not provided"}
Tractor Model: ${data.tractorModel}
Registration Number: ${data.registrationNumber || "Not provided"}
Service Type: ${data.serviceType}
Preferred Date: ${data.preferredDate}
Preferred Time: ${data.preferredTime}

Issue Details:
${data.description || "No additional details provided"}

Please confirm my service appointment.`;

      // Encode and launch WhatsApp click-to-chat in a new tab
      const waUrl = `https://api.whatsapp.com/send?phone=919840930913&text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, "_blank", "noopener");

      // Hide Form, Reveal Success State
      form.style.display = "none";
      if (successState) {
        // Set success message details
        const detailsContainer = successState.querySelector("#success-booking-details");
        if (detailsContainer) {
          detailsContainer.innerHTML = `
            <strong>Tractor</strong>: ${data.tractorModel}<br>
            <strong>Date</strong>: ${data.preferredDate} at ${data.preferredTime}<br>
            <strong>Service</strong>: ${data.serviceType}
          `;
        }
        successState.style.display = "flex";
      }

      // Reset form
      form.reset();

    } catch (err) {
      if (errorAlert) {
        errorAlert.textContent = err.message;
        errorAlert.style.display = "block";
      }
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  // SUCCESS STATE ACTIONS
  const btnReset = document.getElementById("success-reset-btn");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (successState) successState.style.display = "none";
      form.style.display = "block";
      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "<span>Book Tractor Service</span>";
      }
    });
  }
}

/* ==========================================================================
   DEALERSHIP GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const gallery = document.getElementById("gallery-grid");
  if (!gallery) return;

  // Build lightbox markup dynamically inside document
  const backdrop = document.createElement("div");
  backdrop.id = "gallery-lightbox";
  backdrop.className = "lightbox-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-label", "Image viewer");

  backdrop.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close image viewer">
        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
      <img src="" alt="" class="lightbox-img">
      <div class="lightbox-caption"></div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const imgEl = backdrop.querySelector(".lightbox-img");
  const capEl = backdrop.querySelector(".lightbox-caption");
  const closeBtn = backdrop.querySelector(".lightbox-close");

  function closeLightbox() {
    backdrop.classList.remove("open");
    togglePageScroll(false);
    document.removeEventListener("keydown", handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      closeLightbox();
    }
  }

  closeBtn.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeLightbox();
  });

  // Open lightbox on gallery item click
  gallery.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (!item) return;

    const img = item.querySelector(".gallery-img");
    const caption = item.getAttribute("data-caption");

    if (img) {
      imgEl.src = img.src;
      imgEl.alt = img.alt;
      capEl.textContent = caption || "";

      backdrop.classList.add("open");
      togglePageScroll(true);
      document.addEventListener("keydown", handleKeydown);
      closeBtn.focus();
    }
  });
}

/* ==========================================================================
   SCROLL REVEAL (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (elements.length === 0) return;

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Animates once
      }
    });
  }, revealOptions);

  elements.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   WHATSAPP REDIRECTIONS CONTROLLER
   ========================================================================== */
function initWhatsAppActions() {
  // Bind floats and standard page elements
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const messageType = el.getAttribute("data-whatsapp");
      let message = "Hello Sri Shakthi Agros, I would like to enquire about a Powertrac tractor.";

      if (messageType === "parts") {
        message = "Hello Sri Shakthi Agros, I would like to enquire about tractor spare parts.";
      } else if (messageType === "service") {
        message = "Hello Sri Shakthi Agros, I would like to book a tractor service appointment.";
      }

      window.open(getWhatsAppUrl(message), "_blank", "noopener");
    });
  });
}

/* ==========================================================================
   MOBILE ACTION BAR OVERLAY PADDING CONTROLLER
   ========================================================================== */
function initMobileActionBarPadding() {
  // Safe bottom padding offset for screens displaying fixed actions bar
  function adjustPadding() {
    if (window.innerWidth <= 768) {
      document.body.style.paddingBottom = "64px";
    } else {
      document.body.style.paddingBottom = "0";
    }
  }

  adjustPadding();
  window.addEventListener("resize", adjustPadding);

  // Bind mobile action bar item clicks
  const callAction = document.querySelector(".mobile-action-item.call-action");
  const waAction = document.querySelector(".mobile-action-item.whatsapp-action");
  const svcAction = document.querySelector(".mobile-action-item.service-action");

  if (callAction) {
    callAction.addEventListener("click", () => {
      window.location.href = `tel:${window.dealershipData.business.phoneClean}`;
    });
  }

  if (waAction) {
    waAction.addEventListener("click", () => {
      const msg = "Hello Sri Shakthi Agros, I would like to enquire about Powertrac tractors.";
      window.open(getWhatsAppUrl(msg), "_blank", "noopener");
    });
  }

  if (svcAction) {
    svcAction.addEventListener("click", () => {
      const section = document.getElementById("booking");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    });
  }
}
