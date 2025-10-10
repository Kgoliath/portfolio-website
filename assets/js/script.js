// Smooth scrolling for anchor links (if any)
document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Basic form validation and submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const formStatus = document.getElementById('form-status');

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        
        formStatus.textContent = 'Sending...';
        formStatus.style.color = '#ccc';

        fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                formStatus.textContent = "Thanks for your message!";
                formStatus.style.color = '#4ade80'; // Green color for success
                form.reset();
            } else {
                response.json().then(data => {
                    formStatus.textContent = data.errors ? data.errors.map(error => error.message).join(", ") : "Oops! There was a problem.";
                    formStatus.style.color = '#f87171'; // Red color for error
                })
            }
        }).catch(error => {
            formStatus.textContent = "Oops! There was a problem submitting your form.";
            formStatus.style.color = '#f87171'; // Red color for error
        });
    }
    contactForm.addEventListener("submit", handleSubmit);
}

// Typing effect for hero title
const typingText = document.getElementById('typewriter');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    window.addEventListener('load', () => setTimeout(typeWriter, 1000));
}

// Create interactive grid blocks
const gridOverlay = document.getElementById('grid-overlay');
const cols = 80;
const rows = 15;
const totalBlocks = cols * rows;

for (let i = 0; i < totalBlocks; i++) {
    const block = document.createElement('div');
    block.className = 'grid-block';
    gridOverlay.appendChild(block);
}

// Interactive grid hover
const hero = document.querySelector('.hero');
let currentHighlighted = null;

hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor((x / rect.width) * cols);
    const row = Math.floor((y / rect.height) * rows);
    const index = row * cols + col;

    if (currentHighlighted !== null && currentHighlighted !== index) {
        gridOverlay.children[currentHighlighted].style.background = 'rgba(128, 128, 128, 0.1)';
    }

    if (index >= 0 && index < totalBlocks) {
        gridOverlay.children[index].style.background = 'rgba(102, 126, 234, 0.4)';
        currentHighlighted = index;
    }
});

hero.addEventListener('mouseleave', () => {
    if (currentHighlighted !== null) {
        gridOverlay.children[currentHighlighted].style.background = 'rgba(128, 128, 128, 0.1)';
        currentHighlighted = null;
    }
});

// Scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Active nav highlighting
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('change', () => {
    body.classList.toggle('light-mode');
    localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeToggle.checked = true;
}

// Optional: Add some hover effects or animations
