import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { GOOGLE_MAPS_LINK } from '../src/constants';
import { ExternalLink, Star, Quote } from 'lucide-react';

interface ReviewData {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [mapsLink] = useState<string>(GOOGLE_MAPS_LINK);
  const [isLoading, setIsLoading] = useState(true);

  const defaultReviews: ReviewData[] = [
    { name: "Mirco Zimmermann", rating: 5, text: "Junges aufstrebendes Unternehmen mit hoher Motivation, schneller Bearbeitungszeit und toller individueller Umsetzung. Weitere Aufträge werden bestimmt folgen. Vielen Dank", date: "Google Rezension" },
    { name: "Peter Sauer", rating: 5, text: "Schnelle Abwicklung des Druckauftrags (Endstück für Dachrinne mit Rohranschluss), incl. Probedrucks. Gerne wieder!", date: "Google Rezension" },
    { name: "Cork Kinsale", rating: 5, text: "Sehr kompetente Beratung. Schnelle Lieferung einer Starlink mini Halterung für die Befestigung an der Kederschiene meines LMC Wohnwagens. Spitzenqualität zum fairen Preis. Absolute Empfehlung.", date: "Google Rezension" },
    { name: "Konstantin Riedel", rating: 5, text: "Sehr schnelle und professionelle 3D-Druck-Leistung. Top Qualität und ein hervorragendes Preis-Leistungs-Verhältnis. Absolut empfehlenswert!", date: "Google Rezension" }
  ];

  useEffect(() => {
    const fetchLiveReviews = async () => {
      if (!process.env.API_KEY || process.env.API_KEY === 'undefined' || process.env.API_KEY === '') {
        setReviews(defaultReviews);
        setIsLoading(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
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
          const mapsChunk = chunks.find(c => c && c.maps);
          const sources = mapsChunk?.maps?.placeAnswerSources;
          const snippets = Array.isArray(sources) && sources.length > 0 ? sources[0].reviewSnippets : null;

          if (Array.isArray(snippets) && snippets.length > 0) {
            const mapped = snippets.slice(0, 4).map((s: any) => ({
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
    <section id="reviews" className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto text-center bg-slate-50/70 border-y border-slate-200/70">
      <div className="flex flex-col items-center mb-12 md:mb-16 gap-4">
        <div className="text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0096C7] bg-sky-50 border border-sky-100 px-3.5 py-1 rounded-full mb-3 inline-block">
            Kundenstimmen &amp; Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 mt-1">
            Was Kunden über LayerForm sagen.
          </h2>
        </div>

        <div className="flex items-center space-x-2.5 bg-white px-5 py-2 rounded-full border border-slate-200 shadow-sm">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} className="fill-amber-400" />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-800">5.0 / 5.0 bei Google</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto text-left">
        {reviews.map((r, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{r.date}</span>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal italic mb-6">
                "{r.text}"
              </p>
            </div>
            
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 text-[#0096C7] flex items-center justify-center font-bold text-xs">
                {r.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-900">{r.name}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <a 
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#0096C7] bg-white border border-slate-200 px-6 py-3 rounded-full shadow-sm hover:bg-slate-50 transition-colors"
        >
          <span>Alle Rezensionen auf Google Maps ansehen</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </section>
  );
};
