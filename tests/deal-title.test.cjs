const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const source = fs.readFileSync('api/_lib/deal-title.ts', 'utf8');
const code = stripTypeScriptTypes(source).replace('export function', 'function');
const { dealTitel } = vm.runInNewContext(code + '\n;({dealTitel})');
test('contact and company suffixes never enter deal titles', () => {
  assert.equal(dealTitel('kontakt', 'CAD-Konstruktion – Max Mustermann'), 'CAD-Konstruktion');
  assert.equal(dealTitel('kontakt', 'IT-Service – Beispiel GmbH'), 'IT-Service');
  assert.equal(dealTitel('kontakt', 'Anfrage – Max Mustermann'), '3D-Druck');
  assert.equal(dealTitel('kontakt', 'Sonstiges – Max Mustermann'), '3D-Druck');
  assert.equal(dealTitel('kontakt', 'Max Mustermann'), '3D-Druck');
});
test('calculator uses only validated material, never customer or filename', () => {
  assert.equal(dealTitel('anfrage', 'Preisrechner PETG – Mustermann', 'petg'), '3D-Druck – PETG');
  assert.equal(dealTitel('anfrage', 'Anfrage – Mustermann', 'pla;petg'), '3D-Druck – PLA / PETG');
  assert.equal(dealTitel('anfrage', 'Preisrechner – Mustermann', 'offen'), '3D-Druck');
});
