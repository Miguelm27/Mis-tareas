/**
 * ============================================================
 *  CLASE: ErrorApp
 * ============================================================
 * Error personalizado de nuestra aplicación.
 *
 * POO -> HERENCIA: "extends Error" significa que ErrorApp HEREDA
 * todo lo que tiene la clase Error de JavaScript (mensaje, pila, etc.)
 * y además le agregamos un atributo nuevo: el código HTTP.
 *
 * Ejemplo de uso:
 *   throw new ErrorApp('El correo ya está registrado', 409);
 */
class ErrorApp extends Error {
  /**
   * @param {string} mensaje   Texto que verá el usuario.
   * @param {number} estadoHttp Código HTTP (400 = dato inválido, 401 = sin sesión, 404 = no existe...).
   */
  constructor(mensaje, estadoHttp = 400) {
    super(mensaje); // "super" llama al constructor de la clase padre (Error)
    this.name = 'ErrorApp';
    this.estadoHttp = estadoHttp;
  }
}

module.exports = ErrorApp;
