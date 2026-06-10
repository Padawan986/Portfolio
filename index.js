/* ==================== INTERSECTION OBSERVER FOR CLEAN FADE-IN ==================== */
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Klasse hinzufügen statt Inline-Styles zu forcieren
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-animate]").forEach(el => {
        observer.observe(el);
    });
});
