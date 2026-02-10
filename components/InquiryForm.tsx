
import React, { useState, useEffect } from 'react';

interface InquiryFormProps {
  initialProduct?: string;
  initialPersonalization?: string;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ initialProduct, initialPersonalization }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    category: 'Halterung',
    description: '',
    material: '',
    dimensions: ''
  });

  useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({
        ...prev,
        category: initialProduct === 'Puzzle-Herz Anhänger' ? 'Deko / Kunst' : 'Halterung',
        description: `Anfrage für: ${initialProduct}.${initialPersonalization ? `\n\nGravur-Wunsch: ${initialPersonalization}` : ''}`
      }));
    }
  }, [initialProduct, initialPersonalization]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = `${formData.firstName} ${formData.lastName}`;
    const subject = encodeURIComponent(`LayerForm Projektanfrage: ${formData.category} - ${fullName}`);
    const body = encodeURIComponent(
      `Hallo LayerForm-Team,\n\n` +
      `Ich habe folgendes 3D-Druck Projekt geplant:\n\n` +
      `• Projekt-Kategorie: ${formData.category}\n` +
      `• Wunschmaterial: ${formData.material || 'Wird noch geklärt'}\n` +
      `• Maße/Skalierung: ${formData.dimensions || 'Standard'}\n\n` +
      `Details & Beschreibung:\n${formData.description}\n\n` +
      `Meine Kontaktdaten:\n` +
      `${fullName}\nE-Mail: ${formData.email}\n\n` +
      `Bitte senden Sie mir ein unverbindliches Angebot zur Umsetzung auf Ihren Bambu Lab Systemen.`
    );

    window.location.href = `mailto:layerform@web.de?subject=${subject}&body=${body}`;
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">E-Mail wurde vorbereitet</h2>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed font-light">
          Dein Standard-E-Mail-Programm sollte sich nun geöffnet haben. <br />
          Bitte klicke dort nur noch auf "Senden", um uns die Daten zu übermitteln.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="text-[#0071e3] font-semibold hover:underline"
        >
          Noch eine Idee anfragen
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 md:py-24 animate-fade-in">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#1d1d1f]">Individuelle Fertigung.</h2>
        <p className="text-xl text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
          Präzision in jeder Schicht. Beschreibe uns dein Projekt und wir prüfen die Machbarkeit sofort.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <div className="space-y-10">
          <div className="grid grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Vorname *</label>
              <input name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg placeholder:text-gray-200" placeholder="Max" />
            </div>
            <div className="group">
              <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Nachname *</label>
              <input name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg placeholder:text-gray-200" placeholder="Muster" />
            </div>
          </div>
          <div className="group">
            <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Deine E-Mail *</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg" placeholder="email@beispiel.de" />
          </div>
        </div>

        <div className="space-y-10">
          <div className="group">
            <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Details zum Projekt *</label>
            <textarea name="description" rows={3} required value={formData.description} onChange={handleChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg resize-none" placeholder="Maße, Funktion, Wunsch..." />
          </div>
          <div className="group">
            <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2">Materialwunsch</label>
            <input name="material" type="text" value={formData.material} onChange={handleChange} className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg" placeholder="PLA, PETG, TPU..." />
          </div>
        </div>

        <div className="md:col-span-2 pt-12">
          <button type="submit" className="w-full md:w-auto bg-black text-white px-20 py-6 rounded-full font-bold transition-all hover:bg-gray-800 active:scale-[0.98] text-lg shadow-xl shadow-gray-200">
            Anfrage jetzt vorbereiten
          </button>
        </div>
      </form>
    </section>
  );
};
