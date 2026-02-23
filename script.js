document.addEventListener('DOMContentLoaded', () => {
    // --- Gestione Tema (Sincronizzazione Desktop e Mobile) ---
    const themeCheckbox = document.getElementById('theme-checkbox'); // PC
    const themeCheckboxMobile = document.getElementById('theme-checkbox-mobile'); // Mobile
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // Aggiorna visivamente entrambi i bottoni
        if(themeCheckbox) themeCheckbox.checked = (theme === 'dark');
        if(themeCheckboxMobile) themeCheckboxMobile.checked = (theme === 'dark');
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
    }

    // Listener Desktop
    if(themeCheckbox) {
        themeCheckbox.addEventListener('change', (e) => setTheme(e.target.checked ? 'dark' : 'light'));
    }
    // Listener Mobile
    if(themeCheckboxMobile) {
        themeCheckboxMobile.addEventListener('change', (e) => setTheme(e.target.checked ? 'dark' : 'light'));
    }

    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
    });

    // --- Gestione Hamburger Menu Mobile ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const body = document.body; // Selezioniamo il body

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Blocca o sblocca lo scroll della pagina
            body.classList.toggle('no-scroll'); 
        });
    }

    // Chiude il menu automaticamente quando l'utente clicca su una sezione
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                // Sblocca lo scroll della pagina
                body.classList.remove('no-scroll'); 
            }
        });
    });

    // --- Smart Navbar (Nascondi giù, Mostra su) ---
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 80) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
            lastScrollTop = scrollTop;
        });
    }

    // --- Animazioni allo Scroll (Intersection Observer) ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const targets = document.querySelectorAll('.animate-block, .stagger-box');
    targets.forEach(target => observer.observe(target));

    // --- ZOOM MANUALE DEL MODELLO 3D (FIX INFALLIBILE) ---
    const modelViewer = document.getElementById('robot-viewer');
    if (modelViewer) {
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        
        zoomInBtn.addEventListener('click', () => {
            // Estrae l'orbita attuale e riduce il raggio per avvicinarsi forzatamente
            const orbit = modelViewer.getCameraOrbit();
            modelViewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius * 0.7}m`;
        });
        
        zoomOutBtn.addEventListener('click', () => {
            // Aumenta il raggio per allontanarsi
            const orbit = modelViewer.getCameraOrbit();
            modelViewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius * 1.3}m`;
        });
    }

    // --- LIGHTBOX GALLERIA IMMAGINI (FIX) ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const images = document.querySelectorAll('.gallery-item img');
        const closeBtn = document.querySelector('.close-lightbox');
        const nextBtn = document.querySelector('.lightbox-next');
        const prevBtn = document.querySelector('.lightbox-prev');
        let currentIndex = 0;

        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                lightbox.classList.add('active'); // Usa la classe invece del display inline
                lightboxImg.src = img.src;
                currentIndex = index;
            });
        });

        closeBtn.addEventListener('click', () => { lightbox.classList.remove('active'); });
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox) lightbox.classList.remove('active');
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            lightboxImg.src = images[currentIndex].src;
        });
        
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentIndex].src;
        });
        
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'ArrowRight') nextBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'Escape') closeBtn.click();
            }
        });
    }
});

// =========================================
// SMART NAVBAR HIGHLIGHT (SCROLLSPY FIX)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]'); 
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let currentId = '';
        const scrollPosition = window.scrollY;

        // Se siamo in cima alla pagina, rimuovi tutti gli highlight
        if (scrollPosition < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            return;
        }

        // Trova la sezione attualmente visibile
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Se lo scroll è arrivato alla sezione (con 250px di anticipo per attivazione fluida)
            if (scrollPosition >= (sectionTop - 250) && scrollPosition < (sectionTop + sectionHeight)) {
                currentId = section.getAttribute('id');
            }
        });

        // Applica la classe 'active' solo al link corretto
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentId && link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    });
});
