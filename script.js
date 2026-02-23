/**
 * Doggy Star — Toelettatura Premium Script
 * Lenis smooth scroll × GSAP reveal animations × Navbar intelligence
 */

/* ── 1. Add js-ready class ──────────────────────────────── */
document.documentElement.classList.add('js-ready');

/* ── 2. Lenis Smooth Scroll ─────────────────────────────── */
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
    });

    function rafLoop(time) {
        lenis.raf(time);
        requestAnimationFrame(rafLoop);
    }
    requestAnimationFrame(rafLoop);

    // Sync Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }
}

/* ── 3. Scroll-to helper ────────────────────────────────── */
function scrollToTarget(id) {
    const el = document.querySelector(id);
    if (!el) return;
    if (lenis) {
        lenis.scrollTo(el, { offset: -72, duration: 1.4 });
    } else {
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

/* ── 4. Anchor link interception ────────────────────────── */
document.querySelectorAll('.nav-anchor').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        e.preventDefault();
        closeDrawer();
        scrollToTarget(href);
    });
});

/* ── 5. Navbar — hide/show on scroll direction ──────────── */
const nav = document.getElementById('mainNav');
let lastScroll = 0, ticking = false;

function handleNavScroll() {
    const current = window.scrollY;

    if (current > 80) {
        nav.classList.add('nav--scrolled');
    } else {
        nav.classList.remove('nav--scrolled', 'nav--hidden');
    }

    if (current > 300) {
        if (current > lastScroll + 4) nav.classList.add('nav--hidden');
        else if (current < lastScroll - 4) nav.classList.remove('nav--hidden');
    }

    lastScroll = current;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(handleNavScroll); ticking = true; }
}, { passive: true });

/* ── 6. Mobile drawer ───────────────────────────────────── */
const hamburger = document.getElementById('navHamburger');
const drawer = document.getElementById('navDrawer');
const drawerClose = document.getElementById('navDrawerClose');

function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});
drawerClose?.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

/* ── 7. GSAP Animations ─────────────────────────────────── */
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Initial hidden states
    gsap.set('.reveal-mask-inner', { yPercent: 105 });
    gsap.set('.reveal:not(#hero .reveal)', { opacity: 0, y: 30 });
    gsap.set('.reveal-left', { opacity: 0, x: -40 });
    gsap.set('.reveal-right', { opacity: 0, x: 40 });
    gsap.set('.reveal-scale', { opacity: 0, y: 20, scale: .94 });

    // Hero headline mask reveal
    const maskInners = document.querySelectorAll('.reveal-mask-inner');
    if (maskInners.length) {
        gsap.fromTo(maskInners,
            { yPercent: 105 },
            { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: .12, delay: .25 }
        );
    }

    // Hero kicker + body + CTA
    const heroReveal = document.querySelectorAll('#hero .reveal');
    if (heroReveal.length) {
        gsap.fromTo(heroReveal,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .15, delay: .65 }
        );
    }

    // Hero parallax on image (desktop only)
    const heroImg = document.getElementById('heroImg');
    if (heroImg && window.innerWidth > 991) {
        gsap.to(heroImg, {
            yPercent: 20, ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
        });
    }

    // Generic scroll reveals
    function makeReveal(selector, from) {
        document.querySelectorAll(selector).forEach(el => {
            if (el.closest('#hero')) return;
            gsap.fromTo(el,
                { opacity: 0, ...from },
                {
                    opacity: 1, x: 0, y: 0, scale: 1,
                    duration: .85, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
                }
            );
        });
    }

    makeReveal('.reveal', { y: 30 });
    makeReveal('.reveal-left', { x: -40 });
    makeReveal('.reveal-right', { x: 40 });
    makeReveal('.reveal-scale', { scale: .94, y: 20 });

    // Service panels stagger
    const panels = document.querySelectorAll('.service-panel');
    if (panels.length) {
        gsap.fromTo(panels,
            { opacity: 0, y: 40, scale: .96 },
            {
                opacity: 1, y: 0, scale: 1, duration: .9, ease: 'power3.out', stagger: .15,
                scrollTrigger: { trigger: '.services__grid', start: 'top 82%' }
            }
        );
    }

    // Testimonials stagger
    const testiCards = document.querySelectorAll('.testi-card');
    if (testiCards.length) {
        gsap.fromTo(testiCards,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .14,
                scrollTrigger: { trigger: '.testimonials__grid', start: 'top 85%' }
            }
        );
    }
}

/* ── 8. SVG stroke animation ────────────────────────────── */
const svgIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: .3 });

document.querySelectorAll('.service-panel').forEach(p => svgIO.observe(p));

/* ── 9. Custom cursor (desktop only) ────────────────────── */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

if (dot && ring && window.matchMedia('(hover:hover)').matches) {
    let ringX = 0, ringY = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', e => {
        curX = e.clientX; curY = e.clientY;
        dot.style.left = curX + 'px';
        dot.style.top = curY + 'px';
    });

    (function animateRing() {
        ringX += (curX - ringX) * .12;
        ringY += (curY - ringY) * .12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .service-panel').forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.style.transform = 'translate(-50%,-50%) scale(2.5)';
            dot.style.background = 'rgba(92,122,94,.6)';
            ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
        });
        el.addEventListener('mouseleave', () => {
            dot.style.transform = '';
            dot.style.background = '';
            ring.style.transform = '';
        });
    });
}

console.log('%c Doggy Star 🐾 Toelettatura Premium — Savona ', 'background:#2C3A2D;color:#B8CEBA;font-size:13px;padding:6px 12px;border-radius:4px;');
