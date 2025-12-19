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

// Typing effect for hero title and tagline
const typingText = document.getElementById('typewriter');
const typingTagline = document.querySelector('.hero .tagline');
if (typingText) {
    const titleText = typingText.textContent;
    const taglineText = typingTagline ? typingTagline.textContent : '';
    typingText.textContent = '';
    if (typingTagline) typingTagline.textContent = '';

    function typeWriter(el, text, speed, done) {
        let i = 0;
        function step() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(step, speed);
            } else if (typeof done === 'function') {
                done();
            }
        }
        step();
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            typeWriter(typingText, titleText, 100, () => {
                if (typingTagline) {
                    setTimeout(() => typeWriter(typingTagline, taglineText, 40), 300);
                }
            });
        }, 1000);
    });
}

// Create interactive grid blocks
const gridOverlay = document.getElementById('grid-overlay');
const cols = 80;
const rows = 15;
const totalBlocks = cols * rows;

if (gridOverlay) {
    for (let i = 0; i < totalBlocks; i++) {
        const block = document.createElement('div');
        block.className = 'grid-block';
        gridOverlay.appendChild(block);
    }
}

// Interactive grid hover
const hero = document.querySelector('.hero');
let currentHighlighted = null;

if (hero && gridOverlay) {
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
}

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

// Mobile nav: close menu when a nav link is clicked and manage aria-expanded
const navToggle = document.getElementById('nav-toggle');
if (navToggle) {
    // ensure aria-expanded reflects state
    navToggle.setAttribute('aria-expanded', navToggle.checked ? 'true' : 'false');
    navToggle.addEventListener('change', () => {
        navToggle.setAttribute('aria-expanded', navToggle.checked ? 'true' : 'false');
    });

    // Close menu when any nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle.checked) {
                navToggle.checked = false;
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Close menu when clicking outside the nav on mobile
    document.addEventListener('click', (e) => {
        const navContainer = document.querySelector('.nav-container');
        if (!navContainer) return;
        if (navToggle.checked && !navContainer.contains(e.target)) {
            navToggle.checked = false;
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Optional: Add some hover effects or animations

// Certificates Tab + Data Rendering
(function() {
    const container = document.getElementById('certifications-container');
    const tabs = document.querySelectorAll('.cert-tab');
    const viewAllBtn = document.getElementById('view-all-certs');

    if (!container || tabs.length === 0 || !viewAllBtn) return;

    const certificates = {
        testing: [
            { title: 'Foundations of Software Testing & Validation – University of Leeds', file: 'Foundations of Software Testing and Validation.pdf' },
            { title: 'Introduction to Software Testing – University of Minnesota', file: 'Introduction to Software Testing_University of Minnesota.pdf' },
            { title: 'Web and Mobile Testing with Selenium – University of Minnesota', file: 'Web and Mobile Testing with Selenium.pdf' },
            { title: 'Black-box and White-box Testing – University of Minnesota', file: 'Black-box And White-boxTesting.pdf' },
            { title: 'Introduction to Automated Analysis – University of Minnesota', file: 'Introduction to Automated Analysis.pdf' },
        ],
        ai: [
            { title: 'AI For Everyone – DeepLearning.AI', file: 'AI For Everyone Certificate.pdf' },
            { title: 'Introduction to Artificial Intelligence (AI) – IBM', file: 'Introduction to Artificial Inteligence (IBM).pdf' },
            { title: 'Introduction to Generative AI – Google Cloud', file: 'Introduction to Generative AI.pdf' },
            { title: 'Generative AI with Large Language Models – DeepLearning.AI', file: 'Generative AI with LLMs.pdf' },
            { title: 'AI Essentials – Intel', file: 'AI Essentials (INTEL).pdf' },
            { title: 'AI Foundations: Prompt Engineering with ChatGPT – Arizona State University', file: 'AI Foundations_Prompt Eng with ChatGPT.pdf' },
            { title: 'Python for Data Science, AI & Development – IBM', file: 'Python for Data Science, AI & Development.pdf' },
            { title: 'Supervised Machine Learning: Regression and Classification – DeepLearning.AI × Stanford', file: 'Supervised ML Regression and Classification.pdf' },
            { title: 'Advanced Learning Algorithms – DeepLearning.AI', file: 'Advanced Learning Algorithms.pdf' },
        ],
        professional: [
            { title: 'Active Listening: Enhancing Communication Skills - Coursera', file: 'Active Listening_Enhancing Communication Skills.pdf' },
            { title: 'Developing Interpersonal Skills - IBM', file: 'Developing Interpersonal Skills.pdf' },
            { title: 'Emotional Intelligence - Arizona State University', file: 'Emotinal Intelligence.pdf' },
            { title: 'Financial Planning - ISB', file: 'Financial Planning.pdf' },
            { title: 'Finding Your Professional Voice: Confidence & Impact - University of London', file: 'Finding Your Professional Voice_Confidence&Impact.pdf' },
            { title: 'Grit and Growth Mindset - Arizona State University', file: 'Grit and Growth Mindset.pdf' },
            { title: 'Introduction to Personal Branding - University of Virginia', file: 'Introduction to Personal Branding.pdf' },
            { title: 'Leading with Impact: Team Dynamics, Strategy & Ethics - Coursera', file: 'Leading With Impact_Team Dynamics_Strategy&Ethics.pdf' },
            { title: 'Negotiation Skills: Negotiate and Resolve Conflict - Macquarie University', file: 'Negotiation Skills_Negotiate and Resolve Conflict.pdf' },
            { title: 'Positive Psychology: Resilience Skills - University of Pennsylvania', file: 'Positive Psychology_Resilience Skills.pdf' },
            { title: 'Preparation for Job Interviews - Coursera', file: 'Preparation for Job Interviews.pdf' },
            { title: 'Psychology of the Self - American Psychological Association', file: 'Psychology of the Self.pdf' },
            { title: 'Solving Problems with Creative and Critical Thinking - IBM', file: 'Solving Problems with Creative and Critical Thinking.pdf' },
            { title: 'Verbal Communications and Presentation Skills - Starweaver', file: 'Verbal Communications and Presentation Skills.pdf' },
            { title: 'Work Smarter, Not Harder: Time Management for Personal & Professional Productivity – University of California, Irvine', file: 'Work Smarter_Not Harder_ Time Management for Personal & Professional Productivity.pdf' },
            { title: 'Write Professional Emails in English - Georgia Institute of Technology', file: 'Write Profesional Emails in English.pdf' },
        ],
    };

    // Adjust for exact filenames present
    // Note: The file list in assets/certificates shows 11 AI/ML PDFs; tabs label requests 9, but we include all available

    function buildCards(list) {
        container.innerHTML = '';
        list.forEach(item => {
            const a = document.createElement('a');
            a.className = 'cert-card';
            a.href = `assets/certificates/${item.file}`;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = item.title;
            container.appendChild(a);
        });
    }

    function setActiveTab(key) {
        tabs.forEach(t => {
            const isActive = t.dataset.category === key;
            t.classList.toggle('active', isActive);
            t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    function handleTabClick(e) {
        const key = e.currentTarget.dataset.category;
        if (key === 'all') {
            const all = [...certificates.testing, ...certificates.ai, ...certificates.professional];
            buildCards(all);
            viewAllBtn.href = '#certifications';
        } else if (key === 'testing') {
            buildCards(certificates.testing);
            viewAllBtn.href = '#certifications';
        } else if (key === 'ai') {
            buildCards(certificates.ai);
            viewAllBtn.href = '#certifications';
        } else if (key === 'professional') {
            buildCards(certificates.professional);
            viewAllBtn.href = '#certifications';
        }
        setActiveTab(key);
    }

    tabs.forEach(tab => tab.addEventListener('click', handleTabClick));

    // Default: show Software Testing first
    setActiveTab('testing');
    buildCards(certificates.testing);

    // View all behavior - open All tab
    viewAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const allTab = Array.from(tabs).find(t => t.dataset.category === 'all');
        if (allTab) allTab.click();
    });
})();
