# Betriebsorganisation und Schnittstellenpflege

**Stand: 09.11.2026.** Dieser Leitfaden enthält bewusst keine privaten Arbeitszeiten, sensiblen Finanzkennzahlen, Zugänge oder Kundendaten.

## Operative Zuständigkeiten

| Aufgabe | Führendes System | Dokumentationsort |
| --- | --- | --- |
| Angebot, Kunde, Deal und Aufgaben | HubSpot | `hubspot.md`, `prozesse.md` |
| Website, API, Preisrechner, Datenschutz-Code | GitHub / Vercel | `website.md`, `integrations.md` |
| Fertigung, CAD und Materialwahl | Auftrag und CAD-System | `unternehmen.md`, `projekte.md` |
| Rechnung und Buchhaltung | Lexware Office | `prozesse.md`, `versand.md` |
| Label, Sendungsnummer, Versandbenachrichtigung | DHL und CRM | `versand.md` |
| Kampagnen, Social, Produktideen | Eigene Kanaltools | `marketing.md` |
| Technische Integration und Fehlerfälle | GitHub-Code + Live-System | `integrations.md` |
| Dauerhafte Entscheidungen und Chat-Übergabe | GitHub `docs/` | `status.md`, `chat-uebergabe.md` |

## Grafische Prozesslandkarte (ergänzend zur GitHub-Wissensbasis)

**Stand: 09.11.2026 · MITGETEILT / früherer Miro-Schreibabgleich, kein aktueller Live-Nachweis.**

Das [LayerForm-Miro-Board](https://miro.com/app/board/uXjVEQXa8OM=/) dient als **visuelle Navigation**, nicht als eigenständige Dokumentations- oder Kundendatenquelle. Es stellt die Geschäftsprozesse horizontal dar und ordnet Software den Verantwortlichkeiten zu. Die verbindlichen, versionierten Inhalte verbleiben unter `docs/`; Systemstände müssen im jeweiligen Live-System geprüft werden.

| Bereich der Mindmap | Zuständige Anwendungen | Grenze / Zuständigkeit |
| --- | --- | --- |
| Marketing und Lead-Kanäle | Website, Instagram, TikTok, Metricool, Etsy, Kleinanzeigen, WhatsApp | Kanal- und Postingzustände beim Anbieter prüfen |
| Anfrageeingang | Website, Vercel API, Upstash Redis, Gmail | Website-Anfragen laufen laut aktuellem Code nach HubSpot; externe Mail-/WhatsApp-Flows getrennt prüfen |
| CRM und Angebot | HubSpot, Gmail, Kalkulations-App | HubSpot führt Kontakte, Deals und Status; Kalkulation/Angebotsfreigabe separat bestätigen |
| CAD und 3D-Druck | Fusion 360, Bambu Studio, Bambu-Lab-Drucker | Manuelle Machbarkeits- und Qualitätskontrolle |
| Rechnung und Zahlung | Lexware Office, PayPal/Bank, ggf. Gmail/Apps Script | Rechnungsbeleg ≠ Zahlung; Script-Trigger und Matching nicht ungeprüft als live bezeichnen |
| Versand | HubSpot, Google Apps Script, DHL | DHL-Sandbox nicht mit Produktivlabel verwechseln; Tracking erst nach bestätigter Buchung |
| Website und Infrastruktur | GitHub, Vercel, Resend, Upstash, Ubuntu, Caddy, Tailscale | Code, Deployment und private Infrastruktur getrennt verifizieren |
| KI und Wissensarbeit | ChatGPT, ggf. Gemini, GitHub `docs/`, Miro | KI-Tools sind Assistenzsysteme, nicht verbindliche Quellen für operative Daten |

**Linknavigation:** Die Miro-Mindmap enthält nach früherem Chat-Abgleich anklickbare Software-Verweise. Sie ersetzen keine Prüfung von Ziel-URL, Zugriffsrechten oder tatsächlicher Integration. Gemini-Einsatz und vollständige Apps-Script-/HubSpot-Workflow-Zuordnung bleiben **OFFEN**.

**Pflegeregel:** Nach relevanten Änderungen zuerst die passende Datei in `docs/` und `status.md` aktualisieren. Eine optionale grafische Anpassung in Miro erfolgt danach; sie gilt erst nach erfolgreichem Miro-Read-back als verifiziert. Keine Kundenliste, Einzelaufträge, Zugangsdaten oder nicht freigegebene Fallbeispiele veröffentlichen.

## Change-Management für mehrere Chats

- In jeder Aufgabe mindestens **System, Ziel, Risiko, Status und notwendige Freigabe** benennen.
- Kein Chat soll eigenständig eine zweite Pipeline, Dublettenlogik, Zahlungsquelle oder Knowledge-Base erfinden.
- Wenn zwei Chats dieselbe Integrationsfläche berühren, zuerst den aktuellen GitHub-Stand lesen und einen gemeinsamen Integrationsvertrag aktualisieren.
- Für Produktivänderungen aktuelle Trigger, Deployment-Konfiguration, Datenschutz und Auswirkungen auf Bestandsaufträge prüfen.
- Änderungen in `docs/` sollen nachvollziehbar über Commit/PR erfolgen. Nach einer Umsetzung den Status auf `UMGESETZT` setzen, nach erfolgreichem Live-Test ggf. auf `LIVE-VERIFIZIERT`.

## Beispielhafter Deal-Check

1. Kontakt/Deal eindeutig ermitteln, offene Vorgänge und Verknüpfungen prüfen.
2. Aktuelles Feld-/Stadium und geplanten Wert erfassen.
3. Prüfen, ob Apps Script, CRM-Workflows oder E-Mail-Prozesse ausgelöst werden.
4. Nur freigegebene Änderung schreiben.
5. Read-back und ggf. vollständigen Event-Verlauf prüfen.
6. Nur übergreifende technische Änderungen in GitHub dokumentieren; individuelle Auftragsdaten bleiben im CRM.

## Links

- [GitHub-Repository](https://github.com/LayerInForm/LayerForm)
- [HubSpot-Deals](https://app.hubspot.com/contacts/149524579/objects/0-3)
- [Unternehmenswebsite](https://layer-form.de)

**Nicht verifiziert:** Aktuelle Mitarbeiterrollen, vollständige Prozess-Owner, produktive Apps-Script-Trigger, nicht öffentlich bekannte Kundensysteme und weitere Hosting-Accounts.
