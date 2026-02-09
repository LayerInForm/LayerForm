
import React from 'react';

export const FAQ: React.FC = () => {
  const faqs = [
    { q: 'Welche Materialien werden verwendet?', a: 'Wir drucken standardmäßig mit PLA, PETG und High-End Materialien wie Carbon-faserverstärktem Nylon oder hitzebeständigem ABS.' },
    { q: 'Wie lange dauert ein Druck?', a: 'Kleinere Aufträge werden oft innerhalb von 24-48 Stunden fertiggestellt und versendet.' },
    { q: 'Benötige ich eine fertige Datei?', a: 'Nicht zwingend. Wir unterstützen dich gerne bei der Konstruktion (CAD) basierend auf deinen Skizzen oder Maßen.' },
    { q: 'Bieten Sie auch Serienfertigung an?', a: 'Ja, wir fertigen sowohl Einzelstücke als auch Kleinserien bis zu mehreren hundert Einheiten.' }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">Häufige Fragen.</h2>
        <div className="space-y-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-50 pb-8">
              <h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
              <p className="text-gray-500 leading-relaxed font-light">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
