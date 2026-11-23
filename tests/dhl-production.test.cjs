const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('integrations/apps-script/DHL_Produktiv_Warenkorb.gs', 'utf8');
function fixture() {
  const props = new Map([['LF_DHL_PROD_DEAL_ID', '123'], ['DHL_PROD_API_KEY', 'fake']]);
  const p = { dealstage: '6212936902', lf_dhl_produkt: 'PAK02', lf_versanddienstleister: 'dhl', lf_empfaenger: 'TEST', lf_strasse: 'Testweg 1', lf_plz: '12345', lf_ort: 'Teststadt' };
  const calls = []; let failure = '';
  const scope = { console: { log() {} }, Date, JSON, String, Error, RegExp, encodeURIComponent,
    LF_DHL_SUPPORTED: ['PAK02'], LF_DHL_SENDER: { name2: 'TEST', email: 'test@example.invalid' },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => props.get(k) || null, setProperty: (k, v) => props.set(k, v) }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    lfDhlSplitStreet_: s => s ? { street: 'Testweg', streetNumber: '1' } : null,
    lfDhlReceiverFromDeal_: () => ({ name2: 'TEST' }),
    lfDhlExtractCart_: b => ({ id: b.shoppingcart.shoppingCartId, url: b.shoppingcart.download.entryUrl }),
    hs_: (method, path, body) => {
      calls.push({ service: 'hubspot', method, path, body });
      if (method === 'get') return { id: '123', properties: { ...p } };
      if (failure === 'crm') throw new Error('simulated CRM failure');
      Object.assign(p, body.properties); return {};
    },
    UrlFetchApp: { fetch: (url, options) => {
      calls.push({ service: 'dhl', method: options.method, url, options });
      if (options.method === 'get') return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ products: { PAK02: { regions: [{ countries: ['DEU'] }] } } }) };
      if (failure === 'timeout') throw new Error('simulated timeout');
      const entryUrl = failure === 'url' ? 'https://dhl.de.evil.invalid/cart' : 'https://www.dhl.de/cart?token=test';
      return { getResponseCode: () => 201, getContentText: () => JSON.stringify({ shoppingcart: { shoppingCartId: 'cart1', download: { entryUrl } } }) };
    } }
  };
  vm.createContext(scope); vm.runInContext(source, scope);
  return { scope, p, props, calls, fail(v) { failure = v; }, posts() { return calls.filter(c => c.service === 'dhl' && c.method === 'post'); } };
}
test('production cart: one unpaid POST, subsequent calls reuse journal, no payment/mail/stage mutation', () => {
  const f = fixture(); f.scope.lfDhlProduktivWarenkorbErstellen(); f.scope.lfDhlProduktivWarenkorbErstellen();
  assert.equal(f.posts().length, 1); assert.match(f.posts()[0].url, /^https:\/\/api-eu\.dhl\.com/);
  const cart = JSON.parse(f.posts()[0].options.payload).shoppingcart;
  assert.equal(cart.items[0].product.id, 'PAK02'); assert.equal(cart.confirmation.notifyUrl, undefined);
  assert.equal(f.p.dealstage, '6212936902'); assert.equal(f.p.lf_dhl_warenkorb_id, 'cart1');
  assert.ok(f.calls.filter(c => c.method === 'patch').every(c => Object.keys(c.body.properties).every(k => ['lf_dhl_warenkorb_id', 'lf_dhl_warenkorb_url', 'lf_dhl_link'].includes(k))));
});
test('CRM failure after cart creation recovers without a second DHL POST', () => {
  const f = fixture(); f.fail('crm'); assert.throws(() => f.scope.lfDhlProduktivWarenkorbErstellen());
  f.fail(''); f.scope.lfDhlProduktivWarenkorbErstellen(); assert.equal(f.posts().length, 1); assert.equal(f.p.lf_dhl_warenkorb_id, 'cart1');
});
test('ambiguous HTTP failure stays reserved and never automatically repeats the POST', () => {
  const f = fixture(); f.fail('timeout'); assert.throws(() => f.scope.lfDhlProduktivWarenkorbErstellen());
  f.fail(''); assert.throws(() => f.scope.lfDhlProduktivWarenkorbErstellen(), /Unklarer/); assert.equal(f.posts().length, 1);
});
test('untrusted entry URL cannot be saved or cause a second POST', () => {
  const f = fixture(); f.fail('url'); assert.throws(() => f.scope.lfDhlProduktivWarenkorbErstellen(), /entryUrl/);
  assert.equal(f.p.lf_dhl_link, undefined); assert.throws(() => f.scope.lfDhlProduktivWarenkorbErstellen(), /Unklarer/); assert.equal(f.posts().length, 1);
});
test('Warensendung never calls the DHL package API', () => {
  const f = fixture(); f.p.lf_dhl_produkt = 'WARENSENDUNG'; assert.throws(() => f.scope.lfDhlProduktivWarenkorbErstellen(), /Internetmarke/); assert.equal(f.calls.filter(c => c.service === 'dhl').length, 0);
});
test('missing deal, wrong carrier, missing address, tracking or existing cart prevent creation', () => {
  const cases = [f => f.props.delete('LF_DHL_PROD_DEAL_ID'), f => f.p.lf_versanddienstleister = '', f => f.p.lf_plz = '', f => f.p.lf_sendungsnummer = 'existing', f => f.p.lf_dhl_warenkorb_url = 'https://www.dhl.de/existing'];
  for (const change of cases) { const f = fixture(); change(f); assert.throws(() => f.scope.lfDhlProduktivWarenkorbErstellen()); assert.equal(f.posts().length, 0); }
});
test('preflight only reads, without journals, CRM writes or package creation', () => {
  const f = fixture(); f.scope.lfDhlProduktivVorpruefen(); assert.equal(f.posts().length, 0); assert.equal(f.props.size, 2); assert.equal(f.calls.filter(c => c.method === 'patch').length, 0);
});
