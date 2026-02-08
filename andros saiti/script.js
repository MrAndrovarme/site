// Audio & Video Controls
const bgVideo = document.getElementById('bgVideo');
const bgAudio = document.getElementById('bgAudio');
const audioToggle = document.getElementById('audioToggle');
const playPause = document.getElementById('playPause');
const themeSwitch = document.getElementById('themeSwitch');

// Sound Effects
const hoverSounds = {};
const clickSounds = {};

// Initialize audio
function initAudio() {
    // Create audio context for sound effects
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Create hover sound effects
    ['hover1', 'hover2', 'hover3', 'hover4', 'hover5', 'hover6'].forEach((id, i) => {
        hoverSounds[id] = () => playBeep(800 + i * 100, 0.1, 0.1);
    });
    
    // Create click sound effects
    ['click1', 'click2', 'click3'].forEach((id, i) => {
        clickSounds[id] = () => playBeep(500 + i * 200, 0.2, 0.3);
    });
    
    // Try to extract audio from video (fallback to separate audio file)
    try {
        // If video has audio track, use it
        bgAudio.src = bgVideo.src.replace('.mp4', '.mp3') || bgVideo.src;
    } catch (e) {
        console.log("Using separate audio file");
    }
    
    // Start with muted audio
    bgAudio.muted = true;
    bgAudio.volume = 1;
    updateAudioButton();
}

// Play a beep sound
function playBeep(frequency, duration, volume = 0.5) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + duration);
    } catch (e) {
        console.log("Audio context not supported");
    }
}

// Toggle audio mute/unmute
function toggleAudio() {
    bgAudio.muted = !bgAudio.muted;
    updateAudioButton();
    
    // Play a confirmation sound
    if (!bgAudio.muted) {
        playBeep(1200, 0.1);
    }
}

// Toggle play/pause
function togglePlayPause() {
    if (bgAudio.paused) {
        bgAudio.play();
        playPause.innerHTML = '<i class="fas fa-pause"></i><span>PAUSE</span>';
    } else {
        bgAudio.pause();
        playPause.innerHTML = '<i class="fas fa-play"></i><span>PLAY</span>';
    }
}

// Update audio button text/icon
function updateAudioButton() {
    if (bgAudio.muted) {
        audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i><span>SOUND OFF</span>';
    } else {
        audioToggle.innerHTML = '<i class="fas fa-volume-up"></i><span>SOUND ON</span>';
    }
}

// Toggle dark/light theme
function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.style.getPropertyValue('--dark') || '';
    
    if (!isDark || isDark === '#0a0a0f') {
        // Switch to light theme
        root.style.setProperty('--dark', '#f0f0ff');
        root.style.setProperty('--darker', '#e0e0f0');
        root.style.setProperty('--light', '#0a0a0f');
        root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)');
        root.style.setProperty('--glass', 'rgba(0, 0, 0, 0.05)');
        themeSwitch.innerHTML = '<i class="fas fa-sun"></i><span>LIGHT MODE</span>';
    } else {
        // Switch to dark theme
        root.style.setProperty('--dark', '#0a0a0f');
        root.style.setProperty('--darker', '#050508');
        root.style.setProperty('--light', '#f0f0ff');
        root.style.setProperty('--card-bg', 'rgba(20, 20, 30, 0.85)');
        root.style.setProperty('--glass', 'rgba(255, 255, 255, 0.05)');
        themeSwitch.innerHTML = '<i class="fas fa-moon"></i><span>DARK MODE</span>';
    }
}

// Particle Effects
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle system
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = Math.random() > 0.5 ? 'rgba(255, 51, 102, 0.5)' : 'rgba(0, 212, 255, 0.5)';
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Visitor counter
function initVisitorCounter() {
    let count = localStorage.getItem('visitorCount');
    if (!count) {
        count = Math.floor(Math.random() * 1000) + 100;
        localStorage.setItem('visitorCount', count);
    }
    
    // Increment on each visit
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    
    document.getElementById('visitorCount').textContent = count.toLocaleString();
    
    // Update follower count with random increase
    const followers = document.getElementById('followers');
    const views = document.getElementById('views');
    
    let followerCount = parseFloat(followers.textContent.replace('K', '')) * 1000;
    let viewCount = parseFloat(views.textContent.replace('K', '')) * 1000;
    
    // Random small increment
    followerCount += Math.floor(Math.random() * 10);
    viewCount += Math.floor(Math.random() * 50);
    
    followers.textContent = (followerCount / 1000).toFixed(1) + 'K';
    views.textContent = (viewCount / 1000).toFixed(1) + 'K';
}

// Add hover sound effects to elements
function addHoverSounds() {
    const hoverElements = document.querySelectorAll('[data-sound]');
    
    hoverElements.forEach(element => {
        const soundId = element.getAttribute('data-sound');
        
        element.addEventListener('mouseenter', () => {
            if (hoverSounds[soundId]) {
                hoverSounds[soundId]();
            }
        });
        
        if (soundId.startsWith('click')) {
            element.addEventListener('click', (e) => {
                if (clickSounds[soundId]) {
                    clickSounds[soundId]();
                }
                
                // Add click animation
                element.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    element.style.transform = '';
                }, 150);
            });
        }
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    initParticles();
    initVisitorCounter();
    addHoverSounds();
    
    // Event listeners
    audioToggle.addEventListener('click', toggleAudio);
    playPause.addEventListener('click', togglePlayPause);
    themeSwitch.addEventListener('click', toggleTheme);
    
    // Auto-play audio after user interaction (browser requirement)
    document.body.addEventListener('click', () => {
        if (bgAudio.paused && !bgAudio.muted) {
            bgAudio.play().catch(e => console.log("Auto-play prevented"));
        }
    }, { once: true });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // M key toggles audio
        if (e.key === 'm' || e.key === 'M') {
            toggleAudio();
        }
        // Space toggles play/pause
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        }
        // T toggles theme
        if (e.key === 't' || e.key === 'T') {
            toggleTheme();
        }
    });
    
    console.log('Andro Klasnia');
    console.log('Shortcuts: M = Mute, Space = Play/Pause, T = Theme');
});