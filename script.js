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

// --- Interactive Dots Canvas ---
const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
const dotCount = 150;
const mouse = { x: null, y: null, radius: 150 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
}

class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = 1.5;
        this.density = (Math.random() * 30) + 1;
    }

    draw() {
        ctx.fillStyle = '#F0A8D0';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

function initDots() {
    dots = [];
    const spacing = 30;
    const padding = 15;
    for (let y = padding; y < canvas.height; y += spacing) {
        for (let x = padding; x < canvas.width; x += spacing) {
            dots.push(new Dot(x, y));
        }
    }
}

function animateDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < dots.length; i++) {
        dots[i].draw();
        dots[i].update();
    }
    requestAnimationFrame(animateDots);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateDots();

// Parallax Effect & Mouse Interactivity
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const mouseX = (e.clientX / window.innerWidth) - 0.5;
    const mouseY = (e.clientY / window.innerHeight) - 0.5;

    // Movement for content slightly with mouse for depth (optional, keeping for polish)
    const content = document.querySelector('.hero-content');
    if (content) {
        content.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
    }
});

document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
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
