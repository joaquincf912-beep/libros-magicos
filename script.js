/**
 * Libros Mágicos - Interactive JavaScript
 * Flipbook viewer, animations, smooth scrolling, and interactions
 * Powered by TraccionWeb - librosparaninos.traccionweb.com
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========== LANGUAGE SWITCHER ==========
    const langBtn = document.getElementById('lang-btn');
    const langSwitcher = document.getElementById('lang-switcher');
    if (langBtn && langSwitcher) {
        langBtn.addEventListener('click', (e) => { e.stopPropagation(); langSwitcher.classList.toggle('open'); });
        document.addEventListener('click', () => langSwitcher.classList.remove('open'));
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                const flags = { es: '🇪🇸 ES', en: '🇺🇸 EN', pt: '🇧🇷 PT', fr: '🇫🇷 FR' };
                document.getElementById('lang-current').textContent = flags[lang] || flags.es;
                langSwitcher.classList.remove('open');
                localStorage.setItem('lang', lang);
            });
        });
        const saved = localStorage.getItem('lang');
        if (saved) {
            const flags = { es: '🇪🇸 ES', en: '🇺🇸 EN', pt: '🇧🇷 PT', fr: '🇫🇷 FR' };
            document.getElementById('lang-current').textContent = flags[saved] || flags.es;
        }
    }
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
                this.endTime = Date.now() + (2 * 60 * 60 + 45 * 60) * 1000;
                localStorage.setItem('flash_offer_end', this.endTime.toString());
            }
            this.tick();
            setInterval(() => this.tick(), 1000);
            this.updateBuyers();
            setInterval(() => this.updateBuyers(), 8000);
        },
        
        tick() {
            const diff = Math.max(0, this.endTime - Date.now());
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            
            const hEl = document.getElementById('timer-hours');
            const mEl = document.getElementById('timer-minutes');
            const sEl = document.getElementById('timer-seconds');
            if (hEl) hEl.textContent = String(h).padStart(2, '0');
            if (mEl) mEl.textContent = String(m).padStart(2, '0');
            if (sEl) sEl.textContent = String(s).padStart(2, '0');
            
            if (diff <= 0) {
                this.endTime = Date.now() + (2 * 60 * 60 + 45 * 60) * 1000;
                localStorage.setItem('flash_offer_end', this.endTime.toString());
            }
        },
        
        updateBuyers() {
            const el = document.getElementById('flash-buyers');
            if (el) {
                const n = 15 + Math.floor(Math.random() * 20);
                el.textContent = n + ' personas';
            }
        }
    };
    FlashOffer.init();

    // ========== SOCIAL PROOF NOTIFICATIONS ==========
    const SocialProof = {
        index: 0,
        timeout: null,
        
        data: [
            { icon: '📚', name: 'Carlos', child: 'Emiliano', book: 'Mi Super Aventura', time: 'Hace 2 min', flag: '🇨🇴 Colombia' },
            { icon: '👸', name: 'María', child: 'Sofía', book: 'Mi Princesa Favorita', time: 'Hace 5 min', flag: '🇲🇽 México' },
            { icon: '🚀', name: 'Andrea', child: 'Matías', book: 'Aventura en el Espacio', time: 'Hace 8 min', flag: '🇪🇸 España' },
            { icon: '🌳', name: 'Laura', child: 'Valentina', book: 'El Bosque Encantado', time: 'Hace 11 min', flag: '🇦🇷 Argentina' },
            { icon: '🎨', name: 'Pedro', child: 'Santiago', book: 'Mi Primer Libro de Colores', time: 'Hace 14 min', flag: '🇻🇪 Venezuela' },
            { icon: '🍰', name: 'Camila', child: 'Isabella', book: 'La Receta Mágica', time: 'Hace 17 min', flag: '🇨🇱 Chile' },
            { icon: '🦸', name: 'Diego', child: 'Luciana', book: 'Mi Super Aventura', time: 'Hace 20 min', flag: '🇵🇪 Perú' },
            { icon: '👸', name: 'Fernanda', child: 'Martín', book: 'Mi Princesa Favorita', time: 'Hace 23 min', flag: '🇺🇾 Uruguay' },
            { icon: '🚀', name: 'Roberto', child: 'Camila', book: 'Aventura en el Espacio', time: 'Hace 26 min', flag: '🇪🇨 Ecuador' },
            { icon: '🌳', name: 'Ana', child: 'Sebastián', book: 'El Bosque Encantado', time: 'Hace 30 min', flag: '🇩🇴 Rep. Dominicana' },
            { icon: '🍰', name: 'Julián', child: 'Emma', book: 'La Receta Mágica', time: 'Hace 33 min', flag: '🇵🇦 Panamá' },
            { icon: '🎨', name: 'Daniela', child: 'Tomás', book: 'Mi Primer Libro de Colores', time: 'Hace 36 min', flag: '🇨🇷 Costa Rica' },
        ],
        
        init() {
            document.getElementById('proof-close')?.addEventListener('click', () => this.hide());
            setTimeout(() => this.show(), 6000);
        },
        
        show() {
            const d = this.data[this.index];
            const el = document.getElementById('social-proof');
            const icon = document.getElementById('proof-icon');
            const text = document.getElementById('proof-text');
            const time = document.getElementById('proof-time');
            if (!el) return;
            
            if (icon) icon.textContent = d.icon;
            if (text) text.innerHTML = `<strong>${d.name}</strong> descargó <strong>"${d.book}"</strong> para <strong>${d.child}</strong>`;
            if (time) time.textContent = `${d.time} · ${d.flag}`;
            
            // Reset progress bar
            const bar = el.querySelector('.social-proof-progress');
            if (bar) { bar.style.animation = 'none'; bar.offsetHeight; bar.style.animation = 'proofProgress 5s linear forwards'; }
            
            el.classList.add('visible');
            
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.hide();
                const next = 12000 + Math.random() * 18000;
                setTimeout(() => {
                    this.index = (this.index + 1) % this.data.length;
                    this.show();
                }, next);
            }, 5000);
        },
        
        hide() {
            document.getElementById('social-proof')?.classList.remove('visible');
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

// ========== PAYMENT FORM ==========
const PaymentForm = {
    init() {
        this.planSelectors = document.querySelectorAll('.plan-card');
        this.form = document.getElementById('order-form');
        this.paypalBtn = document.getElementById('paypal-btn');
        this.planSummary = document.querySelector('.plan-summary');
        this.childName = document.getElementById('child-name');
        this.childAge = document.getElementById('child-age');
        this.bookTitle = document.getElementById('book-title');
        this.bookDescription = document.getElementById('book-description');
        this.parentPhone = document.getElementById('parent-phone');
        this.bookGrid = document.querySelector('.book-grid');
        this.selectedBooks = new Set();
        
        if (!this.planSelectors.length) return;
        
        this.planPrices = {
            basico: 9.99,
            familiar: 24.99,
            premium: 39.99
        };
        
        this.planFeatures = {
            basico: [
                '1 libro digital (24 páginas)',
                'Nombre y apariencia del niño/a',
                'Formato PDF alta calidad',
                'Descarga instantánea',
                '1 revisión de contenido'
            ],
            familiar: [
                '3 libros digitales (24 pág. c/u)',
                'Nombre y apariencia de cada niño',
                '3 portadas diferentes',
                'Descarga instantánea + imprimible',
                '2 revisiones por libro',
                'Versión interactiva con audio'
            ],
            premium: [
                '5 libros digitales personalizados',
                'Personalización completa',
                'Formato PDF + interactivo con audio',
                'Descarga instantánea ilimitada',
                'Revisiones ilimitadas',
                'Dedicatoria especial animada',
                'Actualizaciones gratuitas de por vida'
            ]
        };
        
        this.setupPlanSelection();
        this.setupBookSelection();
        this.setupPayPalIntegration();
        this.applyUrlParams();
    },
    
    setupPlanSelection() {
        this.planSelectors.forEach(card => {
            card.addEventListener('click', () => {
                const plan = card.dataset.plan;
                this.selectPlan(plan);
            });
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const plan = card.dataset.plan;
                    this.selectPlan(plan);
                }
            });
        });
        
        // Select first plan by default
        if (this.planSelectors.length > 0) {
            this.selectPlan(this.planSelectors[0].dataset.plan);
        }
    },
    
    selectPlan(plan) {
        // Update plan cards visual state
        this.planSelectors.forEach(card => {
            if (card.dataset.plan === plan) {
                card.classList.add('pricing-card-featured');
                card.classList.remove('pricing-card');
                card.setAttribute('aria-pressed', 'true');
            } else {
                card.classList.remove('pricing-card-featured');
                card.classList.add('pricing-card');
                card.setAttribute('aria-pressed', 'false');
            }
        });
        
        // Update price display
        const price = this.planPrices[plan];
        document.querySelector('.plan-summary .plan-price').textContent = `$${price.toFixed(2)}`;
        document.querySelector('.plan-summary .plan-period').textContent = this.getPeriod(plan);
        
        // Update plan info (scoped to the summary, not the plan cards)
        const planName = document.querySelector('.plan-summary .plan-name');
        planName.textContent = this.getPlanName(plan);
        
        // Update book count
        const bookCount = this.getBookCount(plan);
        document.querySelector('.plan-books-count').textContent = bookCount;
        
        // Update PayPal button label
        const payLabel = document.querySelector('.paypal-btn-label');
        if (payLabel) payLabel.textContent = `Pagar con PayPal - $${price.toFixed(2)}`;
        
        // Enforce the new plan's book limit on the current selection
        if (this.bookGrid) {
            const limit = parseInt(this.getBookCount(plan), 10);
            while (this.selectedBooks.size > limit) {
                const first = this.selectedBooks.values().next().value;
                this.selectedBooks.delete(first);
            }
            this.syncBookOptions();
            this.updateBookHint();
        }
        
        // Update form description
        const formDesc = document.querySelector('.form-description');
        if (formDesc) {
            formDesc.textContent = `Plan: ${this.getPlanName(plan)} - $${price.toFixed(2)}`;
        }
        
        // Store selected plan
        this.selectedPlan = plan;
    },
    
    getPlanName(plan) {
        const names = {
            basico: 'Básico',
            familiar: 'Familiar',
            premium: 'Premium'
        };
        return names[plan] || 'Básico';
    },
    
    getPeriod(plan) {
        const periods = {
            basico: 'por ebook',
            familiar: '3 ebooks',
            premium: '5 ebooks'
        };
        return periods[plan] || 'por ebook';
    },
    
    getBookCount(plan) {
        const counts = {
            basico: '1',
            familiar: '3',
            premium: '5'
        };
        return counts[plan] || '1';
    },
    
    setupBookSelection() {
        if (!this.bookGrid) return;
        
        this.books = [
            { id: 'superheroe', title: 'Mi Super Aventura' },
            { id: 'princesa', title: 'Mi Princesa Favorita' },
            { id: 'espacio', title: 'Aventura en el Espacio' },
            { id: 'bosque', title: 'El Bosque Encantado' },
            { id: 'colores', title: 'Mi Primer Libro de Colores' },
            { id: 'receta', title: 'La Receta Mágica' }
        ];
        
        this.bookGrid.innerHTML = this.books.map((book) => `
            <button type="button" class="book-option" data-book="${book.id}" aria-pressed="false">
                <span class="book-option-check">✓</span>
                <span class="book-option-title">${book.title}</span>
            </button>
        `).join('');
        
        this.bookGrid.querySelectorAll('.book-option').forEach((btn) => {
            btn.addEventListener('click', () => this.toggleBook(btn.dataset.book));
        });
        
        const hint = document.querySelector('.book-hint');
        if (hint && !hint.dataset.ready) {
            hint.dataset.ready = '1';
            this.updateBookHint();
        }
    },
    
    toggleBook(id) {
        const limit = parseInt(this.getBookCount(this.selectedPlan), 10);
        
        if (this.selectedBooks.has(id)) {
            this.selectedBooks.delete(id);
        } else if (this.selectedBooks.size < limit) {
            this.selectedBooks.add(id);
        } else {
            const t = window.LM_T || ((s) => s);
            alert(t('Tu plan permite elegir hasta {limit} libro{s}. Cambia de plan o deselecciona uno primero.', { limit, s: limit > 1 ? 's' : '' }));
            return;
        }
        
        this.syncBookOptions();
        this.updateBookHint();
    },
    
    syncBookOptions() {
        this.bookGrid.querySelectorAll('.book-option').forEach((btn) => {
            const on = this.selectedBooks.has(btn.dataset.book);
            btn.classList.toggle('selected', on);
            btn.setAttribute('aria-pressed', String(on));
        });
    },
    
    updateBookHint() {
        const hint = document.querySelector('.book-hint');
        if (!hint) return;
        const limit = this.getBookCount(this.selectedPlan);
        const variants = {
            '1': 'Puedes elegir hasta 1 libro de la colección — o cuéntanos tu propia idea abajo.',
            '3': 'Puedes elegir hasta 3 libros de la colección — o cuéntanos tu propia idea abajo.',
            '5': 'Puedes elegir hasta 5 libros de la colección — o cuéntanos tu propia idea abajo.'
        };
        hint.textContent = variants[limit] || variants['1'];
    },
    
    applyUrlParams() {
        const params = new URLSearchParams(window.location.search);
        
        const plan = params.get('plan');
        if (plan && this.planPrices[plan]) {
            this.selectPlan(plan);
        }
        
        const libro = params.get('libro');
        if (libro && this.books) {
            const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
            const match = this.books.find((b) => norm(b.title) === norm(libro));
            if (match) {
                this.selectedBooks.add(match.id);
                this.syncBookOptions();
                this.updateBookHint();
                if (this.bookTitle && !this.bookTitle.value) {
                    this.bookTitle.value = match.title;
                }
            }
        }
    },
    
    setupPayPalIntegration() {
        if (!this.paypalBtn) return;
        
        this.paypalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.processPayment();
        });
    },
    
    processPayment() {
        if (!this.selectedPlan) {
            alert((window.LM_T || ((s) => s))('Por favor, selecciona un plan primero'));
            return;
        }
        
        // Validate required fields
        const required = [
            ['el nombre del niño/a', this.childName],
            ['la edad', this.childAge],
            ['tu teléfono / WhatsApp', this.parentPhone],
            ['el título o tema del libro', this.bookTitle]
        ];
        const missing = required.filter(([, el]) => el && !el.value.trim());
        if (missing.length) {
            const t = window.LM_T || ((s) => s);
            const fields = missing.map(([label]) => t(label)).join(', ');
            alert(t('Por favor completa: {fields}', { fields }));
            missing[0][1].focus();
            return;
        }
        
        const plan = this.selectedPlan;
        const price = this.planPrices[plan];
        const bookCount = this.getBookCount(plan);
        const name = this.childName.value;
        const age = this.childAge.value;
        
        // Collect form data
        const formData = {
            plan: plan,
            price: price,
            bookCount: bookCount,
            childName: name,
            childAge: age,
            phone: this.parentPhone.value,
            selectedBooks: Array.from(this.selectedBooks).map((id) => {
                const book = this.books.find((b) => b.id === id);
                return book ? book.title : id;
            }),
            bookTitle: this.bookTitle.value || 'Historia personalizada',
            bookDescription: this.bookDescription.value || 'Aventura mágica personalizada'
        };
        
        // Show loading state
        this.paypalBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm16 4h-4v12h-2v-2H14v-4h4V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2V8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zM5.3 6.3a.5.5 0 0 1 .8.6l-3.5 3.5a.5.5 0 0 1-.8-.6l3.5-3.5zM8.8 5.5a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5zM5.8 8.8a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5zM8.3 11.5a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5zM6.8 14.3a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5zM10.3 17.5a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5zM13.8 14.3a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5zM16.3 17.5a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5zM13.8 5.5a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5zM16.8 11.5a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5zM17.3 8.8a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5zM15.3 6.3a.5.5 0 0 1 .6.8l-3.5 3.5a.5.5 0 0 1-.6-.8l3.5-3.5z"/></svg>
            Procesando...
        `;
        this.paypalBtn.disabled = true;
        
        // In a real implementation, this would call PayPal API
        // For now, we'll simulate the payment and show a success message
        setTimeout(() => {
            this.showPaymentSuccess(formData);
        }, 2000);
    },
    
    showPaymentSuccess(formData) {
        const successMessage = `
            <div class="payment-success" style="
                background: linear-gradient(135deg, #d1fd8d, #a7f3d0);
                border: 2px solid #22c55e;
                border-radius: 16px;
                padding: 24px;
                text-align: center;
                margin: 20px 0;
                animation: slideIn 0.3s ease;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
                <h3 style="color: #1e1b4b; margin: 12px 0 8px;">¡Gracias por tu pedido!</h3>
                <p style="color: #334155; margin-bottom: 16px;">Tu pago fue procesado exitosamente.</p>
                <p style="color: #334155; font-size: 14px;">
                    Pedido:<br>
                    <strong>Plan: ${formData.plan} ($${formData.price.toFixed(2)})</strong><br>
                    <strong>Libros: ${formData.bookCount}</strong>${formData.selectedBooks.length ? ` — ${formData.selectedBooks.join(', ')}` : ''}<br>
                    <strong>Nombre: ${formData.childName}</strong> (${formData.childAge} años)<br>
                    <strong>Tel: ${formData.phone}</strong><br>
                    <strong>Título: ${formData.bookTitle}</strong>
                </p>
                <p style="color: #334155; font-size: 12px; margin-top: 16px;">
                    En recibirás un enlace de descarga en tu correo en los próximos 24-48 horas.
                </p>
            </div>
        `;
        
        // Insert success message after form
        const formSection = document.querySelector('.order-form');
        if (formSection) {
            formSection.insertAdjacentHTML('afterend', successMessage);
            
            // Remove form after a delay
            setTimeout(() => {
                formSection.remove();
            }, 3000);
        }
    }
};

PaymentForm.init();
