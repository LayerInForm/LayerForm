const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('integrations/apps-script/Deutsche_Post_Internetmarke.gs', 'utf8');
function fixture() {
  const a = { dealId: '123', productName: 'WARENSENDUNG', productCode: 999, priceCents: 321, pageFormatId: 99, weightGrams: 499, dimensionsMm: [170, 225, 20], checkedAt: new Date(Date.now() - 60000).toISOString(), validUntil: new Date(Date.now() + 3600000).toISOString() };
  const props = new Map([['LF_POST_AUFTRAG_JSON', JSON.stringify(a)], ['LF_POST_KAUFFREIGABE', '123:321'], ...['CLIENT_ID', 'CLIENT_SECRET', 'USERNAME', 'PASSWORD'].map(k => ['LF_POST_' + k, 'fake&+='])]);
  const p = { pipeline: 'default', dealstage: '6212936902', lf_dhl_produkt: 'WARENSENDUNG', lf_versanddienstleister: 'dhl', lf_empfaenger: 'TEST Empfänger', lf_strasse: 'Testweg 1', lf_plz: '12345', lf_ort: 'Teststadt' };
  const calls = []; let failure = '';
  const scope = { console: { log() {} }, LF_DHL_SENDER: { name2: 'TEST Absender', street: 'Testweg', streetNumber: '2', plz: '12345', city: 'Teststadt' },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => props.get(k) || null, setProperty: (k, v) => props.set(k, v), deleteProperty: k => props.delete(k) }) },
    LockService: { getScriptLock: () => ({ tryLock: () => failure !== 'lock', releaseLock() {} }) },
    hs_: (method, path, body) => { calls.push({ service: 'crm', method, path, body }); if (method === 'get') return { properties: { ...p } }; if (failure === 'crm') throw Error('CRM failure'); Object.assign(p, body.properties); return {}; },
    UrlFetchApp: { fetch: (url, options) => {
      calls.push({ service: 'post', url, options });
      const login = url.endsWith('/user');
      if (!login && failure === 'timeout') throw Error('timeout with credential-like text');
      if (!login && failure === 'changed') p.lf_strasse = 'Andere Straße 5';
      const data = login ? { access_token: 'fake-token', walletBalance: failure === 'balance' ? 0 : 500 } : { link: failure === 'host' ? 'https://dhl.de.evil.invalid/label' : 'https://internetmarke.deutschepost.de/label.pdf', shoppingCart: { shopOrderId: 'test-cart' } };
      return { getResponseCode: () => failure === 'auth' ? 401 : 200, getContentText: () => JSON.stringify(data) };
    } }
  };
  vm.createContext(scope); vm.runInContext(source, scope);
  return { a, p, props, calls, scope, fail(v) { failure = v; }, config() { props.set('LF_POST_AUFTRAG_JSON', JSON.stringify(a)); }, purchases() { return calls.filter(c => /shoppingcart\/pdf/.test(c.url || '')); } };
}
test('Warensendung: one paid POST, one-use approval, retry only synchronizes CRM', () => {
  const f = fixture(); f.scope.lfPostMarkeKaufen(); f.scope.lfPostMarkeKaufen();
  assert.equal(f.purchases().length, 1); assert.equal(f.props.has('LF_POST_KAUFFREIGABE'), false);
  const request = f.purchases()[0]; assert.match(request.url, /directCheckout=true&validate=false$/);
  const payload = JSON.parse(request.options.payload); assert.equal(payload.total, 321); assert.equal(payload.positions[0].position.page, 1); assert.equal(payload.shopOrderId, undefined);
  assert.equal(f.p.dealstage, '6212936902'); assert.equal(f.p.lf_sendungsnummer, undefined);
  assert.ok(f.calls.filter(c => c.method === 'patch').every(c => Object.keys(c.body.properties).join() === 'lf_dhl_link'));
  assert.ok(f.calls.every(c => !/wallet/.test(c.url || '')));
});
test('CRM partial failure recovers from receipt without second charge', () => {
  const f = fixture(); f.fail('crm'); assert.throws(() => f.scope.lfPostMarkeKaufen()); f.fail(''); f.scope.lfPostMarkeKaufen(); assert.equal(f.purchases().length, 1);
});
test('CRM recovery still works after the tariff approval expires', () => {
  const f = fixture(); f.fail('crm'); assert.throws(() => f.scope.lfPostMarkeKaufen());
  f.fail(''); f.a.checkedAt = '2020-01-01T00:00:00Z'; f.a.validUntil = '2020-01-02T00:00:00Z'; f.config();
  f.scope.lfPostMarkeKaufen(); assert.equal(f.purchases().length, 1); assert.ok(f.p.lf_dhl_link);
});
test('minimum Warensendung format works; undersized and overweight packages stop', () => {
  const f = fixture(); f.a.dimensionsMm = [100, 70, 5]; f.config(); f.scope.lfPostVorpruefen();
  for (const change of [f => f.a.dimensionsMm = [99, 70, 5], f => f.a.weightGrams = 1001]) {
    const b = fixture(); change(b); b.config(); assert.throws(() => b.scope.lfPostVorpruefen()); assert.equal(b.calls.length, 0);
  }
});
test('ambiguous timeout stays pending and cannot charge again', () => {
  const f = fixture(); f.fail('timeout'); assert.throws(() => f.scope.lfPostMarkeKaufen(), /Verbindung unklar/); f.fail(''); assert.throws(() => f.scope.lfPostMarkeKaufen(), /Zweitkauf/); assert.equal(f.purchases().length, 1);
});
test('untrusted label host cannot reach CRM or cause a retry charge', () => {
  const f = fixture(); f.fail('host'); assert.throws(() => f.scope.lfPostMarkeKaufen(), /Labelhost/); f.fail(''); assert.throws(() => f.scope.lfPostMarkeKaufen(), /Labelhost/); assert.equal(f.purchases().length, 1); assert.equal(f.p.lf_dhl_link, undefined);
});
test('address change during checkout preserves receipt but does not sync wrong label', () => {
  const f = fixture(); f.fail('changed'); assert.throws(() => f.scope.lfPostMarkeKaufen(), /Adresse seit Kauf/); f.fail(''); assert.throws(() => f.scope.lfPostMarkeKaufen(), /Zweitkauf/); assert.equal(f.purchases().length, 1);
});
test('missing approval, stale tariff, unsuitable dimensions, existing label or wrong phase prevent purchase', () => {
  for (const change of [f => f.props.delete('LF_POST_KAUFFREIGABE'), f => { f.a.checkedAt = '2020-01-01'; f.config(); }, f => { f.a.dimensionsMm = [170, 225, 51]; f.config(); }, f => f.p.lf_dhl_link = 'existing', f => f.p.dealstage = 'closedwon', f => f.p.lf_dhl_produkt = 'PAK02', f => f.p.lf_sendungsnummer = 'existing']) {
    const f = fixture(); change(f); assert.throws(() => f.scope.lfPostMarkeKaufen()); assert.equal(f.purchases().length, 0);
  }
});
test('separate credentials required; authentication failure and empty wallet never buy or refill', () => {
  for (const failure of ['auth', 'balance', 'missing']) {
    const f = fixture(); f.fail(failure); if (failure === 'missing') f.props.delete('LF_POST_CLIENT_SECRET');
    assert.throws(() => f.scope.lfPostMarkeKaufen()); assert.equal(f.purchases().length, 0); assert.equal(f.props.has('LF_POST_LABEL_V1_123'), false);
  }
  const f = fixture(); f.scope.lfPostZugangPruefen(); assert.match(f.calls[0].options.payload, /fake%26%2B%3D/);
});
test('local readiness and deal preflight do not authenticate, buy, write CRM or store a journal', () => {
  const f = fixture(); const before = JSON.stringify([...f.props]); f.scope.lfPostKonfigurationPruefen(); f.scope.lfPostVorpruefen(); assert.equal(f.calls.filter(c => c.service === 'post' || c.method === 'patch').length, 0); assert.equal(JSON.stringify([...f.props]), before);
});
test('script lock prevents concurrent purchases', () => {
  const f = fixture(); f.fail('lock'); assert.throws(() => f.scope.lfPostMarkeKaufen(), /Versandverarbeitung/); assert.equal(f.calls.length, 0);
});
