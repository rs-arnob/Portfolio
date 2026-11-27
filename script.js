/**
 * REYADUS SALAHIN - PROFESSIONAL PORTFOLIO SCRIPTS
 * Features:
 * - Interactive Constellation / Cyber Grid Particle Canvas
 * - 3D Card Tilt Physics with Dynamic Cursor Radial Spotlight
 * - Typewriter Text Animation
 * - Scroll-Triggered Stat Counters
 * - Active Navigation Spy & Smooth Scrolling
 * - Mobile Menu Controller
 * - Interactive Form Handler
 */

document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================================
     1. CINEMATIC CONSTELLATION CANVAS ENGINE
     ========================================================================== */
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
    const maxDistance = 140;

    let mouse = {
      x: null,
      y: null,
      radius: 160
    };

    window.addEventListener("resize", function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", function () {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 0.8;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off canvas edges
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Subtle mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 2;
            this.y -= Math.sin(angle) * force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(42, 252, 133, ${this.baseAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(42, 252, 133, 0.4)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby particles with glowing lines
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(42, 252, 133, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Connect particles to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ==========================================================================
     2. DYNAMIC TYPEWRITER EFFECT
     ========================================================================== */
  const texts = [
    "Fullstack Web Technologies",
    "Paid Client-Based Websites",
    "E-Commerce Stores & Portals",
    "Modern Frontends with JavaScript",
    "C/C++, Java & Python Logic",
    "Responsive Cyber-Themed UI"
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 90;
  const typingElement = document.querySelector(".typing-text");

  function typeEffect() {
    if (!typingElement) return;

    const currentText = texts[textIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 45;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 90;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingDelay = 1800; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingDelay = 450; // Pause before typing new text
    }

    setTimeout(typeEffect, typingDelay);
  }

  setTimeout(typeEffect, 900);

  /* ==========================================================================
     3. 3D TILT ENGINE & CARD SPOTLIGHT LIGHTING
     ========================================================================== */
  const tiltCards = document.querySelectorAll(".tilt-card, [data-tilt]");

  tiltCards.forEach(card => {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Set cursor spotlight variables
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });

  /* ==========================================================================
     4. STATS NUMBER COUNTER TICKER
     ========================================================================== */
  const counters = document.querySelectorAll(".counter");
  let countersAnimated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"), 10);
      const duration = 1600; // ms
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  }

  if (counters.length > 0) {
    const statsSection = document.querySelector(".about-stats-container") || document.querySelector("#about");
    if (statsSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            runCounters();
          }
        });
      }, { threshold: 0.35 });

      observer.observe(statsSection);
    }
  }

  /* ==========================================================================
     5. NAVIGATION SPY & SMOOTH SCROLLING
     ========================================================================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav ul li a, .cyber-nav-link");

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavOnScroll);

  /* ==========================================================================
     HACKER CYBERDECK MATRIX TEXT SCRAMBLER ENGINE (CONCEPT 1)
     ========================================================================== */
  const scrambleGlyphs = "!<>-_/[]{}*+=#$&%0123456789ABCDEF";

  class MatrixScrambler {
    constructor(element) {
      this.el = element;
      this.chars = scrambleGlyphs;
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText || newText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise(resolve => (this.resolve = resolve));
      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || "";
        const to = newText[i] || "";
        const start = Math.floor(Math.random() * 5);
        const end = start + Math.floor(Math.random() * 7) + 3;
        this.queue.push({ from, to, start, end, char: "" });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = "";
      let complete = 0;

      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];

        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.queue[i].char = char;
          }
          output += `<span class="glitch-char">${char}</span>`;
        } else {
          output += from;
        }
      }

      this.el.innerHTML = output;

      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
  }

  // Bind scramble & terminal hit glitch to cyber nav links
  const cyberNavLinks = document.querySelectorAll(".cyber-nav-link");
  cyberNavLinks.forEach(link => {
    const textSpan = link.querySelector(".scramble-text");
    const targetText = link.getAttribute("data-text") || (textSpan ? textSpan.innerText : "");
    if (!textSpan) return;

    const scrambler = new MatrixScrambler(textSpan);

    // Hover decode trigger
    link.addEventListener("mouseenter", () => {
      scrambler.setText(targetText);
    });

    // Hit / Click terminal glitch execution
    link.addEventListener("click", () => {
      link.classList.remove("glitch-hit");
      void link.offsetWidth; // Force CSS reflow to re-trigger keyframe
      link.classList.add("glitch-hit");

      scrambler.setText(targetText);

      setTimeout(() => {
        link.classList.remove("glitch-hit");
      }, 400);

      // Immediately highlight clicked link
      cyberNavLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Smooth scroll with 80px fixed header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth"
        });
      }
    });
  });

  /* ==========================================================================
     6. MOBILE MENU TOGGLE
     ========================================================================== */
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    });

    // Close menu when a link is clicked
    document.querySelectorAll("nav a").forEach(link => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        const icon = menuToggle.querySelector("i");
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        const icon = menuToggle.querySelector("i");
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      }
    });
  }

  /* ==========================================================================
     7. CONTACT FORM SUBMISSION HANDLER
     ========================================================================== */
  const contactForm = document.getElementById("contactForm");
  const formNotice = document.getElementById("formNotice");

  if (contactForm && formNotice) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameVal = document.getElementById("name").value.trim();
      const emailVal = document.getElementById("email").value.trim();
      const subjectVal = document.getElementById("subject").value.trim();
      const messageVal = document.getElementById("message").value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        return;
      }

      // Submit feedback visual effect
      const submitBtn = contactForm.querySelector(".btn-submit");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Received!';
        submitBtn.style.background = "linear-gradient(90deg, #15c46a 0%, #2afc85 100%)";

        formNotice.className = "form-notice success";
        formNotice.innerHTML = `<i class="fas fa-check-circle"></i> Thank you, <strong>${nameVal}</strong>! Your message regarding "<em>${subjectVal || 'Project Inquiry'}</em>" has been noted. Reyadus will reply to <u>${emailVal}</u> shortly.`;

        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = "";
        }, 4000);
      }, 900);
    });
  }

});
