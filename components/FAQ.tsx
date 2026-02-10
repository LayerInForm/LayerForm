
import React from 'react';

export const FAQ: React.FC = () => {
  const faqs = [
    { q: 'Welche Hardware kommt zum Einsatz?', a: 'Wir fertigen ausschließlich auf modernsten Bambu Lab CoreXY Systemen. Dies garantiert uns maximale Präzision bei extrem hohen Druckgeschwindigkeiten und makellosen Oberflächen.' },
    { q: 'Welche Materialien sind möglich?', a: 'Standardmäßig bieten wir hochwertiges PLA und robustes PETG an. Nach individueller Absprache können wir jedoch nahezu JEDES Filament drucken – von flexiblem TPU über hitzebeständiges ASA bis hin zu speziellen Verbundstoffen.' },
    { q: 'Wie lange dauert ein Druck?', a: 'Dank der Bambu Lab Technologie sind wir oft doppelt so schnell wie herkömmliche Druckservices. Kleinere Projekte versenden wir meist innerhalb von 24 Stunden.' },
    { q: 'Bieten Sie auch Unterstützung beim Design?', a: 'Ja. Wenn Sie eine Idee haben, aber kein 3D-Modell, konstruieren wir Ihr Bauteil professionell in CAD für den Druck.' }
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
