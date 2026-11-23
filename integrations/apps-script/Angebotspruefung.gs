/** Referenz für den in Code.gs ersetzten Abschnitt; NICHT zusätzlich laden.
 * Benötigt bewertungPhaseneintritt_ aus der bestehenden Historienkorrektur.
 * Absichtlich nur lesend: keine Aufgaben, Phasenwechsel oder Kundenmails.
 */
function angeboteNachfassen_() {
  const result = { modus: 'NUR_LESEN', offeneAngebote: 0, nachFuenfTagen: 0, nachDreissigTagen: 0, ohneHistorie: 0 };
  let after;
  const seen = {};
  do {
    const body = { filterGroups: [{ filters: [
      { propertyName: 'pipeline', operator: 'EQ', value: CONFIG.PIPELINE },
      { propertyName: 'dealstage', operator: 'EQ', value: STAGE_ANGEBOT }
    ] }], limit: 100, properties: ['dealstage'] };
    if (after !== undefined) body.after = after;
    const page = hs_('post', '/crm/v3/objects/deals/search', body);
    (page.results || []).forEach(d => {
      const detail = hs_('get', '/crm/v3/objects/deals/' + encodeURIComponent(d.id) + '?properties=dealstage&propertiesWithHistory=dealstage');
      const seit = bewertungPhaseneintritt_(detail, STAGE_ANGEBOT);
      if (String((detail.properties || {}).dealstage) !== String(STAGE_ANGEBOT)) return;
      result.offeneAngebote++;
      if (seit === null) { result.ohneHistorie++; return; }
      const tage = Math.floor((Date.now() - seit) / 86400000);
      if (tage >= NACHFASSEN_NACH_TAGEN) result.nachFuenfTagen++;
      if (tage >= VERLOREN_NACH_TAGEN) result.nachDreissigTagen++;
    });
    const next = page.paging && page.paging.next && page.paging.next.after;
    if (next !== undefined && next !== null) {
      if (seen[String(next)]) throw new Error('Angebotsprüfung: wiederholter Seitencursor');
      seen[String(next)] = true; after = next;
    } else after = undefined;
  } while (after !== undefined);
  console.log(JSON.stringify(result));
  return result;
}
function angeboteNachfassDiagnoseOhneSchreibzugriff() {
  const result = angeboteNachfassen_();
  if (result.modus !== 'NUR_LESEN') throw new Error('Unerwarteter Prüfmodus');
  console.log('ERFOLG: Angebotsprüfung ohne Aufgaben, Phasenwechsel oder E-Mails.');
}
