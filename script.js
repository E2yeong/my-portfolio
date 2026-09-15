// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initHero();
    initScrollAnimations();
    initSkillBars();
    initTabs();
    preventDefaults();
});

// Navigation functionality
function initNavigation() {
    const nav = document.getElementById('navigation');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('a[href^="#"]');

    // Handle scroll effect on navigation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Animate hamburger
            const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
            hamburgers.forEach((hamburger, index) => {
                if (mobileMenu.classList.contains('active')) {
                    if (index === 0) hamburger.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) hamburger.style.opacity = '0';
                    if (index === 2) hamburger.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    hamburger.style.transform = '';
                    hamburger.style.opacity = '';
                }
            });
        });
    }

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            if (href === '#top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }
            
            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
                hamburgers.forEach(hamburger => {
                    hamburger.style.transform = '';
                    hamburger.style.opacity = '';
                });
            }
        });
    });
}

// Hero section animations
function initHero() {
    // Create floating particles
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.animationDuration = `${3 + Math.random() * 2}s`;
        particlesContainer.appendChild(particle);
    }
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                // Remove class when element leaves viewport for repeat animations
                entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animateElements = document.querySelectorAll(
        '.about-left, .about-right, .skill-category, .certifications, ' +
        '.project-card, .contact-left, .contact-right, .achievement-banner'
    );

    animateElements.forEach(el => observer.observe(el));
}

// Skill bars animation
function initSkillBars() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        bar.style.setProperty('--progress-width', `${width}%`);
                        bar.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.5 });

    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => skillObserver.observe(category));
}

// Tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const targetPane = document.getElementById(`${targetTab}-tab`);
            if (targetPane) {
                targetPane.classList.add('active');
                
                // Trigger animation for tab content
                const tabContent = targetPane.closest('.tab-content');
                if (tabContent) {
                    tabContent.style.opacity = '0';
                    tabContent.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        tabContent.style.opacity = '1';
                        tabContent.style.transform = 'translateY(0)';
                    }, 50);
                }
            }
        });
    });
}

// Prevent right-click, selection, and drag
function preventDefaults() {
    // Prevent context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Prevent text selection
    document.addEventListener('selectstart', (e) => e.preventDefault());
    
    // Prevent drag
    document.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Prevent certain key combinations
    document.addEventListener('keydown', (e) => {
        // Prevent F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
        }
    });
}

// Utility functions for smooth animations
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function animateValue(element, start, end, duration, callback) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = easeInOutCubic(progress);
        const currentValue = start + (end - start) * easedProgress;
        
        if (callback) callback(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Handle project card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Handle study note card interactions
document.addEventListener('DOMContentLoaded', () => {
    const studyCards = document.querySelectorAll('.study-note-card');
    
    studyCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Initialize typing effect for hero section (optional enhancement)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    const text = 'Jooyeong Lee';
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            heroTitle.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typing effect after initial animation
    setTimeout(typeWriter, 2000);
}

// Enhanced scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #06b6d4, #8b5cf6);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Initialize scroll progress on load
document.addEventListener('DOMContentLoaded', initScrollProgress);

// Handle form submissions (if any forms are added)
function handleFormSubmissions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add your form handling logic here
            console.log('Form submitted');
            
            // Show success message or handle form data
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
    });
}

// Initialize form handling
document.addEventListener('DOMContentLoaded', handleFormSubmissions);

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);
