(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#main-navigation');
  const closeMenu = () => { menuButton?.setAttribute('aria-expanded', 'false'); if (menu) menu.dataset.open = 'false'; };
  menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menu.dataset.open = String(open); });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
  document.addEventListener('click', event => { if (menu && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
  window.matchMedia('(min-width: 641px)').addEventListener('change', closeMenu);

  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeLabel = document.querySelector('.theme-label');
  const setTheme = dark => { root.dataset.theme = dark ? 'dark' : 'light'; themeButton?.setAttribute('aria-pressed', String(dark)); if (themeLabel) themeLabel.textContent = dark ? 'Tagmodus' : 'Nachtmodus'; };
  setTheme(false);
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme !== 'dark'));
  const langButton = document.querySelector('.lang-toggle');
  const ar = { 'Menü':'القائمة', 'Leistungen':'الخدمات', 'Arbeitsweise':'طريقة العمل', 'Über uns':'من نحن', 'Kontakt':'تواصل معنا', 'Standort':'الموقع', 'Leistungen entdecken':'اكتشف الخدمات', 'Anfrage vorbereiten':'جهّز طلبك', 'Karte öffnen':'افتح الخريطة', 'Nachtmodus':'الوضع الليلي', 'Tagmodus':'الوضع النهاري' };
  const translate = active => { root.lang = active ? 'ar' : 'de'; root.dir = active ? 'rtl' : 'ltr'; document.querySelectorAll('.navigation a,.menu-toggle span:first-child,.theme-label,.text-link,.hero-actions .button,.section-label,.location-copy .button').forEach(el => { if (!el.dataset.original) el.dataset.original = el.textContent.trim(); const key = el.dataset.original; el.textContent = active ? (ar[key] || key) : el.dataset.original; }); const title = document.querySelector('#location-title'); if (title) title.innerHTML = active ? 'في فيلباخ<br>نحن هنا لخدمتكم.' : 'In Fellbach<br>für Sie da.'; langButton?.setAttribute('aria-pressed', String(active)); if (langButton) langButton.textContent = active ? 'Deutsch' : 'العربية'; };
  langButton?.addEventListener('click', () => translate(root.lang !== 'ar'));

  const form = document.querySelector('#inquiry-form');
  if (!form) return;
  const name = form.elements.name;
  const email = form.elements.email;
  const service = form.elements.service;
  const message = form.elements.message;
  const result = document.querySelector('#inquiry-result');
  const text = document.querySelector('#inquiry-text');
  const status = document.querySelector('#form-status');
  const clearError = field => { field.removeAttribute('aria-invalid'); const error = document.querySelector(`#${field.id}-error`); if (error) { error.hidden = true; error.textContent = ''; } };
  const showError = (field, content) => { field.setAttribute('aria-invalid', 'true'); const error = document.querySelector(`#${field.id}-error`); error.textContent = content; error.hidden = false; };
  [email, message].forEach(field => field.addEventListener('input', () => { clearError(field); status.textContent = ''; }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    clearError(email); clearError(message); status.textContent = '';
    email.value = email.value.trim();
    let firstInvalid = null;
    if (email.value && !email.validity.valid) { showError(email, 'Bitte geben Sie eine gültige E-Mail-Adresse ein oder lassen Sie das freiwillige Feld leer.'); firstInvalid = email; }
    if (!message.value.trim()) { showError(message, 'Bitte beschreiben Sie kurz Ihr Anliegen.'); firstInvalid ||= message; }
    if (firstInvalid) { firstInvalid.focus(); return; }
    const lines = ['Anfrage an Hammurabi', '', 'Guten Tag,', '', message.value.trim()];
    if (service.value) lines.push('', `Gewünschte Unterstützung: ${service.value}`);
    if (name.value.trim() || email.value) lines.push('', 'Meine freiwilligen Kontaktangaben:');
    if (name.value.trim()) lines.push(`Name: ${name.value.trim()}`);
    if (email.value) lines.push(`E-Mail: ${email.value}`);
    lines.push('', 'Freundliche Grüße', name.value.trim() || '');
    text.value = lines.join('\n').trim();
    form.hidden = true; result.hidden = false;
    document.querySelector('#result-title').focus({preventScroll:true});
    result.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'nearest'});
  });
  document.querySelector('#copy-button').addEventListener('click', async event => {
    const button = event.currentTarget; button.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard-unavailable');
      await navigator.clipboard.writeText(text.value);
      status.textContent = 'Text in die Zwischenablage kopiert.';
    } catch {
      text.focus(); text.select();
      status.textContent = 'Bitte den markierten Text manuell kopieren (Strg+C bzw. Kopieren).';
    } finally { button.disabled = false; }
  });
  document.querySelector('#edit-button').addEventListener('click', () => { result.hidden = true; form.hidden = false; text.value = ''; status.textContent = ''; message.focus({preventScroll:true}); });
  const reset = () => { form.reset(); text.value = ''; clearError(email); clearError(message); result.hidden = true; form.hidden = false; };
  document.querySelector('#clear-button').addEventListener('click', () => { reset(); status.textContent = 'Eingaben und Entwurf gelöscht. Bereits kopierter Text bleibt in Ihrer Zwischenablage.'; });
  window.addEventListener('pageshow', reset);
  window.addEventListener('pagehide', () => { reset(); status.textContent = ''; });
})();
