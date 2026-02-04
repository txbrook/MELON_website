// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// Copy Citation Functionality
function copyCitation() {
    const citationText = document.querySelector('.citation-box pre code').innerText;
    navigator.clipboard.writeText(citationText).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.background = 'rgba(74, 222, 128, 0.2)';
        btn.style.color = '#4ade80';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Parallax Effect
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) - 0.5;
    const mouseY = (e.clientY / window.innerHeight) - 0.5;

    // Move background opposite to mouse
    const bgContainer = document.querySelector('.background-container');
    if (bgContainer) {
        bgContainer.style.transform = `translate(${mouseX * -20}px, ${mouseY * -20}px)`;
    }

    // Move content slightly with mouse for depth
    const content = document.querySelector('.hero-content');
    if (content) {
        content.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
    }
});

// Scroll Background Effect - Progressive Fade (Starts at Overview)
window.addEventListener('scroll', () => {
    const bgContainer = document.querySelector('.background-container');
    const aboutSection = document.getElementById('about');
    if (!bgContainer || !aboutSection) return;

    const scrollPos = window.scrollY;
    const aboutTop = aboutSection.offsetTop;
    const fadeStart = aboutTop - window.innerHeight; // Start fade as soon as "Overview" enters
    const fadeEnd = aboutTop; // Complete fade when "Overview" reaches top

    const progress = Math.min(Math.max((scrollPos - fadeStart) / (fadeEnd - fadeStart), 0), 1);
    bgContainer.style.opacity = 1 - progress;
});
