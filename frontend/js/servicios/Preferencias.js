/**
 * ============================================================
 *  CLASE: Preferencias
 * ============================================================
 * Guarda en el celular (localStorage) las opciones del usuario:
 * el tema (claro/oscuro) y si quiere ver avisos de tareas próximas.
 */
export class Preferencias {
  get tema() {
    return localStorage.getItem('tema') || 'Claro';
  }

  set tema(valor) {
    localStorage.setItem('tema', valor);
    this.aplicarTema();
  }

  get notificaciones() {
    return localStorage.getItem('notificaciones') !== 'no';
  }

  set notificaciones(activas) {
    localStorage.setItem('notificaciones', activas ? 'si' : 'no');
  }

  /** Pone o quita la clase "tema-oscuro" en la página. */
  aplicarTema() {
    document.body.classList.toggle('tema-oscuro', this.tema === 'Oscuro');
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', this.tema === 'Oscuro' ? '#3B4FB8' : '#4C63DB');
  }
}
