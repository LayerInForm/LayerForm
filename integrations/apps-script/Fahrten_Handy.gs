/** Private Handyoberfläche; Web-App ausschließlich mit Zugriff „Nur ich“ bereitstellen. */
function lfFahrtenOwner_() {
  const active = String(Session.getActiveUser().getEmail() || '').toLowerCase();
  const owner = String(Session.getEffectiveUser().getEmail() || '').toLowerCase();
  if (!active || !owner || active !== owner) throw new Error('Bitte mit dem eigenen Google-Konto anmelden.');
}

function lfFahrtenBlatt_() {
  const id = PropertiesService.getScriptProperties().getProperty('LF_FAHRTEN_SPREADSHEET_ID');
  if (!id) throw new Error('Fahrtenbuch ist noch nicht verbunden.');
  const sheet = SpreadsheetApp.openById(id).getSheetByName('Formularantworten 1');
  if (!sheet) throw new Error('Fahrtenblatt nicht gefunden.');
  const h = sheet.getRange(1, 1, 1, 7).getDisplayValues()[0];
  if (h[0] !== 'Zeitstempel' || h[1] !== 'Datum' || h[3] !== 'Anlass' || !/^Gefahrene km/.test(h[6])) throw new Error('Tabellenstruktur geändert; Zuordnung zuerst prüfen.');
  return sheet;
}

// Verbindung ausschließlich über private Skripteigenschaft konfigurieren.
function lfFahrtenHandyVerbinden() {
  lfFahrtenOwner_();
  lfFahrtenBlatt_();
  console.log('Bestehendes Fahrtenbuch verbunden. Keine Fahrt angelegt.');
}

function doGet() {
  lfFahrtenOwner_();
  const t = HtmlService.createTemplateFromFile('Fahrten_Handy_UI');
  t.today = Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd');
  return t.evaluate().setTitle('LayerForm · Fahrt erfassen').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function lfFahrtenText_(value, max) {
  const text = String(value || '').trim();
  if (text.length > max || /[\r\n\t]/.test(text)) throw new Error('Bitte eine kurze Angabe ohne Zeilenumbrüche eingeben.');
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function lfFahrtenEingabe_(data) {
  if (!data || !/^[a-zA-Z0-9-]{20,80}$/.test(data.requestId || '')) throw new Error('Bitte das Formular erneut öffnen.');
  const date = String(data.date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Bitte ein gültiges Datum auswählen.');
  const d = Utilities.parseDate(date, 'Europe/Berlin', 'yyyy-MM-dd');
  if (Utilities.formatDate(d, 'Europe/Berlin', 'yyyy-MM-dd') !== date || date > Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd')) throw new Error('Das Fahrtdatum darf nicht in der Zukunft liegen.');
  const reason = String(data.reason || '');
  if (!['Poststelle', 'Kunde', 'Einkauf', 'sonstige'].includes(reason)) throw new Error('Bitte einen Anlass auswählen.');
  const target = reason === 'Poststelle' ? 'Bargteheide' : lfFahrtenText_(data.target, 120);
  const kmString = String(data.km || '').trim().replace(',', '.');
  const km = reason === 'Poststelle' ? 5 : (/^\d+(\.\d{1,2})?$/.test(kmString) ? Number(kmString) : NaN);
  if (!target || !Number.isFinite(km) || km <= 0 || km > 3000) throw new Error('Bitte Ziel und gültige Kilometer für Hin- und Rückweg angeben.');
  const customer = reason === 'Kunde' ? lfFahrtenText_(data.customer, 120) : '';
  return { date, parsedDate: d, reason, target, km, customer, requestId: data.requestId };
}

function lfFahrtSpeichern(data) {
  lfFahrtenOwner_();
  let v;
  try { v = lfFahrtenEingabe_(data); }
  catch (e) { return { saved: false, validationError: e.message }; }
  const fingerprint = JSON.stringify([v.date, v.reason, v.target, v.km, v.customer]);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) throw new Error('Speichern läuft bereits. Bitte gleich noch einmal versuchen.');
  try {
    const props = PropertiesService.getScriptProperties();
    const key = 'LF_FAHRTHANDY_V1_' + v.requestId;
    const saved = props.getProperty(key);
    if (saved) {
      const prior = JSON.parse(saved);
      if (prior.fingerprint !== fingerprint) throw new Error('Diese Eingabe wurde inzwischen geändert. Bitte als neue Fahrt erfassen.');
      if (prior.status !== 'saved') throw new Error('Der vorherige Speichervorgang ist unklar. Bitte zuerst im Fahrtenbuch prüfen; nicht nochmals als neue Fahrt absenden.');
      return { saved: true, duplicate: true, date: v.date, target: v.target, km: v.km };
    }
    const sheet = lfFahrtenBlatt_();
    props.setProperty(key, JSON.stringify({ status: 'pending', fingerprint }));
    // Zeitstempel intern; keine Notiz. Bestehende Einträge bleiben unverändert.
    const row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, 7).setValues([[new Date(), v.parsedDate, v.target, v.reason, v.customer, '', v.km]]);
    SpreadsheetApp.flush();
    props.setProperty(key, JSON.stringify({ status: 'saved', fingerprint, row }));
    return { saved: true, date: v.date, target: v.target, km: v.km };
  } finally { lock.releaseLock(); }
}
