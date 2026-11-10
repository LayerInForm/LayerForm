# Quellen, Verifikationsstand und Dokumentationspflege

**Erstellt:** 2026-11-09. Dieses Repository ist öffentlich. Die Dokumentation ist bewusst auf Unternehmensstruktur und technische Verträge begrenzt.

## Quellenhierarchie

1. **Live-Daten im führenden System** (z. B. HubSpot-Datensatz, Vercel-Deployment) bei Bedarf aktuell lesen.
2. **GitHub-Code am konkreten Commit** als Beleg für implementierte Logik.
3. **`docs/integrations.md`** als bestehende Integrationsreferenz. Ihr Abschnitt „Produktive Umstellung vom 09.11.2026“ geht älteren Snapshots in derselben Datei vor.
4. **Mitgeteilte Unternehmensangaben** als Kontext, keine automatisch live verifizierten Fakten.
5. **Fachliche Projektangaben** nur nach Abgleich mit den oben genannten Quellen übernehmen.

## Bekannte Unsicherheiten / Widersprüche

| Bereich | Beobachtung | Umgang |
| --- | --- | --- |
| Website-Domain | `www.layer-form.de` und `layer-form.de` werden unterschiedlich als primär beschrieben. | Tatsächliche Redirects, DNS und Vercel-Domains live prüfen. |
| Cookie-Banner | Code unter `api/consent.ts` für eigenen Consent-Beleg vorhanden; `integrations.md` dokumentiert gleichzeitig den Wunsch, künftig auf HubSpot-Cookie-Verwaltung umzusteigen. | Zielentscheidung nicht als umgesetzt ausgeben; Browser/HubSpot-Live-Status prüfen. |
| Formular-Fallback | Ältere Passagen in `integrations.md` beschreiben Resend-Fallback. Der jüngste Abschnitt und aktuelle Routenkommentare beschreiben ausschließlich HubSpot für Geschäftsanfragen. | Jüngeren Code priorisieren, frühere Angaben als historischen Snapshot lesen. |
| HubSpot-Ansichten | Freigegebene Soll-Struktur vorhanden, aber keine nachgewiesene Anlage in HubSpot. | Vor erneutem Anlegen bestehende Ansichten über UI prüfen. |
| Öffentlicher Rechner | Code besteht, `PREISRECHNER_AKTIV = false`. | Nicht behaupten, der öffentliche Rechner sei aktiv. |
| Externe Apps-Script-/Studio-Flows | Es existieren Dokumentations-/Upload-Snapshots; aktive Version und Trigger nicht durch Repository-Stand belegt. | Direkt in der jeweiligen Umgebung lesen. |
| Zahlungs- und Versandautomationen | Teilweise geplant oder sandboxgetestet. | Keine aktive Produktionsautomatik behaupten. |
| Home-Server | Ubuntu/Caddy/Tailscale sind mitgeteilt; vollständige Dienste und Deployments unbekannt. | Erst nach autorisierter Live-Prüfung ergänzen. |
| Weitere Kundenwebsites | Domains bekannt, GitHub-/Vercel-Zuordnungen unbekannt. | Keine Projektverknüpfung erfinden. |

| Miro-Prozesslandkarte | In diesem Chat zuvor bearbeitete farbige Unternehmens-Mindmap mit Software-Links; im GitHub-Übergabestand noch als verworfen bezeichnet. | GitHub `docs/` bleibt einzige versionierte Wissensbasis; Miro als ergänzende Navigationsansicht behandeln. Miro-Live-Abgleich am 09.11.2026 wegen täglichem MCP-Limit **OFFEN**. |
| Gemini und externe Automationen | Gemini wurde als mögliches Assistenzwerkzeug in Miro berücksichtigt; produktiver Einsatz und tatsächliche Skript-/Workflow-Trigger sind nicht bestätigt. | Nicht als aktive Integration oder führendes System darstellen; zuerst in der jeweiligen Anwendung prüfen. |

## Stand bei Erstellung

- `main`: Repositorystruktur, vorhandene Datei `docs/integrations.md`, `package.json`, `vercel.json`, `src/constants.ts`, `src/features.ts` und relevante API-Routen lesend geprüft.
- An der bestehenden Website und an `docs/integrations.md` **keine Änderungen** vorgenommen.
- Neue Dateien im Branch `docs/layerform-wissensbasis-2026-11-09` vorbereitet, damit die produktive Website erst nach Review betroffen ist.

## Änderungsprotokoll

| Datum | Änderung | Betroffene Dateien | Status |
| --- | --- | --- | --- |
| 2026-11-09 | Aufbau einer zusammenhängenden, öffentlichen LayerForm-Wissensbasis aus bestehender Integrationsdokumentation und Codeprüfung | `docs/README.md`, `unternehmen.md`, `systeme.md`, `hubspot.md`, `prozesse.md`, `projekte.md`, `regeln.md`, `status.md` | PR zur Prüfung; Website-Code bleibt unverändert |
| 2026-11-09 | Dauerhafte Übergabe des wichtigen Chat-Wissens; zusätzliche Fachleitfäden und klare Einstiegsregeln | `chat-uebergabe.md`, `website.md`, `versand.md`, `marketing.md`, `betrieb.md`, `README.md` | Auf demselben Dokumentations-Branch; keine Änderung an Website-Code oder CRM |

| 2026-11-09 | Frühere Miro-Mindmap-Arbeit mit GitHub-Zuständigkeitsmodell abgeglichen; Miro als optionale Visualisierung statt zweiter Wissensbasis dokumentiert. Bestehende Website und produktive Systeme nicht verändert; Miro-Live-Abgleich durch Tool-Limit blockiert. | `chat-uebergabe.md`, `betrieb.md`, `status.md` | **UMGESETZT** (GitHub-Branch/PR), Miro **OFFEN** |

| 2026-11-09 | Materialauswahl des Kontaktformulars zusätzlich in Deal-Material übernehmen; bestehende Anfrage-Fingerprints erhalten. HubSpot-Enum und neun isolierte Zuordnungen geprüft; Routentests ergänzt, Ausführung blockiert. | `api/_lib/hubspot.ts`, `tests/inquiries.test.cjs`, `integrations.md` | Implementiert; Deployment separat prüfen |

| 2026-11-09 | Turnstile für Kontaktformular und Rechner samt serverseitiger Host-/Action-Prüfung und Limit von fünf neuen Anfrage-IDs je IP/15 Minuten vorbereitet. Retry-Journal unverändert. | `api/_lib/antispam.ts`, `api/_lib/inquiries.ts`, `components/SpamProtection.tsx`, Formular-Komponenten, Tests, Datenschutz | VORBEREITET; Schlüssel fehlen, Production nicht geändert |

| 2026-11-09 | Spamschutz-Preview mit expliziter Prüfkette erfolgreich: Frontend-/API-Typechecks, 21 Tests, Build. | PR #6, Preview `dpl_BQavULDQeJZa7J4s17NpFZEe7PVA` | AUTOMATISIERT GETESTET; Cloudflare-Widget/Schlüssel und Browser-Live-Test OFFEN; Production unverändert |

| 2026-11-09 | Turnstile-Variablen für Production per Metadaten bestätigt; Secret als Sensitive. Nutzer-Widget eingerichtet. Produktive Übernahme von PR #6 gestartet. | `integrations.md`, PR #6 | Konfiguration bestätigt; Deployment anschließend prüfen, Browser-/CRM-End-to-End-Test OFFEN |

| 2026-11-09 | Dezente Website-Designpflege: Typografie, Kontrast, Hero-Bildhöhe, Navigation und Button-Zustände; bestehende Komponenten verwendet, keine neuen Abhängigkeiten. | `index.css`, `tailwind.config.js`, `Hero.tsx`, `Navbar.tsx`, `Projects.tsx`, `website.md` | Implementiert; automatisierte Prüfung folgt, visuelle Browserprüfung OFFEN |

| 2026-11-09 | Nutzerpalette #030407 / #1558C9 / #D4FF24 in Theme, Hero, Kontakt, Formular und Footer übernommen; Vollfarb-Kontraste geprüft. | Theme/CSS und Darstellungs-Komponenten, `website.md` | Implementiert; Typechecks/Tests/Build folgen, visuelle Prüfung OFFEN |

| 2026-11-09 | Helle Nutzerpalette Gelb #FFF21A, Schrift #171717, Elemente #A66BFF. Ehemalige Dark-Mode-Rahmen, Textakzente, Bildbeschriftungen und Fehlermeldungen angepasst. | Theme, CSS, Darstellungs-Komponenten, `website.md` | Implementiert; automatisierte Validierung folgt, visuelle Prüfung OFFEN |

| 2026-11-09 | Gelb-lila Variante nach Nutzerablehnung zurückgenommen; Darstellung wieder auf Stand vor PR #9 (Schwarz/Blau/Limette). | Darstellungsdateien, `website.md` | Wiederherstellung; Deployment anschließend prüfen |

| 2026-11-09 | Nutzer fordert ursprüngliche Logo-Palette zurück: Marineblau, Cyan, helle Schrift. Farbdateien aus geprüftem Stand nach PR #7 wiederhergestellt. | Theme/CSS und Farb-Komponenten, `website.md` | Wiederhergestellt; Produktionsdeployment anschließend prüfen |

## 10.11.2026 – SEO und KI-Suche

- **CODE-VERIFIZIERT / lokal geprüft:** Statisches Prerendering, drei eigene Leistungsseiten, crawlbare Links, individuelle Metadaten, Organization-/Service-Daten und generierte Sitemap. Details und offene Erfolgsmessung in [website.md](website.md).
- Kein Zugriff auf Search-Console-Leistungsdaten; Indexierung und mehr qualifizierte Anfragen sind noch nicht nachgewiesen. Produktionsstatus separat am Deployment prüfen.
