import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ArrowLeft, EnvelopeSimple, Trash, UploadSimple, WhatsappLogo, X } from '@phosphor-icons/react';
import {
  DEFAULT_INFILL, DEFAULT_QUALITY, MATERIALS, MAX_FILE_MB, MAX_PART, QUALITIES, type Material,
} from './pricing';
import {
  addEntry, autoDistribute, estimate, instancesOn, measure, normalize, pack, parse3MF, parseSTEP, parseSTL, placeNew,
  type Entry, type PartData,
} from './engine';
import { PlateViewer } from './PlateViewer';

interface Props {
  onBack: () => void;
  onPrivacy: () => void;
}

const EMAIL = 'auftrag@layer-form.de';
const WHATSAPP = '4917685922649';
const euro = (v: number) => v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
const mm = (v: number) => v.toFixed(2).replace('.', ',');

type SendState =
  | { kind: 'idle' }
  | { kind: 'sending'; text: string }
  | { kind: 'sent' }
  | { kind: 'failed'; text: string };

const Step: React.FC<{ n: number; title: string; done?: boolean; locked?: boolean; children: React.ReactNode; id?: string }> = ({
  n, title, done, locked, children, id,
}) => (
  <section
    id={id}
    aria-disabled={locked || undefined}
    className={`rounded-panel bg-surface p-5 shadow-[inset_0_0_0_1px_rgba(232,241,247,.08)] transition-opacity duration-300 md:p-6 ${
      locked ? 'pointer-events-none opacity-40' : ''
    }`}
  >
    <h2 className="flex items-center gap-3 text-xl font-semibold">
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-[9px] text-sm font-semibold transition-colors ${
          done ? 'bg-cyan text-ink' : 'bg-white/[.07] text-fg-muted'
        }`}
      >
        {n}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

export default function PriceCalculator({ onBack, onPrivacy }: Props) {
  const [parts, setParts] = useState<PartData[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [plateCount, setPlateCount] = useState(1);
  const [active, setActive] = useState(0);
  const [mat, setMat] = useState<Material | null>(null);
  const [q, setQ] = useState(QUALITIES[DEFAULT_QUALITY]);
  const [infill, setInfill] = useState(DEFAULT_INFILL);
  const [fileErr, setFileErr] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', street: '', zip: '', city: '', comment: '', website: '' });
  const [privacy, setPrivacy] = useState(false);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [formErr, setFormErr] = useState('');
  const [send, setSend] = useState<SendState>({ kind: 'idle' });
  const fileInput = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const formRef = useRef<HTMLElement>(null);

  /* ---------- abgeleitete Werte ---------- */
  const plateStates = useMemo(
    () => Array.from({ length: plateCount }, (_, i) => pack(instancesOn(i, entries, parts))),
    [plateCount, entries, parts]
  );
  const allFit = plateStates.every((s) => s.ok);
  const count = entries.reduce((s, e) => s + e.qty, 0);
  const usedPlates = new Set(entries.map((e) => e.plate)).size;
  const ready = parts.length > 0 && !!mat && count > 0;
  const price = ready && allFit && mat && !mat.onRequest ? estimate(entries, parts, plateCount, mat, q, infill) : null;
  const priceText = !ready || !allFit ? '– €' : mat!.onRequest ? 'Preis auf Anfrage' : `ca. ${euro(price!)}`;
  const placements = plateStates[active]?.places ?? [];
  const viewKey = `${active}:${placements.map((p) => p.part.id).join(',')}`;

  /* ---------- Teile verwalten ---------- */
  const cleanup = (next: Entry[]) => {
    const merged: Entry[] = [];
    next.filter((e) => e.qty > 0).forEach((e) => {
      const m = merged.find((x) => x.part === e.part && x.plate === e.plate);
      if (m) m.qty += e.qty; else merged.push({ ...e });
    });
    setEntries(merged);
    setParts((ps) => ps.filter((p) => merged.some((e) => e.part === p.id)));
    if (!merged.length) { setPlateCount(1); setActive(0); }
  };

  const readFiles = useCallback(async (files: FileList | File[]) => {
    const list = [...files]; if (!list.length) return;
    setLoading(list.some((f) => /\.(step|stp)$/i.test(f.name)) ? 'STEP-Datei wird umgewandelt …' : 'Datei wird gelesen …');
    const msgs: string[] = [];
    let ps = parts, es = entries, pc = plateCount, last = active;
    const add = (positions: Float32Array, name: string, file: File) => {
      if (!positions.length) throw new Error(`${name}: enthält keine Dreiecke.`);
      const m = measure(positions);
      if (m.volume < 1) throw new Error(`${name}: kein geschlossenes Volumen.`);
      if (m.size.x > MAX_PART || m.size.y > MAX_PART || m.size.z > MAX_PART) {
        throw new Error(`${name} ist größer als 255 × 255 × 255 mm. Bitte stellen Sie dafür eine Anfrage, wir finden eine Lösung, zum Beispiel durch Teilen des Modells.`);
      }
      normalize(positions, m.min, m.size);
      const part: PartData = { id: nextId.current++, name, file, positions, volume: m.volume, area: m.area, size: m.size };
      ps = [...ps, part];
      const r = placeNew(part, es, ps, pc);
      es = r.entries; pc = r.plateCount; last = r.plate;
    };
    for (const file of list) {
      try {
        if (!/\.(stl|3mf|step|stp)$/i.test(file.name)) throw new Error(`${file.name}: bitte STL, 3MF oder STEP. Für andere Formate stellen Sie gern eine Anfrage.`);
        if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`${file.name} ist größer als ${MAX_FILE_MB} MB.`);
        const buf = await file.arrayBuffer();
        if (/\.(3mf|step|stp)$/i.test(file.name)) {
          const objs = /\.3mf$/i.test(file.name) ? await parse3MF(buf) : await parseSTEP(buf);
          objs.forEach((o, i) => {
            try { add(o.positions, objs.length === 1 ? file.name : o.label || `${file.name} (Objekt ${i + 1})`, file); }
            catch (e) { msgs.push((e as Error).message); }
          });
        } else add(parseSTL(buf), file.name, file);
      } catch (e) {
        msgs.push((e as Error).message || `${file.name} konnte nicht gelesen werden.`);
      }
    }
    setParts(ps); setEntries(es); setPlateCount(pc); setActive(last);
    setFileErr(msgs.join(' '));
    setLoading(null);
    if (fileInput.current) fileInput.current.value = '';
  }, [parts, entries, plateCount, active]);

  const changeQty = (part: number, plate: number, delta: number) =>
    cleanup(entries.map((e) => (e.part === part && e.plate === plate ? { ...e, qty: Math.min(999, e.qty + delta) } : e)));
  const removeEntry = (part: number, plate: number) => cleanup(entries.filter((e) => !(e.part === part && e.plate === plate)));
  const moveEntry = (part: number, from: number, to: string) => {
    const target = to === 'new' ? plateCount : +to;
    if (to === 'new') setPlateCount(plateCount + 1);
    const e = entries.find((x) => x.part === part && x.plate === from); if (!e) return;
    cleanup(addEntry(entries.filter((x) => x !== e), part, target, e.qty));
    setActive(target);
  };
  const addPlate = () => { setPlateCount(plateCount + 1); setActive(plateCount); };
  const removePlate = (i: number) => {
    if (plateCount <= 1) return;
    cleanup(entries.filter((e) => e.plate !== i).map((e) => (e.plate > i ? { ...e, plate: e.plate - 1 } : e)));
    setPlateCount(plateCount - 1);
    setActive((a) => Math.min(a > i ? a - 1 : a, plateCount - 2));
  };
  const distribute = () => {
    const r = autoDistribute(entries, parts);
    setEntries(r.entries); setPlateCount(r.plateCount); setActive(0);
  };

  /* ---------- Anfrage ---------- */
  const summaryText = () => {
    const lines = [
      'Neue Anfrage über den Preisrechner', '',
      `Name: ${form.name}`, `E-Mail: ${form.email}`, `Adresse: ${form.street}, ${form.zip} ${form.city}`, '',
      `Material: ${mat?.name}`, `Qualität: ${mm(q.lh)} mm`, `Infill: ${infill} %`, '',
      ...Array.from({ length: plateCount }, (_, i) => {
        const l = entries.filter((e) => e.plate === i);
        return l.length ? `Platte ${i + 1}: ${l.map((e) => `${e.qty} × ${parts.find((p) => p.id === e.part)?.name}`).join(', ')}` : '';
      }).filter(Boolean), '',
      `Richtpreis: ${mat?.onRequest ? 'auf Anfrage (TPU)' : price != null ? euro(price) : '–'}`, '',
      `Kommentar: ${form.comment.trim() || '–'}`,
    ];
    return lines.join('\n');
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const req = ['name', 'email', 'street', 'zip', 'city'] as const;
    const bad: Record<string, boolean> = {};
    req.forEach((k) => { bad[k] = !form[k].trim() || (k === 'email' && !/^\S+@\S+\.\S+$/.test(form.email.trim())); });
    setInvalid(bad);
    if (Object.values(bad).some(Boolean)) { setFormErr('Bitte füllen Sie alle Pflichtfelder aus.'); return; }
    if (!privacy) { setFormErr('Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.'); return; }
    setFormErr('');

    try {
      // 1. Dateien hochladen (jede Originaldatei nur einmal)
      const { upload } = await import('@vercel/blob/client');
      const files = [...new Set(parts.map((p) => p.file).filter((f): f is File => !!f))];
      const uploaded: { name: string; url: string; size: number }[] = [];
      for (let i = 0; i < files.length; i++) {
        setSend({ kind: 'sending', text: `Dateien werden hochgeladen (${i + 1} von ${files.length}) …` });
        const f = files[i];
        const safe = f.name.replace(/[^\w.\-]+/g, '_');
        const blob = await upload(`anfragen/${Date.now()}-${safe}`, f, { access: 'public', handleUploadUrl: '/api/upload' });
        uploaded.push({ name: f.name, url: blob.url, size: f.size });
      }
      // 2. Anfrage verschicken
      setSend({ kind: 'sending', text: 'Anfrage wird gesendet …' });
      const res = await fetch('/api/anfrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          material: mat?.name, quality: `${mm(q.lh)} mm (${q.label})`, infill,
          estimate: mat?.onRequest ? 'auf Anfrage (TPU)' : price != null ? euro(price) : '–',
          plates: Array.from({ length: plateCount }, (_, i) => ({
            plate: i + 1,
            items: entries.filter((e) => e.plate === i).map((e) => ({ name: parts.find((p) => p.id === e.part)?.name, qty: e.qty })),
          })).filter((p) => p.items.length),
          files: uploaded,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSend({ kind: 'sent' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSend({ kind: 'failed', text: 'Die Anfrage konnte gerade nicht automatisch gesendet werden. Bitte schicken Sie sie per E-Mail oder WhatsApp, Ihre Angaben sind schon eingetragen. Die Dateien hängen Sie bitte selbst an.' });
    }
  };

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`Druckanfrage von ${form.name}`)}&body=${encodeURIComponent(summaryText())}`;
  const whatsapp = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(summaryText())}`;

  /* ---------- Ansicht: gesendet ---------- */
  if (send.kind === 'sent') {
    return (
      <section className="mx-auto max-w-3xl px-5 pb-28 pt-10 md:px-8">
        <div className="rounded-panel bg-gradient-to-br from-deep to-surface p-8 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] md:p-12">
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Vielen Dank, Ihre Anfrage ist da.</h1>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-fg/80">
            Wir prüfen Ihre Dateien und melden uns mit dem finalen Preis inklusive Versand und der Rechnung per E-Mail an {form.email}.
          </p>
          <button onClick={onBack} className="btn-primary mt-9">Zur Startseite</button>
        </div>
      </section>
    );
  }

  /* ---------- Ansicht: Rechner ---------- */
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-8 md:px-8 md:pb-32">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition-colors hover:text-fg">
        <ArrowLeft size={16} aria-hidden="true" /> Zur Startseite
      </button>
      <h1 className="mt-6 max-w-[18ch] text-4xl font-semibold leading-[1.04] md:text-6xl">Datei hochladen, Richtpreis sehen, anfragen.</h1>
      <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-fg-muted">
        Laden Sie Ihr 3D-Modell hoch und wählen Sie Material, Qualität und Füllung. Sie sehen sofort einen Richtpreis und können Ihre Anfrage direkt absenden.
      </p>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
        {/* 3D-Ansicht */}
        <div
          className={`relative aspect-[4/3.4] overflow-hidden rounded-panel bg-surface shadow-[inset_0_0_0_1px_rgba(232,241,247,.08)] lg:sticky lg:top-28 lg:aspect-auto lg:h-[min(76vh,680px)] ${
            dragOver ? 'ring-2 ring-cyan' : ''
          }`}
          style={{ background: 'radial-gradient(70% 60% at 50% 25%,rgba(8,36,111,.55),transparent 70%),repeating-linear-gradient(to bottom,rgba(232,241,247,.03) 0 1px,transparent 1px 7px),#0A1731' }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); readFiles(e.dataTransfer.files); }}
        >
          <PlateViewer placements={placements} viewKey={viewKey} highlight={!!mat} />

          {!parts.length && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <span className="grid h-[72px] w-[72px] place-items-center rounded-[22px] border border-dashed border-white/25 text-cyan">
                <UploadSimple size={30} aria-hidden="true" />
              </span>
              <p className="max-w-[30ch] text-fg-muted">
                <strong className="block text-lg font-semibold text-fg">Dateien hierher ziehen</strong>
                STL, 3MF oder STEP, bis {MAX_FILE_MB} MB je Datei. Ihre Teile erscheinen hier in 3D.
              </p>
            </div>
          )}

          {parts.length > 0 && (
            <div className="absolute inset-x-3 top-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Druckplatten">
              {plateStates.map((s, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold backdrop-blur transition-colors ${
                    i === active ? 'border-cyan bg-cyan text-ink' : s.ok ? 'border-white/15 bg-bg/60 text-fg' : 'border-red-300 bg-bg/60 text-red-300'
                  }`}
                >
                  Platte {i + 1}
                </button>
              ))}
              <button onClick={addPlate} aria-label="Platte hinzufügen" className="rounded-full border border-white/15 bg-bg/60 px-3.5 py-1.5 text-sm font-semibold text-cyan backdrop-blur">
                +
              </button>
            </div>
          )}
          {parts.length > 0 && (
            <p className="pointer-events-none absolute bottom-3 left-4 text-sm text-fg-subtle">Ziehen zum Drehen, scrollen oder zwei Finger zum Zoomen</p>
          )}
          {loading && <div className="absolute inset-0 grid place-items-center bg-bg/55 text-fg-muted">{loading}</div>}
        </div>

        {/* Schritte */}
        <div className="flex min-w-0 flex-col gap-3.5">
          <Step n={1} title="Dateien hochladen" done={parts.length > 0}>
            <p className="mt-1.5 text-fg-subtle sm:ml-10">
              {parts.length
                ? 'Teile werden automatisch mit 1 cm Abstand auf Platten verteilt. Sie können sie jederzeit verschieben.'
                : 'Ein oder mehrere Teile als STL, 3MF oder STEP. Maximal 255 × 255 × 255 mm pro Teil.'}
            </p>
            {!parts.length && (
              <div className="mt-4 sm:ml-10">
                <button onClick={() => fileInput.current?.click()} className="btn-primary">Dateien auswählen</button>
              </div>
            )}
            <input ref={fileInput} type="file" accept=".stl,.3mf,.step,.stp" multiple className="sr-only" tabIndex={-1} onChange={(e) => e.target.files && readFiles(e.target.files)} />

            {parts.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 sm:ml-10">
                {plateStates.map((s, i) => {
                  const list = entries.filter((e) => e.plate === i);
                  const n = list.reduce((a, e) => a + e.qty, 0);
                  return (
                    <div key={i} className={`rounded-media border px-3.5 py-3 transition-colors ${!s.ok ? 'border-red-300' : i === active ? 'border-cyan/45' : 'border-white/[.08]'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <button onClick={() => setActive(i)} className="font-semibold">
                          Platte {i + 1}<span className="ml-1.5 text-sm font-normal text-fg-subtle">{n} {n === 1 ? 'Teil' : 'Teile'}</span>
                        </button>
                        {plateCount > 1 && (
                          <button onClick={() => removePlate(i)} aria-label={`Platte ${i + 1} entfernen`} className="grid h-8 w-8 place-items-center rounded-full text-fg-subtle hover:bg-white/10 hover:text-fg">
                            <X size={15} />
                          </button>
                        )}
                      </div>
                      {list.length ? list.map((e) => {
                        const p = parts.find((x) => x.id === e.part)!;
                        return (
                          <div key={e.part} className="mt-2.5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-t border-white/[.08] pt-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
                            <span className="col-span-3 truncate text-[15px] sm:col-span-1" title={p.name}>{p.name}</span>
                            <span className="flex items-center rounded-full border border-white/15">
                              <button onClick={() => changeQty(e.part, i, -1)} aria-label="Weniger" className="h-8 w-8 rounded-full active:bg-white/10">−</button>
                              <span className="min-w-[2ch] text-center text-sm font-semibold tabular-nums">{e.qty}</span>
                              <button onClick={() => changeQty(e.part, i, 1)} aria-label="Mehr" className="h-8 w-8 rounded-full active:bg-white/10">+</button>
                            </span>
                            <select
                              value={i}
                              onChange={(ev) => moveEntry(e.part, i, ev.target.value)}
                              aria-label="Auf Platte verschieben"
                              className="justify-self-start rounded-full border border-white/15 bg-surface-2 px-3 py-1.5 text-sm text-fg"
                            >
                              {Array.from({ length: plateCount }, (_, k) => <option key={k} value={k}>Platte {k + 1}</option>)}
                              <option value="new">Neue Platte</option>
                            </select>
                            <button onClick={() => removeEntry(e.part, i)} aria-label={`${p.name} entfernen`} className="grid h-8 w-8 place-items-center rounded-full text-fg-subtle hover:bg-white/10 hover:text-fg">
                              <Trash size={16} />
                            </button>
                          </div>
                        );
                      }) : <p className="mt-2 text-sm text-fg-subtle">Noch leer. Teile über „Platte“ hierher verschieben.</p>}
                      {!s.ok && <p className="mt-2 text-sm text-red-300">Passt nicht auf eine Platte. Verschieben Sie Teile oder verteilen Sie automatisch.</p>}
                    </div>
                  );
                })}
                <div className="flex flex-wrap gap-2">
                  <button onClick={addPlate} className="btn-ghost !px-4 !py-2 !text-sm">+ Platte hinzufügen</button>
                  <button onClick={distribute} className="btn-ghost !px-4 !py-2 !text-sm">Automatisch verteilen</button>
                  <button onClick={() => fileInput.current?.click()} className="btn-ghost !px-4 !py-2 !text-sm">Weitere Datei</button>
                </div>
              </div>
            )}
            {fileErr && <p role="alert" className="mt-3 text-red-300 sm:ml-10">{fileErr}</p>}
          </Step>

          <Step n={2} title="Filament wählen" done={!!mat} locked={!parts.length}>
            <div role="radiogroup" aria-label="Filament" className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {MATERIALS.map((m) => (
                <button
                  key={m.id}
                  role="radio"
                  aria-checked={mat?.id === m.id}
                  onClick={() => setMat(m)}
                  className={`rounded-media border px-4 py-3.5 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[.98] ${
                    mat?.id === m.id ? 'border-cyan bg-cyan/[.07]' : 'border-white/[.08] hover:border-white/30'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{m.name}</span>
                    <span className={`text-xs font-medium ${m.recommended ? 'text-cyan' : 'text-fg-subtle'}`}>{m.tag}</span>
                  </span>
                  <ul className="mt-2 list-disc space-y-0.5 pl-4 text-sm leading-snug text-fg-muted marker:text-cyan">
                    {m.pros.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </button>
              ))}
            </div>
          </Step>

          <Step n={3} title="Qualität" done={!!mat} locked={!parts.length || !mat}>
            <p className="mt-1.5 text-fg-subtle sm:ml-10">Schichthöhe: je kleiner, desto feiner die Oberfläche.</p>
            <div role="radiogroup" aria-label="Qualität" className="mt-4 grid grid-cols-3 gap-2">
              {QUALITIES.map((x) => (
                <button
                  key={x.lh}
                  role="radio"
                  aria-checked={x === q}
                  onClick={() => setQ(x)}
                  className={`rounded-media border px-1.5 py-3 text-center transition-[border-color,background-color,transform] duration-200 active:scale-[.97] ${
                    x === q ? 'border-cyan bg-cyan/[.07]' : 'border-white/[.08] hover:border-white/30'
                  }`}
                >
                  <span className="block whitespace-nowrap text-[clamp(.86rem,3.4vw,1.1rem)] font-semibold tabular-nums">{mm(x.lh)} mm</span>
                  <span className="mt-0.5 block text-[13px] text-fg-muted">{x.label}</span>
                </button>
              ))}
            </div>
          </Step>

          <Step n={4} title="Füllung (Infill)" done={!!mat} locked={!parts.length || !mat}>
            <div className="mt-4 flex items-baseline justify-between">
              <output className="text-3xl font-semibold tabular-nums">{infill} %</output>
              <small className="text-fg-subtle">Standard: 15 %</small>
            </div>
            <input
              type="range" min={5} max={100} step={5} value={infill}
              onChange={(e) => setInfill(+e.target.value)}
              aria-label="Infill in Prozent"
              className="calc-range mt-3 w-full"
              style={{ ['--p' as string]: `${((infill - 5) / 95) * 100}%` }}
            />
            <div className="mt-0.5 flex justify-between text-xs text-fg-subtle"><span>5 %</span><span>50 %</span><span>100 %</span></div>
            <p className="mt-2.5 min-h-[1.4em] text-[15px] text-fg-muted">
              {infill <= 20 ? 'Für die meisten Teile ideal: leicht und trotzdem stabil.'
                : infill <= 50 ? 'Stabiler, gut für belastete Funktionsteile.'
                : 'Sehr massiv, für hohe Belastung. Mehr Material, höherer Preis.'}
            </p>
          </Step>

          <section aria-live="polite" className={`rounded-panel bg-gradient-to-br from-deep to-surface p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] transition-opacity ${ready ? '' : 'opacity-40'}`}>
            <p className="text-[15px] text-fg-muted">Geschätzter Richtpreis</p>
            <p className="mt-1 text-[clamp(2.4rem,6vw,3.25rem)] font-semibold leading-none tracking-tight tabular-nums">{priceText}</p>
            {count > 0 && <p className="mt-2 text-[15px] text-fg-muted">{count} {count === 1 ? 'Teil' : 'Teile'} auf {usedPlates} {usedPlates === 1 ? 'Platte' : 'Platten'}</p>}
            <p className="mt-4 text-sm leading-relaxed text-fg-subtle">
              Unverbindlicher Richtwert, der um einige Euro abweichen kann. Den genauen Preis inklusive Versand erhalten Sie von uns mit der Rechnung. Gemäß § 19 UStG ohne Umsatzsteuer.
            </p>
            {parts.length > 0 && !allFit && (
              <p role="alert" className="mt-3 text-red-300">Auf mindestens einer Platte ist zu wenig Platz. Bitte Teile verschieben oder „Automatisch verteilen“ wählen.</p>
            )}
            <button
              disabled={!(ready && allFit)}
              onClick={() => { setShowForm(true); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }}
              className="btn-primary mt-5 w-full !py-4 text-base disabled:cursor-not-allowed disabled:opacity-45"
            >
              {mat?.onRequest ? 'TPU-Druck anfragen' : 'Mit diesem Richtpreis anfragen'}
            </button>
          </section>

          {showForm && (
            <section ref={formRef} className="scroll-mt-28">
              <Step n={5} title="Ihre Angaben" done={send.kind !== 'idle'}>
                <p className="mt-1.5 text-fg-subtle sm:ml-10">Wir prüfen Ihre Dateien und schicken Ihnen den finalen Preis mit Rechnung per E-Mail.</p>
                <form onSubmit={submit} noValidate className="mt-4 flex flex-col gap-3">
                  {([
                    ['name', 'Name', 'name', 'text'],
                    ['email', 'E-Mail', 'email', 'email'],
                    ['street', 'Straße und Hausnummer', 'street-address', 'text'],
                  ] as const).map(([k, label, ac, type]) => (
                    <label key={k} className="flex flex-col gap-1.5 text-sm font-semibold">
                      {label}
                      <input
                        type={type} autoComplete={ac} value={form[k]} aria-invalid={invalid[k] || undefined}
                        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                        className="calc-input"
                      />
                    </label>
                  ))}
                  <div className="grid grid-cols-[2fr_3fr] gap-3">
                    <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold">
                      PLZ
                      <input inputMode="numeric" autoComplete="postal-code" value={form.zip} aria-invalid={invalid.zip || undefined}
                        onChange={(e) => setForm({ ...form, zip: e.target.value })} className="calc-input" />
                    </label>
                    <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold">
                      Ort
                      <input autoComplete="address-level2" value={form.city} aria-invalid={invalid.city || undefined}
                        onChange={(e) => setForm({ ...form, city: e.target.value })} className="calc-input" />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1.5 text-sm font-semibold">
                    <span>Kommentar <span className="ml-1.5 font-normal text-fg-subtle">optional</span></span>
                    <textarea rows={4} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      placeholder="Farbe, Wunschtermin, Einsatzzweck oder alles, was wir wissen sollten" className="calc-input resize-y" />
                  </label>
                  {/* Spamschutz: für Menschen unsichtbar */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" aria-hidden="true" />
                  <label className="flex cursor-pointer items-start gap-2.5 text-sm text-fg-muted">
                    <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#00E5FF]" />
                    <span>
                      Ich bin einverstanden, dass meine Angaben und Dateien zur Bearbeitung der Anfrage gespeichert werden. Mehr dazu in der{' '}
                      <button type="button" onClick={onPrivacy} className="text-cyan underline underline-offset-2">Datenschutzerklärung</button>.
                    </span>
                  </label>
                  {formErr && <p role="alert" className="text-red-300">{formErr}</p>}

                  {send.kind === 'failed' && (
                    <div role="alert" className="rounded-media border border-red-300/60 p-4">
                      <p className="text-[15px] text-fg/90">{send.text}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a href={mailto} className="btn-ghost !px-4 !py-2 !text-sm"><EnvelopeSimple size={17} aria-hidden="true" /> Per E-Mail senden</a>
                        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2 !text-sm"><WhatsappLogo size={17} aria-hidden="true" /> Per WhatsApp senden</a>
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={send.kind === 'sending'} className="btn-primary mt-1 w-full !py-4 text-base disabled:opacity-60">
                    {send.kind === 'sending' ? send.text : 'Anfrage absenden'}
                  </button>
                </form>
              </Step>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
