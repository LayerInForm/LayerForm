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
