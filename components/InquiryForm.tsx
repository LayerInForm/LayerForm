import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Buildings, CheckCircle, EnvelopeSimple, Paperclip, User, WhatsappLogo } from '@phosphor-icons/react';

interface InquiryFormProps {
  /** Vorausgefüllter Produktname (optional) */
  initialProduct?: string;
  /** Vorausgefüllter Betreff / Text, z. B. "Anfrage: Giveaways für Unternehmen" */
  initialPersonalization?: string;
  onBack?: () => void;
  onPrivacy?: () => void;
}

// Ziel für die Anfragen
const WHATSAPP_NUMBER = '4917685922649';
const EMAIL = 'auftrag@layer-form.de';

const FILAMENTE = ['PLA', 'PETG', 'ABS', 'TPU', 'Auf Anfrage'];
const TOPICS = ['Ersatzteil', 'Prototyp', 'Giveaways', 'Deko & Geschenke', 'Serienproduktion', 'CAD-Konstruktion', 'Sonstiges'];

type CustomerType = 'privat' | 'unternehmen';

const inputCls =
  'w-full rounded-xl border border-white/[.12] bg-bg/70 px-4 py-3 text-[16px] text-fg placeholder:text-fg-subtle outline-none transition-[border-color,box-shadow] duration-200 focus:border-cyan focus:ring-4 focus:ring-cyan/15';

const Field: React.FC<{ label: string; optional?: boolean; error?: string; children: React.ReactNode; className?: string }> = ({
  label, optional, error, children, className = '',
}) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-fg">
      {label}
      {optional && <span className="text-xs font-normal text-fg-muted">optional</span>}
    </span>
    {children}
    {error && <span className="mt-1.5 block text-sm text-red-300">{error}</span>}
  </label>
);

export const InquiryForm: React.FC<InquiryFormProps> = ({ initialProduct, initialPersonalization, onBack, onPrivacy }) => {
  const reduce = useReducedMotion();

  // Themen aus dem vorausgefüllten Text erkennen
  const preset = `${initialProduct ?? ''} ${initialPersonalization ?? ''}`;
  const presetType: CustomerType = /unternehmen|giveaway|serie/i.test(preset) ? 'unternehmen' : 'privat';
  const presetTopics = TOPICS.filter((t) => new RegExp(t.split(' ')[0], 'i').test(preset));

  const [type, setType] = useState<CustomerType>(presetType);
  const [topics, setTopics] = useState<string[]>(presetTopics);
  const [form, setForm] = useState({
    vorname: '',
    nachname: '',
    filament: 'Auf Anfrage',
    farbe: '',
    company: '',
    email: '',
    phone: '',
    street: '',
    zip: '',
    city: '',
    quantity: '',
    deadline: '',
    message: [initialProduct, initialPersonalization].filter(Boolean).join('\n'),
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentVia, setSentVia] = useState<'whatsapp' | 'email' | 'mailto' | null>(null);
  const [sending, setSending] = useState(false);
  const [hp, setHp] = useState(''); // Spamschutz (verstecktes Feld)

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleTopic = (t: string) =>
    setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  // Fertiger Nachrichtentext für WhatsApp und E-Mail
  const text = useMemo(() => {
    const lines = [
      'Hallo LayerForm,',
      '',
      form.message.trim(),
      '',
      `Kunde: ${type === 'unternehmen' ? 'Unternehmen' : 'Privatkunde'}`,
      topics.length ? `Thema: ${topics.join(', ')}` : '',
      form.quantity ? `Stückzahl: ${form.quantity}` : '',
      form.deadline ? `Wunschtermin: ${form.deadline}` : '',
      `Filament: ${form.filament}`,
      form.farbe.trim() ? `Farbe: ${form.farbe.trim()}` : '',
      '',
      `Name: ${form.vorname.trim()} ${form.nachname.trim()}`,
      type === 'unternehmen' && form.company ? `Firma: ${form.company.trim()}` : '',
      form.email ? `E-Mail: ${form.email.trim()}` : '',
      form.phone ? `Telefon: ${form.phone.trim()}` : '',
      [form.street.trim(), [form.zip.trim(), form.city.trim()].filter(Boolean).join(' ')].filter(Boolean).length
        ? `Adresse: ${[form.street.trim(), [form.zip.trim(), form.city.trim()].filter(Boolean).join(' ')].filter(Boolean).join(', ')}`
        : '',
    ];
    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }, [form, type, topics]);

  const validate = (via: 'whatsapp' | 'email') => {
    const e: Record<string, string> = {};
    if (!form.vorname.trim()) e.vorname = 'Bitte geben Sie Ihren Vornamen an.';
    if (!form.nachname.trim()) e.nachname = 'Bitte geben Sie Ihren Nachnamen an.';
    if (form.message.trim().length < 10) e.message = 'Beschreiben Sie Ihr Projekt bitte in ein paar Worten.';
    if (via === 'email' && !form.email.trim()) e.email = 'Bitte geben Sie Ihre E-Mail-Adresse an, damit wir Ihnen antworten können.';
    else if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Diese E-Mail-Adresse sieht nicht vollständig aus.';
    if (!consent) e.consent = 'Bitte bestätigen Sie den Hinweis zum Datenschutz.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const subject = `Anfrage: ${topics[0] ?? 'Projekt'}${type === 'unternehmen' && form.company ? `, ${form.company}` : ''}`;
  const mailtoUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

  // Anfrage im Hintergrund direkt an LayerForm übertragen (landet automatisch in der Kundenverwaltung)
  const transmit = (via: 'whatsapp' | 'email') =>
    fetch('/api/kontakt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ via, ...form, name: `${form.vorname.trim()} ${form.nachname.trim()}`, type, topics, text, subject, website: hp }),
    }).then((r) => r.ok);

  const send = async (via: 'whatsapp' | 'email') => {
    if (!validate(via) || sending) return;
    if (via === 'whatsapp') {
      // WhatsApp sofort öffnen (sonst blockiert der Browser das Fenster), Übertragung läuft parallel
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
      transmit('whatsapp').catch(() => {});
      setSentVia('whatsapp');
      return;
    }
    setSending(true);
    const ok = await transmit('email').catch(() => false);
    setSending(false);
    if (ok) {
      setSentVia('email');
    } else {
      // Rückfall: wie bisher im Mailprogramm vorbereiten
      window.open(mailtoUrl, '_self');
      setSentVia('mailto');
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 md:px-8 md:pb-32">
        {onBack && (
          <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-[15px] font-semibold text-fg-muted hover:text-fg">
            <ArrowLeft size={18} aria-hidden="true" /> Zur Startseite
          </button>
        )}

        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-14">
          {/* Linke Spalte */}
          <div className="md:sticky md:top-28 md:self-start">
            <h1 className="text-4xl font-semibold leading-[1.05] md:text-5xl">Projekt anfragen</h1>
            <p className="mt-5 text-lg leading-relaxed text-fg-muted">
              Beschreiben Sie kurz, was Sie brauchen. Sie bekommen eine persönliche Rückmeldung mit Preis und Lieferzeit.
            </p>
            <div className="mt-8 rounded-panel border border-white/[.07] bg-surface p-5">
              <p className="flex items-center gap-2 font-semibold">
                <Paperclip size={17} className="text-cyan" aria-hidden="true" /> Fotos oder Dateien?
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">
                Senden Sie diese nach dem Absenden einfach in WhatsApp hinterher oder hängen Sie sie an die E-Mail an:
                Foto, Skizze, STL oder STEP.
              </p>
            </div>
          </div>

          {/* Formular */}
          <div className="rounded-panel border border-white/[.07] bg-surface p-6 md:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {sentVia ? (
                <motion.div
                  key="done"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="py-10 text-center"
                >
                  <CheckCircle size={52} className="mx-auto text-cyan" aria-hidden="true" />
                  <h2 className="mt-6 text-3xl font-semibold">{sentVia === 'email' ? 'Anfrage gesendet' : 'Fast geschafft'}</h2>
                  <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-fg-muted">
                    {sentVia === 'email'
                      ? 'Vielen Dank! Ihre Anfrage ist bei uns angekommen. Sie erhalten gleich eine Bestätigung per E-Mail – Fotos oder Dateien können Sie einfach als Antwort darauf schicken.'
                      : sentVia === 'whatsapp'
                        ? 'Ihre Nachricht ist in WhatsApp vorbereitet. Tippen Sie dort nur noch auf „Senden“.'
                        : 'Ihre E-Mail ist in Ihrem Mailprogramm vorbereitet. Klicken Sie dort nur noch auf „Senden“.'}
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {sentVia === 'whatsapp' && (
                      <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')} className="btn-primary">Erneut öffnen</button>
                    )}
                    {sentVia === 'mailto' && (
                      <button onClick={() => window.open(mailtoUrl, '_self')} className="btn-primary">Erneut öffnen</button>
                    )}
                    {sentVia !== 'email' && (
                      <button onClick={() => setSentVia(null)} className="btn-ghost">Anfrage bearbeiten</button>
                    )}
                  </div>
                  <p className="mt-6 text-sm text-fg-muted">
                    Hat sich nichts geöffnet? Schreiben Sie direkt an{' '}
                    <a href={`mailto:${EMAIL}`} className="font-semibold text-cyan underline">{EMAIL}</a>.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={(e) => e.preventDefault()}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Kundentyp */}
                  <div>
                    <span className="mb-2 block text-sm font-semibold">Ich frage an als</span>
                    <div className="grid grid-cols-2 gap-2" role="radiogroup">
                      {([
                        ['privat', 'Privatkunde', User],
                        ['unternehmen', 'Unternehmen', Buildings],
                      ] as const).map(([key, label, Icon]) => (
                        <button
                          key={key}
                          type="button"
                          role="radio"
                          aria-checked={type === key}
                          onClick={() => setType(key)}
                          className={`flex items-center justify-center gap-2 rounded-xl border px-2 py-3 text-sm font-semibold min-[400px]:px-4 min-[400px]:text-base transition ${
                            type === key ? 'border-cyan bg-cyan text-ink' : 'border-white/10 text-fg-muted hover:border-white/30 hover:text-fg'
                          }`}
                        >
                          <Icon size={18} className="hidden shrink-0 min-[400px]:block" aria-hidden="true" /> {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Themen */}
                  <div>
                    <span className="mb-2 block text-sm font-semibold">
                      Worum geht es? <span className="font-normal text-fg-muted">(mehrere möglich)</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((t) => {
                        const on = topics.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggleTopic(t)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              on ? 'border-cyan bg-cyan/15 text-fg' : 'border-white/10 text-fg-muted hover:border-white/30 hover:text-fg'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field label="Ihre Nachricht" error={errors.message}>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={set('message')}
                      placeholder="Was soll gedruckt werden? Maße, Farbe, Einsatzzweck …"
                      className={`${inputCls} resize-y`}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Stückzahl" optional>
                      <input value={form.quantity} onChange={set('quantity')} inputMode="numeric" placeholder="z. B. 1 oder 250" className={inputCls} />
                    </Field>
                    <Field label="Wunschtermin" optional>
                      <input value={form.deadline} onChange={set('deadline')} placeholder="z. B. Mitte Oktober" className={inputCls} />
                    </Field>
                  </div>

                  {/* Filament und Farbe */}
                  <div>
                    <span className="mb-2 block text-sm font-semibold">Filament</span>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filament">
                      {FILAMENTE.map((f) => {
                        const on = form.filament === f;
                        return (
                          <button
                            key={f}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => setForm((x) => ({ ...x, filament: f }))}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              on ? 'border-cyan bg-cyan/15 text-fg' : 'border-white/10 text-fg-muted hover:border-white/30 hover:text-fg'
                            }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                    <span className="mt-1.5 block text-xs text-fg-muted">Unsicher? Dann „Auf Anfrage“ wählen, wir beraten Sie gern.</span>
                  </div>
                  <Field label="Farbe" optional>
                    <input value={form.farbe} onChange={set('farbe')} placeholder="z. B. Schwarz, Weiß oder RAL-Ton" className={inputCls} />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Vorname" error={errors.vorname}>
                      <input value={form.vorname} onChange={set('vorname')} autoComplete="given-name" className={inputCls} />
                    </Field>
                    <Field label="Nachname" error={errors.nachname}>
                      <input value={form.nachname} onChange={set('nachname')} autoComplete="family-name" className={inputCls} />
                    </Field>
                    {type === 'unternehmen' ? (
                      <Field label="Firma" optional>
                        <input value={form.company} onChange={set('company')} autoComplete="organization" className={inputCls} />
                      </Field>
                    ) : (
                      <Field label="Telefon" optional>
                        <input value={form.phone} onChange={set('phone')} type="tel" autoComplete="tel" className={inputCls} />
                      </Field>
                    )}
                    <Field label="E-Mail" error={errors.email}>
                      <input value={form.email} onChange={set('email')} type="email" autoComplete="email" className={inputCls} />
                    </Field>
                    {type === 'unternehmen' && (
                      <Field label="Telefon" optional>
                        <input value={form.phone} onChange={set('phone')} type="tel" autoComplete="tel" className={inputCls} />
                      </Field>
                    )}
                  </div>

                  {/* Adresse, optional */}
                  <fieldset>
                    <legend className="mb-1.5 flex w-full items-baseline justify-between text-sm font-semibold text-fg">
                      Adresse
                      <span className="text-xs font-normal text-fg-muted">optional, für Versand und Angebot</span>
                    </legend>
                    <div className="grid grid-cols-6 gap-3">
                      <input
                        value={form.street}
                        onChange={set('street')}
                        autoComplete="street-address"
                        placeholder="Straße und Hausnummer"
                        aria-label="Straße und Hausnummer"
                        className={`${inputCls} col-span-6`}
                      />
                      <input
                        value={form.zip}
                        onChange={set('zip')}
                        autoComplete="postal-code"
                        inputMode="numeric"
                        placeholder="PLZ"
                        aria-label="Postleitzahl"
                        className={`${inputCls} col-span-2`}
                      />
                      <input
                        value={form.city}
                        onChange={set('city')}
                        autoComplete="address-level2"
                        placeholder="Ort"
                        aria-label="Ort"
                        className={`${inputCls} col-span-4`}
                      />
                    </div>
                  </fieldset>

                  <div>
                    <label className="flex items-start gap-3 text-[15px] leading-relaxed text-fg/80">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-5 w-5 shrink-0 accent-[#00E5FF]"
                      />
                      <span>
                        Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden.{' '}
                        {onPrivacy && (
                          <button type="button" onClick={onPrivacy} className="font-semibold text-cyan underline">
                            Datenschutzerklärung
                          </button>
                        )}
                      </span>
                    </label>
                    {errors.consent && <span className="mt-1.5 block text-sm text-red-300">{errors.consent}</span>}
                  </div>

                  <input
                    type="text"
                    name="website"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />

                  <div className="border-t border-white/10 pt-6">
                    <p className="mb-3 text-sm font-semibold">Anfrage senden über</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => send('whatsapp')} className="btn-primary w-full">
                        <WhatsappLogo size={20} aria-hidden="true" /> WhatsApp
                      </button>
                      <button type="button" onClick={() => send('email')} disabled={sending} className="btn-ghost w-full disabled:opacity-60">
                        <EnvelopeSimple size={20} aria-hidden="true" /> {sending ? 'Wird gesendet …' : 'E-Mail'}
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-fg-muted">
                      Per E-Mail geht Ihre Anfrage direkt an uns. Bei WhatsApp wird die Nachricht vorbereitet – Sie tippen nur noch auf „Senden“.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
