/**
 * ==========================================================
 *  💖 NIDHI & RAJVEER - INTERACTIVE LOVE WEBSITE ENGINE 💖
 *  iPhone Safari & Android Compliant Audio & Touch Engine
 * ==========================================================
 */

// Global State
const state = {
  soundEnabled: true,
  musicPlaying: false,
  audioUnlocked: false,
  gameScore: 0,
  gameGoal: LOVE_CONFIG.gameMaxClicks || 5,
  isCalculating: false,
  isMobile: window.innerWidth <= 768
};

window.addEventListener('resize', () => {
  state.isMobile = window.innerWidth <= 768;
});

/* ================= 1. WEB AUDIO API SYNTHESIZER & SOUND EFFECTS ================= */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isPlayingSynthMusic = false;
    this.synthTimer = null;
  }

  // Synchronous unlock for iOS Safari & Android WebKit
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.25;
        this.sfxGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.16;
        this.musicGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // Play 1-sample silent buffer to unlock iOS hardware audio pipeline
    if (this.ctx && !state.audioUnlocked) {
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
        state.audioUnlocked = true;
      } catch (e) {
        // Silently catch if not yet permitted
      }
    }
  }

  // Bubble pop SFX
  playPop() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // Sweet chime / sparkle SFX
  playChime() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now);
          osc.stop(now + 0.4);
        } catch (e) {}
      }, index * 65);
    });
  }

  // Celebratory victory chord SFX
  playVictory() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 987.77, 1046.50];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now);
          osc.stop(now + 0.75);
        } catch (e) {}
      }, idx * 55);
    });
  }

  // Dramatic low rumble SFX for Secret Button
  playDramatic() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 1.2);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch (e) {}
  }

  // Typewriter tick SFX
  playTypewriter() {
    if (!state.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(720 + Math.random() * 180, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  // Synthesizer Fallback: Gentle Romantic Music Box Melody
  startMusicBox() {
    this.init();
    this.isPlayingSynthMusic = true;

    const melody = [
      { f: 523.25, d: 450 }, // C5
      { f: 659.25, d: 450 }, // E5
      { f: 783.99, d: 450 }, // G5
      { f: 659.25, d: 450 }, // E5
      { f: 587.33, d: 450 }, // D5
      { f: 493.88, d: 450 }, // B4
      { f: 523.25, d: 900 }, // C5
      { f: 440.00, d: 450 }, // A4
      { f: 523.25, d: 450 }, // C5
      { f: 659.25, d: 450 }, // E5
      { f: 587.33, d: 450 }, // D5
      { f: 392.00, d: 900 }  // G4
    ];

    let noteIndex = 0;
    const playNextNote = () => {
      if (!this.isPlayingSynthMusic || !this.ctx) return;
      const note = melody[noteIndex % melody.length];
      const now = this.ctx.currentTime;

      try {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now);

        noteGain.gain.setValueAtTime(0.18, now);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + (note.d / 1000) * 1.5);

        osc.connect(noteGain);
        noteGain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + (note.d / 1000) * 1.6);
      } catch (e) {}

      noteIndex++;
      this.synthTimer = setTimeout(playNextNote, note.d);
    };

    playNextNote();
  }

  stopMusicBox() {
    this.isPlayingSynthMusic = false;
    clearTimeout(this.synthTimer);
  }
}

const sounds = new SoundEngine();

/* ================= 2. AUDIO & MUSIC MANAGER (IPHONE & ANDROID OPTIMIZED) ================= */
class MusicManager {
  constructor() {
    this.audioEl = document.getElementById('bgMusicPlayer');
    this.isPlaying = false;
    this.useSynth = false;
    this.initAudioElement();
  }

  initAudioElement() {
    if (this.audioEl) {
      if (LOVE_CONFIG.customMusicUrl) {
        this.audioEl.src = LOVE_CONFIG.customMusicUrl;
      }
      this.audioEl.loop = true;
      this.audioEl.volume = 0.55;

      // Handle track end in case loop attribute has browser quirks
      this.audioEl.addEventListener('ended', () => {
        if (this.isPlaying) {
          this.audioEl.currentTime = 0;
          this.audioEl.play().catch(() => {});
        }
      });

      // If audio file errors (e.g. 404 or unsupported on weird device), switch to synth
      this.audioEl.addEventListener('error', (e) => {
        console.warn("HTML5 audio encountered an error, activating synth fallback:", e);
        this.useSynth = true;
        if (this.isPlaying) {
          sounds.startMusicBox();
        }
      });
    }
  }

  // Called SYNCHRONOUSLY inside user touch/click handlers
  startMusic(fromUserGesture = true) {
    sounds.init();

    if (this.isPlaying) return;

    if (this.audioEl && !this.useSynth) {
      this.audioEl.muted = false;
      const playPromise = this.audioEl.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          state.musicPlaying = true;
          this.updateUI();
        }).catch((err) => {
          console.warn("HTML5 Audio playback was restricted by browser policy:", err);
          // If HTML5 audio was blocked or failed, fall back directly to synthesized music box
          if (fromUserGesture) {
            this.useSynth = true;
            sounds.startMusicBox();
            this.isPlaying = true;
            state.musicPlaying = true;
            this.updateUI();
          }
        });
      }
    } else {
      sounds.startMusicBox();
      this.isPlaying = true;
      state.musicPlaying = true;
      this.updateUI();
    }
  }

  pauseMusic() {
    if (this.audioEl && !this.useSynth) {
      this.audioEl.pause();
    }
    sounds.stopMusicBox();
    this.isPlaying = false;
    state.musicPlaying = false;
    this.updateUI();
  }

  toggle() {
    sounds.init();
    if (this.isPlaying) {
      this.pauseMusic();
      sounds.playPop();
    } else {
      this.startMusic(true);
    }
  }

  updateUI() {
    const musicBtn = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const statusText = document.getElementById('musicStatusText');
    const eq = document.getElementById('musicEqualizer');
    const heroPill = document.getElementById('heroMusicPrompt');
    const heroPillText = document.getElementById('heroMusicPromptText');

    if (this.isPlaying) {
      if (musicBtn) {
        musicBtn.classList.add('playing');
        musicBtn.classList.remove('pulse-music-btn');
        musicBtn.setAttribute('title', 'Mute Romantic Music');
      }
      if (musicIcon) musicIcon.textContent = '🎶';
      if (statusText) statusText.textContent = 'Mute';
      if (eq) eq.classList.remove('hidden');

      if (heroPill) {
        heroPill.classList.add('playing');
      }
      if (heroPillText) {
        heroPillText.textContent = 'Playing Our Song ❤️ (Tap to Mute)';
      }
    } else {
      if (musicBtn) {
        musicBtn.classList.remove('playing');
        musicBtn.classList.add('pulse-music-btn');
        musicBtn.setAttribute('title', 'Play Romantic Music');
      }
      if (musicIcon) musicIcon.textContent = '🎵';
      if (statusText) statusText.textContent = 'Play Music';
      if (eq) eq.classList.add('hidden');

      if (heroPill) {
        heroPill.classList.remove('playing');
      }
      if (heroPillText) {
        heroPillText.textContent = 'Play Romantic Music';
      }
    }
  }
}

let musicManager = null;

/* ================= 3. AMBIENT FLOATING PARTICLES CANVAS ================= */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const symbols = ['❤️', '💖', '✨', '🌸', '🐾', '💕', '🧸', '💌'];
  const particles = [];
  const particleCount = state.isMobile ? 12 : 24;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 14 + 14,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      speedY: Math.random() * 0.7 + 0.3,
      speedX: Math.sin(Math.random() * Math.PI) * 0.4,
      opacity: Math.random() * 0.55 + 0.25,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += Math.sin(p.angle) * 0.5;
      p.angle += p.rotationSpeed;

      if (p.y < -35) {
        p.y = height + 35;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.symbol, p.x, p.y);
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ================= 4. NIGHT SKY CANVAS (TWINKLING STARS) ================= */
function initNightSkyCanvas() {
  const canvas = document.getElementById('night-sky-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    if (canvas.parentElement) {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }
  });

  const stars = [];
  const starCount = state.isMobile ? 45 : 95;
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.5,
      alpha: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.006
    });
  }

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(s => {
      s.alpha += s.twinkleSpeed;
      const opacity = (Math.sin(s.alpha) + 1) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.85 + 0.15})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#fff';
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(renderStars);
  }

  renderStars();
}

/* ================= 5. CLICK / TOUCH PARTICLE BURSTS ================= */
function spawnHeartBurst(x, y, count = 10) {
  const actualCount = state.isMobile ? Math.min(count, 8) : count;
  const symbols = ['❤️', '💖', '💕', '✨', '🌸', '🥹'];
  
  const safeX = typeof x === 'number' ? x : window.innerWidth / 2;
  const safeY = typeof y === 'number' ? y : window.innerHeight / 2;

  for (let i = 0; i < actualCount; i++) {
    const el = document.createElement('div');
    el.className = 'floating-heart-item';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = `${safeX}px`;
    el.style.top = `${safeY}px`;
    el.style.fontSize = `${Math.random() * 14 + 14}px`;

    const randomAngle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 70 + 25;
    const destX = Math.cos(randomAngle) * distance;
    const destY = Math.sin(randomAngle) * distance;
    const duration = Math.random() * 0.7 + 0.7;

    el.style.transition = `all ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1)`;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), duration * 1000);
  }
}

function getEventCoords(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else if (e.changedTouches && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  } else if (typeof e.clientX === 'number') {
    return { x: e.clientX, y: e.clientY };
  }
  const rect = e.target ? e.target.getBoundingClientRect() : null;
  if (rect) {
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

/* ================= 6. OPENING SEQUENCE & ENVELOPE ================= */
function initOpeningFlow() {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingBarFill = document.getElementById('loadingBarFill');
  const envelopeScreen = document.getElementById('envelopeScreen');
  const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');
  const envelopeObj = document.getElementById('envelopeObj');
  const mainSite = document.getElementById('mainSite');

  document.getElementById('loadingTitleText').textContent = LOVE_CONFIG.loadingTitle;
  document.getElementById('loadingAuthorText').textContent = LOVE_CONFIG.loadingAuthor;
  document.getElementById('envelopePromptText').textContent = LOVE_CONFIG.envelopePrompt;
  openEnvelopeBtn.textContent = LOVE_CONFIG.envelopeButton;
  document.getElementById('heroGreetingText').textContent = LOVE_CONFIG.heroGreeting;

  // Fake Loading Fill
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 18) + 10;
    if (progress > 100) progress = 100;
    loadingBarFill.style.width = `${progress}%`;

    if (progress === 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        envelopeScreen.classList.remove('hidden');
        sounds.playChime();
      }, 400);
    }
  }, 100);

  let envelopeOpened = false;
  const handleOpenEnvelope = (e) => {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // SYNCHRONOUS: Start music and unlock audio immediately inside the user tap event!
    sounds.init();
    sounds.playVictory();
    if (musicManager) {
      musicManager.startMusic(true);
    }

    envelopeObj.classList.add('opened');
    openEnvelopeBtn.style.pointerEvents = 'none';

    if (typeof confetti === 'function') {
      confetti({
        particleCount: state.isMobile ? 50 : 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6584', '#ffccd5', '#ffd166', '#ffffff']
      });
    }

    setTimeout(() => {
      envelopeScreen.classList.add('hidden');
      mainSite.classList.remove('site-hidden');
      window.scrollTo(0, 0);
      startHeroTypewriter();
    }, 1100);
  };

  openEnvelopeBtn.addEventListener('click', handleOpenEnvelope);
  envelopeObj.addEventListener('click', handleOpenEnvelope);
}

/* ================= 7. HERO SECTION TYPEWRITER ================= */
function startHeroTypewriter() {
  const target = document.getElementById('heroTypedText');
  const text = LOVE_CONFIG.heroSubtitle;
  let index = 0;
  target.textContent = '';

  function typeChar() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      if (index % 3 === 0) sounds.playTypewriter();
      index++;
      setTimeout(typeChar, 38);
    }
  }

  typeChar();

  document.getElementById('enterWorldBtn').addEventListener('click', () => {
    sounds.playPop();
    document.getElementById('stickerWall').scrollIntoView({ behavior: 'smooth' });
  });

  const heroCat = document.getElementById('heroCatImg');
  const bubble = document.getElementById('heroSpeechBubble');
  const heroLines = [
    '"is for me? 👉👈🥺"',
    '"Rajveer loves Nidhi SO MUCH ❤️"',
    '"STOP YOU\'RE MAKING ME BLUSH 😭"',
    '"certified cutest girl alive ✨"',
    '"100% yours forever 🐾"'
  ];
  let catIndex = 0;

  heroCat.addEventListener('click', (e) => {
    sounds.playPop();
    catIndex = (catIndex + 1) % heroLines.length;
    bubble.textContent = heroLines[catIndex];
    const coords = getEventCoords(e);
    spawnHeartBurst(coords.x, coords.y, 8);
  });
}

/* ================= 8. STICKER CHAOS / REACTION WALL ================= */
function initStickerWall() {
  const cards = document.querySelectorAll('.sticker-card');
  const toast = document.getElementById('reactionToast');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      sounds.playPop();
      const coords = getEventCoords(e);
      spawnHeartBurst(coords.x, coords.y, 8);

      const customReaction = card.dataset.reaction;
      const randomCaption = LOVE_CONFIG.stickerCaptions[
        Math.floor(Math.random() * LOVE_CONFIG.stickerCaptions.length)
      ];
      const message = customReaction || randomCaption;

      toastText.textContent = message;
      toast.classList.add('show');

      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2200);

      card.style.transform = 'scale(0.93) rotate(-3deg)';
      setTimeout(() => {
        card.style.transform = '';
      }, 180);
    });
  });
}

/* ================= 9. REASONS I LOVE YOU SECTION ================= */
function renderReasons() {
  const grid = document.getElementById('reasonsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  LOVE_CONFIG.reasons.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.innerHTML = `
      <span class="reason-tag">${r.tag}</span>
      <div class="reason-img-box">
        <img src="${r.img}" alt="${r.title}" loading="lazy" onerror="this.src='assets/shy_cat.jpg'">
      </div>
      <h3 class="reason-title">${r.title}</h3>
      <p class="reason-desc">${r.desc}</p>
      <div class="reason-expand-hint">Tap for extra love 💖</div>
    `;

    card.addEventListener('click', (e) => {
      sounds.playChime();
      const coords = getEventCoords(e);
      spawnHeartBurst(coords.x, coords.y, 10);
      card.style.transform = 'scale(1.05)';
      setTimeout(() => {
        card.style.transform = '';
      }, 250);
    });

    grid.appendChild(card);
  });
}

/* ================= 10. FUNNY LOVE CALCULATOR ================= */
function initLoveCalculator() {
  const btn = document.getElementById('startCalcBtn');
  const status = document.getElementById('calcStatus');
  const meterFill = document.getElementById('meterFill');
  const percentText = document.getElementById('calcPercent');
  const resultBox = document.getElementById('calcResultBox');

  btn.addEventListener('click', () => {
    if (state.isCalculating) return;
    state.isCalculating = true;
    btn.disabled = true;
    btn.style.opacity = '0.6';
    resultBox.classList.add('hidden');

    let current = 0;
    const stages = [
      { max: 25, text: "Scanning heart rate for Nidhi... 💓" },
      { max: 55, text: "Measuring dopamine spikes... 📈" },
      { max: 75, text: "Still calculating... system warm... ⚠️" },
      { max: 95, text: "SYSTEM OVERHEATING!! TOO MUCH LOVE!! 🔥" },
      { max: 100, text: "ERROR: CAPACITY EXCEEDED!! ❤️💥" }
    ];

    let stageIdx = 0;

    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 5) + 2;
      if (current > 100) current = 100;

      meterFill.style.width = `${current}%`;
      percentText.textContent = `${current}%`;
      sounds.playTypewriter();

      if (stageIdx < stages.length && current >= stages[stageIdx].max) {
        status.textContent = stages[stageIdx].text;
        stageIdx++;
      }

      if (current >= 100) {
        clearInterval(interval);
        sounds.playVictory();
        
        setTimeout(() => {
          resultBox.classList.remove('hidden');
          status.textContent = "CRITICAL SUCCESS 💖";
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.textContent = "Recalculate (Still Infinity!) ♾️";
          state.isCalculating = false;

          if (typeof confetti === 'function') {
            confetti({
              particleCount: state.isMobile ? 70 : 120,
              spread: 100,
              origin: { y: 0.6 }
            });
          }
        }, 500);
      }
    }, 50);
  });
}

/* ================= 11. CUTE LOVE LETTER UNFOLDING ================= */
function initLoveLetter() {
  const waxSeal = document.getElementById('waxSealBtn');
  const card = document.getElementById('parchmentCard');
  const typedContainer = document.getElementById('letterBodyTyped');
  let letterOpened = false;

  document.getElementById('letterGreeting').textContent = LOVE_CONFIG.letterGreeting;
  document.getElementById('letterClosing').textContent = LOVE_CONFIG.letterClosing;
  document.getElementById('letterSign').textContent = LOVE_CONFIG.letterSign;

  const openLetter = (e) => {
    if (letterOpened) return;
    letterOpened = true;
    sounds.playVictory();
    card.classList.remove('folded');
    const coords = getEventCoords(e);
    spawnHeartBurst(coords.x, coords.y, 12);

    const fullText = LOVE_CONFIG.letterBody;
    let charIdx = 0;
    typedContainer.textContent = '';

    function typeLetterChar() {
      if (charIdx < fullText.length) {
        typedContainer.textContent += fullText.charAt(charIdx);
        if (charIdx % 4 === 0) sounds.playTypewriter();
        charIdx++;
        setTimeout(typeLetterChar, 28);
      }
    }

    setTimeout(typeLetterChar, 350);
  };

  waxSeal.addEventListener('click', openLetter);
  card.addEventListener('click', (e) => {
    if (card.classList.contains('folded')) openLetter(e);
  });

  document.querySelectorAll('.parchment-sticker').forEach(st => {
    st.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playPop();
      const coords = getEventCoords(e);
      spawnHeartBurst(coords.x, coords.y, 6);
    });
  });
}

/* ================= 12. MINI GAME: CATCH MY HEART 💘 ================= */
function initCatchHeartGame() {
  const arena = document.getElementById('gameArena');
  const target = document.getElementById('heartTarget');
  const scoreDisplay = document.getElementById('gameScore');
  const goalDisplay = document.getElementById('gameGoal');
  const statusDisplay = document.getElementById('gameStatus');
  const victoryBox = document.getElementById('gameVictory');
  const playAgainBtn = document.getElementById('playAgainBtn');

  goalDisplay.textContent = state.gameGoal;

  const banter = [
    "Too fast for you! 🏃‍♂️💨",
    "Hey! Almost got me! 💨",
    "Nice reflexes! Try again! 👀",
    "One more tap! Don't let it escape! 💖",
    "CAUGHT IT! 🎉"
  ];

  function moveTarget() {
    const targetW = target.offsetWidth || 64;
    const targetH = target.offsetHeight || 64;
    const arenaW = arena.clientWidth;
    const arenaH = arena.clientHeight;

    const maxX = Math.max(10, arenaW - targetW - 16);
    const maxY = Math.max(50, arenaH - targetH - 20);

    const newX = Math.max(12, Math.floor(Math.random() * maxX));
    const newY = Math.max(50, Math.floor(Math.random() * maxY));

    target.style.left = `${newX}px`;
    target.style.top = `${newY}px`;
  }

  moveTarget();

  const handleTargetHit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sounds.playPop();
    state.gameScore++;
    scoreDisplay.textContent = state.gameScore;
    const coords = getEventCoords(e);
    spawnHeartBurst(coords.x, coords.y, 8);

    if (state.gameScore < state.gameGoal) {
      statusDisplay.textContent = banter[state.gameScore - 1] || "Caught! Next one!";
      moveTarget();
    } else {
      sounds.playVictory();
      target.style.display = 'none';
      victoryBox.classList.remove('hidden');

      if (typeof confetti === 'function') {
        confetti({
          particleCount: state.isMobile ? 60 : 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  target.addEventListener('pointerdown', handleTargetHit);

  target.addEventListener('mouseenter', () => {
    if (!state.isMobile && Math.random() > 0.45 && state.gameScore < state.gameGoal) {
      moveTarget();
    }
  });

  playAgainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sounds.playPop();
    state.gameScore = 0;
    scoreDisplay.textContent = '0';
    statusDisplay.textContent = "Tap the heart! 👀";
    victoryBox.classList.add('hidden');
    target.style.display = 'flex';
    moveTarget();
  });
}

/* ================= 13. MEME / INSIDE-JOKE SECTION ================= */
function renderMemes() {
  const grid = document.getElementById('memeGrid');
  if (!grid) return;
  grid.innerHTML = '';

  LOVE_CONFIG.memes.forEach(m => {
    const card = document.createElement('div');
    card.className = 'meme-card';
    card.innerHTML = `
      <span class="meme-badge">${m.badge}</span>
      <div class="meme-img-box">
        <img src="${m.img}" alt="${m.title}" loading="lazy" onerror="this.src='assets/shy_cat.jpg'">
      </div>
      <h3 class="meme-title">${m.title}</h3>
      <p class="meme-caption">${m.caption}</p>
    `;

    card.addEventListener('click', (e) => {
      sounds.playPop();
      const coords = getEventCoords(e);
      spawnHeartBurst(coords.x, coords.y, 8);
      card.style.transform = 'scale(0.96)';
      setTimeout(() => {
        card.style.transform = '';
      }, 160);
    });

    grid.appendChild(card);
  });
}

/* ================= 14. SECRET BUTTON DRAMATIC SEQUENCE ================= */
function initSecretButton() {
  const secretBtn = document.getElementById('secretBtn');
  const overlay = document.getElementById('secretOverlay');
  const stage1 = document.getElementById('secretStage1');
  const stage2 = document.getElementById('secretStage2');
  const stage3 = document.getElementById('secretStage3');
  const closeBtn = document.getElementById('closeSecretBtn');

  secretBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    sounds.playDramatic();

    stage1.classList.remove('hidden');
    stage2.classList.add('hidden');
    stage3.classList.add('hidden');

    setTimeout(() => {
      sounds.playChime();
      stage1.classList.add('hidden');
      stage2.classList.remove('hidden');
    }, 2000);

    setTimeout(() => {
      sounds.playVictory();
      stage2.classList.add('hidden');
      stage3.classList.remove('hidden');

      if (typeof confetti === 'function') {
        confetti({
          particleCount: state.isMobile ? 80 : 140,
          spread: 110,
          origin: { y: 0.5 },
          colors: ['#ff3366', '#ff6584', '#ffd166', '#ffffff']
        });
      }
    }, 4000);
  });

  closeBtn.addEventListener('click', () => {
    sounds.playChime();
    overlay.classList.add('hidden');
  });
}

/* ================= 15. FINAL NIGHT SKY & HUG SENDER ================= */
function initNightSky() {
  initNightSkyCanvas();

  const nightLines = document.querySelectorAll('.night-line, .night-final-signature');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  nightLines.forEach(line => observer.observe(line));

  const hugBtn = document.getElementById('sendHugBtn');
  const toast = document.getElementById('reactionToast');
  const toastText = document.getElementById('toastText');

  hugBtn.addEventListener('click', (e) => {
    sounds.playVictory();
    const coords = getEventCoords(e);
    spawnHeartBurst(coords.x, coords.y, 20);

    const swarmCount = state.isMobile ? 10 : 18;
    for (let i = 0; i < swarmCount; i++) {
      setTimeout(() => {
        spawnHeartBurst(
          Math.random() * window.innerWidth,
          Math.random() * (window.innerHeight / 2) + window.innerHeight / 4,
          5
        );
      }, i * 65);
    }

    toastText.textContent = "Hug delivered straight to Rajveer's heart! 💌✈️🫂";
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  });

  document.getElementById('backToTopBtn').addEventListener('click', () => {
    sounds.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================= 15.5 SPECIAL VIDEO SECTION ================= */
function initVideoSection() {
  const video = document.getElementById('specialVideo');
  const section = document.getElementById('videoSection');
  const soundToggle = document.getElementById('videoSoundToggle');
  const soundIcon = document.getElementById('videoSoundIcon');
  const soundText = document.getElementById('videoSoundText');
  const playBtn = document.getElementById('videoPlayBtn');
  const playBtnIcon = document.getElementById('videoPlayBtnIcon');
  const playBtnText = document.getElementById('videoPlayBtnText');
  const restartBtn = document.getElementById('videoRestartBtn');
  const restartBtnText = document.getElementById('videoRestartBtnText');
  const playOverlayBtn = document.getElementById('videoPlayOverlayBtn');
  const endedOverlay = document.getElementById('videoEndedOverlay');
  const overlayReplayBtn = document.getElementById('overlayReplayBtn');
  const wrapper = document.getElementById('videoWrapper');
  const progressWrap = document.getElementById('videoProgressWrap');
  const progressFill = document.getElementById('videoProgressFill');
  const captionEl = document.getElementById('videoCaptionText');

  if (!video || !section) return;

  // Set configurable texts from LOVE_CONFIG
  const tagEl = document.getElementById('videoSectionTag');
  const titleEl = document.getElementById('videoSectionTitle');
  const subtitleEl = document.getElementById('videoSectionSubtitle');
  if (tagEl && LOVE_CONFIG.videoTag) tagEl.textContent = LOVE_CONFIG.videoTag;
  if (titleEl && LOVE_CONFIG.videoTitle) titleEl.textContent = LOVE_CONFIG.videoTitle;
  if (subtitleEl && LOVE_CONFIG.videoSubtitle) subtitleEl.textContent = LOVE_CONFIG.videoSubtitle;
  if (captionEl && LOVE_CONFIG.videoCaption) captionEl.textContent = LOVE_CONFIG.videoCaption;
  if (restartBtnText && LOVE_CONFIG.videoReplayBtnText) restartBtnText.textContent = LOVE_CONFIG.videoReplayBtnText;

  let userManuallyPaused = false;
  let bgMusicPausedByVideo = false;

  const updatePlayUI = (isPlaying) => {
    if (isPlaying) {
      if (playOverlayBtn) playOverlayBtn.classList.remove('show-play-btn');
      if (endedOverlay) endedOverlay.classList.add('hidden');
      if (playBtnIcon) playBtnIcon.textContent = '⏸️';
      if (playBtnText) playBtnText.textContent = 'Pause';
    } else {
      if (playOverlayBtn && (!endedOverlay || endedOverlay.classList.contains('hidden'))) {
        playOverlayBtn.classList.add('show-play-btn');
      }
      if (playBtnIcon) playBtnIcon.textContent = '▶️';
      if (playBtnText) playBtnText.textContent = 'Play';
    }
  };

  const updateSoundUI = (isMuted) => {
    if (isMuted) {
      if (soundIcon) soundIcon.textContent = '🔇';
      if (soundText) soundText.textContent = '🔇 Tap for Sound';
      if (soundToggle) {
        soundToggle.classList.add('pulse-btn');
        soundToggle.classList.remove('unmuted');
        soundToggle.setAttribute('title', 'Unmute Video');
      }
    } else {
      if (soundIcon) soundIcon.textContent = '🔊';
      if (soundText) soundText.textContent = '🔊 Sound On';
      if (soundToggle) {
        soundToggle.classList.remove('pulse-btn');
        soundToggle.classList.add('unmuted');
        soundToggle.setAttribute('title', 'Mute Video');
      }
    }
  };

  // Replay action helper
  const replayVideo = (e) => {
    if (e) {
      e.stopPropagation();
      const coords = getEventCoords(e);
      spawnHeartBurst(coords.x, coords.y, 10);
    }
    sounds.init();
    sounds.playVictory();
    if (endedOverlay) endedOverlay.classList.add('hidden');
    video.currentTime = 0;
    userManuallyPaused = false;
    video.play().then(() => {
      updatePlayUI(true);
    }).catch(() => {});
  };

  // Intersection Observer for smooth entrance animation and autoplay
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        section.classList.add('in-view');
        // Autoplay muted on viewport enter if not manually paused by user and not ended
        if (video.paused && !userManuallyPaused && (!endedOverlay || endedOverlay.classList.contains('hidden'))) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              updatePlayUI(true);
            }).catch(() => {
              updatePlayUI(false);
            });
          }
        }
      }
    });
  }, { threshold: 0.25 });

  videoObserver.observe(section);

  // Video event listeners
  video.addEventListener('play', () => {
    updatePlayUI(true);
  });

  video.addEventListener('pause', () => {
    updatePlayUI(false);
  });

  video.addEventListener('timeupdate', () => {
    if (video.duration && progressFill) {
      const pct = (video.currentTime / video.duration) * 100;
      progressFill.style.width = `${pct}%`;
    }
  });

  // When video ends, do not auto-restart; show Replay Memory overlay and trigger subtle particles
  video.addEventListener('ended', () => {
    updatePlayUI(false);
    if (playOverlayBtn) playOverlayBtn.classList.remove('show-play-btn');
    if (endedOverlay) endedOverlay.classList.remove('hidden');

    // Spawn a gentle, romantic heart/sparkle burst around the video card
    const rect = wrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    spawnHeartBurst(centerX, centerY, 12);
    sounds.playChime();

    // If bg music was paused by video sound, resume it
    if (bgMusicPausedByVideo && musicManager && !musicManager.isPlaying) {
      musicManager.startMusic(false);
      bgMusicPausedByVideo = false;
    }
  });

  // Sound Toggle Handler
  if (soundToggle) {
    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.init();

      if (video.muted) {
        video.muted = false;
        video.volume = 1.0;
        updateSoundUI(false);
        sounds.playChime();
        const coords = getEventCoords(e);
        spawnHeartBurst(coords.x, coords.y, 8);

        // If background music is playing, pause it so video audio is clear
        if (musicManager && musicManager.isPlaying) {
          musicManager.pauseMusic();
          bgMusicPausedByVideo = true;
        }

        // If video was paused, start playing
        if (video.paused) {
          userManuallyPaused = false;
          video.play().catch(() => {});
        }
      } else {
        video.muted = true;
        updateSoundUI(true);
        sounds.playPop();

        // Resume bg music if it was playing before
        if (bgMusicPausedByVideo && musicManager && !musicManager.isPlaying) {
          musicManager.startMusic(false);
          bgMusicPausedByVideo = false;
        }
      }
    });
  }

  // Play/Pause on Video wrapper tap
  const togglePlayPause = (e) => {
    // If ended overlay is visible, replay instead
    if (endedOverlay && !endedOverlay.classList.contains('hidden')) {
      replayVideo(e);
      return;
    }

    sounds.init();
    if (video.paused) {
      userManuallyPaused = false;
      video.play().then(() => {
        updatePlayUI(true);
        sounds.playPop();
      }).catch(() => {});
    } else {
      userManuallyPaused = true;
      video.pause();
      updatePlayUI(false);
      sounds.playPop();
    }
  };

  if (wrapper) {
    wrapper.addEventListener('click', (e) => {
      // Don't trigger if click was on sound button, overlay button, or progress bar
      if (e.target.closest('#videoProgressWrap') || e.target.closest('#overlayReplayBtn')) return;
      togglePlayPause(e);
    });
  }

  if (playOverlayBtn) {
    playOverlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlayPause(e);
    });
  }

  if (overlayReplayBtn) {
    overlayReplayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      replayVideo(e);
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlayPause(e);
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      replayVideo(e);
    });
  }

  if (progressWrap) {
    progressWrap.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!video.duration) return;
      const rect = progressWrap.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      video.currentTime = ratio * video.duration;
      sounds.playPop();
    });
  }

  // Initial state check
  updateSoundUI(video.muted);
  updatePlayUI(!video.paused);
}

/* ================= 16. AUDIO CONTROLS & LISTENERS ================= */
function initSoundControls() {
  musicManager = new MusicManager();

  const musicBtn = document.getElementById('musicToggle');
  const sfxBtn = document.getElementById('sfxToggle');
  const heroMusicPrompt = document.getElementById('heroMusicPrompt');

  // Top Dock Music Button
  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      musicManager.toggle();
    });
  }

  // Hero Section Romantic Music Pill
  if (heroMusicPrompt) {
    heroMusicPrompt.addEventListener('click', (e) => {
      e.stopPropagation();
      musicManager.toggle();
    });
  }

  // Sound Effects Toggle
  if (sfxBtn) {
    sfxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.init();
      state.soundEnabled = !state.soundEnabled;
      const btnText = sfxBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = state.soundEnabled ? 'SFX: ON' : 'SFX: OFF';
      sfxBtn.querySelector('.icon').textContent = state.soundEnabled ? '🔊' : '🔇';
      if (state.soundEnabled) sounds.playPop();
    });
  }

  // Global touch listener to unlock audio on very first user tap anywhere
  const unlockAudioOnFirstTouch = () => {
    sounds.init();
    window.removeEventListener('touchstart', unlockAudioOnFirstTouch);
    window.removeEventListener('click', unlockAudioOnFirstTouch);
  };
  window.addEventListener('touchstart', unlockAudioOnFirstTouch, { passive: true });
  window.addEventListener('click', unlockAudioOnFirstTouch, { passive: true });
}

/* ================= INITIALIZATION ================= */
window.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initSoundControls();
  renderReasons();
  renderMemes();
  initOpeningFlow();
  initStickerWall();
  initLoveCalculator();
  initLoveLetter();
  initVideoSection();
  initCatchHeartGame();
  initSecretButton();
  initNightSky();
});
