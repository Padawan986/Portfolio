function scrollToProjects() {
    document.getElementById("projects").scrollIntoView({
        behavior: "smooth"
    });
}

/* kleine Hover-Glow Animation */
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mousemove", e => {
        card.style.boxShadow = `0 0 30px rgba(0, 150, 255, 0.5)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.boxShadow = "none";
    });
});
