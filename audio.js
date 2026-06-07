/* ======================================
   SISTEMA DE ÁUDIO DO PIP-BOY
   - Sons de Hover & Click via Web Audio API
     (Baseado nos arquivos originais do Fallout:
      ui_pipboy_scroll.wav e ui_pipboy_select.wav
      extraídos do Fallout - Sound.bsa)
   - Rádio de fundo via YouTube IFrame API
====================================== */

(function () {
  'use strict';

  /* ======================================
     WEB AUDIO API — SONS DO PIP-BOY
  ====================================== */
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Retoma o contexto se suspenso (política de autoplay)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // ── Som de SCROLL / HOVER do Pip-Boy ──
  const hoverAudio = new Audio('assets/dial_move.ogg');
  hoverAudio.volume = 0.4;
  function playHoverSound() {
    try {
      hoverAudio.currentTime = 0;
      hoverAudio.play().catch(e => { /* silencioso */ });
    } catch (e) { /* silencioso */ }
  }

  // ── Som de SELECT / CLICK do Pip-Boy ──
  const clickAudio = new Audio('assets/module_change.ogg');
  clickAudio.volume = 0.6;
  function playClickSound() {
    try {
      clickAudio.currentTime = 0;
      clickAudio.play().catch(e => { /* silencioso */ });
    } catch (e) { /* silencioso */ }
  }

  // ── Som de TRANSMISSÃO (estática de rádio + confirmação) ──
  function playTransmitSound() {
    try {
      const ctx = getAudioCtx();
      const t = ctx.currentTime;
      const duration = 0.5;

      // Estática de rádio
      const bufSize = Math.ceil(ctx.sampleRate * duration);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1800;
      bp.Q.value = 1.5;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, t);
      noiseGain.gain.linearRampToValueAtTime(0.06, t + 0.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      noise.connect(bp);
      bp.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + duration);

      // Tom de confirmação
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 880;
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0, t + 0.2);
      g1.gain.linearRampToValueAtTime(0.08, t + 0.22);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 1100;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0, t + 0.32);
      g2.gain.linearRampToValueAtTime(0.08, t + 0.34);
      g2.gain.exponentialRampToValueAtTime(0.001, t + duration);

      const toneLP = ctx.createBiquadFilter();
      toneLP.type = 'lowpass';
      toneLP.frequency.value = 3000;

      osc1.connect(g1); g1.connect(toneLP);
      osc2.connect(g2); g2.connect(toneLP);
      toneLP.connect(ctx.destination);

      osc1.start(t + 0.2); osc1.stop(t + 0.35);
      osc2.start(t + 0.32); osc2.stop(t + duration);
    } catch (e) { /* silencioso */ }
  }

  /* ======================================
     VINCULAR SONS AOS ELEMENTOS DE UI
  ====================================== */
  function attachPipBoySounds() {
    const hoverTargets = [
      '#navLinks a',
      '.social-btn',
      '.project-card',
      '.thumb-action-btn',
      '.special-stat',
      '.radio-btn',
      '#backToTop',
      '.btn-primary',
      '.btn-danger'
    ].join(', ');

    const clickTargets = [
      '#navLinks a',
      '.social-btn',
      '.thumb-action-btn',
      '.radio-btn',
      '#backToTop',
      '#radioToggle'
    ].join(', ');

    // Sons de hover
    document.body.addEventListener('mouseenter', function (e) {
      const target = e.target.closest(hoverTargets);
      if (target) playHoverSound();
    }, true);

    // Sons de click
    document.body.addEventListener('click', function (e) {
      const target = e.target.closest(clickTargets);
      if (target) playClickSound();
    }, true);

    // Som especial de transmissão no formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function () {
        playTransmitSound();
      });
    }
  }

  /* ======================================
     MÚSICA DE FUNDO DO YOUTUBE
  ====================================== */
  const RADIO_TRACKS = [
    { id: 'l7eeEprQ0x4', name: 'Main Title — Fallout New Vegas' }
  ];

  let ytPlayer = null;
  let hasInteracted = false;

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      createPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(tag, firstScript);

    window.onYouTubeIframeAPIReady = function () {
      createPlayer();
    };
  }

  function createPlayer() {
    const container = document.getElementById('ytPlayerContainer');
    if (!container) return;

    container.innerHTML = '<div id="ytPlayerFrame"></div>';

    ytPlayer = new YT.Player('ytPlayerFrame', {
      height: '200',
      width: '200',
      videoId: RADIO_TRACKS[0].id,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        origin: window.location.origin,
        loop: 1,
        playlist: RADIO_TRACKS[0].id,
        start: 1
      },
      events: {
        onReady: function (event) {
          event.target.setVolume(4); // Volume bem baixo
          // Tenta tocar imediatamente, mas navegadores geralmente bloqueiam sem interação
          if (hasInteracted) {
             event.target.playVideo();
          }
        },
        onStateChange: function (event) {
          // O looping nativo via 'playlist' + 'loop' já cuida disso sem delays extras
        }
      }
    });
  }

  /* ======================================
     INICIALIZAÇÃO
  ====================================== */
  document.addEventListener('DOMContentLoaded', () => {
    attachPipBoySounds();
    loadYouTubeAPI();

    // Inicia a música no primeiro clique/interação do usuário na página
    const startMusic = () => {
      if (hasInteracted) return;
      hasInteracted = true;
      if (ytPlayer && ytPlayer.playVideo) {
        ytPlayer.playVideo();
      }
      document.body.removeEventListener('click', startMusic);
      document.body.removeEventListener('keydown', startMusic);
      window.removeEventListener('scroll', startMusic);
      window.removeEventListener('touchstart', startMusic);
    };

    document.body.addEventListener('click', startMusic);
    document.body.addEventListener('keydown', startMusic);
    window.addEventListener('scroll', startMusic, { once: true });
    window.addEventListener('touchstart', startMusic, { once: true });
  });

})();
