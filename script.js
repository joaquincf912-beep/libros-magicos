/**
 * Libros Mágicos - Interactive JavaScript
 * Flipbook viewer, animations, smooth scrolling, and interactions
 * Powered by TraccionWeb - librosparaninos.traccionweb.com
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========== FLIPBOOK CONTROLLER ==========
    const FlipBook = {
        currentPage: 0,
        totalPages: 0,
        isAnimating: false,
        pages: [],
        
        init() {
            this.pages = document.querySelectorAll('.flipbook-page');
            this.totalPages = this.pages.length;
            this.prevBtn = document.getElementById('flip-prev');
            this.nextBtn = document.getElementById('flip-next');
            this.indicator = document.getElementById('flipbook-indicator');
            
            if (!this.pages.length) return;
            
            // Set initial state
            this.updateUI();
            
            // Button events
            this.prevBtn?.addEventListener('click', () => this.prevPage());
            this.nextBtn?.addEventListener('click', () => this.nextPage());
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                const flipbookSection = document.getElementById('preview');
                if (!flipbookSection) return;
                
                const rect = flipbookSection.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    if (e.key === 'ArrowLeft') this.prevPage();
                    if (e.key === 'ArrowRight') this.nextPage();
                }
            });
            
            // Touch/swipe support
            this.setupSwipe();
        },
        
        setupSwipe() {
            const flipbook = document.getElementById('flipbook');
            if (!flipbook) return;
            
            let startX = 0;
            let startY = 0;
            let isDragging = false;
            
            flipbook.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isDragging = true;
            }, { passive: true });
            
            flipbook.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                isDragging = false;
                
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = startX - endX;
                const diffY = Math.abs(startY - endY);
                
                // Only trigger if horizontal swipe is dominant
                if (Math.abs(diffX) > 50 && diffY < 100) {
                    if (diffX > 0) this.nextPage();
                    else this.prevPage();
                }
            }, { passive: true });
        },
        
        nextPage() {
            if (this.isAnimating || this.currentPage >= this.totalPages - 1) return;
            this.isAnimating = true;
            
            const currentEl = this.pages[this.currentPage];
            const nextEl = this.pages[this.currentPage + 1];
            
            // Animate out current page
            currentEl.classList.remove('active');
            currentEl.classList.add('flip-out-right');
            
            // Animate in next page
            setTimeout(() => {
                nextEl.classList.add('active', 'flip-in-left');
                
                setTimeout(() => {
                    currentEl.classList.remove('flip-out-right');
                    nextEl.classList.remove('flip-in-left');
                    this.currentPage++;
                    this.updateUI();
                    this.isAnimating = false;
                }, 600);
            }, 100);
        },
        
        prevPage() {
            if (this.isAnimating || this.currentPage <= 0) return;
            this.isAnimating = true;
            
            const currentEl = this.pages[this.currentPage];
            const prevEl = this.pages[this.currentPage - 1];
            
            // Animate out current page
            currentEl.classList.remove('active');
            currentEl.classList.add('flip-out-left');
            
            // Animate in previous page
            setTimeout(() => {
                prevEl.classList.add('active', 'flip-in-right');
                
                setTimeout(() => {
                    currentEl.classList.remove('flip-out-left');
                    prevEl.classList.remove('flip-in-right');
                    this.currentPage--;
                    this.updateUI();
                    this.isAnimating = false;
                }, 600);
            }, 100);
        },
        
        updateUI() {
            // Update buttons
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentPage === 0;
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentPage === this.totalPages - 1;
            }
            
            // Update indicator
            if (this.indicator) {
                const currentSpan = this.indicator.querySelector('.current-page');
                const totalSpan = this.indicator.querySelector('.total-pages');
                if (currentSpan) currentSpan.textContent = this.currentPage + 1;
                if (totalSpan) totalSpan.textContent = this.totalPages;
            }
        }
    };
    
    FlipBook.init();

    // ========== INTERSECTION OBSERVER (FADE-IN ANIMATIONS) ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach((el) => {
        fadeObserver.observe(el);
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });

    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });

    // ========== MOBILE MENU ==========
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    function closeMobileMenu() {
        mobileMenuBtn?.classList.remove('active');
        mobileMenu?.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    mobileMenuBtn?.addEventListener('click', () => {
        const isOpen = mobileMenu?.classList.contains('open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            mobileMenuBtn.classList.add('active');
            mobileMenu?.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ========== ANIMATED COUNTERS ==========
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }
    
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach((counter) => {
            const text = counter.textContent;
            const hasK = text.includes('K');
            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            const hasDot = text.includes('.');
            
            let target;
            if (hasK) {
                target = parseFloat(text.replace(/[^0-9.]/g, ''));
            } else if (hasDot) {
                target = parseFloat(text.replace(/[^0-9.]/g, ''));
            } else {
                target = parseInt(text.replace(/[^0-9]/g, ''));
            }
            
            let current = 0;
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            const stepTime = duration / steps;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                let display;
                if (hasK) {
                    display = Math.floor(current) + 'K';
                } else if (hasDot) {
                    display = current.toFixed(1);
                } else {
                    display = Math.floor(current);
                }
                
                if (hasPlus) display += '+';
                if (hasPercent) display += '%';
                
                counter.textContent = display;
            }, stepTime);
        });
    }

    // ========== BOOK CARDS HOVER TILT EFFECT ==========
    document.querySelectorAll('.book-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ========== PARALLAX EFFECTS ==========
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        document.querySelectorAll('.hero-orb').forEach((orb, i) => {
            const speed = 0.05 + (i * 0.02);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, { passive: true });

    // ========== SERVICE WORKER REGISTRATION ==========
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }

    // ========== FLASH OFFER COUNTDOWN ==========
    const FlashOffer = {
        endTime: null,
        
        init() {
            const stored = localStorage.getItem('flash_offer_end');
            if (stored && parseInt(stored) > Date.now()) {
                this.endTime = parseInt(stored);
            } else {
                // Set 2 hours 45 minutes from now
                this.endTime = Date.now() + (2 * 60 * 60 * 1000) + (45 * 60 * 1000);
                localStorage.setItem('flash_offer_end', this.endTime.toString());
            }
            this.tick();
            setInterval(() => this.tick(), 1000);
        },
        
        tick() {
            const now = Date.now();
            const diff = Math.max(0, this.endTime - now);
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            const h = document.getElementById('timer-hours');
            const m = document.getElementById('timer-minutes');
            const s = document.getElementById('timer-seconds');
            
            if (h) h.textContent = String(hours).padStart(2, '0');
            if (m) m.textContent = String(minutes).padStart(2, '0');
            if (s) s.textContent = String(seconds).padStart(2, '0');
            
            if (diff <= 0) {
                document.getElementById('flash-offer')?.classList.add('expired');
                // Reset after expired for 5 minutes
                setTimeout(() => {
                    this.endTime = Date.now() + (2 * 60 * 60 * 1000) + (45 * 60 * 1000);
                    localStorage.setItem('flash_offer_end', this.endTime.toString());
                    document.getElementById('flash-offer')?.classList.remove('expired');
                }, 5 * 60 * 1000);
            }
        }
    };
    
    FlashOffer.init();

    // ========== SOCIAL PROOF NOTIFICATIONS ==========
    const SocialProof = {
        currentIndex: 0,
        isVisible: false,
        isPaused: false,
        
        notifications: [
            { name: 'Carlos', child: 'Emiliano', book: 'Mi Super Aventura', time: '2 minutos', country: '🇨🇴 Colombia', color: '#ec4899' },
            { name: 'María', child: 'Sofía', book: 'Mi Princesa Favorita', time: '5 minutos', country: '🇲🇽 México', color: '#a855f7' },
            { name: 'Andrea', child: 'Matías', book: 'Aventura en el Espacio', time: '8 minutos', country: '🇪🇸 España', color: '#3b82f6' },
            { name: 'Laura', child: 'Valentina', book: 'El Bosque Encantado', time: '12 minutos', country: '🇦🇷 Argentina', color: '#22c55e' },
            { name: 'Pedro', child: 'Santiago', book: 'Mi Primer Libro de Colores', time: '15 minutos', country: '🇻🇪 Venezuela', color: '#f97316' },
            { name: 'Camila', child: 'Isabella', book: 'La Receta Mágica', time: '18 minutos', country: '🇨🇱 Chile', color: '#06b6d4' },
            { name: 'Diego', child: 'Luciana', book: 'Mi Super Aventura', time: '22 minutos', country: '🇵🇪 Perú', color: '#eab308' },
            { name: 'Fernanda', child: 'Martín', book: 'Mi Princesa Favorita', time: '25 minutos', country: '🇺🇾 Uruguay', color: '#ef4444' },
            { name: 'Roberto', child: 'Camila', book: 'Aventura en el Espacio', time: '30 minutos', country: '🇪🇨 Ecuador', color: '#8b5cf6' },
            { name: 'Ana', child: 'Sebastián', book: 'El Bosque Encantado', time: '35 minutos', country: '🇩🇴 Rep. Dominicana', color: '#ec4899' },
            { name: 'Julián', child: 'Emma', book: 'La Receta Mágica', time: '40 minutos', country: '🇵🇦 Panamá', color: '#10b981' },
            { name: 'Daniela', child: 'Tomás', book: 'Mi Primer Libro de Colores', time: '45 minutos', country: '🇨🇷 Costa Rica', color: '#6366f1' },
        ],
        
        init() {
            const closeBtn = document.getElementById('proof-close');
            closeBtn?.addEventListener('click', () => this.hide());
            
            // First notification after 8 seconds
            setTimeout(() => this.show(), 8000);
        },
        
        show() {
            if (this.isPaused) return;
            
            const notif = this.notifications[this.currentIndex];
            const el = document.getElementById('social-proof');
            const avatar = document.getElementById('proof-avatar');
            const text = document.getElementById('proof-text');
            const time = document.getElementById('proof-time');
            
            if (!el || !avatar || !text || !time) return;
            
            avatar.textContent = notif.name.charAt(0);
            avatar.style.background = `linear-gradient(135deg, ${notif.color}, ${notif.color}88)`;
            text.innerHTML = `<strong>${notif.name}</strong> acaba de descargar <strong>"${notif.book}"</strong> para su hijo/a <strong>${notif.child}</strong>`;
            time.textContent = `Hace ${notif.time} · ${notif.country}`;
            
            el.classList.add('visible');
            this.isVisible = true;
            
            // Hide after 6 seconds
            setTimeout(() => {
                this.hide();
                // Next notification in 15-30 seconds
                const nextDelay = 15000 + Math.random() * 15000;
                setTimeout(() => {
                    this.currentIndex = (this.currentIndex + 1) % this.notifications.length;
                    this.show();
                }, nextDelay);
            }, 6000);
        },
        
        hide() {
            const el = document.getElementById('social-proof');
            el?.classList.remove('visible');
            this.isVisible = false;
        }
    };
    
    SocialProof.init();

    // ========== CONSOLE BRANDING ==========
    console.log(
        '%c✨ Libros Mágicos by TraccionWeb ✨\n%cwww.traccionweb.com',
        'color: #ec4899; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(236,72,153,0.3);',
        'color: #a855f7; font-size: 14px;'
    );
});
