/** Deal-Titel enthalten nur ein freigegebenes Leistungsthema, keine Kontaktnamen. */
const THEMEN = new Set(['Automatisierung', 'IT-Service', 'Ersatzteil', 'Prototyp', 'Giveaways', 'Deko & Geschenke', 'Serienproduktion', 'CAD-Konstruktion']);
export function dealTitel(source: string, titel: string, material?: string): string {
  if (source === 'anfrage') {
    const materialien = (material || '').split(';').filter(m => ['pla', 'petg', 'asa', 'abs', 'tpu'].includes(m)).map(m => m.toUpperCase());
    return '3D-Druck' + (materialien.length ? ' – ' + materialien.join(' / ') : '');
  }
  const thema = titel.split(' – ')[0].trim();
  return THEMEN.has(thema) ? thema : '3D-Druck';
}
