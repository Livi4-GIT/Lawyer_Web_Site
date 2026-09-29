(function () {
  'use strict';

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav-principal');

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      toggle.focus();
    }
  });

  /* ---------- Seção ativa no menu ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.setAttribute('aria-current', 'true');
          } else {
            a.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { navObserver.observe(s); });

    /* ---------- Animações sutis de entrada ---------- */
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reveals = document.querySelectorAll('.reveal');

    if (reduced) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      reveals.forEach(function (el) { revealObserver.observe(el); });
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Foco acessível ao navegar por âncoras ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      window.setTimeout(function () {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, 400);
    });
  });

  /* ---------- Validação do formulário ---------- */
  var form = document.getElementById('formContato');
  var status = document.getElementById('formStatus');

  var rules = [
    { id: 'nome', erro: 'erro-nome', msg: 'Informe seu nome.' },
    { id: 'telefone', erro: 'erro-telefone', msg: 'Informe um telefone ou WhatsApp para contato.' },
    { id: 'mensagem', erro: 'erro-mensagem', msg: 'Escreva sua mensagem.' }
  ];

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var primeiroInvalido = null;

    rules.forEach(function (r) {
      var campo = document.getElementById(r.id);
      var alvoErro = document.getElementById(r.erro);
      var vazio = campo.value.trim() === '';

      alvoErro.textContent = vazio ? r.msg : '';
      campo.setAttribute('aria-invalid', vazio ? 'true' : 'false');
      if (vazio && !primeiroInvalido) primeiroInvalido = campo;
    });

    if (primeiroInvalido) {
      status.textContent = '';
      primeiroInvalido.focus();
      return;
    }

    status.textContent = 'Em breve responderemos ao seu e-mail.';
    form.reset();
  });
})();
