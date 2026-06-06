/* ======================================
     DATA STORE (localStorage)
  ====================================== */
  const STORAGE_KEY = 'vaulttec_portfolio_v1';

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
      bio: 'Olá! Sou estudante de Ciências da Computação na Universidade Tiradentes — UNIT. Apaixonado por tecnologia, games e desenvolvimento web. Atualmente focado no frontend, onde combino lógica e criatividade para construir interfaces únicas e funcionais. Fã declarado de Fallout New Vegas e do Mojave Wasteland.',
      photo: '',
      github: 'https://github.com/GabriiellMendes',
      linkedin: 'https://www.linkedin.com/in/gabriel-mendes-344b66230/',
      instagram: 'https://www.instagram.com/gabriellm.s_/',
      skills: [
        { name: 'HTML5', icon: '◈', pct: 75 },
        { name: 'CSS3', icon: '◈', pct: 65 },
        { name: 'JavaScript', icon: '◈', pct: 50 },
        { name: 'UI/UX Design', icon: '◈', pct: 40 },
        { name: 'Git', icon: '◈', pct: 45 },
      ],
      projects: [
        {
          id: 'p1',
          name: 'PROJETO EXEMPLO',
          desc: 'Breve descrição do projeto — o que foi feito e quais habilidades foram usadas. Edite ou delete este card.',
          tags: ['HTML', 'CSS', 'JS'],
          link: '',
          thumb: ''
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
      const div = document.createElement('div');
      div.className = 'skill-item';
      div.innerHTML = `
        <div class="skill-header">
          <div class="skill-name"><span class="skill-icon">${s.icon}</span> ${s.name}</div>
          <div class="skill-pct">${s.pct}%</div>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" data-pct="${s.pct}" style="width:0"></div>
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
      const dots = Array.from({length: 10}, (_, i) =>
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
          <span class="card-number">// ${String(i+1).padStart(2,'0')}</span>
          ${thumbHTML}
          <div class="card-thumb-actions">
            ${linkBtn}
            <button class="thumb-action-btn" onclick="openEditModal('${p.id}')">[ EDITAR ]</button>
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

    // Add project button
    const addCard = document.createElement('div');
    addCard.className = 'add-project-card';
    addCard.onclick = () => openNewModal();
    addCard.innerHTML = `
      <div class="plus">+</div>
      <div class="add-label">Adicionar Projeto</div>
    `;
    grid.appendChild(addCard);

    // Re-init animations
    setTimeout(() => initAnimations(), 50);
  }

  /* ======================================
     MODAL
  ====================================== */
  function openNewModal() {
    currentEditId = null;
    currentTags = [];
    thumbBase64 = '';
    document.getElementById('pName').value = '';
    document.getElementById('pDesc').value = '';
    document.getElementById('pLink').value = '';
    document.getElementById('pTagList').innerHTML = '';
    document.getElementById('pTagInput').value = '';
    document.getElementById('deleteProjectBtn').style.display = 'none';
    document.getElementById('modalTitle').textContent = 'NOVO PROJETO';
    document.getElementById('thumbPreview').innerHTML = `
      <div style="font-size: 0.7rem; letter-spacing: 1px;">CLIQUE PARA ENVIAR IMAGEM</div>
      <div style="font-size: 0.6rem; color: var(--border-bright); margin-top: 4px;">PNG, JPG, WEBP aceitos</div>
    `;
    document.getElementById('projectModal').classList.add('open');
  }

  function openEditModal(id) {
    const p = appData.projects.find(x => x.id === id);
    if (!p) return;
    currentEditId = id;
    currentTags = [...p.tags];
    thumbBase64 = p.thumb || '';
    document.getElementById('pName').value = p.name;
    document.getElementById('pDesc').value = p.desc;
    document.getElementById('pLink').value = p.link || '';
    document.getElementById('modalTitle').textContent = 'EDITAR PROJETO';
    document.getElementById('deleteProjectBtn').style.display = 'block';
    renderModalTags();

    if (p.thumb) {
      document.getElementById('thumbPreview').innerHTML = `<img src="${p.thumb}" style="max-height:80px; object-fit: contain; margin-bottom: 8px;" /><div style="font-size: 0.6rem; color: var(--text-dim);">Clique para trocar</div>`;
    } else {
      document.getElementById('thumbPreview').innerHTML = `
        <div style="font-size: 0.7rem; letter-spacing: 1px;">CLIQUE PARA ENVIAR IMAGEM</div>
        <div style="font-size: 0.6rem; color: var(--border-bright); margin-top: 4px;">PNG, JPG, WEBP aceitos</div>
      `;
    }

    document.getElementById('projectModal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('projectModal').classList.remove('open');
  }

  document.getElementById('projectModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('projectModal')) closeModal();
  });

  document.getElementById('pThumbInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      thumbBase64 = ev.target.result;
      document.getElementById('thumbPreview').innerHTML = `<img src="${thumbBase64}" style="max-height:80px; object-fit: contain; margin-bottom: 8px;" /><div style="font-size: 0.6rem; color: var(--text-dim);">Imagem carregada ✓</div>`;
    };
    reader.readAsDataURL(file);
  });

  function addTag() {
    const input = document.getElementById('pTagInput');
    const val = input.value.trim().toUpperCase();
    if (!val || currentTags.includes(val)) { input.value = ''; return; }
    currentTags.push(val);
    input.value = '';
    renderModalTags();
  }

  function removeTag(tag) {
    currentTags = currentTags.filter(t => t !== tag);
    renderModalTags();
  }

  function renderModalTags() {
    const list = document.getElementById('pTagList');
    list.innerHTML = currentTags.map(t =>
      `<div class="tag-item">${t}<button class="tag-remove" onclick="removeTag('${t}')">✕</button></div>`
    ).join('');
  }

  function saveProject() {
    const name = document.getElementById('pName').value.trim();
    const desc = document.getElementById('pDesc').value.trim();
    const link = document.getElementById('pLink').value.trim();

    if (!name) { alert('Informe o nome do projeto!'); return; }

    if (currentEditId) {
      const idx = appData.projects.findIndex(p => p.id === currentEditId);
      if (idx >= 0) {
        appData.projects[idx] = { id: currentEditId, name, desc, tags: currentTags, link, thumb: thumbBase64 };
      }
    } else {
      appData.projects.push({
        id: 'p' + Date.now(),
        name, desc, tags: currentTags, link, thumb: thumbBase64
      });
    }

    saveData(appData);
    renderPortfolio();
    closeModal();
  }

  function deleteProject() {
    if (!currentEditId) return;
    if (!confirm('Deletar este projeto?')) return;
    appData.projects = appData.projects.filter(p => p.id !== currentEditId);
    saveData(appData);
    renderPortfolio();
    closeModal();
  }

  /* ======================================
     CONTACT FORM VALIDATION
  ====================================== */
  document.getElementById('contactForm').addEventListener('submit', function(e) {
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
      status.className = 'form-status success';
      status.textContent = '> TRANSMISSÃO ENVIADA COM SUCESSO. GOOD LUCK OUT THERE, COURIER.';
      document.getElementById('contactForm').reset();
      // Reset classes
      ['fg-name', 'fg-email', 'fg-msg'].forEach(id => {
        document.getElementById(id).className = 'form-group';
      });
      setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
    } else {
      status.className = 'form-status error';
      status.textContent = '> FALHA NA TRANSMISSÃO. VERIFIQUE OS DADOS.';
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