(function () {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    // const cursorGlow = document.getElementById('cursorGlow');
    const contactForm = document.getElementById('contactForm');

    // document.addEventListener('mousemove', function (e) {
    //     if (cursorGlow) {
    //         cursorGlow.style.left = e.clientX + 'px';
    //         cursorGlow.style.top = e.clientY + 'px';
    //     }
    // });

    // var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // if (isMobile && cursorGlow) {
    //     cursorGlow.style.display = 'none';
    //     document.body.style.cursor = 'auto';
    // }

    window.addEventListener('scroll', function () {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        }
    });

    var animatedEls = document.querySelectorAll('[data-animate]');

    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
                setTimeout(function () {
                    el.classList.add('animated');
                }, delay);
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    animatedEls.forEach(function (el) {
        observer.observe(el);
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    function validateName(val) {
        return val.trim().length >= 2;
    }

    function validateEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function validateMessage(val) {
        return val.trim().length >= 10;
    }

    function setError(inputId, errorId, msg) {
        var input = document.getElementById(inputId);
        var error = document.getElementById(errorId);
        if (input) input.classList.add('error');
        if (error) error.textContent = msg;
    }

    function clearError(inputId, errorId) {
        var input = document.getElementById(inputId);
        var error = document.getElementById(errorId);
        if (input) input.classList.remove('error');
        if (error) error.textContent = '';
    }

    if (contactForm) {
        var nameInput = document.getElementById('name');
        var emailInput = document.getElementById('email');
        var messageInput = document.getElementById('message');

        if (nameInput) {
            nameInput.addEventListener('input', function () {
                if (validateName(this.value)) clearError('name', 'nameError');
            });
        }

        if (emailInput) {
            emailInput.addEventListener('input', function () {
                if (validateEmail(this.value)) clearError('email', 'emailError');
            });
        }

        if (messageInput) {
            messageInput.addEventListener('input', function () {
                if (validateMessage(this.value)) clearError('message', 'messageError');
            });
        }

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            var nameVal = document.getElementById('name').value;
            var emailVal = document.getElementById('email').value;
            var messageVal = document.getElementById('message').value;

            var valid = true;

            clearError('name', 'nameError');
            clearError('email', 'emailError');
            clearError('message', 'messageError');

            if (!validateName(nameVal)) {
                setError('name', 'nameError', 'Please enter your name (at least 2 characters).');
                valid = false;
            }

            if (!validateEmail(emailVal)) {
                setError('email', 'emailError', 'Please enter a valid email address.');
                valid = false;
            }

            if (!validateMessage(messageVal)) {
                setError('message', 'messageError', 'Please enter a message (at least 10 characters).');
                valid = false;
            }

            if (!valid) return;

            var submitBtn = document.getElementById('submitBtn');
            var btnText = submitBtn.querySelector('.btn-text');
            var btnLoading = submitBtn.querySelector('.btn-loading');
            var formSuccess = document.getElementById('formSuccess');

            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'flex';

            try {
                var formData = new FormData(contactForm);
                var response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                var data = await response.json();

                if (data.success) {
                    contactForm.reset();
                    submitBtn.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.style.display = 'flex';
                    }
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (err) {
                submitBtn.disabled = false;
                if (btnText) btnText.style.display = '';
                if (btnLoading) btnLoading.style.display = 'none';
                setError('message', 'messageError', 'Something went wrong. Please try again or email directly.');
            }
        });
    }

    var projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
            var y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
            card.querySelector('.project-card-inner').style.transform =
                'translateY(-6px) rotateX(' + (-y) + 'deg) rotateY(' + x + 'deg)';
        });

        card.addEventListener('mouseleave', function () {
            card.querySelector('.project-card-inner').style.transform = '';
        });
    });

    var skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(function (card, i) {
        card.style.transitionDelay = (i * 40) + 'ms';
    });
})();
