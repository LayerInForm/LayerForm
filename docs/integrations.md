# LayerForm – Website & HubSpot: gemeinsame Integrationsdokumentation

## Produktive Umstellung vom 09.11.2026 (ersetzt ältere Ablaufbeschreibungen unten)

- Beide Website-Endpunkte `/api/kontakt` und `/api/anfrage` übertragen ausschließlich serverseitig an HubSpot. Kein Resend-Versand an das Geschäftspostfach, auch kein Fehler-Fallback. Resend dient optional nur zur Kundenbestätigung; deren Fehler ändern einen erfolgreichen CRM-Eingang nicht.
- Kontakt wird direkt anhand normalisierter E-Mail gelesen (`idProperty=email`), nur bei HTTP 404 angelegt. Andere Lesefehler brechen ab. Bei paralleler Anlage wird HTTP 409 durch erneutes Lesen aufgelöst. Vorhandene Kontaktdaten werden nicht überschrieben. Keine Marketing-, Abonnement- oder Einwilligungsfelder werden geschrieben.
- Jede neue Anfrage bekommt einen eigenen Deal mit Kontaktzuordnung. Pipeline `default` / Phase `6212936899` sowie alle verwendeten `lf_*`-Felder wurden über den HubSpot-Connector live lesend bestätigt. `it_service` ist weiterhin keine verfügbare Leistungsoption; deshalb bestehendes Mapping beibehalten, Originalthema bleibt im Text.
- Browser erzeugt UUID v4 pro unverändertem Formularentwurf. Wiederholungen innerhalb desselben geöffneten Formulars verwenden dieselbe ID. Der Preisrechner hält zusätzlich den identischen übertragenen Payload einschließlich Upload-Links für einen erneuten Versuch vor. Neue Angaben ergeben eine neue Anfrage-ID. Neuladen/erneutes Öffnen des Formulars beginnt einen neuen Entwurf; keine pauschale Zusammenführung nach E-Mail oder identischem Inhalt, da dies echte neue Anfragen unterdrücken würde.
- Redis-Journal `lf:website:request:v1:<kontakt|anfrage>:<UUID>` bindet die ID an einen SHA-256-Prüfwert des serverseitigen Lead-Payloads. Sperre per `SET NX EX 120`, Freigabe nur durch den Besitzer. Unmittelbar vor dem Deal-POST setzt ein zweites atomisches `SET NX` eine **dauerhafte** Schreibmarkierung. Dadurch darf auch nach Ablauf einer Sperre kein zweiter Worker denselben Deal erzeugen. Erfolgreicher Abschluss speichert Deal-ID und URL; Wiederholungen erhalten Erfolg ohne weiteren Deal oder weitere Bestätigung.
- Journal enthält keine E-Mail-Adresse und keinen Nachrichtentext. Es hat absichtlich keine automatische Ablaufzeit: spätere Wiederholungen und unklare Schreibabbrüche dürfen keine Doppelanlage erzeugen. Bei administrativer Löschung einer Anfrage auch den zugehörigen Journalschlüssel entfernen. Redis muss die Schlüssel erhalten; Löschung/Eviction/Verlust des Journals hebt diese Wiederholungssicherung auf.
- Vollständige Angaben, Anfrage-ID und sämtliche akzeptierte Dateilinks stehen bereits in der Deal-Beschreibung. Zusätzliche Notiz und private HubSpot-Dateikopien bleiben erhalten; Notizfehler erzeugen keinen zweiten Deal. Die bisherigen öffentlichen Vercel-Blob-Uploads des Preisrechners werden nicht umgestellt. Downloads folgen keinen Weiterleitungen und haben Zeitlimits.
- WhatsApp bleibt ein separater Link: erst der Nutzer sendet in WhatsApp, kein paralleler Formular-POST und keine vorzeitige Deal-Anlage. Unabhängige E-Mail-/WhatsApp-Workflows außerhalb dieses Repositorys werden nicht verändert.
- Sicherheitsprüfungen: nur POST/JSON, Größenlimits, Origin-Prüfung, Honeypot, UUID-Prüfung, Redis-Ratenlimit (20 Versuche/15 Minuten je gehashter IP); fehlende Redis-Konfiguration bricht vor CRM-Schreiboperationen ab.

### Unklare Übertragungen abgleichen

Bei Timeout, Fehler beim Deal-POST oder Ausfall beim abschließenden Journal-Schreiben bleibt `phase=writing` bestehen. Die Antwort zeigt einen Prüfhinweis mit Anfrage-ID, keine Erfolgsmeldung. Weitere Versuche erzeugen keinen Deal. In HubSpot nach `Website-Anfrage-ID: <UUID>` in der Deal-Beschreibung suchen und Kontaktzuordnung prüfen. Wird ein Deal eindeutig gefunden, den Journaleintrag mit unverändertem Fingerprint und `{phase:'done', result:{dealId, url}}` abschließen. Nur wenn sicher feststeht, dass kein Deal angelegt wurde und kein Worker mehr läuft, die Schreibmarkierung für einen erneuten Versuch entfernen. Niemals unklare Markierungen pauschal löschen.

### Zugriffe, Secrets und Verifikation

GitHub-Schreibzugriff und Vercel-Projekt `layerform` im Team `team_4ZbCkRIGcv01VAAwr3rgeke4` bestätigt. Secret-Namen (keine Werte gelesen): `HUBSPOT_TOKEN`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `RESEND_API_KEY` in Production und Preview vorhanden. Keine neuen Secrets nötig. Benötigte HubSpot-Rechte: Kontakte und Deals lesen/schreiben, Notizen schreiben sowie optional Files für Dateikopien. Vorhandensein eines Secrets bestätigt weder seine Gültigkeit noch seine API-Berechtigungen.

`npm test` prüft die tatsächlichen TypeScript-Routen mit isolierten CRM-/Redis-/E-Mail-Doubles einschließlich Parallelität, Kontaktkonflikt, Wiederholungen, neuen Anfragen, Teilfehlern, fehlenden Secrets und ausbleibenden internen E-Mails. Zusätzlich `npm run lint`, `npm run check:api` und Produktionsbuild. Tests legen keine echten Kontakte oder Deals an und senden keine echten E-Mails. Ein vollständiger Live-Schreibtest mit dem Vercel-Service-Token ist dadurch nicht ersetzt.

Anbieterreferenzen zur Datenschutzbeschreibung: [HubSpot DPA](https://legal.hubspot.com/dpa), [Resend Datenschutz](https://resend.com/legal/privacy-policy), [Resend DPA](https://resend.com/legal/dpa). Der konkrete Abschluss der Auftragsverarbeitungsverträge und die Kontokonfiguration wurden nicht geprüft.

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


## Verifizierter CRM-Integrationsstand (Quellcodeabgleich 2026-11-03; HUBSPOT-Chat)

**Prüfumfang und Evidenz:** GitHub `main`: `api/_lib/hubspot.ts`, `api/kontakt.ts`, `api/anfrage.ts`; bereitgestellte Dateien `Code (1).gs` (1.184 Zeilen), `appsscript (1).json`, `Fahrten (1).gs` und die HubSpot-/Google-Übergabe vom 30.10.2026. Aussagen unten bedeuten **im Code implementiert bzw. in der Übergabe beschrieben**, nicht durch einen Live-API-Test bestätigt. Die Apps-Script-Dateien sind Upload-Snapshots, kein nachgewiesener aktiver Deploymentstand. Die produktive HubSpot-Feldkonfiguration wurde nicht live ausgelesen.

### Gemeinsame CRM-Konstanten

| Einstellung | Im Website-Code und Apps-Script-Snapshot | Hinweis |
| --- | --- | --- |
| HubSpot API | `https://api.hubapi.com` | Bearer-Token aus Secret-Store, niemals veröffentlichen |
| Portal | `149524579` (EU1) | Deal-URL: `https://app-eu1.hubspot.com/contacts/149524579/record/0-3/{dealId}` |
| Pipeline | `default` („LayerForm Aufträge“) | beide Codepfade |
| Owner | `100897636` | beide Codepfade |
| Neue Anfrage | `6212936899` | 10 % laut Übergabe |
| Angebot gesendet | `6212936900` | 40 % |
| Zusage – Rechnung gestellt | `6212936901` | 80 % |
| Bezahlt – in Produktion | `6212936902` | 95 % |
| Versendet/abgeholt – gewonnen | `6212936903` | 100 % |
| Verloren | `6212936904` | 0 % |

### Website → HubSpot: tatsächlicher Codepfad

1. `POST /api/kontakt` (`api/kontakt.ts`): Kontaktformular; nur POST, Honeypot `website`, Pflicht `name`, `message` (mind. 10 Zeichen), bei `via=email` auch gültige `email`. Ohne gültige E-Mail bei `via=whatsapp` möglich. `topics` auf sieben Elemente begrenzt. Aus `topics` werden Leistungen ermittelt, Standard `3d_druck`. Über `legeLeadAn` wird zunächst CRM versucht; bei einem geworfenen Fehler wird via Resend eine E-Mail an `ANFRAGE_EMPFAENGER` (Standard `auftrag@layer-form.de`) gesendet. Bei `via=email` wird eine Eingangsbestätigung versucht, sofern nicht deaktiviert. Erfolgsantwort `{ok:true}` ohne Deal-ID.
2. `POST /api/anfrage` (`api/anfrage.ts`): Preisrechner; Pflicht `name`, `street`, `zip`, `city`, gültige `email`. Akzeptiert bis zu 30 geprüfte öffentliche Vercel-Blob-Dateilinks sowie bis zu 50 `plates`. Erst CRM-Versuch; bei Misserfolg interne Resend-Mail samt Dateilinks/kleinen Anhängen; Eingangsbestätigung. Hinweis: eine Resend-Fehlermeldung kann hier trotz bereits erfolgreichem CRM-Eintrag zu HTTP 502 führen, weil die Kundenbestätigung und der Rückgabepfad gemeinsam im äußeren `try` liegen.
3. `api/_lib/hubspot.ts`: `legeLeadAn(Lead)` sucht Kontakt nach E-Mail und danach normalisierter Telefon-Suchproperty, legt sonst Kontakt an, zählt bisherige Deals, legt **immer einen neuen Deal** in „Neue Anfrage“ an, hängt Notiz und ggf. private HubSpot-Dateien an. Anders als Apps Script wird ein offener Deal von diesem Pfad nicht für eine Folgenachricht wiederverwendet. Upload von maximal 20 Dateien; einzelne fehlgeschlagene Uploads werden in der Notiz vermerkt. `HUBSPOT_TOKEN` ist die serverseitige Authentifizierung.

**Website-Feldmapping – Werte aus dem tatsächlich geprüften Code:**

| Website-Payload / Herkunft | HubSpot-Eigenschaft / Verwendung | Typ / Hinweise |
| --- | --- | --- |
| `name`, ggf. `vorname`, `nachname` | Kontakt `firstname`, `lastname` | Splitting/Fallback auf Name |
| `email`, `phone`, `company` | Kontakt `email`, `phone`, `company` | E-Mail kleingeschrieben; Telefon als Suchfallback |
| `street`, `zip`, `city` | Kontakt `address`, `zip`, `city` | Standardfelder |
| Server-Konstanten | Kontakt und Deal `hubspot_owner_id` | `100897636` |
| `topics` (`/api/kontakt`) | Deal `lf_leistung` | `Giveaways→werbeartikel`, `CAD-Konstruktion→cad`, `Automatisierung→beratung`, **`IT-Service→beratung`** (Abweichung), sonst `3d_druck`; Semikolon-getrennte Mehrfachwerte |
| Preisrechner | Deal `lf_leistung`, `lf_material` | `3d_druck`; Material aus `materialWert` (`pla/petg/asa/abs/tpu`, sonst `offen`) |
| `type` | Deal `lf_kundentyp` | `unternehmen` oder `privat`; Preisrechner erzwingt `privat` |
| `via` / Quellendpunkt | Deal `lf_kanal` | `whatsapp` bei `via=whatsapp`, sonst `website` |
| `quantity` oder Platten-Summe | Deal `lf_stueckzahl` | nur Ziffern; Preisrechner summiert Item-Mengen |
| `deadline`, `filament`, `farbe`, Themen, Druckparameter, `estimate` | Deal `lf_anforderungen`, Notiz/Volltext | **Nicht automatisch** `lf_wunschtermin`, `lf_farbe`, `lf_preis` bzw. `amount` |
| `message`/`text`, Rechner-Details | Deal `description`, Notiz `hs_note_body` | Volltext HTML-escaped; Notiz an Deal und Kontakt |
| Links aus Volltext | Deal `lf_links` | URLs dedupliziert; interne LayerForm-/Vercel-Storage-Links gefiltert |
| `files` aus Preisrechner | Deal `lf_anhaenge`, Notiz `hs_attachment_ids` | Dateinamen; bis 20 private Dateien per HubSpot Files API |
| bisherige Deals zum Kontakt | Deal `lf_stammkunde` | `true/false`; nicht auf abgeschlossene Aufträge begrenzt |
| `titel` aus Endpunkt | Deal `dealname` | auf 120 Zeichen gekürzt; Pipeline `default`, Phase `6212936899` |

**Weitere CRM-Eigenschaften aus dem Apps-Script-Snapshot/der Übergabe:** `lf_farbe`, `lf_wunschtermin`, `lf_anfrage_link`, `lf_rechnungsnummer`, `lf_preis`, `lf_versand`, `lf_sendungsnummer`, `lf_versandmail_am`, `lf_nachgefasst_am`, `lf_bewertung_angefragt` (Kontakt) sowie Standard-Deal-`amount`. Der Snapshot mappt `webdesign` und `it_service`, die Übergabe vom 30.10. meldet aber, dass diese Optionen in der live konfigurierten HubSpot-Mehrfachauswahl `lf_leistung` noch anzulegen sind. **Nicht ohne Prüfung als verfügbar voraussetzen.**

### Gmail, Workspace Studio und Apps Script → CRM

Die Übergabe nennt die Workspace-Studio-Flows `LayerForm Kunden-E-Mail Bewertung` und `LayerForm Rechnung → HubSpot`. Das hochgeladene `appsscript.json` definiert zwei aktive **Workflow-Elemente** (`leadInHubspot` / `rechnungInHubspot`), was allein nicht beweist, dass die Studio-Flows aktuell aktiv sind.

| Funktion / Einstieg | Auslöser und Verhalten im Snapshot | Idempotenz / Risiko |
| --- | --- | --- |
| `onExecuteLead` → `verarbeiteLead` | Gemini-JSON + Absender/Betreff/optionaler Link; Kontakt per E-Mail/Telefon suchen oder anlegen, leere Felder ergänzen; `art=folge` / Re:/AW: wird als Notiz an Deal gehängt, sonst neuer Deal; ggf. Originalmail/Anhänge übernehmen | Bei mehreren offenen Deals Zuordnung zur neuesten Karte und Warn-Aufgabe; kein umfassender transaktionsübergreifender Dedupe-Nachweis |
| `onExecuteRechnung` → `verarbeiteRechnung` | Lexware-BCC-Rechnungsmail; Rechnungsnummer aus Betreff, Empfänger ggf. aus Gmail ermitteln, geeigneten offenen Auftrag auf „Zusage – Rechnung gestellt“ setzen | Mehrdeutige/fehlende Zuordnung führt zu Warnung statt blindem Update; Details im Quellcode |
| `angebotePruefen` → `angeboteErkennen_` | Laut `automatikEinrichten`: jede Minute; scannt gesendete Gmail-Angebote, erkennt Preis-Ausdrücke, schreibt `amount`/`lf_preis`, verschiebt vorwärts auf „Angebot gesendet“; importiert WhatsApp-Exporte | Verarbeitete Mail-ID in ScriptProperties; bei mehreren offenen Deals Warnung. Achtung: Kennzeichnung erfolgt schon vor erfolgreicher Deal-Zuordnung (möglicher verpasster Retry) |
| `versandPruefen` | Laut `automatikEinrichten`: alle 10 Minuten; Preisabgleich, Bewertungsbitte, Nachfassen, Versandaufgaben und Versandmails | Zeitbasierte Automatiken und CRM-/Gmail-Zustände müssen live geprüft werden |
| `bewertungenAnfragen_` | 5 Tage nach Eintritt in Versandphase, einmal je Kontakt (`lf_bewertung_angefragt`), Google-Bewertungslink | E-Mail wird vor dem Setzen des CRM-Merkers gesendet; Fehler dazwischen kann Wiederholung erzeugen |
| `angeboteNachfassen_` | Nach 5 Tagen in Angebotsphase Aufgabe; nach 30 Tagen ohne erkannte Kundenantwort automatisch „Verloren“ | Automatik basiert auf Gmail-Antworterkennung; andere Kanäle gesondert beachten |
| `fahrtenEinrichten` (`Fahrten (1).gs`) | Separates Google-Formular und Google-Sheet für Dienstfahrten, 0,30 €/km | **Keine** HubSpot-Integration |

**Belegte Unterschiede der beiden Lead-Pfade:** Website legt pro erfolgreichem Formularaufruf immer neuen Deal an; Studio/Apps Script erkennt Folgenachrichten. Website-`lf_kanal` nennt bei gewähltem WhatsApp-Kontakt `whatsapp`, nicht zwingend einen tatsächlich über WhatsApp eingetroffenen Lead. Apps Script verwendet bereits `it_service`/`webdesign`, die Website (noch) nicht. Der E-Mail-Fallback kann bei Teilfehlern zu doppelten Leads führen. Die Website verarbeitet Dateianhänge im Rechnerpfad, nicht im allgemeinen Kontaktformularpfad.

### Risiken, offene Verifikationen und Übergabe an WEBSITE

- **Priorität 1 – Doppelanlage:** Gemeinsame Anfrage-ID, wiederholbare/idempotente Verarbeitung und Erkennung unvollständiger CRM-Transaktionen entwerfen. HubSpot-Kontakt, Deal und Notiz werden in aufeinanderfolgenden API-Calls erstellt; scheitert eine spätere Operation, kann der Resend-/Studio-Fallback zusätzlich einen Deal anlegen. **Keine produktive Logik ohne abgestimmten Test verändern.**
- **Priorität 1 – Service-Mapping:** WEBSITE soll `IT-Service→beratung` bewerten; HUBSPOT soll die tatsächlichen zulässigen `lf_leistung`-Optionswerte `it_service`/`webdesign` live prüfen. Erst danach gemeinsam umstellen.
- **Priorität 2 – Formularvollständigkeit:** WEBSITE und HUBSPOT sollen entscheiden, ob `deadline→lf_wunschtermin`, `farbe→lf_farbe`, `filament→lf_material`, `estimate→amount/lf_preis` und Unternehmenstyp beim Preisrechner übernommen werden sollen. Bis dahin sind diese Werte lediglich in `lf_anforderungen`/Notiz enthalten; Rechner-Richtpreis ist kein verbindliches Angebot.
- **Priorität 2 – Feedback/Fehler:** `/api/anfrage`-Resend-Fehlerbehandlung und `/api/kontakt`-Bestätigungsfehler prüfen; API antwortet bei Erfolg nur `{ok:true}`, nicht mit Deal-ID. Bei Teilfehlern besteht mögliches Fehlersignal nach erfolgter Deal-Anlage.
- **Priorität 2 – Versand/Follow-ups:** Live-Verfügbarkeit von Triggern, Studio-Flows, Script-Version, Properties, Resend-DNS, Berechtigungen und End-to-End-Test nicht bestätigt. Für WhatsApp-Antworten ist die Gmail-basierte 30-Tage-Abschlussregel besonders zu prüfen.
- **Sicherheitscheck:** Quellcode enthält keine hier offengelegten Tokens; nur Secret-Namen dokumentieren. Bestehende Token-Rotationshinweise aus der Übergabe beachten.

**Verantwortungsübergabe:** HUBSPOT betreut die CRM-Felder, Pipeline, Apps Script, Studio-Flows und Dedupe-Konzept; WEBSITE betreut Formularfelder, `api/kontakt.ts`, `api/anfrage.ts`, `api/_lib/hubspot.ts`, Resend, Vercel und Deployment. Änderungen gemeinsam über diese Datei abstimmen. **Status dieses Updates: dokumentiert; keine produktiven Laufzeit- oder Schnittstellenänderungen.**


## Übergabe WEBSITE → HUBSPOT: zentrale Cookie-Verwaltung (09.11.2026)

**Nutzerentscheidung:** Cookie-Banner, Einwilligungsverwaltung und Widerruf sollen künftig vollständig über HubSpot erfolgen; keine doppelte Website-eigene Consent-Oberfläche.

**Aktueller Website-Stand:** In `index.html` wird HubSpot-Tracking `https://js-eu1.hs-scripts.com/149524579.js` bisher nur nach Zustimmung im eigenen LayerForm-Banner geladen. Speicherung in `localStorage` unter `layerform:hubspot-consent:v1`. Der eigene Einstellungsbutton hatte einen Reopen-Bug; Korrektur Commit `afafe1fb`. Der Nutzer hat im Inkognito-Test nach „Ablehnen“ keine HubSpot-Network-Requests gesehen. Vollständige Cookie- und Tracking-Inventur ist **nicht** abgeschlossen.

**Auftrag an HUBSPOT-Chat:**
1. HubSpot-Portal 149524579 / EU1 prüfen: Existiert eine aktive Cookie-Consent-Richtlinie für `www.layer-form.de` und `layer-form.de`? Richtlinie, Banner-Sprache Deutsch, Kategorien, Widerrufsmöglichkeit und tatsächliche Veröffentlichung verifizieren. Falls über Connector nicht administrierbar, genaue nötige Benutzeraktion benennen; **nicht als eingerichtet behaupten**.
2. Prüfen, wie HubSpot-Cookie-Banner/Consent-API auf externer Website technisch eingebunden wird und wie das HubSpot-Script vor erforderlicher Zustimmung rechtssicher betrieben wird. Insbesondere Unterschied zwischen HubSpot-Tracking-Script, Cookie-Banner und optionalen Nicht-HubSpot-Trackern beachten.
3. Mit WEBSITE abstimmen, wann das bisherige Banner und der `localStorage`-Mechanismus entfernt werden können. Erst umstellen, wenn HubSpot-Banner und Widerruf tatsächlich funktionieren; keinen Tracking-Gap erzeugen.
4. Erforderliche Änderungen an Datenschutzerklärung und etwaige HubSpot-DPA-/Drittanbieterprüfungen festhalten. Keine pauschale DSGVO-Konformität behaupten.
5. Ergebnisse, konkrete Einstellungen und offene Punkte **hier** dokumentieren, damit WEBSITE den Code entsprechend umstellt und den Live-Test durchführt.

**Abgrenzung:** Die Website-Formulare `/api/kontakt` und `/api/anfrage` übertragen serverseitig an HubSpot und sollen unverändert bleiben. Keine Marketing-Einwilligung aus Kontaktanfragen ableiten. Keine bestehenden CRM-Automationen ohne gesonderte Prüfung ändern.

**Status:** Abstimmung angefordert, HubSpot-Banner-Aktivierung und End-to-End-Test noch **nicht bestätigt**. Keine Umstellung des produktiven Consent-Mechanismus in diesem Schritt.

## Materialübernahme aus dem Kontaktformular (09.11.2026)

Das ausgewählte Filament wird beim Deal-POST zusätzlich in `lf_material` übernommen. Der vorhandene normalisierte Lead-Payload enthält die Auswahl bereits als `Filament: …` in `anforderungen`; die zentrale HubSpot-Schreiblogik liest diesen begrenzten Abschnitt über `materialWert`. Dadurch bleiben Request-Payload und bestehende Idempotenz-Fingerprints unverändert. Keine Materialableitung aus Nachrichtentext, Farbe oder Kundennamen.

Werte: PLA→`pla`, PETG→`petg`, ASA→`asa`, ABS→`abs`, TPU→`tpu`; fehlende/unbekannte Auswahl und „Auf Anfrage“→`offen`. HubSpot-Enum live geprüft. Preisrechner behält sein bereits explizit gesetztes Material. Neun isolierte Zuordnungsprüfungen bestanden; zusätzliche Routentests für Material und Retry ergänzt, wegen ausgefallener Ausführungsumgebung hier nicht gestartet. Produktivstatus separat am Deployment prüfen.

## Zusätzlicher Formular-Spamschutz (09.11.2026, VORBEREITET – NICHT AKTIV)

- Kontaktformular und Preisrechner: Turnstile erst beim Absenden laden, pro Versuch einen frischen Token erzeugen. Sicherheitsprüfung im Formular sichtbar; Lade-/Prüffehler erlauben erneuten Versuch. WhatsApp-Link bleibt eigenständig.
- Server: Pflichtprüfung über Siteverify vor CRM-Zugriff, Erfolg, Action `website_inquiry` und Hostname prüfen. Erlaubt sind `layer-form.de`, `www.layer-form.de` und der von Vercel gesetzte Deployment-Host `VERCEL_URL`. Keine clientseitig gelieferten Hosts als Nachweis. Timeout 10 Sekunden; fehlende Konfiguration/Dienstausfall→503, ungültiger Token→400. Keine stille Umgehung.
- Redis: bestehendes Limit 20 Versuche/15 Minuten bleibt als grober Schutz. Zusätzlich atomar maximal fünf verschiedene Anfrage-IDs je gehashter IP/15 Minuten über beide Formularendpunkte. Retry derselben ID verbraucht keinen neuen Platz, bleibt aber vom allgemeinen Versuchslimit begrenzt. Tokens werden nicht im Lead-Fingerprint oder Journal gespeichert; neue Tokens verändern den bestehenden Retry-Vertrag nicht.
- Benötigt: `VITE_TURNSTILE_SITE_KEY` (öffentlicher Sitekey beim Vite-Build), `TURNSTILE_SECRET_KEY` (nur Server), jeweils Production und Preview. Metadatenprüfung am 09.11.2026 ergab keine solchen Variablen. Kein Secret im Chat oder Repository speichern. Cloudflare-Widget im Modus Managed für die beiden Website-Hosts einrichten; Preview-Hosts gesondert zulassen oder offizielle Testkonfiguration ausschließlich für Preview verwenden.
- Datenschutzhinweis im Formular-/Website-Text ergänzt. Kontobezogene Anbietervereinbarungen und erforderliche Rechtsgrundlage vor Aktivierung prüfen; keine pauschale Compliance-Aussage.
- Kein unscharfer Inhaltsfilter: Modell-Links und echte ungewöhnliche Projekte sollen nicht still unterdrückt werden.
- Offene Prüfung: vollständige Typechecks/Routentests, Browserprüfung auf Mobil/Desktop, erfolgreiche und abgelehnte Siteverify-Antwort, Token-Erneuerung bei Retry sowie kontrollierter CRM-Live-Test nach Schlüsselkonfiguration. Vorher nicht nach Production übernehmen.

**Validierung aktualisiert:** Preview `dpl_BQavULDQeJZa7J4s17NpFZEe7PVA` für Code-Commit `eebf6665a387ed41fd5540560f470f2efc3901f2`: `npm run lint`, `npm run check:api`, `npm test` (21 bestanden, 0 fehlgeschlagen), `npm run build` erfolgreich. Live-Widget-/Browserprüfung und Aktivierung bleiben mangels Turnstile-Schlüsseln offen. Kein produktiver Merge.

**Aktivierung 09.11.2026:** Nutzer hat das Cloudflare-Widget erstellt und beide Schlüssel in Vercel hinterlegt. Production-Metadaten bestätigt: `TURNSTILE_SECRET_KEY` Sensitive und `VITE_TURNSTILE_SITE_KEY` vorhanden (keine Werte gelesen). Preview-Schlüssel fehlen weiterhin; Preview-Formulare benötigen eine getrennte Test-/Widget-Konfiguration. Nach automatisierten Prüfungen wird PR #6 produktiv übernommen. Ein erfolgreicher Build ersetzt keine Browser-/CRM-End-to-End-Prüfung; diese bleibt offen.
