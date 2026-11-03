# LayerForm – Website & HubSpot: gemeinsame Integrationsdokumentation

> Gemeinsame technische Referenz für die Chats **WEBSITE** und **HUBSPOT** im ChatGPT-Projekt LayerForm.
> Stand: 2026-11-03. Diese Datei dokumentiert Zuständigkeiten und bekannte Konfigurationen, keine unbestätigten API-Verträge.

## Systeme und Zuständigkeiten

| Bereich | Verantwortlicher Chat | Typische Aufgaben |
| --- | --- | --- |
| Website | WEBSITE | UI, Seiten, SEO, Formulare, Preisrechner, Routing, GitHub, Vercel, Website-seitige API-Integration |
| CRM | HUBSPOT | Kontakte, Deals, Pipelines, Eigenschaften, Workflows, Automatisierung, Google Apps Script |
| Übergabe Website → CRM | Beide | Feldmapping, Authentifizierung, Validierung, Fehlerbehandlung, Tests, Datenschutz |

## Bekannte Infrastruktur

- GitHub: `LayerInForm/LayerForm`, Hauptbranch `main`.
- Vercel: Projekt `layerform`, Team `layerforms-projects`, Framework Vite.
- Website: `https://www.layer-form.de`; `layer-form.de` ist als Weiterleitung eingerichtet.
- Vercel-Umgebungsvariablen (Namen, **keine Werte**): `HUBSPOT_TOKEN` (Production/Preview), `RESEND_API_KEY` (Production/Preview), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `INTERN_PASSWORT` (Production), `REDIS_URL` (Development/Preview/Production).
- Vorhandensein einer Variablen beweist **nicht**, dass Token, Endpunkt oder Integration funktionieren.

## Integrationsvertrag (bei Änderungen vervollständigen)

| Vorgang | Quelle | Ziel | Status / offene Punkte |
| --- | --- | --- | --- |
| Kundenanfrage | Website-Formular | HubSpot | Endpunkt, Pflichtfelder, Kontakt-/Deal-Logik und Fehlerverhalten im Code verifizieren |
| Benachrichtigung | Website / Serverfunktion | Resend | Auslöser, Empfänger, Absenderdomain und Fehlermeldungen prüfen |
| Interner Bereich / Kalkulator | Website | Ggf. CRM / weitere Dienste | Authentifizierung, Berechtigungen und Datenaustausch anhand Code prüfen |
| CRM-Automatisierungen | HubSpot / Apps Script | CRM und ggf. Website | Trigger, Properties, Idempotenz und Zuständigkeiten dokumentieren |

### Feldmapping-Vorlage

Für jede produktive Integration festhalten: **Formularfeld → API-Property → Datentyp → Pflicht/optional → Validierung → Verarbeitung bei Fehlern**. Keine Feldnamen oder Endpunkte raten; erst anhand des tatsächlichen Codes und der HubSpot-Konfiguration bestätigen.

## Arbeitsablauf für Änderungen an der Schnittstelle

1. **WEBSITE-Chat:** Betroffene UI, Payloads, Serverfunktionen und vorhandene Schnittstelle prüfen; geplante Änderungen hier dokumentieren.
2. **HUBSPOT-Chat:** Properties, Pipeline, Workflows, Apps Script und Auswirkungen prüfen; notwendige CRM-Anpassungen hier dokumentieren.
3. **Abgleich:** Feldnamen, Datentypen, Authentifizierung, Dublettenbehandlung, Fehlerfälle und Datenschutz gemeinsam festlegen.
4. **Umsetzung:** Änderungen mit nachvollziehbaren Git-Commits vornehmen; keine Secrets ins Repository schreiben.
5. **Prüfung:** Testanfrage über die Website, korrekten CRM-Datensatz/Workflow und E-Mail-Versand (falls betroffen) verifizieren; Vercel-Deploymentstatus prüfen.
6. **Dokumentation:** Diese Datei aktualisieren und im jeweils anderen Chat auf den Commit bzw. die Änderung verweisen.

## Sicherheitsregeln

- Niemals API-Tokens, Passwörter oder private Schlüssel in diese Datei, Commits oder Chat-Nachrichten kopieren.
- Secrets nur in den vorgesehenen Secret-Stores verwalten; Token-Gültigkeit durch geeignete Funktionstests prüfen.
- Früher offengelegte Tokens (insbesondere alte GitHub-PATs und ggf. Gemini-Keys) widerrufen/rotieren.
- Vercel meldete für `REDIS_URL` den Hinweis `readable-secret`; Berechtigungen/Secret-Sichtbarkeit gesondert prüfen.
- Änderungen an produktiven CRM-Automatisierungen nur nach Prüfung möglicher Nebenwirkungen und Dubletten.

## Übergabe zwischen den Chats

Wenn eine Aufgabe beide Bereiche betrifft, im jeweils anderen Chat kurz übergeben:

- **Ziel:** Was soll sich für den Nutzer ändern?
- **Betroffene Stellen:** Dateien, Formulare, Endpunkte, HubSpot-Properties und Workflows (nur verifizierte Namen).
- **Vertrag:** Erwartete Eingaben/Ausgaben und Fehlerfälle.
- **Status:** Geplant / umgesetzt / getestet; relevante Commit-ID.
- **Offene Punkte:** Wer muss was noch prüfen?

**Hinweis:** Chats sind nicht live miteinander synchronisiert. Diese versionierte Datei dient als gemeinsame Referenz; der jeweils aktuelle Stand ist in GitHub zu lesen.
