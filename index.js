function scrollToProjects() {
    document.getElementById("projects").scrollIntoView({
        behavior: "smooth"
    });
}

/* ==================== INTERSECTION OBSERVER FOR ANIMATIONS ==================== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `fadeInUp 0.8s ease forwards`;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(".card").forEach(card => {
    observer.observe(card);
});

/* ==================== ENHANCED CARD HOVER EFFECTS ==================== */
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.boxShadow = `0 0 40px rgba(59, 130, 246, 0.4)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.boxShadow = "0 20px 50px rgba(59, 130, 246, 0.2)";
    });

    card.addEventListener("mouseenter", () => {
        card.style.boxShadow = "0 20px 50px rgba(59, 130, 246, 0.3)";
    });
});

/* ==================== SMOOTH SCROLL OFFSET FOR STICKY NAV ==================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/* ==================== PARALLAX EFFECT ==================== */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    }
});

/* ==================== PAGE LOAD ANIMATIONS ==================== */
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

/* ==================== SCROLL PROGRESS ==================== */
window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    // Progress bar can be added with this value if needed
});
