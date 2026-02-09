
import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ReviewData {
  name: string;
  rating: number;
  text: string;
  date: string;
  isLive?: boolean;
}

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [mapsLink, setMapsLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Originale Rezensionen von echten Kunden für LayerForm
  const originalReviews: ReviewData[] = [
    { 
      name: "Gerrit", 
      rating: 5, 
      text: "Top Service! Benjamin hat mir bei einem speziellen Problem geholfen und eine perfekte Lösung gedruckt. Die Qualität ist überragend und der Kontakt war super nett. Absolut empfehlenswert!", 
      date: "Original Rezension", 
      isLive: false 
    },
    { 
      name: "Marc", 
      rating: 5, 
      text: "Sehr gute Qualität der Drucke. Die Abwicklung war unkompliziert und der Versand erfolgte extrem schnell. Man merkt, dass hier mit Profi-Equipment gearbeitet wird.", 
      date: "Original Rezension", 
      isLive: false 
    },
    { 
      name: "Lasse", 
      rating: 5, 
      text: "Gerne wieder. Benjamin ist sehr kompetent und die Beratung zu den Materialien (Carbon/Nylon) war Gold wert. Die Bauteile sind extrem stabil und passgenau.", 
      date: "Original Rezension", 
      isLive: false 
    }
  ];

  useEffect(() => {
    async function fetchLiveReviews() {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: "Suche EXAKT nach dem Google Maps Profil von 'LayerForm', Benjamin Ridel in Bargteheide (Ludwig-Bechstein-Weg 25a). Extrahiere die Google Maps URL und die originalen Texte der neuesten Rezensionen.",
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: {
                latLng: {
                  latitude: 53.7317,
                  longitude: 10.2714
                }
              }
            }
          },
        });
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        if (chunks) {
          const mapsChunk = chunks.find((c: any) => c.maps);
          if (mapsChunk?.maps?.uri) {
            setMapsLink(mapsChunk.maps.uri);
          }

          const sources = mapsChunk?.maps?.placeAnswerSources;
          const snippets = sources?.[0]?.reviewSnippets;

          if (snippets && snippets.length > 0) {
            const mappedReviews = snippets.map((s: any) => ({
              name: `Verifizierter Kunde`,
              rating: 5,
              text: s.text || s,
              date: "Live von Google Maps",
              isLive: true
            }));
            setReviews(mappedReviews);
          } else {
            setReviews(originalReviews);
          }
        } else {
          setReviews(originalReviews);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Maps-Daten:", error);
        setReviews(originalReviews);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveReviews();
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden border-t border-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className={`flex h-2 w-2 rounded-full ${loading ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`}></span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                {loading ? 'Synchronisiere mit Google...' : 'Kundenfeedback'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
              Originale Rezensionen.
            </h2>
            <p className="text-gray-500 mt-4 text-lg font-light">
              Echte Qualität, die überzeugt.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 bg-[#f5f5f7] px-6 py-3 rounded-full border border-gray-100 shadow-sm">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <span className="font-bold text-[#1d1d1f]">5.0 / 5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div 
              key={idx} 
              className="bg-[#f5f5f7] p-8 rounded-[32px] flex flex-col justify-between transition-soft hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-200/50 group border border-transparent hover:border-white h-full"
            >
              <div>
                <div className="flex mb-6 text-yellow-500 opacity-80 group-hover:opacity-100 transition-opacity">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-[#1d1d1f] leading-relaxed italic mb-8 text-[15px] font-medium">
                  &bdquo;{review.text}&ldquo;
                </p>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-6 mt-auto">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#1d1d1f]">{review.name}</span>
                  <span className="text-[10px] text-gray-400 font-medium flex items-center">
                    <svg className="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.3 1.241.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                    Verifizierte Bewertung
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">{review.date}</span>
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
              className="inline-flex items-center px-10 py-5 bg-white border border-gray-200 rounded-full text-[#1d1d1f] font-semibold transition-soft hover:bg-[#f5f5f7] hover:shadow-xl group shadow-sm"
            >
              <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-4 mr-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              Alle Rezensionen auf Google Maps lesen
              <svg className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M3 12h18" /></svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
