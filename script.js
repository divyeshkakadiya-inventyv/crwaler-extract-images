// Fusion Polymer Industries - Simplified JavaScript
// No config.json dependency - all content embedded in HTML

let currentSlide = 0;
let slideInterval;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeSlider();
    initializeNavigation();
    initializeForm();
    initializeScrollEffects();
});

// Hero Slider Functionality
function initializeSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('slider-dots');

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Slider controls
    document.getElementById('prevSlide').addEventListener('click', () => {
        stopSlider();
        prevSlide();
        startSlider();
    });

    document.getElementById('nextSlide').addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
    });

    // Auto-advance
    startSlider();

    // Pause on hover
    const sliderContainer = document.querySelector('.hero-slider');
    sliderContainer.addEventListener('mouseenter', stopSlider);
    sliderContainer.addEventListener('mouseleave', startSlider);
}

function goToSlide(index) {
    const slidesWrapper = document.getElementById('hero-slides');
    const dots = document.querySelectorAll('.slider-dot');
    const totalSlides = document.querySelectorAll('.hero-slide').length;

    currentSlide = index;
    slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    const totalSlides = document.querySelectorAll('.hero-slide').length;
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
}

function prevSlide() {
    const totalSlides = document.querySelectorAll('.hero-slide').length;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlider() {
    clearInterval(slideInterval);
}

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Form Handling
function initializeForm() {
    const form = document.getElementById('contact-form');
    const messageDiv = document.querySelector('.form-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous messages
        messageDiv.classList.add('hidden');
        messageDiv.classList.remove('success', 'error');

        // Validate form
        let isValid = true;
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Check required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ef4444';
            } else {
                field.style.borderColor = '#E5E7EB';
            }
        });

        // Validate email
        const emailField = form.querySelector('[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                emailField.style.borderColor = '#ef4444';
            }
        }

        if (!isValid) {
            messageDiv.textContent = 'Please fill in all required fields correctly';
            messageDiv.classList.remove('hidden');
            messageDiv.classList.add('error');
            return;
        }

        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        setTimeout(() => {
            // Show success message
            messageDiv.textContent = 'Thank you! We will get back to you shortly.';
            messageDiv.classList.remove('hidden');
            messageDiv.classList.add('success');

            // Clear form
            form.reset();

            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';

            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 5000);
        }, 1000);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Animate stats on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe stat items
    document.querySelectorAll('.stat-item').forEach(item => {
        observer.observe(item);
    });
}

// Animated counter for stats
function animateCounter(statItem) {
    const valueElement = statItem.querySelector('.stat-value');
    if (!valueElement) return;

    const text = valueElement.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[0-9]/g, '');

    if (isNaN(number)) return;

    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            valueElement.textContent = number + suffix;
            clearInterval(timer);
        } else {
            valueElement.textContent = Math.floor(current) + suffix;
        }
    }, duration / steps);
}
