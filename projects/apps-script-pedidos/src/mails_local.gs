/** =========================================
 *  mailPorArea (versión local, autocontenida)
 *  Lee una hoja llamada "Mails_de_Areas" del
 *  spreadsheet activo y resuelve Área → Email.
 *  Encabezados esperados: AREA | EMAIL
 *  ========================================= */
function mailPorArea(area) {
  // Lee la pestaña local "Mails_de_Areas" del mismo spreadsheet
  const ss = SpreadsheetApp.getActive();
  const hoja = ss.getSheetByName('Mails_de_Areas');
  if (!hoja) throw new Error('Falta la hoja "Mails_de_Areas" en este spreadsheet.');

  const datos = hoja.getDataRange().getDisplayValues().slice(1); // sin encabezado

  const norm = s => String(s).trim().toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const objetivo = norm(area);
  const fila = datos.find(r => norm(r[0]) === objetivo);

  const email = fila && fila[1];
  if (!email || !/@/.test(email)) {
    throw new Error('No se encontró un email válido para el área: ' + area);
  }
  return email;
}
