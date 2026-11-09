# Projekte, Produktentwicklung und Roadmap

**Stand:** 2026-11-09. Hier stehen **nur öffentliche bzw. allgemeine Projektübersichten**, keine unveröffentlichten Kundendetails. Projektstände sind Snapshots und müssen im jeweiligen System bestätigt werden.

## Projektlandschaft

| Projekt / Stream | Gegenstand | Stand |
| --- | --- | --- |
| LayerForm Website | Öffentlicher Auftritt, Formulare, Kalkulator, rechtliche Seiten | Website-Code vorhanden; Live-Deployment jeweils prüfen |
| Website → HubSpot | Kontaktanlage, Deal, Notiz, Datei- und Retry-Logik | Code implementiert; Live-Schreibtest und offene Risiken siehe `integrations.md` |
| CRM-Ansichten | Vier Deal-Ansichten, drei Aufgabenansichten, einheitliches Layout | Freigegeben / in HubSpot-UI **noch nicht nachgewiesen** |
| Rechnungsautomatisierung | Lexware-Mailstatus → HubSpot | Externe Logik beschrieben; produktive Trigger prüfen |
| DHL-Integration | Versandlabel, Tracking, HubSpot-Felder | Sandbox-Vorarbeit mitgeteilt; Live-Freigabe offen |
| Cookie-Einwilligung | Entscheidung zwischen eigenem Banner und HubSpot-Consent-Verwaltung | **Widersprüchliche Stände**; aktuelle UI und Datenschutzentscheidung prüfen, keine Umstellung behaupten |
| Etsy-Sortiment | Drei standardisierbare 3D-Druckprodukte | Entwicklungsidee, nicht bestätigt als verkaufsfertig |
| Faltbarer Becherträger | Träger für sechs Getränkebecher | Konzept, Validierung/Konstruktion/Schutzrechte offen |
| B2B-Referenzprojekte | Prototypen, Kleinserien, individuelle Konstruktionen | Kundennamen/Details nur mit Freigabe öffentlich dokumentieren |
| TAX-Steuerberater-Website | Digitale Visitenkarte für Kundenunternehmen | Kundenprojekt / Entwurfsarbeit, separates Repository/Hosting nicht verifiziert |
| Bohs-Buchhaltungswebsite | Zweite Website in ähnlichem Stil | Folgeprojekt / geplant, Zuordnung noch offen |

## Priorisierte nächste Schritte

1. **P0: Datenschutz/Consent:** Tatsächliche produktive Consent-Lösung, Banner, Widerruf, Netzanfragen, Speicherung und rechtliche Dokumentation überprüfen.
2. **P0: CRM-Ansichten:** Gespeicherte Ansichten und Layout in HubSpot-UI prüfen/anlegen; bestehende Konfiguration erhalten.
3. **P1: Integrationsmonitoring:** Fehler bei Website-Anfrage-ID, Redis-Journal und CRM-Eintrag erkennen; keine Dubletten.
4. **P1: Rechnungen/Zahlung:** Lexware- und Bank-/PayPal-Ereignisse sauber und nachweisbar in CRM überführen.
5. **P1: DHL:** Sandbox vs. Produktion, Adressvalidierung und echte Label-Käufe absichern.
6. **P2: Produktentwicklung:** Etsy-Ideen validieren, Stückkosten, Zielgruppen und Serienfähigkeit prüfen.
7. **P2: Monitoring/KPI:** Auswertungen auf Basis bestätigter Live-Daten.

## Projektpflege

Jeder neue Eintrag erhält: **Status** (`GEPLANT`, `UMGESETZT`, `VERIFIZIERT`, `OFFEN`), **führendes System**, **öffentliche technische Referenz** und **letzten Prüfzeitpunkt**. Kundenaufträge ausschließlich im CRM pflegen.
