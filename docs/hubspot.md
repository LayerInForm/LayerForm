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
