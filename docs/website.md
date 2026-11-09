# Website, Quellcode und Deployment

**Stand: 09.11.2026 · Quelle:** GitHub `LayerInForm/LayerForm`, [Integrationen](integrations.md). Das Projekt `layerform` auf Vercel wird als Host genannt; Deployment-Aktivität gesondert prüfen.

## Architektur

| Ebene | Technologie / Ort | Funktion |
| --- | --- | --- |
| UI | React 19, TypeScript, Vite, Tailwind CSS | Öffentliche Unternehmenswebsite |
| API | `api/` (Vercel Serverless Functions) | Kontaktformular, Preisrechner, Uploads, Consent, interner Bereich |
| CRM | HubSpot | Kontakt, Deal, Notiz, Dateizuordnung |
| Wiederholungsschutz | Upstash Redis | Anfrage-ID, Fingerprint, Status und idempotente Schreibmarkierung |
| E-Mail | Resend | Optionale Kundenbestätigung, **kein Geschäftsanfrage-Fallback** nach jüngster Umstellung |
| Dateiablage | Vercel Blob / HubSpot Files | Rechner-Uploads bzw. private CRM-Dateikopien |
| Deployment | Vercel | `npm run build` → `dist` |
| Rechtliches | `components/LegalPages.tsx` | Impressum, Datenschutzerklärung, weitere Rechtstexte |

## Wichtige Pfade

- `src/constants.ts`: öffentliche Firmendaten und Social-/WhatsApp-Links.
- `src/features.ts`: `PREISRECHNER_AKTIV = false` (letzte Codeprüfung).
- `src/pricing.ts`, `components/calculator/`: Preisrechner.
- `components/InquiryForm.tsx`: Kontaktformular.
- `components/Projects.tsx`, `data/`: öffentlich dargestellte Produkte und Beispiele.
- `components/LegalPages.tsx`: Rechtstexte (bei Relaunch besonders schützen).
- `api/kontakt.ts`: Anfrageformular zur HubSpot-Verarbeitung.
- `api/anfrage.ts`: Preisrechneranfrage und Dateilinks.
- `api/_lib/hubspot.ts`, `api/_lib/inquiries.ts`: CRM-Logik, Fehler- und Idempotenzbehandlung.
- `api/consent.ts`: pseudonymisierte Consent-Protokollierung.
- `api/intern/`, `components/internal/`, `vercel.json`: interner Bereich.

## Besonderheiten, die bei Änderungen nicht verloren gehen dürfen

1. Die Website erstellt für eine **neue** Anfrage einen Deal, darf aber beim Retry derselben Anfrage-ID keinen zweiten erstellen.
2. Redis speichert eine Schreibmarkierung, bevor ein potenziell nicht-idempotenter Deal-POST ausgelöst wird. Bei unklarem Schreibresultat **nicht blind löschen**: erst mit HubSpot abgleichen. Siehe [integrations.md](integrations.md).
3. WhatsApp-Link öffnet einen Chat. **Allein der Klick erzeugt keinen CRM-Deal.**
4. Marketing-Einwilligung wird aus einer normalen Kontaktanfrage **nicht** abgeleitet.
5. Preisrechner-Richtpreis ist **kein verbindliches Kundenangebot**.
6. Optionale Resend-Bestätigung darf eine erfolgreich abgeschlossene CRM-Anlage nicht rückwirkend scheitern lassen.
7. `vercel.json` enthält Pfade für `/intern`, API- und Sicherheitsheader; nicht unbedacht entfernen.
8. Historische Relaunch-Absprachen: `components/LegalPages.tsx`, `data/` und `src/constants.ts` erhalten. `.env.local` gehört nicht in Git.

## Prüfprogramm nach einer Website-Änderung

- `npm run lint`, `npm run check:api`, `npm test`, `npm run build` (wenn Änderungen dazu passen).
- GitHub-Änderung, Vercel-Buildstatus und Browserfunktion getrennt kontrollieren.
- Bei Formularänderungen zuerst mit Mocks testen; kostenpflichtige oder echte Kundendaten erzeugende Live-Tests nur gezielt und freigegeben.
- **Consent ist offen:** Eigener Banner/Receipt-Code existiert; der Wunsch, auf HubSpot-Verwaltung umzusteigen, ist dokumentiert, aber Umsetzung nicht bestätigt. Keine voreilige Abschaltung.

## Dezente Designpflege (09.11.2026)

Vorhandene dunkelblaue/Cyan-Identität, Outfit/Geist-Mono, echte Projektfotos und bestehende React-/Tailwind-Komponenten weiterverwendet. Anpassungen: kompaktere Hero-Typografie und Bildhöhe, weniger aggressive Laufweite, besser lesbare Nebentext-Tokens, ruhigerer Blauverlauf, zurückhaltenderes Filmkorn, einheitliche Button-Radien sowie explizite Hover-/Active-/Disabled-Zustände. Navigation setzt Hintergrund und Trennlinie abhängig vom Scroll-/Menüzustand. Keine neuen Abhängigkeiten oder Bilder.

Formularübertragung, Materialmapping, Turnstile, Consent, Rechtstexte und Feature-Schalter sind nicht Gegenstand dieser Änderung. Vorhandene Reduced-Motion-Regeln und Tastatur-Fokus bleiben erhalten. Kein Komponentenimport aus 21st: CLI-/Katalogzugriff war in der ausgefallenen lokalen Umgebung nicht verfügbar. Designkontext wurde aus dem Repository gelesen; keine neue Designrichtung gewählt.

Validierung: Typechecks, bestehende Tests und Vercel-Build werden auf dem konkreten Branch geprüft. Browserdarstellung und Mobilprüfung sind wegen Ausfall der Browser-Verbindung noch offen; ein erfolgreicher Build ist kein visueller Nachweis.
