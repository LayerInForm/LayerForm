# LayerForm – Website

3D-Druck & CAD für Privatkunden und Unternehmen – [layer-form.de](https://layer-form.de)

## Lokal starten

```
npm install
npm run dev
```

Dann im Browser http://localhost:5173 öffnen.

## Veröffentlichen (Vercel)

Framework: **Vite** · Build-Befehl: `npm run build` · Ausgabeordner: `dist`

## Wo ändere ich was?

| Was | Datei |
| --- | --- |
| Etsy-Link | `components/links.ts` |
| Projekte & Bilder | `components/Projects.tsx`, Bilder in `public/projects/` |
| Google-Rezensionen | `components/Reviews.tsx` (Liste `REVIEWS`, `REVIEW_COUNT`) |
| Anfrage-Ziel (E-Mail / WhatsApp) | `components/InquiryForm.tsx` |
| Kontaktdaten | `components/ConsultationHub.tsx` |
| Impressum, AGB, Datenschutz | `components/LegalPages.tsx` |
| Farben | `tailwind.config.js` |
