// ==========================================
// 1. WEB COMPONENTS (Header & Footer)
// ==========================================
class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <a href="index.html" class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
            <path d="M12 12l4-4" stroke="#ff1e27" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          RED<span>LINE</span>
        </a>

        <nav>
          <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about-us.html">About Us</a></li>
            <li><a href="contact-us.html">Contact US</a></li>
          </ul>
        </nav>

        <div class="header-actions">
          <button class="btn-red" onclick="window.location.href='#'">Login</button>
        </div>
      </header>
    `;

    // Highlight the active navigation link based on the current URL
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '') currentPath = 'index.html';

    const navLinks = this.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPath || linkHref.startsWith(currentPath + '#')) {
        link.classList.add('active');
      }
    });
  }
}
customElements.define('site-header', SiteHeader);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="logo">
              <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                <path d="M12 12l4-4" stroke="#ff1e27" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              RED<span>LINE</span>
            </a>
            <p>The premier luxury vehicle marketplace. Engineering passion meets world-class customer experience.</p>
          </div>
          
          <div class="footer-col">
            <h4>Models</h4>
            <ul>
              <li><a href="#">Supercars</a></li>
              <li><a href="#">Luxury SUVs</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Redline</a></li>
              <li><a href="#">Showrooms</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="contact-us.html">Contact Us</a></li>
              <li><a href="#">Financing</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 REDLINE Automotive Inc. All Rights Reserved.</p>
        </div>
      </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);


// ==========================================
// 2. INTERACTIVE SHOWROOM & PAGE LOGIC
// ==========================================

// Global Showroom State
const state = {
  currentColorHex: '#ff1e27',
  currentColorName: 'Supersonic Red',
  currentAngle: 'side'
};

// Pure SVG Car Vector Generators
function generateCarSVG(colorHex, angle) {
  if (angle === 'front') {
    return `<svg viewBox="0 0 500 250" fill="none"><ellipse cx="250" cy="220" rx="200" ry="15" fill="rgba(0,0,0,0.6)" /><path d="M150 110 L200 65 L300 65 L350 110 Z" fill="#1f242d" stroke="#3a4150" stroke-width="3"/><path d="M195 65 Q250 60 305 65" stroke="#ffffff" stroke-width="2" fill="none"/><path d="M80 160 Q80 125 130 115 L370 115 Q420 125 420 160 L410 190 Q400 200 380 200 L120 200 Q100 200 90 190 Z" fill="${colorHex}" stroke="#222" stroke-width="3"/><path d="M160 115 L190 160 M340 115 L310 160" stroke="rgba(0,0,0,0.3)" stroke-width="3"/><polygon points="100,140 160,145 150,165 95,155" fill="#e0f7fa" stroke="#ff1e27" stroke-width="2"/><polygon points="400,140 340,145 350,165 405,155" fill="#e0f7fa" stroke="#ff1e27" stroke-width="2"/><rect x="180" y="150" width="140" height="35" rx="5" fill="#111" stroke="#333" stroke-width="2"/><circle cx="250" cy="162" r="8" fill="none" stroke="#fff" stroke-width="2"/></svg>`;
  } else if (angle === 'rear') {
    return `<svg viewBox="0 0 500 250" fill="none"><ellipse cx="250" cy="220" rx="200" ry="15" fill="rgba(0,0,0,0.6)" /><path d="M160 110 L205 70 L295 70 L340 110 Z" fill="#1f242d" stroke="#3a4150" stroke-width="3"/><path d="M80 160 Q80 125 130 115 L370 115 Q420 125 420 160 L410 190 Q400 200 380 200 L120 200 Q100 200 90 190 Z" fill="${colorHex}" stroke="#222" stroke-width="3"/><path d="M95 145 L405 145 L400 160 L100 160 Z" fill="#ff1e27" stroke="#b71c1c" stroke-width="2"/><rect x="200" y="165" width="100" height="20" rx="3" fill="#111" stroke="#333"/><circle cx="130" cy="195" r="7" fill="#555" stroke="#222" stroke-width="2"/><circle cx="150" cy="195" r="7" fill="#555" stroke="#222" stroke-width="2"/><circle cx="350" cy="195" r="7" fill="#555" stroke="#222" stroke-width="2"/><circle cx="370" cy="195" r="7" fill="#555" stroke="#222" stroke-width="2"/></svg>`;
  } else {
    return `<svg viewBox="0 0 500 250" fill="none"><ellipse cx="250" cy="215" rx="220" ry="12" fill="rgba(0,0,0,0.6)" /><circle cx="120" cy="180" r="38" fill="#111" stroke="#444" stroke-width="6"/><circle cx="120" cy="180" r="20" fill="#222" stroke="#ff1e27" stroke-width="3"/><circle cx="380" cy="180" r="38" fill="#111" stroke="#444" stroke-width="6"/><circle cx="380" cy="180" r="20" fill="#222" stroke="#ff1e27" stroke-width="3"/><path d="M30 170 Q40 140 90 135 L170 120 L240 75 L350 75 L430 130 L470 150 Q480 170 460 180 L420 180 Q410 150 380 150 Q350 150 340 180 L160 180 Q150 150 120 150 Q90 150 80 180 L50 180 Z" fill="${colorHex}" stroke="#111" stroke-width="3"/><path d="M180 120 L245 83 L340 83 L380 120 Z" fill="#1f242d" stroke="#3a4150" stroke-width="2"/><path d="M140 140 L330 140 M220 120 L210 175" stroke="rgba(0,0,0,0.3)" stroke-width="2"/></svg>`;
  }
}

// Render UI Update
function updateShowroom() {
  const svgContainer = document.getElementById('car-svg-container');
  const colorNameDisplay = document.getElementById('color-name-display');

  if (svgContainer && colorNameDisplay) {
    svgContainer.innerHTML = generateCarSVG(state.currentColorHex, state.currentAngle);
    colorNameDisplay.innerText = state.currentColorName;
  }
}

// Toast Notification
function showToast(message) {
  const toastEl = document.getElementById('toast');
  if (toastEl) {
    toastEl.innerText = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3000);
  }
}

// Setup Event Listeners when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Showroom Render (if on index.html)
  if (document.getElementById('showroom')) {
    updateShowroom();

    // Color Swatch Clicks
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        e.target.classList.add('active');
        state.currentColorHex = e.target.getAttribute('data-hex');
        state.currentColorName = e.target.getAttribute('data-name');
        updateShowroom();
      });
    });

    // Angle Button Clicks
    document.querySelectorAll('.thumb-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.currentAngle = e.target.getAttribute('data-angle');
        updateShowroom();
      });
    });

    // Action Buttons
    document.getElementById('reserve-btn')?.addEventListener('click', () => {
      showToast(`Vehicle reserved in ${state.currentColorName}!`);
    });

    document.getElementById('explore-btn')?.addEventListener('click', () => {
      document.getElementById('showroom').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 2. Handle Contact Form Submission (if on contact.html)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message Sent! Our Concierge will contact you shortly.');
      contactForm.reset();
    });
  }
});


// form submission to backend server

const form = document.getElementById("contact-form");
if (form) {

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      message: document.getElementById("message").value
    };

    const response = await fetch("https://red-line.onrender.com/contact", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(formData)

    });


    const result = await response.json();

    // alert(result.message);

    form.reset();


  });
}
