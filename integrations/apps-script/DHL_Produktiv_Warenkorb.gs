/**
 * Ergänzung für das bestehende LayerForm-Apps-Script-Projekt.
 * Benötigt hs_, LF_DHL_SENDER, LF_DHL_SUPPORTED, lfDhlSplitStreet_,
 * lfDhlReceiverFromDeal_, lfDhlExtractCart_ aus dem bestehenden Projekt.
 * Ausschließlich manuell starten; kein Trigger und keine automatische Zahlung.
 * ScriptProperties: DHL_PROD_API_KEY, LF_DHL_PROD_DEAL_ID.
 */
const LF_DHL_PROD_CART_API = 'https://api-eu.dhl.com/parcel/de/shipping/of/v1/public';

function lfDhlProduktivKonfigurationPruefen() {
  const settings = PropertiesService.getScriptProperties();
  const helper = typeof hs_ === 'function' && typeof lfDhlSplitStreet_ === 'function' && typeof lfDhlReceiverFromDeal_ === 'function' && typeof lfDhlExtractCart_ === 'function' && typeof LF_DHL_SENDER === 'object' && Array.isArray(LF_DHL_SUPPORTED);
  if (!helper) throw new Error('Bestehende LayerForm-Versandhelfer fehlen.');
  console.log(JSON.stringify({ modus: 'NUR_LESEN', versandhelferVorhanden: helper, produktivKeyVorhanden: Boolean(settings.getProperty('DHL_PROD_API_KEY')), auftragAusgewaehlt: Boolean(settings.getProperty('LF_DHL_PROD_DEAL_ID')) }));
}

function lfDhlProduktivKontext_() {
  const settings = PropertiesService.getScriptProperties();
  const dealId = String(settings.getProperty('LF_DHL_PROD_DEAL_ID') || '').trim();
  if (!/^\d+$/.test(dealId)) throw new Error('Zuerst einen konkreten DHL-Auftrag in LF_DHL_PROD_DEAL_ID festlegen.');
  const apiKey = settings.getProperty('DHL_PROD_API_KEY');
  if (!apiKey) throw new Error('DHL_PROD_API_KEY fehlt.');
  const fields = ['dealstage', 'lf_dhl_produkt', 'lf_versanddienstleister', 'lf_empfaenger', 'lf_strasse', 'lf_plz', 'lf_ort', 'lf_sendungsnummer', 'lf_dhl_warenkorb_id', 'lf_dhl_warenkorb_url'];
  const deal = hs_('get', '/crm/v3/objects/deals/' + dealId + '?properties=' + fields.join(','));
  const p = deal.properties || {};
  if (p.lf_dhl_produkt === 'WARENSENDUNG') throw new Error('Warensendung benötigt die separate Internetmarke-Anbindung.');
  if (LF_DHL_SUPPORTED.indexOf(p.lf_dhl_produkt) < 0) throw new Error('Kein unterstütztes DHL-Produkt ausgewählt.');
  if (p.lf_versanddienstleister !== 'dhl') throw new Error('Versanddienstleister muss ausdrücklich DHL sein.');
  if (String(p.dealstage) !== '6212936902') throw new Error('Auftrag ist nicht in der bezahlten Produktionsphase.');
  if (p.lf_sendungsnummer) throw new Error('Sendungsnummer vorhanden; keine weitere Frankierung erstellen.');
  if (!String(p.lf_empfaenger || '').trim() || !String(p.lf_ort || '').trim() || !/^\d{5}$/.test(String(p.lf_plz || ''))) throw new Error('Empfängeradresse unvollständig.');
  if (!lfDhlSplitStreet_(p.lf_strasse) || /packstation|postfiliale|paketshop/i.test(String(p.lf_strasse || ''))) throw new Error('Straßenadresse nicht eindeutig unterstützt.');
  return { dealId, apiKey, deal, settings, productCode: p.lf_dhl_produkt };
}

function lfDhlProduktivKatalogprodukt_(ctx) {
  const response = UrlFetchApp.fetch(LF_DHL_PROD_CART_API + '/catalog/current/products', {
    method: 'get', headers: { 'dhl-api-key': ctx.apiKey, Accept: 'application/json' }, muteHttpExceptions: true, followRedirects: false
  });
  if (response.getResponseCode() !== 200) throw new Error('DHL-Produktivkatalog nicht erreichbar.');
  const product = (JSON.parse(response.getContentText()).products || {})[ctx.productCode];
  if (!product || !(product.regions || []).some(r => (r.countries || []).indexOf('DEU') >= 0 && r.unavailable !== true)) throw new Error('Produkt nicht für Deutschland verfügbar.');
  return product;
}

function lfDhlProduktivVorpruefen() {
  const ctx = lfDhlProduktivKontext_();
  lfDhlProduktivKatalogprodukt_(ctx);
  const p = ctx.deal.properties;
  console.log(JSON.stringify({ modus: 'NUR_LESEN', adresseGueltig: true, produkt: ctx.productCode, bestehenderWarenkorb: Boolean(p.lf_dhl_warenkorb_id || p.lf_dhl_warenkorb_url), journalVorhanden: Boolean(ctx.settings.getProperty('LF_DHL_PROD_CART_V1_' + ctx.dealId)) }));
}

function lfDhlProduktivCartSpeichern_(ctx, cart) {
  if (!/^https:\/\/(?:www\.)?dhl\.de\//i.test(cart.url || '')) throw new Error('Keine vertrauenswürdige DHL-entryUrl; Journal prüfen, nicht neu erstellen.');
  const fresh = hs_('get', '/crm/v3/objects/deals/' + ctx.dealId + '?properties=lf_dhl_warenkorb_id,lf_dhl_warenkorb_url,lf_sendungsnummer').properties || {};
  if (fresh.lf_sendungsnummer) throw new Error('Zwischenzeitlich Sendungsnummer vorhanden; manuell prüfen.');
  if (fresh.lf_dhl_warenkorb_url && fresh.lf_dhl_warenkorb_url !== cart.url) throw new Error('Anderer Warenkorb im Deal; nicht überschreiben.');
  if (fresh.lf_dhl_warenkorb_id && fresh.lf_dhl_warenkorb_id !== cart.id) throw new Error('Andere Warenkorb-ID im Deal; nicht überschreiben.');
  const properties = { lf_dhl_warenkorb_url: cart.url, lf_dhl_link: cart.url };
  if (cart.id) properties.lf_dhl_warenkorb_id = cart.id;
  hs_('patch', '/crm/v3/objects/deals/' + ctx.dealId, { properties });
}

function lfDhlProduktivWarenkorbErstellen() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) throw new Error('Andere Versandverarbeitung läuft.');
  try {
    const ctx = lfDhlProduktivKontext_();
    const key = 'LF_DHL_PROD_CART_V1_' + ctx.dealId;
    const previous = ctx.settings.getProperty(key);
    if (previous) {
      const saved = JSON.parse(previous);
      if (saved.phase !== 'created' || !saved.cart) throw new Error('Unklarer früherer DHL-Aufruf; kein automatischer zweiter Warenkorb.');
      if (saved.productCode !== ctx.productCode) throw new Error('Produkt seit Warenkorberstellung geändert; manuell prüfen.');
      lfDhlProduktivCartSpeichern_(ctx, saved.cart);
      console.log('Vorhandenen Warenkorb abgeglichen; kein neuer DHL-POST.');
      return;
    }
    const p = ctx.deal.properties;
    if (p.lf_dhl_warenkorb_id || p.lf_dhl_warenkorb_url) throw new Error('Warenkorb vorhanden; keinen zweiten erstellen.');
    lfDhlProduktivKatalogprodukt_(ctx);
    const payload = JSON.stringify({ shoppingcart: {
      confirmation: { email: LF_DHL_SENDER.email },
      items: [{ type: 'ShipmentItem', product: { id: ctx.productCode }, address: { sender: LF_DHL_SENDER, receiver: lfDhlReceiverFromDeal_(ctx.deal) } }]
    } }).replace(/[\u007f-\uffff]/g, c => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4));
    ctx.settings.setProperty(key, JSON.stringify({ phase: 'writing', productCode: ctx.productCode, at: new Date().toISOString() }));
    const response = UrlFetchApp.fetch(LF_DHL_PROD_CART_API + '/shopping-carts/pre-paid', {
      method: 'post', headers: { 'dhl-api-key': ctx.apiKey, Accept: 'application/json' },
      contentType: 'application/json; charset=ISO-8859-1', payload, muteHttpExceptions: true, followRedirects: false
    });
    if (response.getResponseCode() !== 201) throw new Error('DHL-Warenkorb nicht bestätigt (HTTP ' + response.getResponseCode() + '); Journal vor Wiederholung prüfen.');
    const cart = lfDhlExtractCart_(JSON.parse(response.getContentText()));
    if (!cart.url || !/^https:\/\/(?:www\.)?dhl\.de\//i.test(cart.url)) throw new Error('Warenkorb möglicherweise erstellt, aber entryUrl fehlt; nicht erneut starten.');
    ctx.settings.setProperty(key, JSON.stringify({ phase: 'created', productCode: ctx.productCode, cart: { id: cart.id || null, url: cart.url }, at: new Date().toISOString() }));
    lfDhlProduktivCartSpeichern_(ctx, cart);
    console.log('Unbezahlter Produktiv-Warenkorb im Deal gespeichert. Keine Zahlung, Versandmail oder Phasenänderung.');
  } finally { lock.releaseLock(); }
}
