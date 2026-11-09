# Übergabe an künftige LayerForm-Chats

> **Historischer Wissensstand: 09.11.2026.** Diese Datei ist ausdrücklich eine Übergabe aus bisherigen Chat-Unterhaltungen. **Sie ersetzt keine Live-Prüfung.** Das GitHub-Repository ist öffentlich, daher keine vertraulichen Kundeninformationen, Zugangsdaten oder internen Finanzdaten.

## Bitte zuerst lesen

1. [README](README.md): Navigation und Zuständigkeiten.
2. [Regeln für alle Chats](regeln.md): Sicherheits- und Änderungsgrenzen.
3. Passende Fachdatei aus `docs/`.
4. Bei Website-CRM-Schnittstellen: [Integrationsdokumentation](integrations.md), **neueste produktive Aktualisierung vor älteren Beschreibungen**.
5. Live-Quelle: GitHub-Commit, Vercel, HubSpot oder zuständige Anwendung.

## Gesicherte Entscheidungen und Prioritäten

| Thema | Entscheidung / Sachstand | Weiterarbeit |
| --- | --- | --- |
| Dokumentation | **GitHub `docs/` ist die einzige zentrale LayerForm-Wissensbasis**. Frühere visuelle Board-Lösungen wurden verworfen. | Keine separate parallele Unternehmensdatenbank ohne Auftrag. |
| GitHub-Änderungen | Dokumentationsänderungen zunächst im Branch und PR überprüfen; Website nicht nebenbei umgestalten. | PR prüfen, dann nach `main` übernehmen. |
| HubSpot Phase 1.1 | Vier im CRM bestätigte `hs_next_step`-Aktualisierungen wurden ausgeführt und zurückgelesen. | Nicht erneut oder ungeprüft überschreiben. |
| HubSpot Phase 1.2 | Vier Deal-Ansichten, drei Aufgabenansichten und ein einheitliches Layout wurden **freigegeben, aber nicht technisch erstellt**. | In HubSpot-Oberfläche Bestand prüfen; erst dann konfigurieren. |
| ROTOCON | Bestehende Aufträge und Automationen ausdrücklich geschützt. | Keine Änderungen ohne konkrete erneute Freigabe. |
| Testdaten | DHL-Testdeal ist als TEST erkennbar; nicht mit realen Bestellungen vermischen. | Eigene Testansicht in CRM, ohne Deal-Phase zu ändern. |
| Kundenservice | Website-Anfragen sollen CRM-orientiert und ohne stille E-Mail-Fallback-Dubletten verarbeitet werden. | Retry-/Idempotenzvertrag erhalten. |
| Website / Rechner | Öffentlicher Preisrechner im Code deaktiviert, interner Kalkulator bleibt eigenständig. | Schalter nur auf ausdrückliche Anweisung ändern. |
| DHL | Auf DHL fokussieren; ältere Hermes-Felder können existieren. | Keine Bereinigung ohne Abhängigkeitsprüfung. |
| Social | Bestehende Instagram-/TikTok-Bio soll nicht ungefragt verändert werden. | Content-Arbeit separat vom CRM halten. |
| Etsy | Erst kleines Sortiment mit etwa drei serienfähigen Produkten testen. | Ideen validieren, nicht als fertig vermarkten. |
| Steuer/Consent | Änderungen an Umsatzsteuer und Cookie-Verwaltung waren Planung bzw. strittiger Zustand. | Kein automatisch angenommener Rechts- oder Deploymentstatus. |

## Was dieser Chat überprüft hat

- GitHub-Repository `LayerInForm/LayerForm`, Standardbranch `main`, vorhandene `docs/integrations.md`, React/Vite-Stack und Website-Dateien wurden über die GitHub-Verbindung gelesen.
- Aktueller Feature-Schalter: `PREISRECHNER_AKTIV = false`.
- Website-Endpunkte `/api/kontakt`, `/api/anfrage`, `/api/consent` und HubSpot-Client liegen im Repository; konkrete CRM- und Redis-Deduplizierung ist in der Integrationsdatei beschrieben.
- HubSpot-Phase 1.1: Vier gezielte CRM-Nächste-Schritte-Änderungen wurden in einem früheren Arbeitsschritt bestätigt und per Read-back geprüft. **Keine automatischen Änderungen an anderen Deals.**
- HubSpot-Phase 1.2: API-Werkzeuge konnten gespeicherte Ansichten und Record-Layouts nicht schreiben. **Die Anweisungen waren ein Plan, keine Umsetzung.**
- Diese Wissensbasis wurde auf einem eigenen Git-Branch erzeugt. **Ein offener Pull Request ist kein Merge nach `main`**.

## Änderungsregeln

- Ein Chat darf nicht nur aus alten Gesprächen schließen, dass ein Projekt jetzt fertig ist.
- „Geplant“, „im Code implementiert“, „in einer Sandbox getestet“, „live getestet“ und „produktiv freigegeben“ sind verschiedene Zustände.
- Vor CRM-Updates Kunden, Firma und Deal eindeutig zuordnen. Vor Rechnungs-/Versandautomation technische Trigger prüfen.
- Nutzerinformationen nur im für die Aufgabe notwendigen Umfang behandeln. **Das öffentliche GitHub-Repository niemals als Ersatz für HubSpot, Lexware, ein geschütztes Kundenarchiv oder einen Secret-Store verwenden.**

## Kurzanweisung für neue Chats

> Arbeite für LayerForm auf Grundlage von `https://github.com/LayerInForm/LayerForm/tree/main/docs`. Lies zuerst `docs/README.md`, `docs/regeln.md` und `docs/chat-uebergabe.md`, anschließend die relevanten Fachdateien. Bevor du Änderungen vornimmst, prüfe die Daten im jeweiligen Live-System, bewahre bestehende Automationen, respektiere den Schutz produktiver Kundendaten und dokumentiere nur bestätigte Änderungen im passenden GitHub-Dokument. Nutze keine frühere Chat-Aussage als Nachweis für den heutigen Live-Status. 
