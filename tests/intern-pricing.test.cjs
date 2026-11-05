const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');
const assert = require('node:assert/strict');

// Exercise the actual calculator embedded in /intern, without Firebase or the DOM.
const html = readFileSync('public/intern.html', 'utf8');
const source = html.slice(html.indexOf('const P = {'), html.indexOf('const positionsText ='));
function calculate(overrides = {}) {
  const context = vm.createContext({ overrides });
  vm.runInContext(source + `
    calc = { ...emptyCalc(), plates: [
      { ...newPlate(), g1: '100', h: '1', mal: 1 },
      { ...newPlate(), g1: '300', h: '3', mal: 1 }
    ], handling: '0', minStk: '0', pausch: '0', ...overrides };
    result = compute();`, context);
  return context.result;
}
test('order-wide rework follows cost ratio, not quantity, and is counted once', () => {
  const base = calculate();
  const result = calculate({ nach: '60', arbeit: '40' });
  assert.equal(result.positionen.length, 2);
  assert.equal(result.positionen[0].summe, base.positionen[0].summe + 10);
  assert.equal(result.positionen[1].summe, base.positionen[1].summe + 30);
  assert.equal(result.gesamt, base.gesamt + 40);
  assert.equal(result.nacharbeit, 40);
});
test('zero time or zero rate leaves prices unchanged; default rate and decimal input work', () => {
  const base = calculate();
  assert.equal(calculate({ nach: '0', arbeit: '70' }).gesamt, base.gesamt);
  assert.equal(calculate({ nach: '60', arbeit: '0' }).gesamt, base.gesamt);
  assert.equal(calculate({ nach: '60' }).gesamt, base.gesamt + 30);
  assert.equal(calculate({ nach: '30', arbeit: '40,8' }).gesamt, Math.round((base.gesamt + 20.4) * 100) / 100);
  assert.equal(calculate({ nach: '-1' }), null);
});
test('quantities, discounts, minimums, extras, CAD and fee modes retain consistent totals', () => {
  for (const pauschInPreis of [false, true]) {
    const result = calculate({ nach: '17', arbeit: '37', cad: '20', pausch: '3',
      handling: '0,5', minStk: '2', pauschInPreis, extras: { verpackung: 2 },
      plates: [{ mat1: 'PLA', g1: '1', h: '0', m: '1', teile: 1, mal: 25 }] });
    const print = result.positionen[0];
    assert.equal(print.rabattP, 10);
    assert.ok(result.minAufschlag > 0);
    assert.equal(print.summe, Math.round(print.einzel * print.menge * 100) / 100);
    assert.equal(result.positionen.length, pauschInPreis ? 2 : 3);
    assert.equal(result.gesamt, Math.round(result.positionen.reduce((a, x) => a + x.summe, 0) * 100) / 100);
    const expected = 50 + 0.6 + (pauschInPreis ? 3 : 0) + 17 / 60 * 37;
    assert.ok(print.summe >= expected - 0.0001);
    assert.ok(print.summe - expected < print.menge * 0.01);
  }
});
