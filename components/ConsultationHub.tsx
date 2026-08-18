import React from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import { 
  CONTACT_EMAIL, 
  CONTACT_PHONE, 
  WHATSAPP_LINK
} from '../src/constants';

interface ConsultationHubProps {
  onInquiryClick: () => void;
}

export const ConsultationHub: React.FC<ConsultationHubProps> = ({ onInquiryClick }) => {
  const channels = [
    {
      title: "WhatsApp",
      subtitle: "Direkter Draht",
      desc: "Fotos, Maße oder kurze Fragen unkompliziert per Chat klären.",
      icon: MessageSquare,
      link: WHATSAPP_LINK,
      isExternal: true,
      actionText: "Chat starten",
      color: "#25D366"
    },
    {
      title: "Projektanfrage",
      subtitle: "Online Formular",
      desc: "CAD-Dateien (STEP/STL) und Spezifikationen direkt einreichen.",
      icon: FileText,
      onClick: onInquiryClick,
      actionText: "Anfrage starten",
      color: "#0096C7"
    },
    {
      title: "Telefon",
      subtitle: "Persönlich",
      desc: "Machbarkeit, Material oder Fristen direkt besprechen.",
      icon: Phone,
      link: `tel:${CONTACT_PHONE.replace(/\s+/g, '')}`,
      isExternal: false,
      actionText: CONTACT_PHONE,
      color: "#0096C7"
    },
    {
      title: "E-Mail",
      subtitle: "Dokumente",
      desc: "Technische Zeichnungen oder Leistungsverzeichnisse zusenden.",
      icon: Mail,
      link: `mailto:${CONTACT_EMAIL}`,
      isExternal: false,
      actionText: CONTACT_EMAIL,
      color: "#0096C7"
    }
  ];

  return (
    <section id="consultation" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10 md:mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0096C7] bg-sky-50 border border-sky-100 px-3.5 py-1 rounded-full mb-3 inline-block">
          Kontakt
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 mt-1">
          Jetzt Projekt anfragen.
        </h2>
        <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto font-normal">
          Wählen Sie Ihren bevorzugten Kontaktkanal.
        </p>
      </div>

      {/* Grid of channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {channels.map((ch, idx) => {
          const Icon = ch.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0096C7]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center transition-colors shadow-2xs"
                    style={{ backgroundColor: `${ch.color}15`, color: ch.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {ch.subtitle}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-[#0096C7] transition-colors">
                  {ch.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6 font-normal">
                  {ch.desc}
                </p>
              </div>

              <div>
                {ch.link ? (
                  <a
                    href={ch.link}
                    target={ch.isExternal ? "_blank" : undefined}
                    rel={ch.isExternal ? "noopener noreferrer" : undefined}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#0096C7] text-slate-800 hover:text-white border border-slate-200/80 hover:border-[#0096C7] text-xs font-bold transition-all flex items-center justify-between group/btn"
                  >
                    <span className="truncate">{ch.actionText}</span>
                    <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                ) : (
                  <button
                    onClick={ch.onClick}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#0096C7] text-slate-800 hover:text-white border border-slate-200/80 hover:border-[#0096C7] text-xs font-bold transition-all flex items-center justify-between group/btn"
                  >
                    <span>{ch.actionText}</span>
                    <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
