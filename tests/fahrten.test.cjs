const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync('integrations/apps-script/Fahrten_Handy.gs', 'utf8');
function fixture() {
  const settings = new Map([['LF_FAHRTEN_SPREADSHEET_ID', 'test-sheet']]);
  const writes = []; let error = ''; let active = 'owner@example.invalid';
  const sheet = { getLastRow: () => 31, getRange: (...range) => ({ getDisplayValues: () => [['Zeitstempel', 'Datum', 'Ziel', 'Anlass', 'Kunde', 'Notiz', 'Gefahrene km (hin + zurück)']], setValues(values) { writes.push({ range, values }); if (error === 'ambiguous') throw Error('ambiguous'); } }) };
  const scope = { console, Session: { getActiveUser: () => ({ getEmail: () => active }), getEffectiveUser: () => ({ getEmail: () => 'owner@example.invalid' }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => settings.get(k) || null, setProperty: (k, v) => settings.set(k, v) }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush() {} },
    Utilities: { parseDate: s => new Date(s + 'T12:00:00Z'), formatDate: (d, zone, format) => d.toISOString().slice(0, 10) },
    LockService: { getScriptLock: () => ({ tryLock: () => error !== 'lock', releaseLock() {} }) }
  };
  vm.createContext(scope); vm.runInContext(code, scope);
  const input = { requestId: 'test-request-1234567890', date: '2026-01-01', reason: 'Poststelle', target: 'ignored', km: '999' };
  return { scope, writes, settings, input, fail(v) { error = v; }, user(v) { active = v; } };
}
test('post shortcut enforces Bargteheide and five km; append never changes earlier rows or creates notes', () => {
  const f = fixture(); const r = f.scope.lfFahrtSpeichern(f.input);
  assert.equal(r.saved, true); assert.equal(f.writes.length, 1); assert.equal(f.writes[0].range[0], 32);
  const row = f.writes[0].values[0]; assert.equal(row[2], 'Bargteheide'); assert.equal(row[3], 'Poststelle'); assert.equal(row[5], ''); assert.equal(row[6], 5);
});
test('retry is idempotent; changed payload cannot reuse the saved request', () => {
  const f = fixture(); f.scope.lfFahrtSpeichern(f.input); assert.equal(f.scope.lfFahrtSpeichern(f.input).duplicate, true);
  assert.throws(() => f.scope.lfFahrtSpeichern({ ...f.input, date: '2026-01-02' }), /geändert/); assert.equal(f.writes.length, 1);
});
test('ambiguous write prevents automatic duplicate even when client retries', () => {
  const f = fixture(); f.fail('ambiguous'); assert.throws(() => f.scope.lfFahrtSpeichern(f.input)); f.fail('');
  assert.throws(() => f.scope.lfFahrtSpeichern(f.input), /unklar/); assert.equal(f.writes.length, 1);
});
test('only owner can read or save; lock prevents concurrent writes', () => {
  const f = fixture(); f.user('other@example.invalid'); assert.throws(() => f.scope.lfFahrtSpeichern(f.input), /eigenen/);
  f.user('owner@example.invalid'); f.fail('lock'); assert.throws(() => f.scope.lfFahrtSpeichern(f.input), /bereits/); assert.equal(f.writes.length, 0);
});
test('other trips need valid date, destination and distance; formula-like text is escaped', () => {
  const f = fixture(); for (const change of [{ reason: 'unknown' }, { date: '2099-01-01' }, { date: '2026-02-31' }, { reason: 'Kunde', target: '' }, { reason: 'Einkauf', km: '-2' }]) {
    assert.ok(f.scope.lfFahrtSpeichern({ ...f.input, ...change }).validationError); assert.equal(f.writes.length, 0);
  }
  const r = f.scope.lfFahrtSpeichern({ ...f.input, reason: 'Kunde', target: '=formula()', customer: '+customer', km: '12,5' });
  assert.equal(r.saved, true); const row = f.writes[0].values[0]; assert.equal(row[2], "'=formula()"); assert.equal(row[4], "'+customer"); assert.equal(row[6], 12.5);
});
