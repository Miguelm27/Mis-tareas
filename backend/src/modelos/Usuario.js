const crypto = require('crypto'); // Módulo de Node.js para encriptar
const Entidad = require('./Entidad');
const ErrorApp = require('../errores/ErrorApp');

/**
 * ============================================================
 *  CLASE: Usuario  (hereda de Entidad)
 * ============================================================
 * Representa a la persona que usa la app, con sus datos personales.
 *
 * POO -> HERENCIA: "extends Entidad" (recibe id y fechaCreacion).
 * POO -> ENCAPSULAMIENTO: la contraseña es un atributo PRIVADO (#contrasenaHash).
 *        Nadie fuera de esta clase puede leerla ni cambiarla directamente;
 *        solo se puede usar a través de los métodos establecerContrasena()
 *        y verificarContrasena().
 * POO -> POLIMORFISMO: sobrescribe validar() y aRegistro() de Entidad.
 */
class Usuario extends Entidad {
  // Atributo PRIVADO: el "#" hace que solo esta clase lo pueda ver.
  #contrasenaHash;

  constructor({ id, nombre, apellido, correo, telefono, carrera, contrasenaHash, fechaCreacion }) {
    super(id, fechaCreacion); // Llama al constructor de Entidad
    this.nombre = (nombre || '').trim();
    this.apellido = (apellido || '').trim();
    this.correo = (correo || '').trim().toLowerCase();
    this.telefono = (telefono || '').trim();
    this.carrera = (carrera || '').trim();
    this.#contrasenaHash = contrasenaHash || null;
  }

  /** GETTER: se usa como si fuera un atributo -> usuario.nombreCompleto */
  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  /**
   * Guarda la contraseña ENCRIPTADA (nunca guardamos la contraseña real).
   * Usamos "scrypt" con una "sal" aleatoria para que sea segura.
   */
  establecerContrasena(contrasena) {
    if (!contrasena || contrasena.length < 6) {
      throw new ErrorApp('La contraseña debe tener al menos 6 caracteres');
    }
    const sal = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(contrasena, sal, 64).toString('hex');
    this.#contrasenaHash = `${sal}:${hash}`;
  }

  /** Revisa si la contraseña escrita coincide con la guardada. Devuelve true/false. */
  verificarContrasena(contrasena) {
    if (!this.#contrasenaHash || !contrasena) return false;
    const [sal, hashGuardado] = this.#contrasenaHash.split(':');
    const hashIntento = crypto.scryptSync(contrasena, sal, 64).toString('hex');
    return hashGuardado === hashIntento;
  }

  /** Cambia los datos personales (solo los que vengan con valor). */
  actualizarDatos({ nombre, apellido, telefono, carrera }) {
    if (nombre !== undefined) this.nombre = nombre.trim();
    if (apellido !== undefined) this.apellido = apellido.trim();
    if (telefono !== undefined) this.telefono = telefono.trim();
    if (carrera !== undefined) this.carrera = carrera.trim();
  }

  /** POLIMORFISMO: reglas propias de un Usuario. */
  validar() {
    if (!this.nombre) throw new ErrorApp('El nombre es obligatorio');
    if (!this.apellido) throw new ErrorApp('El apellido es obligatorio');
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoCorreo.test(this.correo)) throw new ErrorApp('El correo no es válido');
    if (this.telefono && !/^[0-9+\s-]{7,15}$/.test(this.telefono)) {
      throw new ErrorApp('El teléfono no es válido');
    }
  }

  /**
   * POLIMORFISMO: para la base de datos SÍ necesitamos la contraseña encriptada,
   * así que agregamos el atributo privado al registro.
   * (toJSON() no la incluye, por eso nunca se envía al celular).
   */
  aRegistro() {
    return { ...this.toJSON(), contrasenaHash: this.#contrasenaHash };
  }
}

module.exports = Usuario;
