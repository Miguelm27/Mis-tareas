/**
 * ============================================================
 *  CLASE: Utilidades
 * ============================================================
 * Funciones de ayuda que se usan en varias pantallas.
 * Son métodos ESTÁTICOS: Utilidades.escapar(texto)
 */
export class Utilidades {
  /**
   * Evita que alguien escriba código HTML malicioso en un campo
   * (por ejemplo en el nombre de una tarea) y se ejecute en la app.
   */
  static escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
  }

  /** Lee todos los campos de un formulario y los devuelve como objeto. */
  static datosFormulario(formulario) {
    return Object.fromEntries(new FormData(formulario).entries());
  }
}
