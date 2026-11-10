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

## Farbpalette Schwarz / Blau / Limette (09.11.2026)

Nutzerpalette: `#030407` für den Seitengrund, `#1558C9` für blaue Flächen und `#D4FF24` für primäre Aktionen, Fokus und Highlights. Abgeleitete dunkle Neutralflächen und helle Texttöne sichern die Lesbarkeit. Der bestehende Tokenname `cyan` ist aus Kompatibilitätsgründen ein Alias für Limette; `blue` und `deep` verwenden das gewünschte Blau. Hero-Faktenleiste und Kontaktfläche führen Blau sichtbar ein; Bildüberlagerungen, Formular-Akzente und CSS-Fokus wurden auf die Palette abgestimmt.

Kontrastprüfung der Vollfarben: Limette/Schwarz 17,70:1; Weiß/Blau 6,42:1; Limette/Blau 5,54:1. Bestehendes Logo-Bild und Projektfotos bleiben Originale. Keine Anfrage-, Consent- oder Spamschutzlogik geändert. Visuelle Browserprüfung wegen nicht verfügbarer Browser-Verbindung weiterhin offen.

## Helle Nutzerpalette Gelb / Schwarz / Lila (09.11.2026)

Aktuelle Nutzerentscheidung ersetzt die dunkle Farbvariante: `#FFF21A` als Seitengrund, `#171717` für Schrift, `#A66BFF` für Buttons und Akzentflächen. Karten nutzen abgeleitete helle Gelbtöne; Kontakt- und Faktenflächen Lila. Alle Text-Akzente sind dunkel, damit Lila nicht als kontrastarme kleine Schrift auf Gelb erscheint. Fokus und wichtige Button-Rahmen sind dunkel.

Umstellung umfasst Theme, CSS, Navigation, Hero-Bildbeschriftungen, Projekte, Leistungen, CAD, Automation, Bewertungen, Kontakt, Footer und Formular-/Rechner-Darstellung. Rechtstexte werden nur über CSS an helle Flächen angepasst, ihre Inhalte bleiben bestehen. Fotos und Logo-Datei bleiben Originale. Nicht aktive Rechneransicht bleibt deaktiviert.

Gemessene Vollfarb-Kontraste: Schwarz/Gelb 15,34:1; Schwarz/Lila 5,27:1; Schwarz/helle Karte 16,46:1. Typechecks, bestehende Routentests und Build im Preview ausführen; echte Browser-/Mobilkontrolle bleibt wegen Browser-Ausfall offen. Keine Änderung an CRM-, Upload-, Consent- oder Turnstile-Verarbeitung.

## Farbentscheidung korrigiert (09.11.2026)

Die helle gelb-lila Variante aus PR #9 wurde vom Nutzer verworfen. Darstellung auf den Stand vor PR #9 zurückgesetzt: #030407 als Grund, #1558C9 für blaue Flächen, #D4FF24 für Highlights. Der zuvor veröffentlichte Design-Feinschliff bleibt enthalten. Keine Integrations- oder Spamschutzlogik zurückgesetzt.

## Aktuelle Farbentscheidung: Logo-Palette (09.11.2026)

Auf ausdrücklichen Nutzerwunsch gelten wieder die ursprünglichen Logo-Farben: Marineblau #040B1D, Cyan #00E5FF, helle Schrift. Betroffene Farbdateien exakt aus dem bereits geprüften Stand nach PR #7 (a8116ce2a4e3a9590d7484a48aa60c0a7beb7341) wiederhergestellt. Frühere Schwarz/Blau/Limette- und Gelb/Lila-Experimente sind verworfen. Design-Feinschliff aus PR #7 sowie Formular-, Material- und Spamschutzfunktionen bleiben erhalten.

## SEO und Sichtbarkeit in KI-Suchen (10.11.2026)

**CODE-VERIFIZIERT:** Öffentliche Inhalte werden beim Build mit React serverseitig zu statischen HTML-Dateien vorgerendert. `scripts/prerender.tsx` und `scripts/generate-pages.mjs` verwenden dieselben Komponenten und Inhalte wie der Browser. Keine gesonderte Crawler-Version. Die React-App übernimmt anschließend die Interaktionen; Formulare benötigen JavaScript und bieten einen Hinweis mit direkten Kontaktwegen ohne JavaScript.

- Neue Leistungsseiten: `/3d-druck`, `/cad-konstruktion`, `/automatisierung`. Standort Bargteheide, deutschlandweiter Versand bei Druckteilen, konkrete Anforderungen, Projektbilder aus vorhandenen Assets, sichtbare Antworten auf häufige Fragen und direkte Anfragewege. Keine erfundenen Preise, Lieferzeiten, Kundenreferenzen oder Ranking-Versprechen.
- Zehn öffentliche Ansichten einschließlich Kontakt, Anfrage und bestehender Rechtstexte haben eigene HTML-Dateien, Titel, Beschreibung, Canonical, Open-Graph-Angaben und JSON-LD. Vorhandene Rechtstext-Inhalte bleiben erhalten.
- Navigation und Footer verlinken die Seiten über echte URLs. Client-Navigation aktualisiert Metadaten; Browser-Zurück und Direktaufrufe werden berücksichtigt. Vercel `cleanUrls` bedient die erzeugten HTML-Dateien unter den kurzen URLs. Interne Pfade, APIs und deren Schutzheader bleiben erhalten.
- Sitemap enthält Startseite, drei Leistungen und Kontakt. Keine erfundenen Änderungsdaten. `robots.txt` erlaubt öffentliche Seiten bereits allgemein; dies schließt Suchcrawler wie OAI-SearchBot ein. Kein zusätzlicher Training-Zugriff gegenüber dem bisherigen Stand eingerichtet.
- Strukturierte Daten: Organization, WebPage, auf Leistungsseiten zusätzlich Service und BreadcrumbList. Nur sichtbare bzw. bereits öffentlich bestätigte Unternehmensangaben; keine fiktive Straßenadresse, AggregateRating oder versprochene FAQ-Rich-Results.
- Initiale Inhalts-Reveals verbergen den statischen Text nicht. Bestehende Gestaltung in Marineblau/Cyan bleibt bestehen.

**Prüfungen:** `npm run lint`, `npm run check:api`, bestehende 21 Tests und `npm run build`. Der Build prüft zusätzlich die tatsächlichen HTML-Ausgaben: eindeutige Titel, genau eine H1, Canonicals, JSON-LD, interne Links, referenzierte Assets und Sitemap. Browser- und produktive URL-Prüfung separat dokumentieren; ein erfolgreicher Build allein bestätigt keinen Live-Status.

**Aktualisierung 10.11.2026 / Erfolgsmessung:** Search Console ist inzwischen über OpenSEO angebunden. Sitemap und Indexierungsanträge wurden laut Nutzer eingereicht. Das bestätigt noch keine Indexierung der Leistungsseiten oder einen Anfragezuwachs. Suchbegriffe, Klicks, Impressionen und tatsächlich eingegangene qualifizierte Anfragen getrennt auswerten. Keine neue CRM-Aufgabe und kein zusätzliches Tracking angelegt. Bestehende Consent-Regeln bleiben erhalten.

### Weitere Inhaltsverbesserung und IndexNow (10.11.2026)

- `/3d-druck`: sichtbarer Materialvergleich für PLA, PETG, ASA, ABS und TPU mit Anwendungen und Auswahlgrenzen; technische Orientierung am verlinkten Bambu-Lab-Leitfaden. Keine garantierten Bauteileigenschaften oder pauschalen Temperaturgrenzen. Tabelle ist auch im statischen HTML vorhanden und auf kleinen Bildschirmen innerhalb ihres Bereichs scrollbar.
- Gegenseitige kontextbezogene Verweise zwischen CAD-Konstruktion und 3D-Druck helfen Interessenten mit und ohne fertige Datei.
- Google-Gesamtzahl von 12 auf 15 Rezensionen aktualisiert, Bewertung weiter 5,0; öffentliches Unternehmensprofil am 10.11.2026 geprüft. Vorhandene Rezensionstexte unverändert. Keine selbstbezogenen Bewertungs-Rich-Results hinzugefügt.
- Öffentliche IndexNow-Verifikationsdatei im Website-Root vorbereitet. Dieser Verifikationswert ist absichtlich öffentlich und kein API-Secret. Nach Deployment neue/geänderte Seiten melden; Google nutzt IndexNow nicht. Eine erfolgreiche Annahme bestätigt keine Indexierung.
- Google-Unternehmensprofil: Beschreibung und HTTPS-Link gespeichert; sechs Dienstleistungen mit Beschreibungen eingereicht, Freigabe zuletzt ausstehend. Vorhandener abgelehnter WhatsApp-Änderungsvorschlag bleibt offen. Keine Account-/Sessiondaten in Git dokumentieren.

Validierung: Frontend- und API-Typechecks, 21 bestehende Tests sowie Build einschließlich SEO-HTML-Prüfungen bestanden. Produktionsstatus separat am Deployment nachweisen. 21st-CLI ist in dieser Umgebung nicht installiert; bestehende Website-Komponenten und Tokens wiederverwendet.

Grundlagen: [Google KI-Funktionen](https://developers.google.com/search/docs/appearance/ai-features), [JavaScript-SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [crawlbare Links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [OpenAI Publisher-FAQ](https://help.openai.com/de-de/articles/12627856-publisher-und-entwickler-faq). GEO wird hier als bessere Zugänglichkeit, eindeutige Fakten und hilfreiche Inhalte umgesetzt; keine spezielle Datei garantiert Aufnahme in KI-Antworten.

### Absenden ohne zusätzliche Checkbox (10.11.2026)

Auf Nutzerwunsch entfällt im öffentlichen Anfrageformular die Pflicht-Checkbox zur Datenverarbeitung samt Validierung. Ein sachlicher Hinweis zur Bearbeitung der Anfrage und ein regulärer Link zur Datenschutzerklärung bleiben sichtbar. Die bestehende Datenschutzerklärung benennt hierfür bereits Art. 6 Abs. 1 lit. b DSGVO; keine neue Marketing-Einwilligung. Die gesonderte Auswahl optionaler Website-Dienste bleibt bestehen.

Turnstile wird weiterhin erst nach gültigem Sendeversuch geladen. Der Widget-Container befindet sich jetzt direkt über den Versandbuttons. `appearance: interaction-only` zeigt das Widget nur, wenn eine Interaktion erforderlich ist; dann wird der Bereich in Sicht gebracht. Der Button unterscheidet „Wird geprüft …“ von „Wird gesendet …“, beide Versandwege sind während der Übertragung gesperrt. Serverprüfung, Schlüssel und Anfrage-Fingerprints unverändert.

Cloud-Browser bleibt auf Nutzerwunsch geschlossen. Typechecks, bestehende Tests, Build und statisches Formular-Markup prüfen; keine neue echte Testanfrage oder visuelle Browserprüfung für diesen Change.

### Materialauswahl mit Kurzbeschreibung (10.11.2026)

Im Anfrageformular stehen ausschließlich PLA, PETG, ASA, ABS und TPU zur Auswahl. „Auf Anfrage“ und die bisherige Vorbelegung entfallen. Unter der Auswahl erscheint abhängig vom gewählten Material eine kurze Beschreibung mit typischen Anwendungen in heller, normal gewichteter Schrift. Ein Live-Bereich macht den Textwechsel für assistive Technik verfügbar. Ohne Materialauswahl bleibt das Absenden möglich; der bestehende Backend-Wert `offen` bleibt erhalten. Keine Formular-, Spamschutz- oder CRM-Schnittstelle geändert.
