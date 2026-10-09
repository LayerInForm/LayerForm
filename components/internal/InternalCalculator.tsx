import React, { useEffect, useMemo, useState } from 'react';
import { CaretDown, Check, Copy, LockSimple, Minus, PencilSimple, Plus, Trash, X } from '@phosphor-icons/react';
import {
  FILAMENT_PER_KG, MARGE_STANDARD, MARGE_VORLAGEN, MINDESTPREIS, MWST_HINWEIS, STROM_PRO_STUNDE, VERSCHLEISS_PRO_STUNDE,
  ZUSATZKOSTEN, euro, kalkuliere, type FilamentId, type Zusatzposition,
} from '../../src/pricing';
import { KALKULATION_PIN } from './config';

/* ---------- Hilfen ---------- */
type MatId = FilamentId | 'TPU';
const MATS: MatId[] = ['PLA', 'PETG', 'ABS', 'ASA', 'TPU'];
const PIN_KEY = 'lf-kalkulation-pin';
const HIST_KEY = 'lf-kalkulation-verlauf';
const EXTRA_KEY = 'lf-kalkulation-zusatzkosten';

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
  qty: string; marge: string; cad: string;
  extras: Record<string, number>; // Zusatzposition → Anzahl
}
const EMPTY: Inputs = {
  mat1: 'PLA', tpu1: '', g1: '', h: '', m: '',
  multi: false, mat2: 'PETG', tpu2: '', g2: '', purge: '',
  qty: '1', marge: String(MARGE_STANDARD), cad: '', extras: {},
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
    if (pin.trim() === KALKULATION_PIN) { storage.set(PIN_KEY, KALKULATION_PIN); onOk(); }
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
          onChange={(e) => { setPin(e.target.value); setErr(false); }}
          type="password"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoFocus
          aria-label="PIN"
          aria-invalid={err || undefined}
          className={`mt-6 h-16 w-full rounded-2xl border bg-bg/70 text-center text-2xl tracking-[.2em] text-fg outline-none focus:border-cyan ${err ? 'border-red-300' : 'border-white/[.12]'}`}
        />
        {err && <p role="alert" className="mt-2 text-sm text-red-300">Falsche PIN</p>}
        <button type="submit" className="btn-primary mt-4 h-14 w-full text-base">Öffnen</button>
      </form>
    </div>
  );
};

/* ---------- Kalkulator ---------- */
const Stepper: React.FC<{ value: number; onChange: (n: number) => void; label: string; min?: number }> = ({ value, onChange, label, min = 0 }) => (
  <span className="flex h-11 shrink-0 items-center rounded-full border border-white/[.12]">
    <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`${label} weniger`} className="grid h-full w-10 place-items-center text-fg-muted active:bg-white/10 rounded-l-full"><Minus size={16} /></button>
    <span className="min-w-[2ch] text-center font-semibold tabular-nums">{value}</span>
    <button type="button" onClick={() => onChange(value + 1)} aria-label={`${label} mehr`} className="grid h-full w-10 place-items-center text-fg-muted active:bg-white/10 rounded-r-full"><Plus size={16} /></button>
  </span>
);

const Calculator: React.FC<{ onLock: () => void }> = ({ onLock }) => {
  const [v, setV] = useState<Inputs>(EMPTY);
  const [openDetails, setOpenDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [label, setLabel] = useState('');
  const [editExtras, setEditExtras] = useState(false);
  const [extraList, setExtraList] = useState<Zusatzposition[]>(() => {
    try { const s = storage.get(EXTRA_KEY); return s ? JSON.parse(s) : ZUSATZKOSTEN; } catch { return ZUSATZKOSTEN; }
  });
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try { return JSON.parse(storage.get(HIST_KEY) || '[]'); } catch { return []; }
  });
  const set = <K extends keyof Inputs>(k: K) => (val: Inputs[K]) => setV((s) => ({ ...s, [k]: val }));

  const n = {
    g1: num(v.g1), h: num(v.h), m: num(v.m), tpu1: num(v.tpu1), tpu2: num(v.tpu2),
    g2: num(v.g2), purge: num(v.purge), qty: num(v.qty), marge: num(v.marge), cad: num(v.cad),
  };
  const kg = (m: MatId, tpu: number) => (m === 'TPU' ? tpu : FILAMENT_PER_KG[m]);
  const bad = (x: number) => Number.isNaN(x);
  const needTpu1 = v.mat1 === 'TPU' && !(n.tpu1 > 0);
  const needTpu2 = v.multi && v.mat2 === 'TPU' && !(n.tpu2 > 0);
  const anyBad = Object.values(n).some(bad);
  const ready = !anyBad && n.g1 > 0 && n.h * 60 + n.m > 0 && !needTpu1 && !needTpu2;

  const extrasChosen = extraList.filter((e) => (v.extras[e.id] ?? 0) > 0);
  const extrasSum = extrasChosen.reduce((s, e) => s + e.preis * (v.extras[e.id] ?? 0), 0);

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
      margeProzent: n.marge,
      cad: n.cad,
      zusatz: extrasSum,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, v, extrasSum]);

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

  /* Verlauf */
  const save = () => {
    if (!result) return;
    const entry: HistoryEntry = { id: Date.now(), ts: Date.now(), label: label.trim(), inputs: v, gesamt: result.gesamt, proStueck: result.produkt / result.stueck };
    const next = [entry, ...history].slice(0, 20);
    setHistory(next); storage.set(HIST_KEY, JSON.stringify(next)); setLabel('');
  };
  const remove = (id: number) => {
    const next = history.filter((h) => h.id !== id);
    setHistory(next); storage.set(HIST_KEY, JSON.stringify(next));
  };
  const load = (h: HistoryEntry) => {
    const old = h.inputs as Inputs & { surcharge?: string };
    setV({ ...EMPTY, ...old, cad: old.cad ?? old.surcharge ?? '', extras: old.extras ?? {} });
    setLabel(h.label); window.scrollTo({ top: 0 });
  };

  /* Zusatzkosten verwalten (auf diesem Gerät gespeichert) */
  const saveExtras = (list: Zusatzposition[]) => { setExtraList(list); storage.set(EXTRA_KEY, JSON.stringify(list)); };
  const setExtraQty = (id: string, q: number) => setV((s) => ({ ...s, extras: { ...s.extras, [id]: q } }));

  const qty = n.qty > 0 ? Math.floor(n.qty) : 1;
  const time = (s: Inputs) => `${num(s.h) || 0} h ${num(s.m) || 0} min`;
  const row = (k: string, val: string, strong = false) => (
    <div className={`flex justify-between gap-4 py-1.5 ${strong ? 'font-semibold text-fg' : 'text-fg-muted'}`}>
      <span className="min-w-0 truncate">{k}</span><span className="shrink-0 tabular-nums">{val}</span>
    </div>
  );
  const stat = (k: string, val: number | undefined) => (
    <div className="min-w-0 rounded-xl bg-white/[.05] px-2.5 py-2">
      <p className="truncate text-[11px] text-fg-subtle">{k}</p>
      <p className="text-[15px] font-semibold tabular-nums">{val != null ? euro(val) : '–'}</p>
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
        <div className="rounded-panel bg-gradient-to-br from-deep to-surface p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] sm:p-5">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-fg-muted">Endpreis{qty > 1 ? ` für ${qty} Stück` : ''}</p>
              <p className="mt-0.5 text-5xl font-semibold leading-none tracking-tight tabular-nums">{result ? euro(result.gesamt) : '– €'}</p>
            </div>
            <button
              onClick={copy}
              disabled={!result}
              className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-cyan px-4 font-semibold text-ink transition-transform active:scale-[.97] disabled:opacity-40"
            >
              {copied ? <Check size={18} weight="bold" /> : <Copy size={18} />} {copied ? 'Kopiert' : 'Preis kopieren'}
            </button>
          </div>

          {/* Kosten auf einen Blick, pro Stück */}
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {stat('Material', result?.material)}
            {stat('Strom', result?.strom)}
            {stat('Verschleiß', result?.verschleiss)}
            {stat('Herstellung', result?.herstellkosten)}
          </div>
          {result?.mindestpreisGreift && <p className="mt-2.5 text-sm text-cyan">Mindestpreis von {euro(MINDESTPREIS)} greift.</p>}

          <button
            onClick={() => setOpenDetails((o) => !o)}
            aria-expanded={openDetails}
            disabled={!result}
            className="mt-2.5 flex w-full items-center justify-between text-sm font-semibold text-fg-muted disabled:opacity-40"
          >
            Aufschlüsselung
            <CaretDown size={16} className={`transition-transform duration-200 ${openDetails ? 'rotate-180' : ''}`} />
          </button>
          {openDetails && result && (
            <div className="mt-2 max-h-[45vh] overflow-y-auto border-t border-white/10 pt-2 text-[15px]">
              {row('Material', euro(result.material))}
              {row(`Strom (${euro(STROM_PRO_STUNDE)} / h)`, euro(result.strom))}
              {row(`Verschleiß (${euro(VERSCHLEISS_PRO_STUNDE)} / h)`, euro(result.verschleiss))}
              {row('Herstellkosten pro Stück', euro(result.herstellkosten), true)}
              {row(`Marge ${result.margeProzent} %`, euro(result.marge))}
              {row('Verkauf pro Stück', euro(result.verkaufProStueck), true)}
              {qty > 1 && row(`× ${qty} Stück`, euro(result.zwischensumme))}
              {result.mindestpreisGreift && row('Mindestpreis greift', euro(MINDESTPREIS))}
              {row('Produkt', euro(result.produkt), true)}
              {result.cad > 0 && row('CAD-Konstruktion', euro(result.cad))}
              {extrasChosen.map((e) => row(`${v.extras[e.id] > 1 ? `${v.extras[e.id]} × ` : ''}${e.name}`, euro(e.preis * v.extras[e.id])))}
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

        {/* Marge */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-fg-muted">Marge auf die Herstellkosten</span>
          <div role="radiogroup" aria-label="Marge" className="grid grid-cols-4 gap-1.5">
            {MARGE_VORLAGEN.map((m) => {
              const on = n.marge === m.prozent;
              return (
                <button
                  key={m.prozent}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set('marge')(String(m.prozent))}
                  className={`flex h-14 flex-col items-center justify-center rounded-2xl border text-[15px] font-semibold transition-colors active:scale-[.97] ${
                    on ? 'border-cyan bg-cyan text-ink' : 'border-white/[.12] text-fg'
                  }`}
                >
                  {m.label}
                  {m.hinweis && <span className={`text-[11px] font-medium ${on ? 'text-ink/70' : 'text-fg-subtle'}`}>{m.hinweis}</span>}
                </button>
              );
            })}
          </div>
          <Field label="Eigene Marge" unit="%" mode="numeric" value={v.marge} onChange={set('marge')} invalid={bad(n.marge)} hint="100 % = doppelter Preis, 300 % = vierfacher Preis" />
        </div>

        {/* Stückzahl und CAD */}
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
          <Field label="CAD-Konstruktion" unit="€" value={v.cad} onChange={set('cad')} placeholder="0" invalid={bad(n.cad)} />
        </div>
        <p className="-mt-3 text-xs text-fg-subtle">Gewicht und Zeit pro Stück eingeben. CAD und Zusatzkosten kommen einmal pro Auftrag und ohne Marge dazu.</p>

        {/* Zusatzkosten */}
        <section className="rounded-panel border border-white/[.08] p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Zusatzkosten <span className="ml-1 text-sm font-normal text-fg-subtle">ohne Marge</span></span>
            <button
              type="button"
              onClick={() => setEditExtras((e) => !e)}
              className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-cyan active:bg-white/10"
            >
              {editExtras ? <><Check size={16} weight="bold" /> Fertig</> : <><PencilSimple size={16} /> Bearbeiten</>}
            </button>
          </div>

          {!editExtras ? (
            <ul className="mt-2 divide-y divide-white/[.08]">
              {extraList.map((e) => {
                const q = v.extras[e.id] ?? 0;
                return (
                  <li key={e.id} className="flex items-center gap-3 py-2.5">
                    <button type="button" onClick={() => setExtraQty(e.id, q > 0 ? 0 : 1)} className="min-w-0 flex-1 text-left">
                      <span className={`block truncate font-medium ${q > 0 ? 'text-fg' : 'text-fg-muted'}`}>{e.name}</span>
                      <span className={`block text-sm tabular-nums ${e.preis > 0 ? 'text-fg-subtle' : 'text-red-300'}`}>{e.preis > 0 ? euro(e.preis) : 'Preis fehlt'}</span>
                    </button>
                    <Stepper value={q} onChange={(x) => setExtraQty(e.id, x)} label={e.name} />
                  </li>
                );
              })}
              {!extraList.length && <li className="py-3 text-sm text-fg-subtle">Noch keine Positionen. Über „Bearbeiten“ anlegen.</li>}
            </ul>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {extraList.map((e, i) => (
                <div key={e.id} className="grid grid-cols-[minmax(0,1fr)_6.5rem_auto] items-center gap-2">
                  <input
                    value={e.name}
                    onChange={(ev) => saveExtras(extraList.map((x, k) => (k === i ? { ...x, name: ev.target.value } : x)))}
                    aria-label="Bezeichnung"
                    className="h-12 min-w-0 rounded-xl border border-white/[.12] bg-bg/70 px-3 text-base text-fg outline-none focus:border-cyan"
                  />
                  <span className="flex h-12 items-center rounded-xl border border-white/[.12] bg-bg/70 pr-3 focus-within:border-cyan">
                    <input
                      defaultValue={e.preis ? String(e.preis).replace('.', ',') : ''}
                      onChange={(ev) => { const p = num(ev.target.value); if (!Number.isNaN(p)) saveExtras(extraList.map((x, k) => (k === i ? { ...x, preis: p } : x))); }}
                      inputMode="decimal"
                      placeholder="0"
                      aria-label={`Preis ${e.name}`}
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-base tabular-nums text-fg outline-none"
                    />
                    <span className="text-fg-subtle">€</span>
                  </span>
                  <button type="button" onClick={() => saveExtras(extraList.filter((_, k) => k !== i))} aria-label={`${e.name} löschen`} className="grid h-11 w-11 place-items-center rounded-full text-fg-subtle active:bg-white/10">
                    <Trash size={19} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => saveExtras([...extraList, { id: `z${Date.now()}`, name: 'Neue Position', preis: 0 }])}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 font-semibold text-fg-muted active:bg-white/5"
              >
                <Plus size={18} /> Position hinzufügen
              </button>
              <p className="text-xs text-fg-subtle">Änderungen werden auf diesem Gerät gespeichert.</p>
            </div>
          )}
        </section>

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
                const mg = i.marge && num(i.marge) !== MARGE_STANDARD ? ` · ${i.marge} %` : '';
                return (
                  <li key={h.id} className="flex items-center gap-2">
                    <button onClick={() => load(h)} className="min-w-0 flex-1 py-3 text-left active:opacity-70">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="truncate font-semibold">{h.label || 'Ohne Bezeichnung'}</span>
                        <span className="shrink-0 font-semibold tabular-nums">{euro(h.gesamt)}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-fg-subtle">
                        {mats} · {i.g1} g · {time(i)}{q}{mg} · {new Date(h.ts).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
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
