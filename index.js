
// Smooth Scroll
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Fade-In Sections
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

document.querySelectorAll('.section').forEach(section => {
  section.classList.add('hidden');
  fadeObserver.observe(section);
});

// Skill Bars Animation
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.fill');
      fills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        fill.style.width = width;
      });
    }
  });
});

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
  skillObserver.observe(skillsSection);
}
