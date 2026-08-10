// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== ABAS DO CARDÁPIO =====
function switchTab(tabName) {
  document.querySelectorAll('.menu-tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  document.querySelectorAll('.menu-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.id === 'tab-' + tabName);
  });
}

document.querySelectorAll('.menu-tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Links de navegação que apontam para uma aba específica
document.querySelectorAll('[data-tab-link]').forEach((link) => {
  link.addEventListener('click', () => switchTab(link.dataset.tabLink));
});

// ===== FAQ =====
document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item.active').forEach((openItem) => {
      openItem.classList.remove('active');
      openItem.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ===== HORÁRIO DE FUNCIONAMENTO =====
// Horários: Seg-Sex 11h-23h, Sáb 11h-23h30, Dom 17h-23h
function getScheduleInfo(now) {
  const day = now.getDay(); // 0 = domingo, 1 = segunda...
  const minutes = now.getHours() * 60 + now.getMinutes();

  const schedules = {
    0: { open: 17 * 60, close: 23 * 60 },        // domingo
    6: { open: 11 * 60, close: 23 * 60 + 30 },   // sábado
  };

  let open;
  let close;

  if (day === 0) {
    open = schedules[0].open;
    close = schedules[0].close;
  } else if (day === 6) {
    open = schedules[6].open;
    close = schedules[6].close;
  } else {
    open = 11 * 60;
    close = 23 * 60;
  }

  return { open, close, minutes, isOpen: minutes >= open && minutes < close };
}

function setStatus(el, message, closed) {
  el.classList.toggle('closed', closed);
  el.textContent = '';
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-circle';
  el.appendChild(icon);
  el.appendChild(document.createTextNode(' ' + message));
}

function updateOpenStatus() {
  const el = document.getElementById('openNow');
  const { open, close, minutes, isOpen } = getScheduleInfo(new Date());

  if (isOpen) {
    setStatus(el, 'Aberto agora! Fecha às ' + formatTime(close) + 'h', false);
  } else {
    setStatus(el, 'Fechado no momento. Abrimos às ' + formatTime(open) + 'h', true);
  }

  function formatTime(totalMinutes) {
    const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const m = String(totalMinutes % 60).padStart(2, '0');
    return h + ':' + m;
  }
}

updateOpenStatus();

// ===== PEDIDO VIA WHATSAPP =====
const WHATSAPP_NUMBER = '5511999999999';

document.querySelectorAll('.btn-order').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.dataset.item;
    const price = btn.dataset.price;
    const message = encodeURIComponent(
      'Olá! Quero pedir um ' + item + ' (' + price + '). Pode confirmar a disponibilidade?'
    );
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + message, '_blank', 'noopener,noreferrer');
  });
});
