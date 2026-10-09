import React, { useEffect, useMemo, useState } from 'react';
import { CaretDown, Check, Copy, LockSimple, Minus, Plus, Trash, X } from '@phosphor-icons/react';
import {
  FILAMENT_PER_KG, MINDESTPREIS, MWST_HINWEIS, STROM_PRO_STUNDE, euro, kalkuliere, type FilamentId,
} from '../../src/pricing';
import { KALKULATION_PIN } from './config';

/* ---------- Hilfen ---------- */
type MatId = FilamentId | 'TPU';
const MATS: MatId[] = ['PLA', 'PETG', 'ABS', 'ASA', 'TPU'];
const PIN_KEY = 'lf-kalkulation-pin';
const HIST_KEY = 'lf-kalkulation-verlauf';

/** Komma und Punkt als Dezimaltrennzeichen, leere Eingabe = 0 */
const num = (s: string) => {
  let t = s.trim().replace(/\s/g, '');
  if (!t) return 0;
  if (t.includes(',') && t.includes('.')) t = t.replace(/\./g, '');
  const v = parseFloat(t.replace(',', '.'));
  return Number.isFinite(v) && v >= 0 ? v : NaN;
};
const storage = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* privater Modus */ } },
  del: (k: string) => { try { localStorage.removeItem(k); } catch { /* egal */ } },
};

interface Inputs {
  mat1: MatId; tpu1: string; g1: string; h: string; m: string;
  multi: boolean; mat2: MatId; tpu2: string; g2: string; purge: string;
  qty: string; surcharge: string;
}
const EMPTY: Inputs = {
  mat1: 'PLA', tpu1: '', g1: '', h: '', m: '',
  multi: false, mat2: 'PETG', tpu2: '', g2: '', purge: '',
  qty: '1', surcharge: '',
};
interface HistoryEntry { id: number; ts: number; label: string; inputs: Inputs; gesamt: number; proStueck: number }

/* ---------- Seite für die App-Installation vorbereiten ---------- */
function usePageMeta() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'LayerForm Kalkulation';
    const added: HTMLElement[] = [];
    const meta = (name: string, content: string) => {
      const el = document.createElement('meta'); el.name = name; el.content = content;
      document.head.appendChild(el); added.push(el);
    };
    meta('robots', 'noindex, nofollow');
    meta('apple-mobile-web-app-capable', 'yes');
    meta('mobile-web-app-capable', 'yes');
    meta('apple-mobile-web-app-title', 'Kalkulation');
    meta('apple-mobile-web-app-status-bar-style', 'black-translucent');
    // eigenes Manifest nur für diese Ansicht, das Manifest der Website bleibt unverändert
    const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    const prevManifest = link?.getAttribute('href') ?? null;
    link?.setAttribute('href', '/kalkulation.webmanifest');
    return () => {
      document.title = prevTitle;
      added.forEach((el) => el.remove());
      if (link && prevManifest) link.setAttribute('href', prevManifest);
    };
  }, []);
}

/* ---------- Bausteine ---------- */
const Field: React.FC<{
  label: string; value: string; onChange: (v: string) => void; unit?: string;
  mode?: 'decimal' | 'numeric'; placeholder?: string; invalid?: boolean; hint?: string;
}> = ({ label, value, onChange, unit, mode = 'decimal', placeholder, invalid, hint }) => (
  <label className="flex min-w-0 flex-col gap-1.5">
    <span className="text-sm font-semibold text-fg-muted">{label}</span>
    <span className={`flex h-14 items-center rounded-2xl border bg-bg/70 pr-4 transition-colors focus-within:border-cyan ${invalid ? 'border-red-300' : 'border-white/[.12]'}`}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={mode}
        enterKeyHint="next"
        autoComplete="off"
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent px-4 text-xl font-semibold tabular-nums text-fg outline-none placeholder:font-normal placeholder:text-fg-subtle"
      />
      {unit && <span className="shrink-0 text-base text-fg-subtle">{unit}</span>}
    </span>
    {hint && <span className="text-xs text-fg-subtle">{hint}</span>}
  </label>
);

const MaterialPicker: React.FC<{ value: MatId; onChange: (m: MatId) => void; label: string }> = ({ value, onChange, label }) => (
  <div role="radiogroup" aria-label={label} className="grid grid-cols-5 gap-1.5">
    {MATS.map((m) => (
      <button
        key={m}
        type="button"
        role="radio"
        aria-checked={value === m}
        onClick={() => onChange(m)}
        className={`flex h-14 flex-col items-center justify-center rounded-2xl border text-[15px] font-semibold transition-colors active:scale-[.97] ${
          value === m ? 'border-cyan bg-cyan text-ink' : 'border-white/[.12] text-fg'
        }`}
      >
        {m}
        <span className={`text-[11px] font-medium ${value === m ? 'text-ink/70' : 'text-fg-subtle'}`}>
          {m === 'TPU' ? 'manuell' : `${FILAMENT_PER_KG[m]} €`}
        </span>
      </button>
    ))}
  </div>
);

/* ---------- PIN ---------- */
const PinGate: React.FC<{ onOk: () => void }> = ({ onOk }) => {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === KALKULATION_PIN) { storage.set(PIN_KEY, KALKULATION_PIN); onOk(); }
    else { setErr(true); setPin(''); }
  };
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-5">
      <form onSubmit={submit} className="w-full max-w-xs text-center">
        <img src="/logo-icon.png" alt="" width={56} height={56} className="mx-auto h-14 w-14" />
        <h1 className="mt-5 text-2xl font-semibold">Kalkulation</h1>
        <p className="mt-1.5 text-fg-muted">Bitte PIN eingeben</p>
        <input
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setErr(false); }}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          aria-label="PIN"
          aria-invalid={err || undefined}
          className={`mt-6 h-16 w-full rounded-2xl border bg-bg/70 text-center text-3xl tracking-[.5em] text-fg outline-none focus:border-cyan ${err ? 'border-red-300' : 'border-white/[.12]'}`}
        />
        {err && <p role="alert" className="mt-2 text-sm text-red-300">Falsche PIN</p>}
        <button type="submit" className="btn-primary mt-4 h-14 w-full text-base">Öffnen</button>
      </form>
    </div>
  );
};

/* ---------- Kalkulator ---------- */
const Calculator: React.FC<{ onLock: () => void }> = ({ onLock }) => {
  const [v, setV] = useState<Inputs>(EMPTY);
  const [openDetails, setOpenDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [label, setLabel] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try { return JSON.parse(storage.get(HIST_KEY) || '[]'); } catch { return []; }
  });
  const set = <K extends keyof Inputs>(k: K) => (val: Inputs[K]) => setV((s) => ({ ...s, [k]: val }));

  const n = {
    g1: num(v.g1), h: num(v.h), m: num(v.m), tpu1: num(v.tpu1), tpu2: num(v.tpu2),
    g2: num(v.g2), purge: num(v.purge), qty: num(v.qty), surcharge: num(v.surcharge),
  };
  const kg = (m: MatId, tpu: number) => (m === 'TPU' ? tpu : FILAMENT_PER_KG[m]);
  const bad = (x: number) => Number.isNaN(x);
  const needTpu1 = v.mat1 === 'TPU' && !(n.tpu1 > 0);
  const needTpu2 = v.multi && v.mat2 === 'TPU' && !(n.tpu2 > 0);
  const anyBad = Object.values(n).some(bad);
  const ready = !anyBad && n.g1 > 0 && n.h * 60 + n.m > 0 && !needTpu1 && !needTpu2;

  const result = useMemo(() => {
    if (!ready) return null;
    const p1 = kg(v.mat1, n.tpu1);
    const parts = [{ gramm: n.g1, preisProKg: p1 }];
    if (v.multi) {
      const p2 = kg(v.mat2, n.tpu2);
      if (n.g2 > 0) parts.push({ gramm: n.g2, preisProKg: p2 });
      // AMS-Spülmenge zum Durchschnittspreis beider Materialien
      if (n.purge > 0) parts.push({ gramm: n.purge, preisProKg: (p1 + p2) / 2 });
    }
    return kalkuliere({
      materialien: parts,
      stunden: n.h + n.m / 60,
      stueck: n.qty > 0 ? n.qty : 1,
      zuschlag: n.surcharge,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, v]);

  const copy = async () => {
    if (!result) return;
    const text = euro(result.gesamt);
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); ta.remove();
    }
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };

  const save = () => {
    if (!result) return;
    const entry: HistoryEntry = { id: Date.now(), ts: Date.now(), label: label.trim(), inputs: v, gesamt: result.gesamt, proStueck: result.proStueck };
    const next = [entry, ...history].slice(0, 20);
    setHistory(next); storage.set(HIST_KEY, JSON.stringify(next)); setLabel('');
  };
  const remove = (id: number) => {
    const next = history.filter((h) => h.id !== id);
    setHistory(next); storage.set(HIST_KEY, JSON.stringify(next));
  };
  const load = (h: HistoryEntry) => { setV({ ...EMPTY, ...h.inputs }); setLabel(h.label); window.scrollTo({ top: 0 }); };

  const qty = n.qty > 0 ? Math.floor(n.qty) : 1;
  const time = (s: Inputs) => `${num(s.h) || 0} h ${num(s.m) || 0} min`;
  const row = (k: string, val: string, strong = false) => (
    <div className={`flex justify-between gap-4 py-1.5 ${strong ? 'font-semibold text-fg' : 'text-fg-muted'}`}>
      <span>{k}</span><span className="tabular-nums">{val}</span>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(.75rem,env(safe-area-inset-top))]">
      {/* Kopf */}
      <header className="flex items-center justify-between py-2">
        <span className="flex items-center gap-2.5 font-semibold">
          <img src="/logo-icon.png" alt="" width={28} height={28} className="h-7 w-7" />
          Kalkulation
        </span>
        <button onClick={onLock} aria-label="Sperren" className="grid h-11 w-11 place-items-center rounded-full text-fg-muted active:bg-white/10">
          <LockSimple size={22} />
        </button>
      </header>

      {/* Ergebnis, bleibt beim Scrollen oben */}
      <section aria-live="polite" className="sticky top-0 z-10 -mx-4 bg-bg/90 px-4 pb-3 pt-2 backdrop-blur-xl">
        <div className="rounded-panel bg-gradient-to-br from-deep to-surface p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-fg-muted">{qty > 1 ? `Gesamt für ${qty} Stück` : 'Preis'}</p>
              <p className="mt-0.5 text-5xl font-semibold leading-none tracking-tight tabular-nums">{result ? euro(result.gesamt) : '– €'}</p>
              {result && qty > 1 && <p className="mt-1.5 text-fg-muted tabular-nums">{euro(result.proStueck)} pro Stück</p>}
            </div>
            <button
              onClick={copy}
              disabled={!result}
              className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-cyan px-4 font-semibold text-ink transition-transform active:scale-[.97] disabled:opacity-40"
            >
              {copied ? <Check size={18} weight="bold" /> : <Copy size={18} />} {copied ? 'Kopiert' : 'Preis kopieren'}
            </button>
          </div>
          {result?.mindestpreisGreift && <p className="mt-3 text-sm text-cyan">Mindestpreis von {euro(MINDESTPREIS)} greift.</p>}
          <button
            onClick={() => setOpenDetails((o) => !o)}
            aria-expanded={openDetails}
            disabled={!result}
            className="mt-3 flex w-full items-center justify-between text-sm font-semibold text-fg-muted disabled:opacity-40"
          >
            Aufschlüsselung
            <CaretDown size={16} className={`transition-transform duration-200 ${openDetails ? 'rotate-180' : ''}`} />
          </button>
          {openDetails && result && (
            <div className="mt-2 border-t border-white/10 pt-2 text-[15px]">
              {row('Material', euro(result.material))}
              {row(`Strom (${euro(STROM_PRO_STUNDE)} / h)`, euro(result.strom))}
              {row('Selbstkosten', euro(result.selbstkosten), true)}
              {row('Aufschlag 300 %', euro(result.aufschlag))}
              {row('Verkauf pro Stück', euro(result.verkaufProStueck), true)}
              {qty > 1 && row(`× ${qty} Stück`, euro(result.zwischensumme))}
              {result.mindestpreisGreift && row('Mindestpreis greift', euro(MINDESTPREIS))}
              {result.zuschlag > 0 && row('Zuschlag', euro(result.zuschlag))}
              {row('Endpreis', euro(result.gesamt), true)}
              <p className="mt-2 text-xs text-fg-subtle">{MWST_HINWEIS}</p>
            </div>
          )}
        </div>
      </section>

      {/* Eingaben */}
      <div className="mt-3 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-fg-muted">Material</span>
          <MaterialPicker value={v.mat1} onChange={set('mat1')} label="Material" />
        </div>
        {v.mat1 === 'TPU' && (
          <Field label="TPU-Preis" unit="€ / kg" value={v.tpu1} onChange={set('tpu1')} placeholder="z. B. 30" invalid={bad(n.tpu1)} />
        )}
        <Field label="Gewicht (inkl. Stützen)" unit="g" value={v.g1} onChange={set('g1')} placeholder="0" invalid={bad(n.g1)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Druckzeit" unit="h" mode="numeric" value={v.h} onChange={set('h')} placeholder="0" invalid={bad(n.h)} />
          <Field label="Minuten" unit="min" mode="numeric" value={v.m} onChange={set('m')} placeholder="0" invalid={bad(n.m)} />
        </div>

        {/* Mehrfarbe */}
        {!v.multi ? (
          <button onClick={() => set('multi')(true)} className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 font-semibold text-fg-muted active:bg-white/5">
            <Plus size={18} /> Zweites Material / AMS
          </button>
        ) : (
          <div className="flex flex-col gap-4 rounded-panel border border-white/[.08] p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Zweites Material</span>
              <button onClick={() => setV((s) => ({ ...s, multi: false, g2: '', purge: '', tpu2: '' }))} aria-label="Zweites Material entfernen" className="grid h-10 w-10 place-items-center rounded-full text-fg-muted active:bg-white/10">
                <X size={20} />
              </button>
            </div>
            <MaterialPicker value={v.mat2} onChange={set('mat2')} label="Zweites Material" />
            {v.mat2 === 'TPU' && (
              <Field label="TPU-Preis" unit="€ / kg" value={v.tpu2} onChange={set('tpu2')} placeholder="z. B. 30" invalid={bad(n.tpu2)} />
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Gewicht" unit="g" value={v.g2} onChange={set('g2')} placeholder="0" invalid={bad(n.g2)} />
              <Field label="AMS-Spülung" unit="g" value={v.purge} onChange={set('purge')} placeholder="0" invalid={bad(n.purge)} />
            </div>
            <p className="-mt-2 text-xs text-fg-subtle">Spülmenge wird zum Durchschnittspreis beider Materialien berechnet.</p>
          </div>
        )}

        {/* Stückzahl und Zuschlag */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="text-sm font-semibold text-fg-muted">Stückzahl</span>
            <div className={`flex h-14 items-center rounded-2xl border bg-bg/70 ${bad(n.qty) ? 'border-red-300' : 'border-white/[.12]'}`}>
              <button type="button" onClick={() => set('qty')(String(Math.max(1, qty - 1)))} aria-label="Weniger" className="grid h-full w-12 shrink-0 place-items-center text-fg-muted active:bg-white/10">
                <Minus size={18} />
              </button>
              <input
                value={v.qty}
                onChange={(e) => set('qty')(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                aria-label="Stückzahl"
                className="h-full min-w-0 flex-1 bg-transparent text-center text-xl font-semibold tabular-nums outline-none"
              />
              <button type="button" onClick={() => set('qty')(String(qty + 1))} aria-label="Mehr" className="grid h-full w-12 shrink-0 place-items-center text-fg-muted active:bg-white/10">
                <Plus size={18} />
              </button>
            </div>
          </div>
          <Field label="Zuschlag" unit="€" value={v.surcharge} onChange={set('surcharge')} placeholder="0" invalid={bad(n.surcharge)} />
        </div>
        <p className="-mt-3 text-xs text-fg-subtle">Gewicht und Zeit pro Stück eingeben. Der Zuschlag (Konstruktion, Nacharbeit) zählt einmal pro Auftrag.</p>

        <button onClick={() => { setV(EMPTY); setLabel(''); }} className="self-start text-sm font-semibold text-fg-muted underline underline-offset-4">
          Eingaben leeren
        </button>

        {/* Verlauf */}
        <section className="mt-2 border-t border-white/10 pt-5">
          <h2 className="text-lg font-semibold">Verlauf</h2>
          <div className="mt-3 flex gap-2">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Bezeichnung (optional)"
              enterKeyHint="done"
              className="h-12 min-w-0 flex-1 rounded-2xl border border-white/[.12] bg-bg/70 px-4 text-base text-fg outline-none placeholder:text-fg-subtle focus:border-cyan"
            />
            <button onClick={save} disabled={!result} className="btn-primary h-12 shrink-0 !px-5 disabled:opacity-40">Speichern</button>
          </div>
          {history.length === 0 ? (
            <p className="mt-4 text-sm text-fg-subtle">Noch keine gespeicherten Kalkulationen.</p>
          ) : (
            <ul className="mt-3 divide-y divide-white/[.08]">
              {history.map((h) => {
                const i = h.inputs;
                const mats = i.multi ? `${i.mat1} + ${i.mat2}` : i.mat1;
                const q = num(i.qty) > 1 ? ` · ${Math.floor(num(i.qty))} Stk.` : '';
                return (
                  <li key={h.id} className="flex items-center gap-2">
                    <button onClick={() => load(h)} className="min-w-0 flex-1 py-3 text-left active:opacity-70">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="truncate font-semibold">{h.label || 'Ohne Bezeichnung'}</span>
                        <span className="shrink-0 font-semibold tabular-nums">{euro(h.gesamt)}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-fg-subtle">
                        {mats} · {i.g1} g · {time(i)}{q} · {new Date(h.ts).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </button>
                    <button onClick={() => remove(h.id)} aria-label={`${h.label || 'Eintrag'} löschen`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-fg-subtle active:bg-white/10">
                      <Trash size={19} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default function InternalCalculator() {
  usePageMeta();
  const [ok, setOk] = useState(() => storage.get(PIN_KEY) === KALKULATION_PIN);
  return ok ? <Calculator onLock={() => { storage.del(PIN_KEY); setOk(false); }} /> : <PinGate onOk={() => setOk(true)} />;
}
