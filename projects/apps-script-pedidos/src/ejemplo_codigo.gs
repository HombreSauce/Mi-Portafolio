/** =========================
 *  Clase Hoja (Base)
 *  ========================= */
this.Hoja = class Hoja {
  constructor(e, n1, n2, n3) {
    this.evento = e;            // onEdit / onFormSubmit
    this.nombreColRi   = n1;    // ej. "N° RI"
    this.nombreColArea = n2;    // ej. "ÁREA"
    this.nombreColDesc = n3;    // ej. "DESCRIPCIÓN"
  }

  getParametros() {
    const ri          = this.getRi();
    const area        = this.getArea();
    const descripcion = this.getDescripcion();
    return { ri, area, descripcion };
  }

  // ---------- Lectura con preferencia a namedValues (onFormSubmit) ----------
  getArea() {
    if (this.evento?.namedValues && this.evento.namedValues[this.nombreColArea])
      return this.evento.namedValues[this.nombreColArea][0];

    const h   = this.getHoja();
    const row = this.getFila().getRow();
    const col = this.buscarNroHeader(this.nombreColArea);
    if (col === 0) throw new Error("Encabezado de ÁREA no coincide con la hoja.");
    return h.getRange(row, col).getValue();
  }

  getRi() {
    if (this.evento?.namedValues && this.evento.namedValues[this.nombreColRi])
      return this.evento.namedValues[this.nombreColRi][0];

    const h   = this.getHoja();
    const row = this.getFila().getRow();
    const col = this.buscarNroHeader(this.nombreColRi);
    if (col === 0) throw new Error("Encabezado de N° RI no coincide con la hoja.");
    return h.getRange(row, col).getValue();
  }

  getDescripcion() {
    if (this.evento?.namedValues && this.evento.namedValues[this.nombreColDesc])
      return this.evento.namedValues[this.nombreColDesc][0];

    const h   = this.getHoja();
    const row = this.getFila().getRow();
    const col = this.buscarNroHeader(this.nombreColDesc);
    if (col === 0) throw new Error("Encabezado de DESCRIPCIÓN no coincide con la hoja.");
    return h.getRange(row, col).getValue();
  }

  // ---------- Utilidades ----------
  buscarNroHeader(nombre) {
    const h      = this.getHoja();
    const header = h.getRange(1, 1, 1, h.getLastColumn());
    const celda  = header.createTextFinder(String(nombre)).findNext();
    return celda ? celda.getColumn() : 0;
  }

  getHoja() {
    if (this.evento?.range?.getSheet) return this.evento.range.getSheet();              // onEdit
    if (this.evento?.source?.getActiveSheet) return this.evento.source.getActiveSheet(); // onFormSubmit
    return SpreadsheetApp.getActiveSheet(); // fallback
  }

  getFila() {
    if (this.evento?.range) return this.evento.range;           // onEdit
    const h = this.getHoja();                                   // onFormSubmit (última fila)
    return h.getRange(h.getLastRow(), 1, 1, h.getLastColumn());
  }
};


/** =========================
 *  Notificador (Base)
 *  ========================= */
this.NotificadorBase = class NotificadorBase {
  constructor(e) {
    this.evento = e;
  }

  notificarArea() {
    const datos = this.conseguirDatosMail(this.evento); // Implementar en subclase
    this.enviarMail(datos);
    Logger.log(`Correo enviado a: ${datos.email}`);
  }

  enviarMail(datosMensaje) {
    const mensaje = this.construirMensaje(datosMensaje); // Implementar en subclase
    MailApp.sendEmail(mensaje);
  }

  obtenerEmailArea(area) {
    // Depende de la librería externa "Mails" (área → email).
    return Mails.mailPorArea(area);
  }

  // Métodos abstractos: a implementar en subclases concretas
  conseguirDatosMail() {
    throw new Error("Debe implementar conseguirDatosMail()");
  }
  construirMensaje(/* parametros */) {
    throw new Error("Debe implementar construirMensaje()");
  }
};
