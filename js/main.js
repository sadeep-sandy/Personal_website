// ============================================
// ONE PIECE PORTFOLIO - SANDEEP KUMAR
// Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        offset: 100,
        duration: 800,
        once: true,
        easing: 'ease-out-cubic'
    });

    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Animate skill bars on scroll
        animateSkillBars();
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === MOBILE MENU ===
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // === ACTIVE NAV LINK ON SCROLL ===
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // === QUOTE CAROUSEL ===
    const quotes = document.querySelectorAll('.quote-card');
    const dots = document.querySelectorAll('.quote-dot');
    let currentQuote = 0;
    let quoteInterval;

    function showQuote(index) {
        quotes.forEach(q => q.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        quotes[index].classList.add('active');
        dots[index].classList.add('active');
        currentQuote = index;
    }

    function nextQuote() {
        const next = (currentQuote + 1) % quotes.length;
        showQuote(next);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showQuote(index);
            clearInterval(quoteInterval);
            quoteInterval = setInterval(nextQuote, 5000);
        });
    });

    quoteInterval = setInterval(nextQuote, 5000);

    // === STAT COUNTER ANIMATION ===
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        
        const heroSection = document.getElementById('hero');
        const heroRect = heroSection.getBoundingClientRect();
        
        if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
            statsAnimated = true;
            
            statNumbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-count'));
                let current = 0;
                const increment = target / 40;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    num.textContent = Math.floor(current);
                }, 50);
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats();

    // === SKILL BARS ANIMATION ===
    let skillBarsAnimated = false;

    function animateSkillBars() {
        if (skillBarsAnimated) return;
        
        const skillBars = document.querySelectorAll('.skill-bar-fill');
        if (skillBars.length === 0) return;
        
        const firstBar = skillBars[0];
        const rect = firstBar.getBoundingClientRect();
        
        if (rect.top < window.innerHeight - 100) {
            skillBarsAnimated = true;
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
            });
        }
    }

    // === PARTICLES BACKGROUND ===
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.color = Math.random() > 0.7 
                ? `rgba(244, 163, 36, ${this.opacity})` 
                : `rgba(160, 176, 200, ${this.opacity * 0.5})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(244, 163, 36, ${0.06 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Pause particles when not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animateParticles();
        }
    });

    // === THEME CAROUSEL AUTO-SLIDE ===
    const carouselImages = document.querySelectorAll('.carousel-img');
    if (carouselImages.length > 0) {
        let currentCarouselImage = 0;
        setInterval(() => {
            carouselImages[currentCarouselImage].classList.remove('active');
            currentCarouselImage = (currentCarouselImage + 1) % carouselImages.length;
            carouselImages[currentCarouselImage].classList.add('active');
        }, 5000);
    }

    // === SMOOTH SCROLL FOR ALL ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === CONTACT FORM ===
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const btn = this.querySelector('button[type="submit"]');
            btn.innerHTML = '<span>🏴‍☠️</span> Sending...';
            btn.style.opacity = '0.7';
        });
    }

    console.log('%c☠️ Sandeep Kumar Portfolio - One Piece Theme ☠️', 
        'color: #f4a324; font-size: 20px; font-weight: bold; font-family: "Bangers", cursive; text-shadow: 2px 2px #c41e3a;');
    console.log('%cNavigating the Grand Line of Salesforce Development!', 
        'color: #a0b0c8; font-size: 14px;');
});
