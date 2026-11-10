const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');

// Execute the actual routes/library with in-memory Redis and HTTP/email doubles.
// No real CRM records, mail, credentials or external connections.
function fixture() {
  const values = new Map(), calls = [], emails = [], cache = new Map();
  let contact = true, failure = '', contactsCreated = 0, dealsCreated = 0;
  class Redis {
    async get(k) { return values.get(k) ?? null; }
    async set(k, v, options) { if (options?.nx && values.has(k)) return null; values.set(k, v); return 'OK'; }
    async eval(script, keys, args) {
      if (script.includes('INCR')) { const n = (values.get(keys[0]) || 0) + 1; values.set(keys[0], n); return n; }
      if (script.includes('SCARD')) {
        const ids = values.get(keys[0]) || new Set();
        if (ids.has(args[0])) return ids.size;
        if (ids.size >= 5) return 6;
        ids.add(args[0]); values.set(keys[0], ids); return ids.size;
      }
      if (values.get(keys[0]) === args[0]) values.delete(keys[0]);
      return 1;
    }
  }
  const env = { TURNSTILE_SECRET_KEY: 'test-secret', HUBSPOT_TOKEN: 'fake', KV_REST_API_URL: 'https://fake', KV_REST_API_TOKEN: 'fake', RESEND_API_KEY: 'fake' };
  const fetch = async (url, options = {}) => {
    if (url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
      if (failure === 'turnstile-network') throw new Error('offline');
      return { ok: true, json: async () => ({
        success: failure !== 'turnstile-invalid', hostname: failure === 'turnstile-host' ? 'evil.example' : 'layer-form.de',
        action: failure === 'turnstile-action' ? 'login' : 'website_inquiry',
      }) };
    }
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ url, method: options.method, body });
    let data = {}, status = 200;
    if (url.includes('/contacts/') && options.method === 'GET') {
      if (failure === 'search') status = 500;
      else if (contact) data = { id: 'contact-1' }; else status = 404;
    } else if (url.endsWith('/contacts')) {
      contactsCreated++;
      if (failure === 'contact-conflict') { status = 409; contact = true; }
      else { data = { id: 'contact-1' }; contact = true; }
    } else if (url.endsWith('/deals/search')) data = { total: 2 };
    else if (url.endsWith('/deals')) {
      dealsCreated++;
      if (failure === 'timeout') throw new Error('ambiguous timeout');
      data = { id: 'deal-' + dealsCreated };
    } else if (url.endsWith('/notes')) { if (failure === 'note') status = 500; else data = { id: 'note-1' }; }
    else throw new Error('Unexpected request: ' + url);
    return { ok: status < 400, status, text: async () => JSON.stringify(data) };
  };
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const module = { exports: {} }; cache.set(file, module.exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const localRequire = name => {
      if (name === '@upstash/redis') return { Redis };
      if (name === 'resend') return { Resend: class { emails = { send: async (mail) => { emails.push(mail); if (failure === 'mail') throw new Error('mail'); return { error: null }; } }; } };
      if (name.startsWith('.')) return load(path.resolve(path.dirname(file), name.replace(/\.js$/, '.ts')));
      return require(name);
    };
    vm.runInNewContext(`(function(require,module,exports){${code}\n})`, { process: { env }, fetch, console: { error() {}, warn() {} }, Buffer, URL, AbortSignal, FormData, Blob, setTimeout })(localRequire, module, module.exports);
    return module.exports;
  }
  const requestId = '11111111-1111-4111-8111-111111111111';
  const body = { turnstileToken: 'fake-token', requestId, via: 'email', name: 'TEST Integration', email: 'TEST@example.com', message: 'TEST Anfrage ohne echte Kundendaten', text: 'TEST Anfrage', street: 'Testweg 1', zip: '12345', city: 'Teststadt' };
  const invoke = async (route = 'kontakt', overrides = {}, headers = {}) => {
    const res = { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(data) { this.data = data; return this; } };
    await load('api/' + route + '.ts').default({ method: 'POST', headers: { 'content-type': 'application/json', host: 'layer-form.de', origin: 'https://layer-form.de', ...headers }, socket: {}, body: { ...body, ...overrides } }, res);
    return res;
  };
  return { invoke, values, calls, emails, load, env, body, setContact(v) { contact = v; }, fail(v) { failure = v; }, get counts() { return { contactsCreated, dealsCreated }; } };
}

test('existing contact: one associated new inquiry, full text in deal, no marketing writes or business email', async () => {
  const f = fixture();
  assert.equal((await f.invoke()).code, 200);
  const deal = f.calls.find(c => c.url.endsWith('/deals'));
  assert.equal(deal.body.associations[0].to.id, 'contact-1');
  assert.equal(deal.body.properties.dealstage, '6212936899');
  assert.match(deal.body.properties.description, /TEST Anfrage/);
  assert.equal(f.counts.contactsCreated, 0);
  assert.equal(f.emails.length, 1);
  assert.equal(f.emails[0].to, f.body.email);
  assert.ok(!JSON.stringify(f.calls).match(/marketing|subscription|legal_basis/i));
});
test('new contact is created by normalized email', async () => {
  const f = fixture(); f.setContact(false);
  assert.equal((await f.invoke()).code, 200);
  assert.equal(f.counts.contactsCreated, 1);
  assert.equal(f.calls.find(c => c.url.endsWith('/contacts')).body.properties.email, 'test@example.com');
});
test('contact creation race recovers 409 by email', async () => {
  const f = fixture(); f.setContact(false); f.fail('contact-conflict');
  assert.equal((await f.invoke()).code, 200);
  assert.equal(f.counts.dealsCreated, 1);
});
test('contact read failure aborts instead of creating a duplicate or sending mail', async () => {
  const f = fixture(); f.fail('search');
  assert.equal((await f.invoke()).code, 502);
  assert.deepEqual(f.counts, { contactsCreated: 0, dealsCreated: 0 });
  assert.equal(f.emails.length, 0);
});
test('same ID retries reuse deal and do not resend confirmation', async () => {
  const f = fixture(); await f.invoke();
  const retry = await f.invoke();
  assert.equal(retry.code, 200); assert.equal(retry.data.duplicate, true);
  assert.equal(f.counts.dealsCreated, 1); assert.equal(f.emails.length, 1);
});
test('new inquiry from same email gets a new deal', async () => {
  const f = fixture(); await f.invoke(); await f.invoke('kontakt', { requestId: '22222222-2222-4222-8222-222222222222' });
  assert.equal(f.counts.dealsCreated, 2);
});
test('same ID with changed content is rejected', async () => {
  const f = fixture(); await f.invoke();
  assert.equal((await f.invoke('kontakt', { message: 'Andere echte neue Anfrage' })).code, 409);
  assert.equal(f.counts.dealsCreated, 1);
});
test('concurrent retries create exactly one deal', async () => {
  const f = fixture(); const results = await Promise.all([f.invoke(), f.invoke()]);
  assert.deepEqual(results.map(r => r.code).sort(), [200, 409]);
  assert.equal(f.counts.dealsCreated, 1);
});
test('ambiguous write stays blocked even after lock expires; never falls back to email', async () => {
  const f = fixture(); f.fail('timeout');
  assert.equal((await f.invoke()).code, 409);
  for (const k of f.values.keys()) if (k.endsWith(':lock')) f.values.delete(k);
  f.fail('');
  assert.equal((await f.invoke()).code, 409);
  assert.equal(f.counts.dealsCreated, 1); assert.equal(f.emails.length, 0);
});
test('note or confirmation failure cannot turn persisted deal into failure', async () => {
  for (const failure of ['note', 'mail']) {
    const f = fixture(); f.fail(failure);
    assert.equal((await f.invoke()).code, 200);
    assert.equal((await f.invoke()).code, 200);
    assert.equal(f.counts.dealsCreated, 1);
  }
});
test('calculator uses same safe delivery and no internal email', async () => {
  const f = fixture();
  assert.equal((await f.invoke('anfrage')).code, 200);
  assert.equal((await f.invoke('anfrage')).code, 200);
  assert.equal(f.counts.dealsCreated, 1); assert.equal(f.emails.length, 1);
  assert.equal(f.emails[0].to, f.body.email);
});
test('missing token or Redis fails closed', async () => {
  for (const key of ['HUBSPOT_TOKEN', 'KV_REST_API_TOKEN']) {
    const f = fixture(); delete f.env[key];
    assert.equal((await f.invoke()).code, 503);
    assert.equal(f.counts.dealsCreated, 0); assert.equal(f.emails.length, 0);
  }
});
test('reject invalid ID, cross origin, WhatsApp backend submission and malformed calculator plates safely', async () => {
  const f = fixture();
  assert.equal((await f.invoke('kontakt', { requestId: '' })).code, 400);
  assert.equal((await f.invoke('kontakt', {}, { origin: 'https://evil.example' })).code, 403);
  assert.equal((await f.invoke('kontakt', { via: 'whatsapp' })).code, 400);
  assert.equal((await f.invoke('anfrage', { plates: [null, { items: [null] }] })).code, 200);
});

test('contact form maps selected filament to the dedicated deal material without duplicate retries', async () => {
  for (const [filament, expected] of [['PLA', 'pla'], ['PETG', 'petg'], ['ASA', 'asa'], ['ABS', 'abs'], ['TPU', 'tpu'], ['Auf Anfrage', 'offen'], ['', 'offen'], ['Unbekannt', 'offen']]) {
    const f = fixture();
    assert.equal((await f.invoke('kontakt', { filament })).code, 200);
    const deal = f.calls.find(c => c.url.endsWith('/deals'));
    assert.equal(deal.body.properties.lf_material, expected);
    assert.equal((await f.invoke('kontakt', { filament })).data.duplicate, true);
    assert.equal(f.counts.dealsCreated, 1);
  }
});
test('calculator material mapping remains unchanged', async () => {
  const f = fixture();
  assert.equal((await f.invoke('anfrage', { material: 'PETG HF' })).code, 200);
  assert.equal(f.calls.find(c => c.url.endsWith('/deals')).body.properties.lf_material, 'petg');
});

test('failed, missing or wrong-site Turnstile prevents every CRM write', async () => {
  for (const failure of ['turnstile-invalid', 'turnstile-host', 'turnstile-action', 'turnstile-network']) {
    const f = fixture(); f.fail(failure);
    assert.equal((await f.invoke()).code, failure === 'turnstile-network' ? 503 : 400);
    assert.equal(f.counts.dealsCreated, 0);
    assert.equal(f.counts.contactsCreated, 0);
    assert.equal(f.emails.length, 0);
  }
  const f = fixture();
  assert.equal((await f.invoke('kontakt', { turnstileToken: '' })).code, 400);
  delete f.env.TURNSTILE_SECRET_KEY;
  assert.equal((await f.invoke()).code, 503);
  assert.equal(f.counts.dealsCreated, 0);
});
test('five new inquiry IDs allowed, sixth blocked, same-ID retry still succeeds', async () => {
  const f = fixture();
  for (let i = 1; i <= 5; i++) {
    assert.equal((await f.invoke('kontakt', { requestId: String(i).repeat(8) + '-1111-4111-8111-111111111111' })).code, 200);
  }
  assert.equal((await f.invoke('kontakt', { requestId: '66666666-1111-4111-8111-111111111111' })).code, 429);
  assert.equal((await f.invoke('kontakt', { requestId: '11111111-1111-4111-8111-111111111111' })).code, 200);
  assert.equal(f.counts.dealsCreated, 5);
});
test('fresh challenge tokens do not change the persisted inquiry fingerprint', async () => {
  const f = fixture();
  assert.equal((await f.invoke('kontakt', { turnstileToken: 'first' })).code, 200);
  assert.equal((await f.invoke('kontakt', { turnstileToken: 'second' })).data.duplicate, true);
  assert.equal(f.counts.dealsCreated, 1);
});

test('deal titles contain only service names while full customer information and retry identity stay intact', async () => {
  for (const [route, input, expected] of [
    ['kontakt', { topics: ['Ersatzteil'], name: 'Alex Beispiel', nachname: 'Beispiel' }, 'Ersatzteil'],
    ['kontakt', { topics: [], name: 'Alex Beispiel', nachname: 'Beispiel' }, '3D-Druck'],
    ['kontakt', { topics: ['Unbekannt mit Kundennamen'], company: 'Kundenfirma', type: 'unternehmen' }, '3D-Druck'],
    ['anfrage', { name: 'Alex Beispiel', material: 'PETG' }, '3D-Druck'],
  ]) {
    const f = fixture();
    assert.equal((await f.invoke(route, input)).code, 200);
    const deal = f.calls.find(c => c.url.endsWith('/deals')).body;
    assert.equal(deal.properties.dealname, expected);
    assert.equal(deal.associations[0].to.id, 'contact-1');
    assert.equal((await f.invoke(route, input)).data.duplicate, true);
    assert.equal(f.counts.dealsCreated, 1);
  }
});
