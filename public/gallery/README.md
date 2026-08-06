# Galerie Bilder Ordner (/public/gallery)

In diesem Ordner können Sie ganz einfach Ihre eigenen Bilder für die **Projektgalerie** ablegen.

## Standard Dateinamen:
Sie können Ihre Bilder einfach wie folgt benennen und hier einfügen:

- `projekt-1.jpg` (Industrielle Bauteile)
- `projekt-2.jpg` (Custom Prototyping)
- `projekt-3.jpg` (Funktionsmodelle & Design)
- `projekt-4.jpg` (Kleinserien & On-Demand)
- `projekt-5.jpg` (Ersatzteil Rekonstruktion)
- `projekt-6.jpg` (Firmenlogos & Schriftzüge)

*(Unterstützte Formate: `.jpg`, `.jpeg`, `.png`, `.webp`)*

## Neue Projekte hinzufügen:
Neue Projekte können direkt in `/data/gallery.ts` ergänzt werden. 
Wenn ein lokales Bild nicht gefunden wird, schaltet die Galerie automatisch auf ein Fallback-Bild um, sodass keine abgebrochenen Grafiken angezeigt werden.
