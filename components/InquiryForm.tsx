import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { User, Building2, MessageCircle, Mail, ArrowLeft, CheckCircle2, Paperclip } from 'lucide-react';

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

const TOPICS = ['Ersatzteil', 'Prototyp', 'Giveaways', 'Deko & Geschenke', 'Serienproduktion', 'CAD-Konstruktion', 'Sonstiges'];

type CustomerType = 'privat' | 'unternehmen';

const inputCls =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-[16px] text-ink placeholder:text-muted/70 outline-none transition focus:border-cyan-mid focus:ring-4 focus:ring-cyan/20';

const Field: React.FC<{ label: string; optional?: boolean; error?: string; children: React.ReactNode; className?: string }> = ({
  label, optional, error, children, className = '',
}) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-ink">
      {label}
      {optional && <span className="text-xs font-normal text-muted">optional</span>}
    </span>
    {children}
    {error && <span className="mt-1.5 block text-sm text-red-600">{error}</span>}
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
    name: '',
    company: '',
    email: '',
    phone: '',
    quantity: '',
    deadline: '',
    message: [initialProduct, initialPersonalization].filter(Boolean).join(' – '),
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentVia, setSentVia] = useState<'whatsapp' | 'email' | null>(null);

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
      '',
      `Name: ${form.name.trim()}`,
      type === 'unternehmen' && form.company ? `Firma: ${form.company.trim()}` : '',
      form.email ? `E-Mail: ${form.email.trim()}` : '',
      form.phone ? `Telefon: ${form.phone.trim()}` : '',
    ];
    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }, [form, type, topics]);

  const validate = (via: 'whatsapp' | 'email') => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Bitte geben Sie Ihren Namen an.';
    if (form.message.trim().length < 10) e.message = 'Beschreiben Sie Ihr Projekt bitte in ein paar Worten.';
    if (via === 'email' && form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Diese E-Mail-Adresse sieht nicht vollständig aus.';
    if (!consent) e.consent = 'Bitte bestätigen Sie den Hinweis zum Datenschutz.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const send = (via: 'whatsapp' | 'email') => {
    if (!validate(via)) return;
    const subject = `Anfrage: ${topics[0] ?? 'Projekt'}${type === 'unternehmen' && form.company ? ` – ${form.company}` : ''}`;
    const url =
      via === 'whatsapp'
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
        : `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.open(url, via === 'whatsapp' ? '_blank' : '_self');
    setSentVia(via);
  };

  return (
    <section className="bg-ice">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8 md:pb-32">
        {onBack && (
          <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-[15px] font-semibold text-muted hover:text-ink">
            <ArrowLeft size={18} aria-hidden="true" /> Zur Startseite
          </button>
        )}

        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-14">
          {/* Linke Spalte */}
          <div className="md:sticky md:top-28 md:self-start">
            <h1 className="text-4xl font-semibold leading-[1.05] md:text-5xl">Projekt anfragen</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Beschreiben Sie kurz, was Sie brauchen. Sie bekommen eine persönliche Rückmeldung mit Preis und Lieferzeit.
            </p>
            <div className="mt-8 rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 font-semibold">
                <Paperclip size={17} className="text-cyan-text" aria-hidden="true" /> Fotos oder Dateien?
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Senden Sie diese nach dem Absenden einfach in WhatsApp hinterher oder hängen Sie sie an die E-Mail an –
                Foto, Skizze, STL oder STEP.
              </p>
            </div>
          </div>

          {/* Formular */}
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,28,71,.25)] md:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {sentVia ? (
                <motion.div
                  key="done"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="py-10 text-center"
                >
                  <CheckCircle2 size={52} className="mx-auto text-cyan-mid" aria-hidden="true" />
                  <h2 className="mt-6 text-3xl font-semibold">Fast geschafft!</h2>
                  <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-muted">
                    {sentVia === 'whatsapp'
                      ? 'Ihre Nachricht ist in WhatsApp vorbereitet. Tippen Sie dort nur noch auf „Senden“.'
                      : 'Ihre E-Mail ist in Ihrem Mailprogramm vorbereitet. Klicken Sie dort nur noch auf „Senden“.'}
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button onClick={() => send(sentVia)} className="btn-primary">Erneut öffnen</button>
                    <button onClick={() => setSentVia(null)} className="btn-ghost">Anfrage bearbeiten</button>
                  </div>
                  <p className="mt-6 text-sm text-muted">
                    Hat sich nichts geöffnet? Schreiben Sie direkt an{' '}
                    <a href={`mailto:${EMAIL}`} className="font-semibold text-cyan-text underline">{EMAIL}</a>.
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
                        ['unternehmen', 'Unternehmen', Building2],
                      ] as const).map(([key, label, Icon]) => (
                        <button
                          key={key}
                          type="button"
                          role="radio"
                          aria-checked={type === key}
                          onClick={() => setType(key)}
                          className={`flex items-center justify-center gap-2 rounded-xl border px-2 py-3 text-sm font-semibold min-[400px]:px-4 min-[400px]:text-base transition ${
                            type === key ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink/75 hover:border-ink/40'
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
                      Worum geht es? <span className="font-normal text-muted">(mehrere möglich)</span>
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
                              on ? 'border-cyan-mid bg-cyan/20 text-ink' : 'border-line bg-white text-ink/70 hover:border-ink/40'
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

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" error={errors.name}>
                      <input value={form.name} onChange={set('name')} autoComplete="name" className={inputCls} />
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
                    <Field label="E-Mail" optional error={errors.email}>
                      <input value={form.email} onChange={set('email')} type="email" autoComplete="email" className={inputCls} />
                    </Field>
                    {type === 'unternehmen' && (
                      <Field label="Telefon" optional>
                        <input value={form.phone} onChange={set('phone')} type="tel" autoComplete="tel" className={inputCls} />
                      </Field>
                    )}
                  </div>

                  <div>
                    <label className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/80">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-5 w-5 shrink-0 accent-[#19B2D9]"
                      />
                      <span>
                        Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden.{' '}
                        {onPrivacy && (
                          <button type="button" onClick={onPrivacy} className="font-semibold text-cyan-text underline">
                            Datenschutzerklärung
                          </button>
                        )}
                      </span>
                    </label>
                    {errors.consent && <span className="mt-1.5 block text-sm text-red-600">{errors.consent}</span>}
                  </div>

                  <div className="border-t border-line pt-6">
                    <p className="mb-3 text-sm font-semibold">Anfrage senden über</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => send('whatsapp')} className="btn-primary w-full">
                        <MessageCircle size={19} aria-hidden="true" /> WhatsApp
                      </button>
                      <button type="button" onClick={() => send('email')} className="btn-ghost w-full">
                        <Mail size={19} aria-hidden="true" /> E-Mail
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-muted">
                      Ihre Anfrage wird als fertige Nachricht vorbereitet – Sie müssen sie nur noch abschicken.
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
