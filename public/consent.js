/* LayerForm Consent Manager v2 – optionale Dienste werden erst nach Zustimmung geladen. */
(() => {
  'use strict';
  const KEY = 'layerform:privacy:v2';
  const VERSION = 2;
  const MAX_AGE = 180 * 86400000;
  let current = null;
  let panel = null;
  let manageButton = null;
  let reloading = false;

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!value || value.version !== VERSION || typeof value.timestamp !== 'number' ||
          Date.now() - value.timestamp > MAX_AGE ||
          typeof value.analytics !== 'boolean' || typeof value.hubspot !== 'boolean') return null;
      return value;
    } catch (_) { return null; }
  }

  function notify(value) {
    window.dispatchEvent(new CustomEvent('layerform:consent-changed', {
      detail: { analytics: Boolean(value && value.analytics), hubspot: Boolean(value && value.hubspot) }
    }));
  }

  function loadHubSpot() {
    if (document.getElementById('hs-script-loader')) return;
    const el = document.createElement('script');
    el.id = 'hs-script-loader';
    el.async = true;
    el.src = 'https://js-eu1.hs-scripts.com/149524579.js';
    document.body.appendChild(el);
  }

  function save(analytics, hubspot) {
    const old = current;
    current = { version: VERSION, timestamp: Date.now(), analytics: Boolean(analytics), hubspot: Boolean(hubspot) };
    try { localStorage.setItem(KEY, JSON.stringify(current)); } catch (_) {}
    if (panel) { panel.remove(); panel = null; }
    manageButton.hidden = false;
    notify(current);
    // Ein einmal geladenes Drittanbieter-Skript lässt sich nicht zuverlässig vollständig entladen.
    if (old && old.hubspot && !current.hubspot) {
      reloading = true;
      location.reload();
      return;
    }
    if (current.hubspot) loadHubSpot();
  }

  const css = document.createElement('style');
  css.textContent = [
    '.lf-cm{position:fixed;inset:auto 12px 12px;z-index:99999;max-width:640px;margin:0 auto;color:#f3f8ff;background:#09182d;border:1px solid #3c546e;border-radius:18px;box-shadow:0 18px 64px #000a;padding:22px;font:15px/1.55 system-ui,sans-serif;max-height:calc(100dvh - 24px);overflow-y:auto}',
    '.lf-cm *{box-sizing:border-box}.lf-cm h2{font-size:21px;line-height:1.25;margin:0 0 10px;font-weight:750;color:#fff}.lf-cm p{margin:0 0 14px;color:#d5e2f1}.lf-cm small{color:#b4c5d7}',
    '.lf-cm a{color:#78e8ff;text-decoration:underline}.lf-cm-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.lf-cm button{cursor:pointer;font:inherit;border:1px solid #8198ac;border-radius:11px;padding:10px 15px;background:#132940;color:#fff;font-weight:600}',
    '.lf-cm button.lf-primary{background:#00d5ed;color:#00182b;border-color:#00d5ed}.lf-cm button:focus-visible,.lf-cm-manage:focus-visible{outline:3px solid #fff;outline-offset:3px}',
    '.lf-cm-option{display:flex;gap:12px;align-items:flex-start;border:1px solid #3c546e;border-radius:12px;padding:12px;margin:10px 0}.lf-cm-option input{width:20px;height:20px;margin-top:3px;accent-color:#00d5ed;flex:none}.lf-cm-option strong{display:block;color:#fff}.lf-cm-option small{display:block;margin-top:2px}',
    '.lf-cm-manage{position:fixed;z-index:99998;bottom:12px;left:12px;border:1px solid #58738a;border-radius:999px;background:#09182d;color:#fff;font:13px system-ui,sans-serif;padding:9px 13px;cursor:pointer}',
    '@media(min-width:700px){.lf-cm{left:22px;right:auto;bottom:22px}.lf-cm-manage{left:22px}}'
  ].join('');
  document.head.appendChild(css);

  manageButton = document.createElement('button');
  manageButton.type = 'button';
  manageButton.className = 'lf-cm-manage';
  manageButton.textContent = 'Datenschutzeinstellungen';
  manageButton.hidden = true;
  manageButton.addEventListener('click', () => open(true));
  document.body.appendChild(manageButton);

  function open(settingsMode) {
    if (panel) panel.remove();
    panel = document.createElement('section');
    panel.className = 'lf-cm';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'lf-cm-title');
    const heading = document.createElement('h2');
    heading.id = 'lf-cm-title';
    heading.textContent = settingsMode ? 'Datenschutzeinstellungen' : 'Ihre Privatsphäre bei LayerForm';
    panel.appendChild(heading);

    const intro = document.createElement('p');
    intro.textContent = 'Technisch notwendige Funktionen stehen immer bereit. Statistik und zusätzliche HubSpot-Funktionen nutzen wir nur mit Ihrer freiwilligen Zustimmung. Das Anfrageformular funktioniert auch ohne diese Einwilligung.';
    panel.appendChild(intro);

    const list = document.createElement('div');
    const necessary = document.createElement('div');
    necessary.className = 'lf-cm-option';
    necessary.innerHTML = '<span aria-hidden="true">✓</span><span><strong>Technisch notwendig – immer aktiv</strong><small>Website, Sicherheit und Speicherung Ihrer Datenschutzauswahl. Keine Wahl erforderlich.</small></span>';
    list.appendChild(necessary);

    function option(label, info, checked) {
      const wrapper = document.createElement('label');
      wrapper.className = 'lf-cm-option';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = checked;
      const words = document.createElement('span');
      const title = document.createElement('strong');
      title.textContent = label;
      const detail = document.createElement('small');
      detail.textContent = info;
      words.append(title, detail);
      wrapper.append(input, words);
      list.appendChild(wrapper);
      return input;
    }
    const analytics = option('Statistik – Vercel Web Analytics', 'Anonymisierte, cookiefreie Besucherstatistik von Vercel; optional.', Boolean(current && current.analytics));
    const hubspot = option('HubSpot – zusätzliche Website-Funktionen', 'Externes HubSpot-Skript kann Daten übertragen und Cookies oder ähnliche Technologien verwenden; optional.', Boolean(current && current.hubspot));
    panel.appendChild(list);

    const legal = document.createElement('p');
    legal.innerHTML = '<small>Sie können Ihre Auswahl jederzeit über „Datenschutzeinstellungen“ ändern oder widerrufen. Einzelheiten stehen in der <a href="/#datenschutz" data-lf-privacy-link>Datenschutzerklärung</a>.</small>';
    panel.appendChild(legal);
    const actions = document.createElement('div');
    actions.className = 'lf-cm-actions';
    function action(name, className, callback) {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.textContent = name; btn.className = className;
      btn.addEventListener('click', callback); actions.appendChild(btn);
    }
    action('Alle ablehnen', '', () => save(false, false));
    action('Auswahl speichern', '', () => save(analytics.checked, hubspot.checked));
    action('Alle akzeptieren', 'lf-primary', () => save(true, true));
    panel.appendChild(actions);
    document.body.appendChild(panel);
    manageButton.hidden = true;
    panel.querySelector('button').focus();
    // Die Datenschutzerklärung öffnen, ohne die (noch nicht getroffene) Wahl zu setzen.
    panel.querySelector('[data-lf-privacy-link]').addEventListener('click', () => {
      window.dispatchEvent(new Event('layerform:open-privacy'));
    });
  }

  window.addEventListener('layerform:open-consent', () => open(true));
  current = read();
  window.layerformConsent = {
    get: () => ({ analytics: Boolean(current && current.analytics), hubspot: Boolean(current && current.hubspot) }),
    open: () => open(true)
  };
  if (current) {
    manageButton.hidden = false;
    if (current.hubspot) loadHubSpot();
  } else {
    open(false);
  }
})();
