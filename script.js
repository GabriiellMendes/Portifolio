/* ======================================
     DATA STORE (localStorage)
  ====================================== */
const STORAGE_KEY = 'vaulttec_portfolio_v3';

function getData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || getDefaultData();
  } catch { return getDefaultData(); }
}

function saveData(d) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

function getDefaultData() {
  return {
    name: 'Gabriel Mendes',
    role: 'CIÊNCIAS DA COMPUTAÇÃO',
    bio: 'Olá! Sou estudante de Ciências da Computação na Universidade Tiradentes — UNIT. Apaixonado por tecnologia, games e desenvolvimento web. Atualmente focado no frontend, onde combino lógica e criatividade para construir interfaces únicas e funcionais. Fã de Fallout New Vegas e do Mojave Wasteland.',
    photo: '',
    github: 'https://github.com/GabriiellMendes',
    linkedin: 'https://www.linkedin.com/in/gabriel-mendes-344b66230/',
    instagram: 'https://www.instagram.com/gabriellm.s_/',
    skills: [
      { name: 'CSS', icon: '◈', pct: 52.0 },
      { name: 'JavaScript', icon: '◈', pct: 28.9 },
      { name: 'HTML', icon: '◈', pct: 19.1 }
    ],
    projects: [
      {
        id: 'p1',
        name: 'Projeto Lâmpada',
        desc: 'Um projeto interativo simulando o funcionamento de uma lâmpada.',
        tags: ['HTML', 'CSS', 'JS'],
        link: 'https://gabriiellmendes.github.io/Lampada-HTML/',
        thumb: 'assets/lampada_thumb.png'
      },
      {
        id: 'p2',
        name: 'Projeto Lista de Tarefas',
        desc: 'Um aplicativo simples e direto para organização de tarefas e compromissos.',
        tags: ['HTML', 'CSS', 'JS'],
        link: 'https://gabriiellmendes.github.io/Lista-de-tarefa/',
        thumb: 'assets/tarefas_thumb.png'
      },
      {
        id: 'p3',
        name: 'Projeto calculadora',
        desc: 'Uma calculadora moderna e funcional.',
        tags: ['HTML', 'CSS', 'JS', 'BOOTSTRAP'],
        link: 'https://gabriiellmendes.github.io/Calculadora/',
        thumb: 'assets/calculadora_thumb.png'
      },
      {
        id: 'p4',
        name: 'Zero ou Um',
        desc: 'Um jogo interativo e justo contra a máquina com animações suaves e placar dinâmico.',
        tags: ['HTML', 'CSS', 'JS'],
        link: 'https://gabriiellmendes.github.io/Jogo-de-0-ou-1/',
        thumb: 'assets/jogo_0_1_thumb.png'
      }
    ]
  };
}

let appData = getData();
let editMode = false;
let currentEditId = null;
let currentTags = [];
let thumbBase64 = '';

/* ======================================
   INIT
====================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('footerYear').textContent = new Date().getFullYear();
  applyData();
  renderSkills();
  renderSpecial();
  renderPortfolio();
  initAnimations();
  initNav();
});

/* ======================================
   APPLY DATA TO DOM
====================================== */
function applyData() {
  const d = appData;

  document.getElementById('githubLink').href = d.github || '#';
  document.getElementById('linkedinLink').href = d.linkedin || '#';
  document.getElementById('instagramLink').href = d.instagram || '#';
}

function setEditable(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

/* ======================================
   SKILLS RENDER
====================================== */
function renderSkills() {
  const container = document.getElementById('skillsList');
  container.innerHTML = '';

  appData.skills.forEach(s => {
    const c = 'var(--amber)';
    const glow = 'var(--amber-glow)';
    const dark = 'var(--amber-dark)';

    const div = document.createElement('div');
    div.className = 'skill-item';
    div.innerHTML = `
        <div class="skill-header">
          <div class="skill-name" style="color: ${glow}; text-shadow: 0 0 8px ${dark};">
            <span class="skill-icon" style="color: ${c};">◈</span> ${s.name}
          </div>
          <div class="skill-pct" style="color: ${glow}; font-family: 'VT323', monospace; font-size: 1.2rem; letter-spacing: 1px;">${s.pct}%</div>
        </div>
        <div class="skill-bar-track" style="border-color: ${dark};">
          <div class="skill-bar-fill" data-pct="${s.pct}" style="width:0; background: linear-gradient(to right, ${dark}, ${c}); box-shadow: 0 0 10px ${dark};"></div>
        </div>
      `;
    container.appendChild(div);
  });
  // Animate bars on scroll
  animateBars();
}

function animateBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.dataset.pct;
        setTimeout(() => { entry.target.style.width = pct + '%'; }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => observer.observe(f));
}

/* ======================================
   SPECIAL STATS
====================================== */
const SPECIAL = [
  { l: 'S', name: 'STRENGTH', val: 6 },
  { l: 'P', name: 'PERCEPTION', val: 8 },
  { l: 'E', name: 'ENDURANCE', val: 7 },
  { l: 'C', name: 'CHARISMA', val: 5 },
  { l: 'I', name: 'INTELL.', val: 9 },
  { l: 'A', name: 'AGILITY', val: 7 },
  { l: 'L', name: 'LUCK', val: 6 },
];

function renderSpecial() {
  const grid = document.getElementById('specialGrid');
  grid.innerHTML = '';
  SPECIAL.forEach(s => {
    const dots = Array.from({ length: 10 }, (_, i) =>
      `<div class="dot ${i < s.val ? 'filled' : ''}"></div>`
    ).join('');
    const div = document.createElement('div');
    div.className = 'special-stat';
    div.innerHTML = `
        <div class="special-letter">${s.l}</div>
        <div class="special-name">${s.name}</div>
        <div class="special-val">${s.val}</div>
        <div class="special-dots">${dots}</div>
      `;
    grid.appendChild(div);
  });
}

/* ======================================
   PORTFOLIO RENDER
====================================== */
function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  grid.innerHTML = '';
  appData.projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    card.style.transitionDelay = (i * 0.07) + 's';

    const thumbHTML = p.thumb
      ? `<img src="${p.thumb}" alt="${p.name}" />`
      : `<div class="thumb-placeholder">◈</div>`;

    const tagsHTML = p.tags.map(t => `<span class="tech-tag">${t}</span>`).join('');

    const linkBtn = p.link
      ? `<a class="thumb-action-btn" href="${p.link}" target="_blank" rel="noopener">[ ABRIR PROJETO ]</a>`
      : '';

    card.innerHTML = `
        <div class="card-thumb">
          <span class="card-number">// ${String(i + 1).padStart(2, '0')}</span>
          ${thumbHTML}
          <div class="card-thumb-actions">
            ${linkBtn}
          </div>
        </div>
        <div class="card-body">
          <div class="card-title">${p.name}</div>
          <div class="card-tech">${tagsHTML}</div>
          <div class="card-desc">${p.desc}</div>
        </div>
      `;
    grid.appendChild(card);
  });

  // Re-init animations
  setTimeout(() => initAnimations(), 50);
}



/* ======================================
   CONTACT FORM VALIDATION
====================================== */
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const msg = document.getElementById('cMsg').value.trim();

  // Name
  const fgName = document.getElementById('fg-name');
  const errName = document.getElementById('err-name');
  if (!name || name.length < 2) {
    fgName.className = 'form-group input-invalid';
    errName.textContent = '> ERRO: Nome deve ter ao menos 2 caracteres.';
    valid = false;
  } else {
    fgName.className = 'form-group input-valid';
    errName.textContent = '';
  }

  // Email
  const fgEmail = document.getElementById('fg-email');
  const errEmail = document.getElementById('err-email');
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailReg.test(email)) {
    fgEmail.className = 'form-group input-invalid';
    errEmail.textContent = '> ERRO: Email inválido.';
    valid = false;
  } else {
    fgEmail.className = 'form-group input-valid';
    errEmail.textContent = '';
  }

  // Message
  const fgMsg = document.getElementById('fg-msg');
  const errMsg = document.getElementById('err-msg');
  if (!msg || msg.length < 10) {
    fgMsg.className = 'form-group input-invalid';
    errMsg.textContent = '> ERRO: Mensagem deve ter ao menos 10 caracteres.';
    valid = false;
  } else {
    fgMsg.className = 'form-group input-valid';
    errMsg.textContent = '';
  }

  const status = document.getElementById('formStatus');
  if (valid) {
    status.className = 'form-status';
    status.textContent = '> ESTABELECENDO CONEXÃO...';

    // ==========================================
    // PARA RECEBER EMAILS DE VERDADE:
    // 1. Crie uma conta gratuita em https://formspree.io/
    // 2. Crie um novo formulário lá e copie o link gerado
    // 3. Substitua 'https://formspree.io/f/SEU_ID_AQUI' pelo seu link real
    // ==========================================
    const endpoint = 'https://formspree.io/f/xykaeeqr';

    if (endpoint.includes('SEU_ID_AQUI')) {
      // Modo simulação (ainda não configurado)
      status.className = 'form-status success';
      status.textContent = '> [SIMULAÇÃO] TRANSMISSÃO ENVIADA. (Crie sua conta no Formspree para receber!)';
      resetFormUI();
    } else {
      // Envio real via Formspree
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ Nome: name, Email: email, Mensagem: msg })
      })
        .then(response => {
          if (response.ok) {
            status.className = 'form-status success';
            status.textContent = '> TRANSMISSÃO ENVIADA COM SUCESSO. GOOD LUCK OUT THERE, COURIER.';
            resetFormUI();
          } else {
            throw new Error('Erro na resposta');
          }
        })
        .catch(error => {
          status.className = 'form-status error';
          status.textContent = '> FALHA NA TRANSMISSÃO. INTERFERÊNCIA NA REDE.';
        });
    }
  } else {
    status.className = 'form-status error';
    status.textContent = '> FALHA NA TRANSMISSÃO. VERIFIQUE OS DADOS.';
  }

  function resetFormUI() {
    document.getElementById('contactForm').reset();
    ['fg-name', 'fg-email', 'fg-msg'].forEach(id => {
      document.getElementById(id).className = 'form-group';
    });
    setTimeout(() => {
      const s = document.getElementById('formStatus');
      s.textContent = '';
      s.className = 'form-status';
    }, 6000);
  }
});

/* Real-time validation on input */
['cName', 'cEmail', 'cMsg'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    const fgId = id === 'cName' ? 'fg-name' : id === 'cEmail' ? 'fg-email' : 'fg-msg';
    const errId = id === 'cName' ? 'err-name' : id === 'cEmail' ? 'err-email' : 'err-msg';
    const fg = document.getElementById(fgId);
    const err = document.getElementById(errId);
    const val = document.getElementById(id).value.trim();
    if (id === 'cEmail') {
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (val && emailReg.test(val)) { fg.className = 'form-group input-valid'; err.textContent = ''; }
      else if (val) { fg.className = 'form-group input-invalid'; }
    } else if (id === 'cName') {
      if (val.length >= 2) { fg.className = 'form-group input-valid'; err.textContent = ''; }
      else if (val.length > 0) { fg.className = 'form-group input-invalid'; }
    } else {
      if (val.length >= 10) { fg.className = 'form-group input-valid'; err.textContent = ''; }
      else if (val.length > 0) { fg.className = 'form-group input-invalid'; }
    }
  });
});

/* ======================================
   NAVBAR
====================================== */
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = ['sobre', 'portfolio', 'skills', 'contato'];
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Back to top
    const btn = document.getElementById('backToTop');
    btn.classList.toggle('visible', scrollY > 400);

    // Active nav
    let current = 'sobre';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop - 100 <= scrollY) current = id;
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });
}

/* ======================================
   FADE-IN ANIMATIONS
====================================== */
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
}