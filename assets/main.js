// Variables globales
const weddingDate = new Date('2026-02-14T13:00:00');
let guestName = 'Invitado';
let guestCount = 1;let isFamilia = false;
// Obtener parámetros de la URL
function getURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Obtener nombre del invitado
    const name = urlParams.get('nombre') || urlParams.get('name');
    if (name) {
        guestName = decodeURIComponent(name);
    }
    
    // Obtener cantidad de personas
    const count = urlParams.get('personas') || urlParams.get('count');
    if (count) {
        guestCount = parseInt(count) || 1;
    }
    
    // Obtener si es familia
    const familia = urlParams.get('isFamilia') || urlParams.get('familia');
    if (familia === 'true' || familia === '1') {
        isFamilia = true;
    }
    
    // Actualizar en la página
    updateGuestInfo();
}

// Actualizar información del invitado
function updateGuestInfo() {
    const guestNameElement = document.getElementById('guest-name');
    const guestCountElements = document.querySelectorAll('.guest-count-number');
    const invitationVerbElement = document.getElementById('invitation-verb');
    
    if (guestNameElement) {
        guestNameElement.textContent = guestName;
    }
    
    // Actualizar todos los elementos de conteo de invitados
    guestCountElements.forEach(element => {
        element.textContent = guestCount;
    });
    
    if (invitationVerbElement) {
        invitationVerbElement.textContent = isFamilia ? 'invitarlos' : 'invitarte';
    }
}

// Contador regresivo
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    // Calcular tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Actualizar HTML
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    
    // Si la cuenta regresiva terminó
    if (distance < 0) {
        document.querySelector('.countdown-section h2').textContent = '¡Es hoy!';
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
    }
}

// Pantalla de bienvenida - Click en el sobre
function setupWelcomeScreen() {
    const envelopeContainer = document.querySelector('.envelope-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const invitationScreen = document.getElementById('invitation-screen');
    
    envelopeContainer.addEventListener('click', function() {
        // Iniciar música al hacer clic
        const audio = document.getElementById('background-music');
        if (audio) {
            audio.play().catch(err => console.log('Error al reproducir música:', err));
        }
        
        // Animación de salida
        welcomeScreen.style.opacity = '0';
        
        setTimeout(() => {
            welcomeScreen.classList.remove('active');
            invitationScreen.classList.add('active');
            
            // Scroll al inicio
            window.scrollTo(0, 0);
            
            // Iniciar contador
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }, 800);
    });
}

// Configurar botones de mapa
function setupMapButtons() {
    const mapButtons = document.querySelectorAll('.btn-map');
    
    mapButtons.forEach(button => {
        button.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            
            // URLs de Google Maps
            const locations = {
                church: 'https://maps.app.goo.gl/Jgvo29H9ZLkDQ7c99',
                reception: 'https://maps.app.goo.gl/Jgvo29H9ZLkDQ7c99'
            };
            
            if (locations[location]) {
                window.open(locations[location], '_blank');
            }
        });
    });
}

// Configurar botón de confirmación
function setupConfirmButton() {
    const confirmButtons = document.querySelectorAll('.btn-confirm');
    
    confirmButtons.forEach(button => {
        button.addEventListener('click', function() {
            let message;
            
            if (isFamilia) {
                message = `La ${guestName} confirma la asistencia`;
            } else {
                message = `Yo ${guestName} confirmo asistencia`;
            }
            
            const whatsappURL = `https://wa.me/5219932334052?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, '_blank');
        });
    });
}

// Añadir música de fondo
function setupBackgroundMusic() {
    // Crear elemento de audio con música de piano romántica
    const audio = document.createElement('audio');
    audio.id = 'background-music';
    audio.loop = true;
    audio.volume = 0.2;
    
    // Música de fondo
    const musicSource = document.createElement('source');
    musicSource.src = 'assets/music/CHACHACHA.mp3';
    musicSource.type = 'audio/mpeg';
    audio.appendChild(musicSource);
    
    document.body.appendChild(audio);
    
    // Botón de música flotante
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🔊';
    musicButton.className = 'music-toggle';
    musicButton.style.cssText = 'position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;border:none;background:var(--gold);color:white;font-size:1.8rem;cursor:pointer;z-index:1000;box-shadow:0 4px 15px rgba(0,0,0,0.3);transition:all 0.3s ease;';
    
    let isPlaying = false;
    
    // No intentar reproducir automáticamente - se iniciará al tocar el sobre
    musicButton.innerHTML = '🔇';
    
    // Escuchar cuando la música comience a reproducirse
    audio.addEventListener('play', () => {
        musicButton.innerHTML = '🔊';
        musicButton.style.background = 'var(--gold)';
        isPlaying = true;
    });
    
    audio.addEventListener('pause', () => {
        musicButton.innerHTML = '🔇';
        musicButton.style.background = '#999';
        isPlaying = false;
    });
    
    musicButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicButton.innerHTML = '🔇';
            musicButton.style.background = '#999';
        } else {
            audio.play();
            musicButton.innerHTML = '🔊';
            musicButton.style.background = 'var(--gold)';
        }
        isPlaying = !isPlaying;
    });
    
    // Efecto hover
    musicButton.addEventListener('mouseenter', () => {
        musicButton.style.transform = 'scale(1.1)';
    });
    
    musicButton.addEventListener('mouseleave', () => {
        musicButton.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(musicButton);
}

// Animación de scroll suave
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Añadir efecto parallax sutil
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.invitation-header');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Guardar confirmación en localStorage
function saveRSVP(attending) {
    const rsvpData = {
        name: guestName,
        count: guestCount,
        attending: attending,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('wedding-rsvp', JSON.stringify(rsvpData));
}

// Verificar si ya confirmó
function checkExistingRSVP() {
    const saved = localStorage.getItem('wedding-rsvp');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.attending) {
            const confirmButton = document.getElementById('btn-confirm');
            confirmButton.textContent = '✓ Ya Confirmaste';
            confirmButton.style.background = '#4CAF50';
        }
    }
}

// Animación de confeti (opcional)
function createConfetti() {
    // Implementación simple de confeti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${['var(--gold)', 'var(--dark-green)', 'var(--light-green)'][Math.floor(Math.random() * 3)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            opacity: 0.8;
            z-index: 9999;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const distance = Math.random() * 600 + 400;
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${distance}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Lightbox para ver fotos en grande
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const galleryPhotos = document.querySelectorAll('.gallery-photo');
    
    let currentLightboxIndex = 0;
    const photos = [];
    
    // Recopilar información de todas las fotos
    galleryPhotos.forEach((photo, index) => {
        const caption = photo.parentElement.querySelector('.photo-caption');
        photos.push({
            src: photo.src,
            alt: photo.alt,
            caption: caption ? caption.textContent : ''
        });
        
        // Agregar evento click a cada foto
        photo.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    function openLightbox(index) {
        currentLightboxIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateLightboxImage() {
        const photo = photos[currentLightboxIndex];
        lightboxImg.src = photo.src;
        lightboxImg.alt = photo.alt;
        lightboxCaption.textContent = photo.caption;
    }
    
    function showNextPhoto() {
        currentLightboxIndex = (currentLightboxIndex + 1) % photos.length;
        updateLightboxImage();
    }
    
    function showPrevPhoto() {
        currentLightboxIndex = (currentLightboxIndex - 1 + photos.length) % photos.length;
        updateLightboxImage();
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextPhoto);
    prevBtn.addEventListener('click', showPrevPhoto);
    
    // Cerrar al hacer click fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextPhoto();
        if (e.key === 'ArrowLeft') showPrevPhoto();
    });
}

// Carrusel de fotos
function setupPhotoCarousel() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.photo-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!track || !items.length) return;
    
    let currentIndex = 0;
    let autoPlayInterval;
    
    // Crear indicadores de puntos
    items.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    function updateCarousel() {
        // Mover el track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Actualizar clases activas
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000); // Cambiar cada 4 segundos
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Event listeners para botones
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    // Pausar auto-play al hacer hover
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
    
    // Touch support para móviles
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
    }
    
    // Iniciar auto-play
    startAutoPlay();
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Obtener parámetros de URL
    getURLParams();
    
    // Configurar pantalla de bienvenida
    setupWelcomeScreen();
    
    // Configurar botones
    setupMapButtons();
    setupConfirmButton();
    
    // Verificar RSVP existente
    checkExistingRSVP();
    
    // Configurar smooth scroll
    setupSmoothScroll();
    
    // Música de fondo
    setupBackgroundMusic();
    
    // Configurar carrusel de fotos
    setupPhotoCarousel();
    
    // Configurar lightbox
    setupLightbox();
    
    // Parallax (opcional)
    // setupParallax();
    
    // Confeti al abrir la invitación (opcional)
    // setTimeout(createConfetti, 1000);
    
    console.log('Invitación cargada para:', guestName, '- Personas:', guestCount);
});

// Prevenir zoom en móviles (opcional)
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

// Compartir invitación (API Web Share)
function shareInvitation() {
    if (navigator.share) {
        navigator.share({
            title: '¡Nos Casamos! - Abraham & Raquel',
            text: '¡Estás invitado a nuestra boda!',
            url: window.location.href
        }).catch(err => console.log('Error al compartir:', err));
    }
}