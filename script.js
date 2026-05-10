document.getElementById('footer-year').textContent = new Date().getFullYear();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const offset = document.getElementById('navbar').offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

function validateName(val) {
    if (!val.trim()) return 'Name is required.';
    if (val.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
}

function validateEmail(val) {
    if (!val.trim()) return 'Email is required.';
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(val.trim())) return 'Please enter a valid email address.';
    return '';
}

function validateMessage(val) {
    if (!val.trim()) return 'Message is required.';
    if (val.trim().length < 20) return 'Message must be at least 20 characters.';
    return '';
}

function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    if (msg) {
        field.classList.add('error');
        error.textContent = msg;
    } else {
        field.classList.remove('error');
        error.textContent = '';
    }
}

const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameVal = document.getElementById('name').value;
    const emailVal = document.getElementById('email').value;
    const msgVal = document.getElementById('message').value;

    const nameErr = validateName(nameVal);
    const emailErr = validateEmail(emailVal);
    const msgErr = validateMessage(msgVal);

    showError('name', nameErr);
    showError('email', emailErr);
    showError('message', msgErr);

    if (!nameErr && !emailErr && !msgErr) {
        successMsg.classList.add('visible');
        form.reset();
        setTimeout(() => {
            successMsg.classList.remove('visible');
        }, 5000);
    }
});

['name', 'email', 'message'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
        if (id === 'name') showError('name', validateName(this.value));
        if (id === 'email') showError('email', validateEmail(this.value));
        if (id === 'message') showError('message', validateMessage(this.value));
    });
});
