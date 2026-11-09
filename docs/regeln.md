# Arbeitsregeln für alle LayerForm-Chats und Agenten

> Diese Datei dient als gemeinsame Arbeitsanweisung. **Sie ist kein automatischer Chat-Kontext:** Ein Chat muss die Datei aktiv lesen können. Zugang zu GitHub allein erlaubt nicht automatisch Zugriff auf HubSpot, Lexware, DHL oder Miro.

## Einstieg in jede relevante Aufgabe

1. `docs/README.md` lesen und den passenden Fachbereich öffnen.
2. Für Schnittstellenänderungen zuerst `docs/integrations.md` lesen, besonders die neueste, ausdrücklich als produktiv bezeichnete Aktualisierung.
3. Den **Live-Stand** der betroffenen Anwendung lesen; Snapshot und Live-Daten auseinanderhalten.
4. Den möglichen Effekt auf Kunden, Datenschutz, Kosten, Rechnungen, Versand und Automationen untersuchen.
5. Bei schreibenden, kostenpflichtigen, kundenwirksamen oder destruktiven Aktionen erforderliche Freigabe einholen.
6. Änderung in kleinstmöglichem Umfang ausführen; Ergebnis nachlesen oder End-to-End testen.
7. Status, Datum, Quelle und betroffene Dokumente nachvollziehbar aktualisieren.

## Quellsysteme

| Datenart | Führendes System |
| --- | --- |
| Kontakte, Unternehmen, Angebote, Deals, Aufgaben | HubSpot |
| Website und Schnittstellencode | GitHub |
| Deployment, Runtime, Environment-Konfiguration | Vercel |
| Rechnungen und steuerliche Belege | Lexware Office |
| Labels und Sendungsverfolgung | DHL |
| Geschäftskommunikation | Google Workspace |
| Unternehmens-Wissensdokumentation | `docs/` in GitHub |
| Grafische Mindmap | Miro |

## Verbindliche Sicherheitsregeln

- **Repository ist öffentlich:** Keine Kundendaten, Adressen, Preislisten mit internen Margen, Vertragsdetails, Account-Sessions, Tokens, Cookies, Passwörter, API-Schlüssel, private Ports oder interne Hosts in Dokumentation und Issues/PRs.
- **Bestehende Kundenvorgänge schützen:** Insbesondere ROTOCON nicht ohne konkrete Freigabe verändern.
- Keine CRM-Datensätze löschen, zusammenführen oder Phasen setzen ohne Datensatzprüfung und Prüfung ausgelöster Workflows.
- Nie Testaufträge, Live-Zahlungen oder DHL-Käufe für bloße Dokumentation auslösen.
- Keinen Produktionscode oder produktive Secret-Konfiguration als Nebeneffekt einer Dokumentationspflege verändern.
- Kein Deployment, Live-Test oder Compliance-Audit als erfolgreich melden, wenn nur GitHub-Code oder ein Commit geprüft wurde.
- Nicht automatisch Kunden werblich kontaktieren, nur weil sie eine Anfrage gestellt haben.

## Schreibkonvention

- Fakten mit **Quelle und Stand** angeben: `CODE-VERIFIZIERT`, `LIVE-VERIFIZIERT`, `MITGETEILT`, `GEPLANT`, `OFFEN`.
- Keine durch Vermutung vervollständigten Repositories, Domains, Integrationen oder Dienstzustände.
- Nur relevante Fachdatei ändern; keine parallelen, widersprüchlichen Wiki-Strukturen erzeugen.
- Technische Identifikatoren nur dokumentieren, wenn sie nicht geheim und für die Integration nötig sind.
- Neuer Prozess: Diagramm/Link ergänzen, nicht alle Inhalte in eine riesige Datei kopieren.
- Bestehende Dokumentation nicht ohne Lesung/Backup überschreiben.
- Jede fachliche Änderung in `status.md` mit Datum und Kurznotiz festhalten.

## Mini-Übergabe zwischen Chats

`Ziel | betroffenes System | Quelle/Dateien | Änderung | Stand (geplant/umgesetzt/getestet) | Risiken | offene Prüfung | Git-Commit/PR`.

**Beispiel:** Eine Website-Formularänderung betrifft möglicherweise HubSpot-Felder und Redis-Retry. Vor Änderung Code, CRM-Property und Automation abgleichen; nach Umsetzung beide Systeme testen und `integrations.md` aktualisieren.
