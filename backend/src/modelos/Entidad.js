/**
 * ============================================================
 *  CLASE BASE: Entidad
 * ============================================================
 * Es la clase "padre" de todos los modelos (Usuario, Tarea, Materia).
 * Guarda lo que TODOS tienen en común: un id y una fecha de creación.
 *
 * POO -> ABSTRACCIÓN: Entidad no se usa sola, sirve como molde general.
 * POO -> HERENCIA: Usuario, Tarea y Materia hacen "extends Entidad".
 * POO -> POLIMORFISMO: el método validar() se define aquí, pero cada
 *        clase hija lo SOBRESCRIBE con sus propias reglas.
 */
class Entidad {
  constructor(id, fechaCreacion) {
    // Si no nos pasan un id (objeto nuevo), generamos uno.
    this.id = id || Entidad.generarId();
    this.fechaCreacion = fechaCreacion || new Date().toISOString();
  }

  /**
   * Método ESTÁTICO: pertenece a la clase, no a un objeto.
   * Se llama así: Entidad.generarId()
   * Genera un id único usando la hora actual + números aleatorios.
   */
  static generarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /**
   * Método "abstracto": las clases hijas DEBEN sobrescribirlo.
   * Si alguna clase hija lo olvida, se lanza este error.
   */
  validar() {
    throw new Error(`La clase ${this.constructor.name} debe implementar validar()`);
  }

  /**
   * Convierte el objeto a JSON para enviarlo al frontend.
   * Solo incluye los atributos PÚBLICOS (los privados con # no salen).
   */
  toJSON() {
    return { ...this };
  }

  /**
   * Convierte el objeto al formato en que se guarda en la base de datos.
   * Por defecto es igual a toJSON(), pero Usuario lo sobrescribe
   * para guardar también la contraseña encriptada.
   */
  aRegistro() {
    return this.toJSON();
  }
}

module.exports = Entidad;
