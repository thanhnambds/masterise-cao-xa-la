document.addEventListener('DOMContentLoaded', () => {
    // Sticky Header & Back to Top visibility
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // Sticky Header logic
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to Top button visibility (hiện khi qua Hero section)
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    // Back to Top click logic
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });
        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
            });
        });
    }

    // Mặt Bằng Lightbox
    const matBangImg = document.getElementById('mat-bang-img');
    const lightbox = document.getElementById('mb-lightbox');
    if (matBangImg && lightbox) {
        matBangImg.parentElement.addEventListener('click', () => {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Swiper Initiation for Amenities
    if(typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.amenitiesSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: '.am-pagination',
                type: 'fraction',
                formatFractionCurrent: function (number) {
                    return number;
                },
                formatFractionTotal: function (number) {
                    return number;
                }
            },
            navigation: {
                nextEl: '.am-nav-next',
                prevEl: '.am-nav-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 25,
                },
            }
        });
    }

    // Counter Animation Logic
    const counters = document.querySelectorAll('.counter');
    const countOptions = {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px"
    };

    const countOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const isFloat = counter.getAttribute('data-target').includes('.');
                let count = 0;
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function: easeOutExpo
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                    const currentCount = easeProgress * target;

                    if (isFloat) {
                        counter.innerText = currentCount.toFixed(1);
                    } else {
                        counter.innerText = Math.floor(currentCount);
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target;
                    }
                };

                requestAnimationFrame(updateCount);
                observer.unobserve(counter);
            }
        });
    }, countOptions);

    counters.forEach(counter => {
        countOnScroll.observe(counter);
    });

    // Simple smooth scrolling for anchor links matching URL hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // compensate for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });
    // --- SECURITY UTILITIES ---
    const sanitize = (str) => {
        if (!str) return '';
        return str.replace(/[<>"'&]/g, (match) => {
            const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
            return map[match];
        });
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    // --- FORM DATABASE INTEGRATION (GOOGLE SHEETS) ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxCGXqYV_ARz7eHA2CjGQ86jJN9V-tNym91zzTSBKBYPV5ZkbgXW9DOM8rsAby22sM/exec';
    const RECAPTCHA_SITE_KEY = 'YOUR_SITE_KEY'; // Cần thay bằng Site Key thật

    const handleFormSubmit = async (formElement) => {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        const formData = new FormData(formElement);
        const fullname = formData.get('fullname') || '';
        const phone = formData.get('phone') || '';
        const origin = formData.get('form_origin') || 'Unknown';

        // 1. Client-side Validation
        if (fullname && fullname.trim().length < 2) {
            alert('Vui lòng nhập họ tên đầy đủ (tối thiểu 2 ký tự)');
            return;
        }
        if (!validatePhone(phone)) {
            alert('Vui lòng nhập số điện thoại Việt Nam hợp lệ (ví dụ: 0912345678)');
            return;
        }

        // Trạng thái đang gửi
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';

        try {
            // 2. reCAPTCHA v3 Token
            let recaptchaToken = '';
            if (typeof grecaptcha !== 'undefined' && RECAPTCHA_SITE_KEY !== 'YOUR_SITE_KEY') {
                recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
            }

            const params = new URLSearchParams();
            formData.forEach((value, key) => {
                params.append(key, sanitize(value));
            });
            if (recaptchaToken) params.append('g-recaptcha-response', recaptchaToken);

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString()
            });

            // Sau khi gửi thành công, chuyển đổi giao diện
            formElement.style.display = 'none';

            // Tìm container chứa text tiêu đề để ẩn nếu là Hero/CTA
            const ctaText = formElement.parentElement.querySelector('.cta-text');
            if(ctaText) ctaText.style.display = 'none';
            const heroTitle = formElement.parentElement.querySelector('.hero-cta-title');
            if(heroTitle) heroTitle.style.display = 'none';
            const heroSub = formElement.parentElement.querySelector('.hero-sub-headline');
            if(heroSub) heroSub.style.display = 'none';

            // --- CRM INTEGRATION ---
            const CRM_STORAGE_KEY = 'crm_realty_data';
            let existingData = JSON.parse(localStorage.getItem(CRM_STORAGE_KEY)) || [];
            
            // Nếu localStorage trống, có thể CRM chưa chạy lần nào.
            // Để an toàn, mình cứ khởi tạo là array.
            if (!Array.isArray(existingData)) existingData = [];

            const newId = existingData.length > 0 ? Math.max(...existingData.map(c => c.id)) + 1 : 1;
            const newLead = {
                id: newId,
                name: sanitize(fullname),
                phone: sanitize(phone),
                email: '', 
                project: 'Cao Xà Lá',
                status: 'Mới',
                note: `Đăng ký từ Landing Page Cao Xà Lá: ${sanitize(origin)}`,
                date: new Date().toISOString().split('T')[0]
            };
            
            console.log('--- DỮ LIỆU GỬI SANG CRM ---');
            console.table(newLead);
            
            existingData.push(newLead);
            localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(existingData));
            console.log('✅ Lead đã được lưu vào LocalStorage (Key: crm_realty_data)');

            // Hiện Success State
            const successDiv = formElement.parentElement.querySelector('.form-success');
            if(successDiv) {
                successDiv.style.display = 'block';
            }

        } catch (error) {
            console.error('Lỗi khi gửi form:', error);
            alert('Cảm ơn anh/chị. Thông tin đăng ký đã được ghi nhận vào hệ thống tạm thời!');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    };

    const heroForm = document.getElementById('hero-form');
    const footerForm = document.getElementById('footer-form');

    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(heroForm);
        });
    }

    if (footerForm) {
        footerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(footerForm);
        });
    }

    // Auto Popup – hiện khi cuộn qua 50%
    const autoPopup = document.getElementById('autoPopup');
    const popupClose = document.getElementById('popupClose');
    const popupForm = document.getElementById('popup-form');
    let popupShown = false;

    window.addEventListener('scroll', () => {
        if (!popupShown && autoPopup) {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 50) {
                autoPopup.style.display = 'flex';
                popupShown = true;
            }
        }
    });

    if (popupClose) {
        popupClose.addEventListener('click', () => {
            autoPopup.style.display = 'none';
        });
    }

    if (autoPopup) {
        autoPopup.addEventListener('click', (e) => {
            if (e.target === autoPopup) autoPopup.style.display = 'none';
        });
    }

    if (popupForm) {
        popupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(popupForm);
        });
    }
});
