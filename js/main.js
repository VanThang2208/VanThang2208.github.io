// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
    
    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formMessage = document.getElementById('form-message');
            const formData = new FormData(contactForm);
            
            // Simulate form submission (replace with actual backend integration)
            setTimeout(function() {
                formMessage.classList.remove('hidden');
                formMessage.classList.add('form-message', 'success');
                formMessage.textContent = 'Cảm ơn bạn đã gửi tin nhắn! Mình sẽ phản hồi sớm nhất có thể.';
                
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(function() {
                    formMessage.classList.add('hidden');
                }, 5000);
            }, 1000);
        });
    }
    
    // Smooth Scroll for Internal Links
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
    
    // Add fade-in animation to elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all article elements
    document.querySelectorAll('article').forEach(article => {
        observer.observe(article);
    });
    
    // Add active class to current page nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Image lazy loading fallback for older browsers
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // Back to top button
    const createBackToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all opacity-0 pointer-events-none z-50';
        button.id = 'back-to-top';
        document.body.appendChild(button);
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
            } else {
                button.style.opacity = '0';
                button.style.pointerEvents = 'none';
            }
        });
    };
    
    createBackToTopButton();
    
    // Console Easter Egg
    console.log('%c👋 Xin chào!', 'color: #2563eb; font-size: 24px; font-weight: bold;');
    console.log('%cCảm ơn bạn đã ghé thăm blog của mình!', 'color: #6b7280; font-size: 14px;');
    console.log('%cNếu bạn quan tâm đến code của trang web này, hãy check out GitHub repo nhé!', 'color: #6b7280; font-size: 14px;');
    
    // Performance monitoring (optional)
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((items) => {
            items.getEntries().forEach((entry) => {
                // Log performance metrics (optional, for development)
                // console.log(entry.name, entry.startTime);
            });
        });
        perfObserver.observe({ entryTypes: ['paint', 'navigation'] });
    }
});