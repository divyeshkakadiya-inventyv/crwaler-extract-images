// Global config object
let config = {};
let currentSlide = 0;
let slideInterval;

// Load configuration and initialize the page
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
        initializePage();
    } catch (error) {
        console.error('Error loading config:', error);
        // Fallback: try to load with a slight delay
        setTimeout(async () => {
            try {
                const response = await fetch('config.json');
                config = await response.json();
                initializePage();
            } catch (err) {
                console.error('Failed to load config after retry:', err);
            }
        }, 500);
    }
}

// Initialize all page elements
function initializePage() {
    // Apply dynamic colors
    applyColors();

    // Initialize sections
    updateBranding();
    updateTopBar();
    updateNavigation();
    updateHeroSlider();
    updateAbout();
    updateProducts();
    updateClients();
    updateIndustries();
    updateWhyChoose();
    updateStats();
    updateContact();
    updateFooter();

    // Initialize event listeners
    initializeEventListeners();

    // Start hero slider
    startSlider();

    // Initialize scroll animations
    observeElements();
}

// Apply color scheme from config
function applyColors() {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-primary-dark', config.colors.primaryDark);
    root.style.setProperty('--color-primary-light', config.colors.primaryLight);
    root.style.setProperty('--color-secondary', config.colors.secondary);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-dark', config.colors.dark);
    root.style.setProperty('--color-light', config.colors.light);
    root.style.setProperty('--color-white', config.colors.white);
    root.style.setProperty('--color-gray', config.colors.gray);
}

// Update branding elements
function updateBranding() {
    document.getElementById('page-title').textContent = config.branding.companyName;
    document.getElementById('header-logo').src = config.branding.logo;
    document.getElementById('header-logo').alt = config.branding.companyName;
}

// Update top contact bar
function updateTopBar() {
    if (config.branding.topBar) {
        document.getElementById('top-phone').innerHTML = `📞 ${config.branding.topBar.phone}`;
        document.getElementById('top-email').innerHTML = `📧 ${config.branding.topBar.email}`;

        // Update WhatsApp link if present
        const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me"]');
        whatsappLinks.forEach(link => {
            link.href = `https://wa.me/${config.branding.topBar.whatsapp}`;
        });
    }

    // Add social media links
    if (config.footer && config.footer.socialMedia) {
        const socialContainer = document.getElementById('social-links');
        config.footer.socialMedia.forEach(social => {
            const a = document.createElement('a');
            a.href = social.link;
            a.textContent = social.icon;
            a.title = social.name;
            a.target = '_blank';
            socialContainer.appendChild(a);
        });
    }
}

// Update navigation menu
function updateNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');

    navMenu.innerHTML = '';
    mobileNavMenu.innerHTML = '';

    config.navigation.forEach(item => {
        // Desktop menu
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.link;
        a.textContent = item.text;
        li.appendChild(a);
        navMenu.appendChild(li);

        // Mobile menu
        const mobileLi = li.cloneNode(true);
        mobileNavMenu.appendChild(mobileLi);
    });
}

// Update hero slider
function updateHeroSlider() {
    const slidesWrapper = document.getElementById('hero-slides');
    const dotsContainer = document.getElementById('slider-dots');

    slidesWrapper.innerHTML = '';
    dotsContainer.innerHTML = '';

    config.hero.images.forEach((imageUrl, index) => {
        // Create slide with split layout
        const slide = document.createElement('div');
        slide.className = 'hero-slide';

        // Set slide background image as CSS variable
        slide.style.setProperty(`--slide-${index + 1}-bg`, `url('${imageUrl}')`);

        slide.innerHTML = `
            <div class="hero-slide-content">
                <h1>${config.hero.title}</h1>
                <p>${config.hero.subtitle}</p>
                <p class="description">${config.hero.description}</p>
                <a href="${config.hero.ctaLink}" class="btn-primary">${config.hero.ctaText}</a>
            </div>
        `;
        slidesWrapper.appendChild(slide);

        // Create dot
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Set CSS variables on document root for all slides
    config.hero.images.forEach((imageUrl, index) => {
        document.documentElement.style.setProperty(`--slide-${index + 1}-bg`, `url('${imageUrl}')`);
    });
}

// Slider functions
function goToSlide(index) {
    const slidesWrapper = document.getElementById('hero-slides');
    const dots = document.querySelectorAll('.slider-dot');

    currentSlide = index;
    slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    const totalSlides = config.hero.images.length;
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
}

function prevSlide() {
    const totalSlides = config.hero.images.length;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
}

function stopSlider() {
    clearInterval(slideInterval);
}

// Update about section
function updateAbout() {
    document.getElementById('about-title').textContent = config.about.title;
    document.getElementById('about-tagline').textContent = config.about.tagline;
    document.getElementById('about-description').textContent = config.about.description;
}

// Update products section
function updateProducts() {
    document.getElementById('products-title').textContent = config.products.sectionTitle;
    document.getElementById('products-highlight').textContent = config.products.sectionHighlight;

    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    config.products.items.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// Create product card element
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card scroll-reveal';
    div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-card-content">
            <h3>${product.name}</h3>
        </div>
    `;

    if (product.link) {
        div.style.cursor = 'pointer';
        div.addEventListener('click', () => {
            window.location.href = product.link;
        });
    }

    return div;
}

// Update clients section
function updateClients() {
    document.getElementById('clients-title').textContent = config.clients.title;
    document.getElementById('clients-description').textContent = config.clients.description;

    const logosContainer = document.getElementById('clients-logos');
    logosContainer.innerHTML = '';

    config.clients.logos.forEach(logoUrl => {
        const div = document.createElement('div');
        div.className = 'client-logo';
        const img = document.createElement('img');
        img.src = logoUrl;
        img.alt = 'Client Logo';
        img.loading = 'lazy';
        div.appendChild(img);
        logosContainer.appendChild(div);
    });
}

// Update industries section
function updateIndustries() {
    document.getElementById('industries-title').textContent = config.industries.title;

    const grid = document.getElementById('industries-grid');
    grid.innerHTML = '';

    config.industries.items.forEach(industry => {
        const card = createIndustryCard(industry);
        grid.appendChild(card);
    });
}

// Create industry card element
function createIndustryCard(industry) {
    const div = document.createElement('div');
    div.className = 'industry-card scroll-reveal';
    div.innerHTML = `
        <img src="${industry.image}" alt="${industry.name}" loading="lazy">
        <div class="industry-card-overlay">
            <p>${industry.name}</p>
        </div>
    `;
    return div;
}

// Update why choose section
function updateWhyChoose() {
    const section = document.getElementById('why-choose');
    section.style.backgroundColor = config.whyChoose.backgroundColor;

    document.getElementById('why-choose-title').textContent = config.whyChoose.title;
    document.getElementById('why-choose-title').style.color = 'white';

    const featuresContainer = document.getElementById('why-choose-features');
    featuresContainer.innerHTML = '';

    config.whyChoose.features.forEach(feature => {
        const card = createFeatureCard(feature);
        featuresContainer.appendChild(card);
    });
}

// Create feature card element
function createFeatureCard(feature) {
    const div = document.createElement('div');
    div.className = 'feature-card scroll-reveal';
    div.innerHTML = `
        <div class="icon">${feature.icon}</div>
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
    `;
    return div;
}

// Update stats section
function updateStats() {
    const section = document.getElementById('stats-section');
    if (config.stats.backgroundColor) {
        section.style.backgroundColor = config.stats.backgroundColor;
    }

    document.getElementById('stats-title').textContent = config.stats.title;

    const grid = document.getElementById('stats-grid');
    grid.innerHTML = '';

    config.stats.items.forEach(stat => {
        const card = createStatCard(stat);
        grid.appendChild(card);
    });
}

// Create stat card element
function createStatCard(stat) {
    const div = document.createElement('div');
    div.className = 'stat-card scroll-reveal';
    div.innerHTML = `
        <div class="icon">${stat.icon}</div>
        <div class="value">${stat.value}</div>
        <div class="label">${stat.label}</div>
    `;
    return div;
}

// Update contact section
function updateContact() {
    document.getElementById('contact-title').textContent = config.contact.title;
    document.getElementById('contact-subtitle').textContent = config.contact.subtitle || '';
    document.getElementById('submit-btn-text').textContent = config.contact.submitButtonText;

    // Create form fields
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');
    const submitButton = form.querySelector('button[type="submit"]');

    // Clear existing form fields (except message and button)
    const existingFields = form.querySelectorAll('.form-group');
    existingFields.forEach(field => field.remove());

    config.contact.formFields.forEach(field => {
        const formGroup = createFormField(field);
        form.insertBefore(formGroup, messageDiv);
    });

    // Create contact info cards
    const contactInfoContainer = document.getElementById('contact-info');
    contactInfoContainer.innerHTML = '';

    config.contact.contactInfo.forEach(info => {
        const card = createContactInfoItem(info);
        contactInfoContainer.appendChild(card);
    });

    // Create quick links
    const quickLinksContainer = document.getElementById('quick-links');
    quickLinksContainer.innerHTML = '';

    config.contact.quickLinks.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.link;
        a.textContent = link.text;
        li.appendChild(a);
        quickLinksContainer.appendChild(li);
    });
}

// Create form field element
function createFormField(field) {
    const div = document.createElement('div');
    div.className = 'form-group';

    let input;
    if (field.type === 'textarea') {
        input = document.createElement('textarea');
    } else {
        input = document.createElement('input');
        input.type = field.type;
    }

    input.name = field.name;
    input.required = field.required;
    input.placeholder = field.placeholder || field.label;

    div.appendChild(input);
    return div;
}

// Create contact info item element
function createContactInfoItem(info) {
    const div = document.createElement('div');
    div.className = 'contact-info-item';
    div.innerHTML = `
        <div class="icon">${info.icon}</div>
        <div class="content">
            <h4>${info.label}</h4>
            <p>${info.value}</p>
        </div>
    `;
    return div;
}

// Update footer
function updateFooter() {
    document.getElementById('footer-copyright').textContent = config.footer.copyright;
    document.getElementById('footer-developed').textContent = config.footer.developedBy || '';

    // Add footer social media
    const footerSocial = document.getElementById('footer-social');
    if (config.footer.socialMedia) {
        footerSocial.innerHTML = '';
        config.footer.socialMedia.forEach(social => {
            const a = document.createElement('a');
            a.href = social.link;
            a.textContent = social.icon;
            a.title = social.name;
            a.className = 'text-2xl hover:text-primary transition';
            a.target = '_blank';
            footerSocial.appendChild(a);
        });
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
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
    }

    // Slider controls
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            stopSlider();
            prevSlide();
            startSlider();
        });

        nextBtn.addEventListener('click', () => {
            stopSlider();
            nextSlide();
            startSlider();
        });
    }

    // Pause slider on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopSlider);
        sliderContainer.addEventListener('mouseleave', startSlider);
    }

    // Form submission
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

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
    initHeaderScroll();
}

// Header scroll effect - transparent to solid
function initHeaderScroll() {
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    console.log('Form submitted:', data);

    // Show success message
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = config.contact.successMessage || 'Thank you! We will get back to you soon.';
    messageDiv.className = 'success';
    messageDiv.classList.remove('hidden');

    // Clear form
    e.target.reset();

    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// Intersection Observer for scroll animations with enhanced effects
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Trigger counter animation for stats
                if (entry.target.classList.contains('stat-card')) {
                    animateCounter(entry.target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    // Observe all cards with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Observe section titles
    document.querySelectorAll('h2').forEach(el => {
        observer.observe(el);
    });
}

// Animated counter for stats
function animateCounter(card) {
    const valueElement = card.querySelector('.value');
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

// Parallax scroll effect for hero
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-slide');

        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Add smooth mouse tracking to cards
function initCardTracking() {
    const cards = document.querySelectorAll('.product-card, .industry-card, .feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadConfig();
        observeElements();
        initParallax();
    });
} else {
    loadConfig();
    initParallax();
}

// Initialize card tracking after config loads
window.addEventListener('load', () => {
    setTimeout(initCardTracking, 1000);
});
