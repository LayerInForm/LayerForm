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

| 2026-11-09 | CRM-Organisation: Systemabsender umklassifiziert; sieben Wiedervorlagen und acht verknüpfte Aufgaben; separate Rechnungs-/Zahlungsstatusfelder angelegt. Änderungen zurückgelesen. | `hubspot.md` | CRM LIVE-VERIFIZIERT; Layout, Kanban und externe Automation wegen fehlendem Oberflächen-/Live-Script-Zugriff OFFEN |
