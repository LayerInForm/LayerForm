# HubSpot CRM und Kundenablauf

**Stand:** 2026-11-09 · Daten aus `docs/integrations.md` und früherer CRM-Prüfung. Für aktuelle Aufträge **HubSpot live abfragen**.

## CRM-Führung

- HubSpot-Portal: `149524579`.
- Pipeline-ID: `default` („LayerForm Aufträge“).
- Website legt bestätigte Anfragen in **Neue Anfrage** an. Folge-E-Mails über separate Workspace-/Apps-Script-Flows sind **andere Wege**, deren aktuelle Aktivität geprüft werden muss.
- **Keine echten Kundendatensätze, Kontaktadressen, Deal-IDs, Rechnungsbeträge oder vertraulichen Projektbeschreibungen in dieser öffentlichen Datei speichern.**

## Deal-Phasen

| Reihenfolge | Phase | Technische ID | Hinweise |
| --- | --- | --- | --- |
| 1 | Neue Anfrage | `6212936899` | Eingang und Qualifizierung |
| 2 | Angebot gesendet | `6212936900` | Angebotsnachverfolgung |
| 3 | Zusage – Rechnung gestellt | `6212936901` | Phasenname ersetzt keinen Rechnungsbeleg |
| 4 | Bezahlt – in Produktion | `6212936902` | Zahlung nur mit Nachweis annehmen |
| 5 | Versendet / abgeholt | `6212936903` | Gewonnen |
| 6 | Verloren | `6212936904` | Verlustgrund erfassen |

Werte/Phasennamen nach Umstellung immer über die aktuelle API prüfen.

## Relevante Eigenschaften

- **Auftrag:** `hs_next_step`, `lf_leistung`, `lf_kundentyp`, `lf_kanal`, `lf_material`, `lf_farbe`, `lf_stueckzahl`, `lf_anforderungen`, `lf_wunschtermin`, `lf_anhaenge`, `lf_links`, `lf_anfrage_link`, `amount`, `lf_preis`, `lf_stammkunde`.
- **Rechnung/Kommunikation:** `lf_rechnungsnummer`, `lf_nachgefasst_am`.
- **Versand:** `lf_empfaenger`, `lf_strasse`, `lf_plz`, `lf_ort`, `lf_versand_adresse`, `lf_versanddienstleister`, `lf_dhl_produkt`, `lf_dhl_link`, `lf_dhl_warenkorb_id`, `lf_dhl_warenkorb_url`, `lf_sendungsnummer`, `lf_versandmail_am`, `lf_versand_task_id`.
- Auch ältere Feldnamen können weiter existieren (z. B. Hermes). **Nicht ungeprüft löschen**, weil Integrationen darauf zugreifen könnten.

Wichtiger Mapping-Sonderfall: `IT-Service` wird derzeit auf `beratung` gemappt, weil `it_service` für `lf_leistung` nicht als verfügbar bestätigt ist. Details: [integrations.md](integrations.md).

## Gewünschte gespeicherte Ansichten

**Status: FREIGEGEBEN, ABER NICHT ALS ERSTELLT BESTÄTIGT.** HubSpot-Ansichtskonfiguration wird von der verbundenen Chat-API nicht direkt unterstützt.

- Deals: `01 – Aktive Aufträge`, `02 – Angebote nachfassen`, `03 – Testdaten`, `04 – Abgeschlossene Aufträge`.
- Aufgaben: `01 – Heute & überfällig`, `02 – Angebote nachfassen`, `03 – Produktion & Versand`.
- Deal-Layout: Kundeninformationen, Auftragsinformationen, Rechnung & Versand.

**Schutz:** ROTOCON und andere produktive Kundendatensätze sowie sämtliche bestehenden Automatisierungen unverändert lassen, sofern keine spezifische spätere Freigabe erteilt wurde.

## Prüfregeln für Chats

1. Kontakt/Unternehmen suchen und Dubletten prüfen.
2. Richtige Deal-Zuordnung und aktuellen Status live lesen.
3. Automationen/Trigger und Auswirkungen prüfen.
4. Änderung nur mit erforderlicher Freigabe.
5. Bei Änderungen per API Datensatz erneut lesen und Ergebnis belegen.
6. Testdeals nicht in echte Produktiv-Auswertungen einmischen.

Kundendaten gehören nach HubSpot, nicht in dieses öffentliche GitHub-Repository.

## CRM-Organisation: Umsetzung vom 09.11.2026

**LIVE-VERIFIZIERT über HubSpot-Connector:** 13 eindeutig identifizierte System-/Benachrichtigungsabsender von `lead` auf `other` umklassifiziert. Keine Kontakte gelöscht. Dies ist eine Bestandsbereinigung, keine Korrektur des externen Eingangsfilters; erneute Erfassung oder Überschreibung bleibt möglich.

Sieben offene echte Aufträge besitzen einen nächsten Schritt und `lf_naechster_schritt_am=2026-11-10`. Drei zuvor leere nächste Schritte ergänzt, vier vorhandene beibehalten. Acht interne TODO-Aufgaben mit Deal-Zuordnung, Owner und Fälligkeit 10.11.2026, 09:00 Europe/Berlin angelegt und zurückgelesen: sieben Wiedervorlagen und eine zusätzliche Konsistenzprüfung. Keine Kundennachrichten versendet. Keine abgeschlossenen Aufträge wieder geöffnet. Die Aufgabentermine sind interne Planung, keine zugesagten Liefertermine.

### Neue Deal-Felder

| Eigenschaft | Optionen / Bedeutung |
| --- | --- |
| `lf_rechnungsstatus` | `ungeprueft`, `nicht_gestellt`, `gestellt`, `storniert` |
| `lf_zahlungsstatus` | `ungeprueft`, `offen`, `teilbezahlt`, `bezahlt`, `erstattet` |
| `lf_naechster_schritt_am` | Datum der internen Wiedervorlage; kein Liefertermin |

Felddefinitionen per Read-back bestätigt. Rechnungs-/Zahlungswerte wurden **nicht** aus Deal-Phasen oder alten Beschreibungen abgeleitet. Leer bedeutet noch nicht geprüft. Automatische Befüllung und Sichtbarkeit im Record-Layout sind **OFFEN**.

### Noch ausstehende Umsetzung

Browser-/Oberflächenzugriff war in diesem Schritt technisch nicht verfügbar. Folgende Änderungen sind **nicht umgesetzt**:

- **Deal-Layout:** oben Ansprechpartner/Firmenzuordnung, `hs_next_step` und Wiedervorlagedatum; Auftragsbereich mit Leistung, Material, Menge, Anforderungen und Dateien; separater Bereich mit Preis, Rechnungsnummer, Rechnungsstatus, Zahlungsstatus und Versand.
- **Ansichten:** aktive Aufträge ohne TEST; Wiedervorlagen heute/überfällig; separate Testansicht; abgeschlossene Aufträge. Bestehende Views zuerst prüfen.
- **Kanban:** Bestehende Phasen/IDs unverändert. Gewünschte Ergänzung „Bereit zur Übergabe“ erst nach Live-Prüfung der externen Apps-Script-/Workspace-Trigger; bestehende Versand-/Abschlussautomationen dürfen nicht vorzeitig feuern.
- **Eingangsautomation:** aktive Workspace-/Apps-Script-Version und Trigger lesen. Reine System-/Newsletter-Nachrichten nicht als Verkaufsleads erfassen; keine globale Domainsperre, die echte Geschäftskontakte unterdrückt. Nachvollziehbarer Ausschlussgrund und gesonderte Prüfung mehrdeutiger Nachrichten.
- **Follow-ups:** automatische Verlustentscheidung nicht allein aus fehlender Gmail-Antwort ableiten; WhatsApp und manuelle Kommunikation prüfen. Versand-/Bewertungsmails mit erfolgreichem Versand und wiederholbarer Zustandsmarkierung absichern.
- **Buchhaltung:** Rechnungsstatus erst nach eindeutigem Beleg-Matching, Zahlungsstatus nur nach unabhängigem Zahlungsnachweis befüllen.

Operative Datensätze und individuelle Prüfdetails verbleiben in HubSpot.
