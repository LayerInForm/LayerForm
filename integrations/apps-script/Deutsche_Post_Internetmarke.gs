/**
 * Internetmarke REST 1.30; separat vom DHL-Paketpfad, ohne Zeittrigger.
 * Vertrag: developer.dhl.com/sites/default/files/2025-10/pp-post-internetmarke.yaml
 * Produkt-/Druckformatdaten müssen vor Freigabe aus dem offiziellen Katalog
 * geprüft und in LF_POST_AUFTRAG_JSON hinterlegt werden (siehe docs/versand.md).
 * Kein automatisches Aufladen, keine Versandmail, keine Phasenänderung.
 */
const LF_POST_API = 'https://api-eu.dhl.com/post/de/shipping/im/v1';
const LF_POST_SECRET_KEYS = ['LF_POST_CLIENT_ID', 'LF_POST_CLIENT_SECRET', 'LF_POST_USERNAME', 'LF_POST_PASSWORD'];

function lfPostKonfigurationPruefen() {
  const s = PropertiesService.getScriptProperties();
  const result = { modus: 'NUR_LOKALE_KONFIGURATION', zugangVollstaendig: LF_POST_SECRET_KEYS.every(k => Boolean(s.getProperty(k))), auftragKonfiguriert: Boolean(s.getProperty('LF_POST_AUFTRAG_JSON')), kaufFreigegeben: Boolean(s.getProperty('LF_POST_KAUFFREIGABE')), helferVorhanden: typeof hs_ === 'function' && typeof LF_DHL_SENDER === 'object' };
  console.log(JSON.stringify(result));
  return result;
}

function lfPostJson_(path, method, body, token) {
  const options = { method, muteHttpExceptions: true, followRedirects: false, headers: { Accept: 'application/json' } };
  if (token) options.headers.Authorization = 'Bearer ' + token;
  if (body) { options.contentType = 'application/json; charset=UTF-8'; options.payload = JSON.stringify(body); }
  let response;
  try { response = UrlFetchApp.fetch(LF_POST_API + path, options); }
  catch (_) { throw new Error('Internetmarke-Verbindung unklar; bei Kauf Journal prüfen, nicht erneut frankieren.'); }
  if (response.getResponseCode() !== 200) throw new Error('Internetmarke HTTP ' + response.getResponseCode() + '; Freigabe/Zugang prüfen. Keine automatische Wiederholung.');
  try { return JSON.parse(response.getContentText()); }
  catch (_) { throw new Error('Internetmarke-Antwort nicht lesbar; bei Kauf Journal prüfen.'); }
}

function lfPostAuthentifizieren_() {
  const s = PropertiesService.getScriptProperties();
  if (!LF_POST_SECRET_KEYS.every(k => s.getProperty(k))) throw new Error('Internetmarke-Zugang fehlt; DHL-Paketschlüssel wird nicht ersatzweise verwendet.');
  const values = { grant_type: 'client_credentials', client_id: s.getProperty('LF_POST_CLIENT_ID'), client_secret: s.getProperty('LF_POST_CLIENT_SECRET'), username: s.getProperty('LF_POST_USERNAME'), password: s.getProperty('LF_POST_PASSWORD') };
  const payload = Object.keys(values).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(values[k])).join('&');
  let r;
  try { r = UrlFetchApp.fetch(LF_POST_API + '/user', { method: 'post', contentType: 'application/x-www-form-urlencoded; charset=UTF-8', payload, muteHttpExceptions: true, followRedirects: false }); }
  catch (_) { throw new Error('Internetmarke-Anmeldung nicht erreichbar.'); }
  if (r.getResponseCode() !== 200) throw new Error('Internetmarke-Anmeldung HTTP ' + r.getResponseCode() + '; bei 401 auch Portokasse → Meine Daten → Geschäftsanwendungen prüfen.');
  let data;
  try { data = JSON.parse(r.getContentText()); } catch (_) { throw new Error('Ungültige Anmeldeantwort.'); }
  if (!data.access_token || !Number.isFinite(data.walletBalance)) throw new Error('Token oder Portokassenstand fehlt.');
  return { token: data.access_token, balance: data.walletBalance };
}

// Erst nach Hinterlegung der separat freigegebenen Internetmarke-Zugänge starten.
// Der erste Tokenabruf kann eine Freigabemail des Anbieters auslösen.
function lfPostZugangPruefen() {
  lfPostAuthentifizieren_();
  console.log('Internetmarke-Anmeldung erfolgreich. Keine Marke gekauft, keine Kontodaten protokolliert.');
}

function lfPostDruckformateLesen() {
  const auth = lfPostAuthentifizieren_();
  // Nur explizit manuell aufrufen; Rückgabe nicht ungefiltert protokollieren.
  return lfPostJson_('/app/catalog?types=PAGE_FORMATS', 'get', null, auth.token);
}

function lfPostAdresse_(p) {
  const address = { name: String(p.name || '').trim(), addressLine1: String(p.addressLine1 || '').trim(), postalCode: String(p.postalCode || '').trim(), city: String(p.city || '').trim(), country: 'DEU' };
  if (!address.name || address.name.length > 50 || !address.addressLine1 || address.addressLine1.length > 50 || !/^\d{5}$/.test(address.postalCode) || !address.city || address.city.length > 40 || /packstation|postfiliale|paketshop/i.test(address.addressLine1) || /[\r\n]/.test(Object.values(address).join(''))) throw new Error('Vollständige deutsche Straßenadresse erforderlich.');
  return address;
}

function lfPostKontext_(allowExpiredTariff) {
  const settings = PropertiesService.getScriptProperties();
  let a;
  try { a = JSON.parse(settings.getProperty('LF_POST_AUFTRAG_JSON') || 'null'); } catch (_) { throw new Error('Auftragskonfiguration ist kein gültiges JSON.'); }
  if (!a || !/^\d+$/.test(String(a.dealId))) throw new Error('Konkreten Warensendungsauftrag konfigurieren.');
  if (!Number.isInteger(a.productCode) || a.productCode < 1 || !Number.isInteger(a.priceCents) || a.priceCents < 1 || !Number.isInteger(a.pageFormatId) || a.pageFormatId < 1 || a.productName !== 'WARENSENDUNG') throw new Error('Geprüfter Warensendungs-Produktcode, Centpreis und Druckformat fehlen.');
  const now = Date.now(), checked = Date.parse(a.checkedAt), until = Date.parse(a.validUntil);
  if (!allowExpiredTariff && (!Number.isFinite(checked) || checked > now || now - checked > 86400000 || !Number.isFinite(until) || until <= now || until - checked > 86400000)) throw new Error('Produkt-/Preisfreigabe abgelaufen; offiziellen Tarif erneut prüfen (maximal 24 Stunden).');
  const dimensions = a.dimensionsMm;
  if (!Array.isArray(dimensions) || dimensions.length !== 3 || !dimensions.every(v => Number.isFinite(v) && v > 0) || !Number.isFinite(a.weightGrams) || a.weightGrams <= 0 || a.weightGrams > 1000) throw new Error('Verpacktes Gewicht oder Außenmaße fehlen/überschritten.');
  const sorted = dimensions.slice().sort((x, y) => y - x);
  if (sorted[0] < 100 || sorted[1] < 70 || sorted[0] > 353 || sorted[1] > 250 || sorted[2] > 50) throw new Error('Format ist keine unterstützte Warensendung.');
  const fields = ['pipeline', 'dealstage', 'lf_dhl_produkt', 'lf_versanddienstleister', 'lf_empfaenger', 'lf_strasse', 'lf_plz', 'lf_ort', 'lf_sendungsnummer', 'lf_dhl_link', 'lf_dhl_warenkorb_id', 'lf_dhl_warenkorb_url'];
  const deal = hs_('get', '/crm/v3/objects/deals/' + a.dealId + '?properties=' + fields.join(','));
  const p = deal.properties || {};
  if (p.pipeline !== 'default' || p.dealstage !== '6212936902' || p.lf_dhl_produkt !== 'WARENSENDUNG' || !['dhl', 'deutsche_post'].includes(p.lf_versanddienstleister)) throw new Error('Nur bezahlte Warensendungsaufträge in der Standardpipeline werden unterstützt.');
  if (p.lf_sendungsnummer || p.lf_dhl_warenkorb_id || p.lf_dhl_warenkorb_url) throw new Error('Bestehende Frankierung/Sendungsnummer vorhanden.');
  const receiver = lfPostAdresse_({ name: p.lf_empfaenger, addressLine1: p.lf_strasse, postalCode: p.lf_plz, city: p.lf_ort });
  const sender = lfPostAdresse_({ name: LF_DHL_SENDER.name2, addressLine1: LF_DHL_SENDER.street + ' ' + LF_DHL_SENDER.streetNumber, postalCode: LF_DHL_SENDER.plz, city: LF_DHL_SENDER.city });
  const fingerprint = JSON.stringify({ dealId: String(a.dealId), productCode: a.productCode, priceCents: a.priceCents, pageFormatId: a.pageFormatId, weightGrams: a.weightGrams, dimensionsMm: dimensions, sender, receiver });
  return { settings, a, p, sender, receiver, fingerprint, journalKey: 'LF_POST_LABEL_V1_' + a.dealId };
}

function lfPostVorpruefen() {
  const ctx = lfPostKontext_();
  console.log(JSON.stringify({ modus: 'NUR_LESEN', adresseGueltig: true, formatGueltig: true, produkt: 'WARENSENDUNG', preisCent: ctx.a.priceCents, journalVorhanden: Boolean(ctx.settings.getProperty(ctx.journalKey)) }));
}

function lfPostLinkGueltig_(url) {
  return typeof url === 'string' && /^https:\/\/(?:[a-z0-9-]+\.)*(?:deutschepost\.de|dhl\.com|dhl\.de)\//i.test(url) && url.length < 2000 && !/[\r\n]/.test(url);
}

function lfPostInsCrm_(ctx, saved) {
  if (!saved.shopOrderId || !lfPostLinkGueltig_(saved.link)) throw new Error('Nicht freigegebener Labelhost; Journal manuell prüfen, keinen erneuten Kauf starten.');
  // Vor CRM-Schreiben aktuellen Auftrag und Adresse nochmals prüfen.
  const fresh = lfPostKontext_(true);
  if (fresh.fingerprint !== saved.fingerprint) throw new Error('Auftrag/Adresse seit Kauf geändert; vorhandene Marke manuell prüfen.');
  if (fresh.p.lf_dhl_link && fresh.p.lf_dhl_link !== saved.link) throw new Error('Anderen Versandlink nicht überschreiben.');
  hs_('patch', '/crm/v3/objects/deals/' + ctx.a.dealId, { properties: { lf_dhl_link: saved.link } });
  // voucherId ist KEINE Paket-Sendungsnummer; keine automatische Versandmail.
}

function lfPostMarkeKaufen() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) throw new Error('Andere Versandverarbeitung läuft.');
  try {
    const ctx = lfPostKontext_(true);
    const old = ctx.settings.getProperty(ctx.journalKey);
    if (old) {
      const saved = JSON.parse(old);
      if (saved.phase !== 'purchased' || saved.fingerprint !== ctx.fingerprint) throw new Error('Früherer Kauf unklar oder Auftrag geändert; kein automatischer Zweitkauf.');
      lfPostInsCrm_(ctx, saved);
      return;
    }
    lfPostKontext_(); // Frische Tarifprüfung nur vor einem neuen Kauf.
    if (ctx.p.lf_dhl_link) throw new Error('Versandlink vorhanden; vorhandene Frankierung zuerst prüfen.');
    // Einmalige ausdrückliche Kaufentscheidung nach Prüfung von Auftrag und Tarif.
    if (ctx.settings.getProperty('LF_POST_KAUFFREIGABE') !== String(ctx.a.dealId) + ':' + ctx.a.priceCents) throw new Error('Kauffreigabe für genau diesen Auftrag und Centpreis fehlt.');
    const auth = lfPostAuthentifizieren_();
    if (auth.balance < ctx.a.priceCents) throw new Error('Portokasse reicht nicht aus. Keine automatische Aufladung.');
    const body = { type: 'AppShoppingCartPDFRequest', total: ctx.a.priceCents, createManifest: false, createShippingList: '0', dpi: 'DPI300', pageFormatId: ctx.a.pageFormatId, positions: [{ productCode: ctx.a.productCode, address: { sender: ctx.sender, receiver: ctx.receiver }, voucherLayout: 'ADDRESS_ZONE', positionType: 'AppShoppingCartPDFPosition', position: { labelX: 1, labelY: 1, page: 1 } }] };
    ctx.settings.setProperty(ctx.journalKey, JSON.stringify({ phase: 'pending', fingerprint: ctx.fingerprint, at: new Date().toISOString() }));
    ctx.settings.deleteProperty('LF_POST_KAUFFREIGABE');
    const receipt = lfPostJson_('/app/shoppingcart/pdf?directCheckout=true&validate=false', 'post', body, auth.token);
    // Antwort zuerst sichern, auch bei unvollständigem Provider-Ergebnis niemals neu kaufen.
    const saved = { phase: 'purchased', fingerprint: ctx.fingerprint, link: receipt.link || null, shopOrderId: receipt.shoppingCart && receipt.shoppingCart.shopOrderId || null, at: new Date().toISOString() };
    ctx.settings.setProperty(ctx.journalKey, JSON.stringify(saved));
    if (!saved.shopOrderId || !saved.link) throw new Error('Kaufergebnis unvollständig; Portokasse/Journal manuell prüfen.');
    lfPostInsCrm_(ctx, saved);
    console.log('Internetmarke im Deal verlinkt. Keine Versandmail und keine Phasenänderung.');
  } finally { lock.releaseLock(); }
}
