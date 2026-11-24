const Repositorio = require('./Repositorio');
const Usuario = require('../modelos/Usuario');

/**
 * Repositorio de usuarios (hereda de Repositorio).
 * Solo agrega lo que es propio de los usuarios.
 */
class UsuarioRepositorio extends Repositorio {
  constructor(baseDatos) {
    super(baseDatos, 'usuarios');
  }

  /** POLIMORFISMO: aquí se crean objetos Usuario. */
  crearInstancia(registro) {
    return new Usuario(registro);
  }

  /** Busca un usuario por su correo (para el inicio de sesión). */
  buscarPorCorreo(correo) {
    const correoLimpio = (correo || '').trim().toLowerCase();
    return this.obtenerTodos().find((usuario) => usuario.correo === correoLimpio) || null;
  }
}

module.exports = UsuarioRepositorio;
