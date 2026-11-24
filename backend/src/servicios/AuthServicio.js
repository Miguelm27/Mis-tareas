const crypto = require('crypto');
const Usuario = require('../modelos/Usuario');
const ErrorApp = require('../errores/ErrorApp');

/**
 * ============================================================
 *  CLASE: AuthServicio  (Autenticación)
 * ============================================================
 * Se encarga del REGISTRO, INICIO DE SESIÓN y CIERRE DE SESIÓN.
 *
 * ¿Cómo funciona la sesión?
 *  1. El usuario inicia sesión con correo y contraseña.
 *  2. Si son correctos, generamos un "token" (un código aleatorio).
 *  3. El celular guarda ese token y lo envía en cada petición.
 *  4. Con el token sabemos qué usuario está haciendo la petición.
 *
 * POO -> ENCAPSULAMIENTO: el mapa de sesiones (#sesiones) es privado.
 * POO -> COMPOSICIÓN: el servicio "tiene" repositorios dentro (los usa).
 */
class AuthServicio {
  #sesiones = new Map(); // token -> id del usuario

  constructor(usuarioRepositorio, materiaRepositorio) {
    this.usuarioRepositorio = usuarioRepositorio;
    this.materiaRepositorio = materiaRepositorio;
  }

  /** Registra a una persona nueva y le abre la sesión. */
  registrar(datos) {
    if (this.usuarioRepositorio.buscarPorCorreo(datos.correo)) {
      throw new ErrorApp('Ya existe una cuenta con ese correo', 409);
    }
    const usuario = new Usuario(datos);
    usuario.establecerContrasena(datos.contrasena);
    this.usuarioRepositorio.guardar(usuario); // guardar() también lo valida
    this.materiaRepositorio.crearPorDefecto(usuario.id);
    return { token: this.#crearSesion(usuario), usuario };
  }

  /** Revisa correo y contraseña. Si están bien, devuelve el token. */
  iniciarSesion(correo, contrasena) {
    const usuario = this.usuarioRepositorio.buscarPorCorreo(correo);
    if (!usuario || !usuario.verificarContrasena(contrasena)) {
      throw new ErrorApp('Correo o contraseña incorrectos', 401);
    }
    return { token: this.#crearSesion(usuario), usuario };
  }

  cerrarSesion(token) {
    this.#sesiones.delete(token);
  }

  /** Cambia la contraseña verificando primero la actual. */
  cambiarContrasena(usuario, actual, nueva) {
    if (!usuario.verificarContrasena(actual)) {
      throw new ErrorApp('La contraseña actual no es correcta');
    }
    usuario.establecerContrasena(nueva);
    this.usuarioRepositorio.guardar(usuario);
  }

  /** Método PRIVADO: crea un token aleatorio y lo asocia al usuario. */
  #crearSesion(usuario) {
    const token = crypto.randomUUID();
    this.#sesiones.set(token, usuario.id);
    return token;
  }

  /**
   * Devuelve un "middleware" de Express: una función que se ejecuta
   * ANTES de cada ruta protegida para revisar que haya sesión.
   * Si hay sesión, deja el usuario en req.usuario.
   */
  middleware() {
    return (req, res, next) => {
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      const usuarioId = this.#sesiones.get(token);
      const usuario = usuarioId ? this.usuarioRepositorio.buscarPorId(usuarioId) : null;
      if (!usuario) {
        return res.status(401).json({ error: 'Tu sesión expiró, vuelve a iniciar sesión' });
      }
      req.usuario = usuario;
      req.token = token;
      next();
    };
  }
}

module.exports = AuthServicio;
