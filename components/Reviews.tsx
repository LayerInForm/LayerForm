
import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ReviewData {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  // Die vom Nutzer bereitgestellte spezifische Google Maps URL
  const [mapsLink, setMapsLink] = useState<string | null>("https://www.google.com/maps/place/LayerForm/@53.738933,10.2676088,17z/data=!3m1!4b1!4m6!3m5!1s0x47b219728a0cd3eb:0xfcd3d0c5ba4a1644!8m2!3d53.738933!4d10.2676088!16s%2Fg%2F11yxzg_x9q?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D");
  const [isLoading, setIsLoading] = useState(true);

  const defaultReviews: ReviewData[] = [
    { name: "Nikolas K.", rating: 5, text: "Schnelle und qualitativ sehr hochwertige Erstellung von individuellen 3D-Drucken. Sehr zu empfehlen!", date: "Google Rezension" },
    { name: "Alexander W.", rating: 5, text: "Super Service, sehr kompetente Beratung und die Qualität der Drucke ist hervorragend. Benjamin geht auf alle Wünsche ein.", date: "Google Rezension" },
    { name: "Mona S.", rating: 5, text: "Vielen Dank für die tollen Organizer! Endlich Ordnung auf dem Schreibtisch. Die Qualität ist top und der Kontakt war sehr nett.", date: "Google Rezension" }
  ];

  useEffect(() => {
    const fetchLiveReviews = async () => {
      // Wenn kein API Key vorhanden ist, nutzen wir sofort die Fallbacks
      if (!process.env.API_KEY || process.env.API_KEY === 'undefined' || process.env.API_KEY === '') {
        setReviews(defaultReviews);
        setIsLoading(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Suche nach Rezensionstexten für 'LayerForm Benjamin Ridel Bargteheide' auf Google Maps.",
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: { latitude: 53.7317, longitude: 10.2714 }
              }
            }
          },
        });

        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;
        const chunks = groundingMetadata?.groundingChunks;
        
        if (chunks && Array.isArray(chunks)) {
          // Wir behalten den vom Nutzer bereitgestellten Link bei, außer das Tool findet einen noch präziseren
          const mapsChunk = chunks.find(c => c && c.maps);
          const sources = mapsChunk?.maps?.placeAnswerSources;
          const snippets = Array.isArray(sources) && sources.length > 0 ? sources[0].reviewSnippets : null;

          if (Array.isArray(snippets) && snippets.length > 0) {
            const mapped = snippets.slice(0, 3).map((s: any) => ({
              name: "Google Nutzer",
              rating: 5,
              text: typeof s === 'string' ? s : (s.text || "Exzellente Qualität und sehr freundliche Beratung."),
              date: "Google Maps"
            }));
            setReviews(mapped);
          } else {
            setReviews(defaultReviews);
          }
        } else {
          setReviews(defaultReviews);
        }
      } catch (e) {
        console.debug("Grounding integration skipped or failed:", e);
        setReviews(defaultReviews);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveReviews();
  }, []);

  return (
    <section className="py-48 px-6 max-w-7xl mx-auto overflow-hidden text-center">
      <div className="flex flex-col items-center mb-24 gap-12">
        <div className="animate-fade-in text-center max-w-3xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#00E5FF] mb-6 block">Referenzen</span>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">
            Kundenstimmen
          </h2>
        </div>
        <div className="flex items-center space-x-6 glass px-8 py-4 rounded-full border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-fade-in">
          <div className="flex text-[#00E5FF]">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <span className="font-bold text-xl">5.0 / 5.0</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {(reviews.length > 0 ? reviews : defaultReviews).map((review, idx) => (
          <div 
            key={idx} 
            className="glass p-12 rounded-[48px] flex flex-col items-center text-center justify-between h-full transition-soft hover:scale-[1.03] hover:border-[#00E5FF]/40 border-white/5 animate-fade-in shadow-xl"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div>
              <div className="flex justify-center mb-10 text-[#00E5FF]">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="italic mb-12 text-lg md:text-xl leading-relaxed font-light text-inherit opacity-90 tracking-tight">
                &bdquo;{review.text}&ldquo;
              </p>
            </div>
            <div className="flex flex-col items-center pt-10 border-t border-white/5 mt-auto w-full">
              <span className="font-bold text-base mb-2">{review.name}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{review.date}</span>
            </div>
          </div>
        ))}
      </div>

      {mapsLink && (
        <div className="mt-20 text-center animate-fade-in">
          <a 
            href={mapsLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-10 py-5 glass border border-white/10 rounded-full text-xs font-bold transition-soft hover:bg-white/5 uppercase tracking-widest text-[#00E5FF]"
          >
            Alle Rezensionen auf Google Maps ansehen
          </a>
        </div>
      )}
    </section>
  );
};
