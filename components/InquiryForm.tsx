
import React, { useState } from 'react';

export const InquiryForm: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = `${formData.firstName} ${formData.lastName}`;
    const subject = encodeURIComponent(`Projektanfrage: ${formData.category} von ${fullName}`);
    const body = encodeURIComponent(
      `Hallo LayerForm Team,\n\n` +
      `Ich habe eine neue Projektanfrage:\n\n` +
      `• Vorname: ${formData.firstName}\n` +
      `• Nachname: ${formData.lastName}\n` +
      `• E-Mail: ${formData.email}\n` +
      `• Kategorie: ${formData.category}\n` +
      `• Material: ${formData.material || 'Keine Angabe'}\n` +
      `• Maße: ${formData.dimensions || 'Keine Angabe'}\n\n` +
      `Beschreibung:\n${formData.description}\n\n` +
      `Ich freue mich auf Ihr Angebot.`
    );

    // Öffnet das Mail-Programm
    window.location.href = `mailto:layerform@web.de?subject=${subject}&body=${body}`;
    
    // Zeigt die Erfolgsmeldung in der UI an
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
        <h2 className="text-3xl font-bold mb-4">Anfrage bereit</h2>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          Dein E-Mail-Programm wurde mit allen Details geöffnet. <br />
          Bitte klicke dort nur noch auf "Senden".
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="text-[#007AFF] font-medium hover:underline"
        >
          Noch eine Anfrage senden
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 md:py-24 animate-fade-in">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#1d1d1f]">Lass uns bauen.</h2>
        <p className="text-xl text-gray-400 max-w-xl mx-auto font-light">
          Beschreibe dein Projekt. Wir wählen das perfekte Material und fertigen mit industrieller Präzision.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Vorname *</label>
              <input 
                name="firstName"
                type="text" 
                required 
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Max"
                className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg placeholder:text-gray-200"
              />
            </div>
            <div className="group">
              <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Nachname *</label>
              <input 
                name="lastName"
                type="text" 
                required 
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Mustermann"
                className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg placeholder:text-gray-200"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">E-Mail Adresse *</label>
            <input 
              name="email"
              type="email" 
              required 
              value={formData.email}
              onChange={handleChange}
              placeholder="name@beispiel.de"
              className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg placeholder:text-gray-200"
            />
          </div>

          <div className="group">
            <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Kategorie</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg cursor-pointer appearance-none"
            >
              <option>Halterung</option>
              <option>Ersatzteil</option>
              <option>Deko / Kunst</option>
              <option>Prototyp</option>
              <option>Sonstiges</option>
            </select>
          </div>
        </div>

        <div className="space-y-8">
          <div className="group">
            <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Projektbeschreibung *</label>
            <textarea 
              name="description"
              rows={1}
              required 
              value={formData.description}
              onChange={handleChange}
              placeholder="Was möchtest du drucken?"
              className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg placeholder:text-gray-200 resize-none overflow-hidden"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Material</label>
              <input 
                name="material"
                type="text" 
                value={formData.material}
                onChange={handleChange}
                placeholder="z.B. Carbon"
                className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg placeholder:text-gray-200"
              />
            </div>
            <div className="group">
              <label className="block text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Maße</label>
              <input 
                name="dimensions"
                type="text" 
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="cm / mm"
                className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-all text-lg placeholder:text-gray-200"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 pt-12">
          <button 
            type="submit"
            className="w-full md:w-auto bg-black text-white px-16 py-5 rounded-full font-semibold transition-all hover:bg-gray-800 active:scale-[0.98] text-lg shadow-lg"
          >
            Anfrage jetzt vorbereiten
          </button>
          <p className="mt-6 text-[11px] text-gray-400 text-center md:text-left">
            * Pflichtfelder. Das Formular öffnet dein E-Mail Programm für maximale Sicherheit.
          </p>
        </div>
      </form>
    </section>
  );
};
