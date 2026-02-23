// Variabel global
let audio = null;
let audioStarted = false;
let loadingScreen, progressLoading, websiteContent;
let secretMenuToggle, secretModal, secretWishlist, passwordInput, passwordSubmit, passwordError, closeWishlist;
let scratchCanvas, letter, envelope, ctx, skipScratchButton;
let progressBar, percentage, loadingText, skipProgressButton;
let scrollProgress, backToTop;
let musicToggle, musicIcon;

// Variabel scratch
let isScratching = false;
let scratchPercentage = 0;
let isScratchComplete = false;
let lastX, lastY;

// Variabel progress loading
let loadingProgress = 0;
let isLoaded = false;
let skipLoading = false;

// Secret wishlist
let isPasswordCorrect = false;

// Game Memory Match
let gameGrid, gameMessage, resetGameBtn;
const icons = [
    'fas fa-heart', 'fas fa-heart',
    'fas fa-star', 'fas fa-star',
    'fas fa-gem', 'fas fa-gem',
    'fas fa-crown', 'fas fa-crown',
    'fas fa-ring', 'fas fa-ring',
    'fas fa-infinity', 'fas fa-infinity',
    'fas fa-sun', 'fas fa-sun',
    'fas fa-moon', 'fas fa-moon'
];
let shuffledIcons = [];
let flippedCards = [];
let matchedPairs = 0;
let lockBoard = false;

const loadingMessages = [
    "Memuat pesan cinta pertama...",
    "Menyiapkan kenangan indah...",
    "Mengumpulkan momen spesial...",
    "Menyusun kata-kata dari hati...",
    "Menghias dengan cinta...",
    "Hampir selesai, sayang..."
];

// Inisialisasi audio di awal (belum diputar)
function initAudio() {
    audio = new Audio('hbd.mp3');
    audio.loop = true;
    audio.volume = 0.4;
}

// Toggle play/pause musik
function toggleMusic() {
    if (!audio) return;
    
    if (audio.paused) {
        audio.play().then(() => {
            audioStarted = true;
            musicIcon.className = 'fas fa-pause';
        }).catch(e => console.log('Gagal memutar audio:', e));
    } else {
        audio.pause();
        musicIcon.className = 'fas fa-play';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initAudio(); // Siapkan audio sejak awal

    // Tangkap elemen DOM
    loadingScreen = document.getElementById('loadingScreen');
    progressLoading = document.getElementById('progressLoading');
    websiteContent = document.getElementById('websiteContent');
    
    secretMenuToggle = document.getElementById('secretMenuToggle');
    secretModal = document.getElementById('secretModal');
    secretWishlist = document.getElementById('secretWishlist');
    passwordInput = document.getElementById('passwordInput');
    passwordSubmit = document.getElementById('passwordSubmit');
    passwordError = document.getElementById('passwordError');
    closeWishlist = document.getElementById('closeWishlist');
    
    scratchCanvas = document.getElementById('scratchCanvas');
    letter = document.querySelector('.letter');
    envelope = document.querySelector('.envelope');
    skipScratchButton = document.getElementById('skipScratchButton');
    
    progressBar = document.getElementById('progressBar');
    percentage = document.getElementById('percentage');
    loadingText = document.getElementById('loadingText');
    skipProgressButton = document.getElementById('skipProgressButton');
    
    scrollProgress = document.getElementById('scrollProgress');
    backToTop = document.getElementById('backToTop');
    
    musicToggle = document.getElementById('musicToggle');
    if (musicToggle) {
        musicIcon = musicToggle.querySelector('i');
        musicToggle.addEventListener('click', toggleMusic);
    }

    // Game elements
    gameGrid = document.getElementById('gameGrid');
    gameMessage = document.getElementById('gameMessage');
    resetGameBtn = document.getElementById('resetGame');

    // Mulai proses loading
    initScratchLoading();
    initSecretWishlist();
});

// ================== SECRET WISHLIST ==================
function initSecretWishlist() {
    if (!secretMenuToggle) return;
    
    secretMenuToggle.addEventListener('click', () => {
        secretModal.classList.add('active');
        passwordInput.focus();
    });
    
    passwordSubmit.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });
    
    closeWishlist.addEventListener('click', () => {
        secretWishlist.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    secretModal.addEventListener('click', (e) => {
        if (e.target === secretModal) secretModal.classList.remove('active');
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && secretWishlist.classList.contains('active')) {
            secretWishlist.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function checkPassword() {
    const password = passwordInput.value.trim().toLowerCase();
    if (password === "i love you") {
        isPasswordCorrect = true;
        passwordError.style.display = 'none';
        secretModal.classList.remove('active');
        secretWishlist.classList.add('active');
        passwordInput.value = '';
        document.body.style.overflow = 'hidden';
        createWishlistConfetti();
    } else {
        passwordError.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        passwordInput.style.animation = 'none';
        setTimeout(() => { passwordInput.style.animation = 'shake 0.5s'; }, 10);
    }
}

function createWishlistConfetti() {
    const colors = ['#ff4d94', '#9c27b0', '#ff6b9d', '#ffd700', '#b76e79', '#8b4513', '#6a11cb'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 15 + 8 + 'px';
        confetti.style.height = Math.random() * 15 + 8 + 'px';
        if (Math.random() > 0.7) confetti.style.borderRadius = '50%';
        else if (Math.random() > 0.5) confetti.style.transform = 'rotate(45deg)';
        document.body.appendChild(confetti);
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random()*720}deg) scale(${Math.random()*0.5+0.5})`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            delay: Math.random() * 500
        }).onfinish = () => confetti.remove();
    }
}

// ================== SCRATCH LOADING ==================
function initScratchLoading() {
    if (!scratchCanvas) return;
    
    setupScratchCanvas();
    setupScratchEvents();
    
    skipScratchButton.addEventListener('click', function() {
        skipToProgressLoading();
    });
    
    createScratchHearts();
    
    setTimeout(() => {
        if (!isScratchComplete) skipToProgressLoading();
    }, 30000);
}

function setupScratchCanvas() {
    scratchCanvas.width = envelope.offsetWidth;
    scratchCanvas.height = envelope.offsetHeight;
    const ctx = scratchCanvas.getContext('2d');
    ctx.fillStyle = '#999';
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 100; i++) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(Math.random() * scratchCanvas.width, Math.random() * scratchCanvas.height, Math.random() * 10 + 5, Math.random() * 10 + 5);
    }
    ctx.globalAlpha = 1;
}

function setupScratchEvents() {
    scratchCanvas.addEventListener('mousedown', handleMouseDown);
    scratchCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    scratchCanvas.addEventListener('mousemove', handleMouseMove);
    scratchCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    scratchCanvas.addEventListener('mouseup', handleMouseUp);
    scratchCanvas.addEventListener('touchend', handleTouchEnd);
    scratchCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
}

function handleMouseDown(e) {
    isScratching = true;
    const rect = scratchCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    drawScratchCircle(lastX, lastY, 25);
    checkScratchProgress();
}

function handleTouchStart(e) {
    e.preventDefault();
    isScratching = true;
    const rect = scratchCanvas.getBoundingClientRect();
    lastX = e.touches[0].clientX - rect.left;
    lastY = e.touches[0].clientY - rect.top;
    drawScratchCircle(lastX, lastY, 30);
    checkScratchProgress();
}

function handleMouseMove(e) {
    if (!isScratching) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawScratchLine(x, y);
    lastX = x; lastY = y;
    checkScratchProgress();
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isScratching) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    drawScratchLine(x, y);
    lastX = x; lastY = y;
    checkScratchProgress();
}

function handleMouseUp() { isScratching = false; }
function handleTouchEnd() { isScratching = false; }

function drawScratchLine(x, y) {
    const ctx = scratchCanvas.getContext('2d');
    ctx.lineWidth = 35;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    drawScratchCircle(x, y, 15);
}

function drawScratchCircle(x, y, radius) {
    const ctx = scratchCanvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function checkScratchProgress() {
    scratchPercentage = calculateScratchedPercentage();
    if (scratchPercentage > 50) openEnvelope();
}

function calculateScratchedPercentage() {
    const ctx = scratchCanvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    const pixels = imageData.data;
    let transparent = 0, total = 0;
    for (let i = 3; i < pixels.length; i += 8) {
        total++;
        if (pixels[i] === 0) transparent++;
    }
    return (transparent / total) * 100;
}

function openEnvelope() {
    if (isScratchComplete) return;
    isScratchComplete = true;
    
    scratchCanvas.removeEventListener('mousedown', handleMouseDown);
    scratchCanvas.removeEventListener('touchstart', handleTouchStart);
    scratchCanvas.removeEventListener('mousemove', handleMouseMove);
    scratchCanvas.removeEventListener('touchmove', handleTouchMove);
    scratchCanvas.removeEventListener('mouseup', handleMouseUp);
    scratchCanvas.removeEventListener('touchend', handleTouchEnd);
    
    envelope.style.transform = 'scale(1.15)';
    envelope.style.transition = 'transform 0.6s ease';
    
    setTimeout(() => {
        letter.style.transform = 'translateY(0)';
        createConfetti();
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transform = 'scale(0.9)';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                progressLoading.style.opacity = '1';
                progressLoading.style.pointerEvents = 'all';
                startProgressLoading();
            }, 500);
        }, 1500);
    }, 300);
}

function skipToProgressLoading() {
    if (isScratchComplete) return;
    isScratchComplete = true;
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transform = 'scale(0.9)';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        progressLoading.style.opacity = '1';
        progressLoading.style.pointerEvents = 'all';
        startProgressLoading();
    }, 300);
}

function createScratchHearts() {
    const hearts = ['❤️', '💖', '💕', '💗', '💓', '💞', '💝'];
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.fontSize = Math.random() * 25 + 15 + 'px';
        heart.style.animationDelay = Math.random() * 10 + 's';
        heart.style.animationDuration = Math.random() * 20 + 15 + 's';
        document.body.appendChild(heart);
    }
}

function createConfetti() {
    const colors = ['#ff4d94', '#9c27b0', '#ff6b9d', '#ffd700', '#b76e79', '#6a11cb'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 12 + 6 + 'px';
        confetti.style.height = Math.random() * 12 + 6 + 'px';
        if (Math.random() > 0.7) confetti.style.borderRadius = '50%';
        else if (Math.random() > 0.5) confetti.style.transform = 'rotate(45deg)';
        document.body.appendChild(confetti);
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random()*720}deg) scale(${Math.random()*0.5+0.5})`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            delay: Math.random() * 500
        }).onfinish = () => confetti.remove();
    }
}

// ================== PROGRESS LOADING ==================
function startProgressLoading() {
    if (skipLoading) return;
    
    function updateProgress() {
        if (skipLoading) return;
        if (loadingProgress < 100) {
            let increment = 1;
            if (loadingProgress < 30) increment = 2;
            else if (loadingProgress < 70) increment = 1.5;
            else increment = 0.8;
            loadingProgress += increment;
            
            progressBar.style.width = loadingProgress + '%';
            percentage.textContent = Math.floor(loadingProgress) + '%';
            
            if (loadingProgress % 16 < 1.5) {
                const idx = Math.min(Math.floor(loadingProgress / 16), loadingMessages.length - 1);
                loadingText.textContent = loadingMessages[idx];
            }
            requestAnimationFrame(updateProgress);
        } else {
            isLoaded = true;
            percentage.textContent = "100%";
            loadingText.textContent = "Siap! Membuka website...";
            setTimeout(openWebsite, 1000);
        }
    }
    requestAnimationFrame(updateProgress);
    
    skipProgressButton.addEventListener('click', function() {
        skipProgressLoading();
    });
}

function skipProgressLoading() {
    skipLoading = true;
    loadingProgress = 100;
    progressBar.style.width = '100%';
    percentage.textContent = "100%";
    loadingText.textContent = "Melompati...";
    setTimeout(openWebsite, 300);
}

function openWebsite() {
    progressLoading.style.opacity = '0';
    progressLoading.style.transform = 'translateY(-30px)';
    setTimeout(() => {
        progressLoading.style.display = 'none';
        websiteContent.style.display = 'block';
        setTimeout(() => {
            websiteContent.style.opacity = '1';
            document.body.classList.add('website-content-loaded');
            initWebsiteEffects();
            createCelebrationEffect();
            initGame(); // Inisialisasi game memory match
        }, 50);
    }, 800);
}

// ================== WEBSITE EFFECTS ==================
function initWebsiteEffects() {
    initScrollEffects();
    preloadImages();
    initIntersectionObserver();
}

function initScrollEffects() {
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (window.scrollY / windowHeight) * 100;
                if (scrollProgress) scrollProgress.style.width = scrolled + '%';
                
                if (backToTop) {
                    const show = window.scrollY > 300;
                    if (show && !backToTop.classList.contains('visible')) {
                        backToTop.classList.add('visible');
                    } else if (!show && backToTop.classList.contains('visible')) {
                        backToTop.classList.remove('visible');
                    }
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1529254479751-fbacb4c7a587?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ];
    images.forEach(src => { new Image().src = src; });
}

function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.gallery-item, .wishlist-item, .relationship-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function createCelebrationEffect() {
    const colors = ['#ff4d94', '#9c27b0', '#ff6b9d', '#ffd700', '#b76e79'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 15 + 8 + 'px';
        confetti.style.height = Math.random() * 15 + 8 + 'px';
        if (Math.random() > 0.7) confetti.style.borderRadius = '50%';
        else if (Math.random() > 0.5) confetti.style.transform = 'rotate(45deg)';
        document.body.appendChild(confetti);
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random()*720}deg) scale(${Math.random()*0.5+0.5})`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            delay: Math.random() * 500
        }).onfinish = () => confetti.remove();
    }
    createFloatingHearts();
}

function createFloatingHearts() {
    const hearts = ['❤️', '💖', '💕', '💗', '💓', '💞', '💝'];
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.fontSize = Math.random() * 30 + 20 + 'px';
        heart.style.animationDelay = Math.random() * 15 + 's';
        heart.style.animationDuration = Math.random() * 30 + 25 + 's';
        document.body.appendChild(heart);
    }
}

// ================== GAME MEMORY MATCH ==================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initGame() {
    if (!gameGrid) return; // Jika elemen game tidak ada, jangan jalankan
    shuffledIcons = shuffleArray([...icons]);
    gameGrid.innerHTML = '';
    matchedPairs = 0;
    flippedCards = [];
    lockBoard = false;
    if (gameMessage) gameMessage.textContent = '';

    shuffledIcons.forEach((iconClass, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.icon = iconClass;
        card.innerHTML = `<i class="${iconClass}"></i>`;
        card.style.visibility = 'hidden'; // Sembunyikan ikon awal
        card.addEventListener('click', handleCardClick);
        gameGrid.appendChild(card);
    });
}

function handleCardClick(e) {
    const card = e.currentTarget;
    if (lockBoard) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flippedCards.length === 2) return;

    // Tampilkan ikon
    card.style.visibility = 'visible';
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        lockBoard = true;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const icon1 = card1.dataset.icon;
    const icon2 = card2.dataset.icon;

    if (icon1 === icon2) {
        // Cocok
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;

        if (matchedPairs === icons.length / 2) {
            if (gameMessage) gameMessage.textContent = '🎉 Selamat! Kamu menemukan semua cinta 💖';
            createConfetti(); // pakai fungsi confetti yang sudah ada
        }

        resetFlipped();
        lockBoard = false;
    } else {
        // Tidak cocok, tutup kembali setelah 0.5 detik
        setTimeout(() => {
            card1.style.visibility = 'hidden';
            card2.style.visibility = 'hidden';
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetFlipped();
            lockBoard = false;
        }, 500);
    }
}

function resetFlipped() {
    flippedCards = [];
}

if (resetGameBtn) {
    resetGameBtn.addEventListener('click', () => {
        initGame();
    });
}

// Handle resize
window.addEventListener('resize', () => {
    if (loadingScreen && loadingScreen.style.display !== 'none' && envelope && scratchCanvas) {
        setupScratchCanvas();
    }
});
