const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const moduleScope = { exports: {} };
const code = ts.transpileModule(fs.readFileSync('src/analytics.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
vm.runInNewContext(code, { exports: moduleScope.exports });
const { inquirySuccessPath } = moduleScope.exports;

test('conversion paths contain only fixed public entry pages', () => {
  assert.equal(inquirySuccessPath('/'), '/anfrage-erfolgreich/startseite');
  assert.equal(inquirySuccessPath('/cad-konstruktion/'), '/anfrage-erfolgreich/cad-konstruktion');
  assert.equal(inquirySuccessPath('/3d-druck'), '/anfrage-erfolgreich/3d-druck');
});
test('conversion paths strip private query and fragment contents', () => {
  const path = inquirySuccessPath('/kontakt?email=privat@example.invalid#Kundenname');
  assert.equal(path, '/anfrage-erfolgreich/kontakt');
  assert.doesNotMatch(path, /email|privat|Kundenname/);
});
test('unknown and internal entry paths never enter analytics', () => {
  for (const path of ['/intern', '/kunde/privat', 'https://evil.invalid/3d-druck', '/3d-druck/privat']) {
    assert.equal(inquirySuccessPath(path), '/anfrage-erfolgreich/sonstige');
  }
});
