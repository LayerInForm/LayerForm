// Nur feste öffentliche Einstiegsseiten in der Statistik verwenden.
// Keine Suchparameter, Freitexte, Namen oder Anfrage-IDs übertragen.
const ENTRY_PAGES = new Set(['/', '/3d-druck', '/cad-konstruktion', '/automatisierung', '/kontakt', '/anfrage']);

export function inquirySuccessPath(entryPath: string): string {
  const path = entryPath.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';
  const entry = ENTRY_PAGES.has(path) ? (path === '/' ? '/startseite' : path) : '/sonstige';
  return '/anfrage-erfolgreich' + entry;
}
