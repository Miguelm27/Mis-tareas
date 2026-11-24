const Controlador = require('./Controlador');

/**
 * ============================================================
 *  CLASE: AuthControlador  (hereda de Controlador)
 * ============================================================
 * Rutas de usuario:
 *   POST /api/auth/registro    -> crear cuenta
 *   POST /api/auth/login       -> iniciar sesión
 *   POST /api/auth/logout      -> cerrar sesión
 *   GET  /api/auth/perfil      -> ver mis datos
 *   PUT  /api/auth/perfil      -> editar mis datos
 *   PUT  /api/auth/contrasena  -> cambiar contraseña
 */
class AuthControlador extends Controlador {
  constructor(authServicio, usuarioRepositorio) {
    super(); // Llama al constructor de Controlador (crea el router)
    this.authServicio = authServicio;
    this.usuarioRepositorio = usuarioRepositorio;
  }

  /** POLIMORFISMO: rutas propias de este controlador. */
  registrarRutas() {
    const protegida = this.authServicio.middleware(); // exige sesión iniciada
    this.ruta('post', '/registro', this.registro);
    this.ruta('post', '/login', this.login);
    this.router.use(protegida); // Todas las rutas de abajo necesitan sesión
    this.ruta('post', '/logout', this.logout);
    this.ruta('get', '/perfil', this.perfil);
    this.ruta('put', '/perfil', this.actualizarPerfil);
    this.ruta('put', '/contrasena', this.cambiarContrasena);
  }

  registro(req, res) {
    const resultado = this.authServicio.registrar(req.body);
    res.status(201).json(resultado);
  }

  login(req, res) {
    const { correo, contrasena } = req.body;
    res.json(this.authServicio.iniciarSesion(correo, contrasena));
  }

  logout(req, res) {
    this.authServicio.cerrarSesion(req.token);
    res.json({ mensaje: 'Sesión cerrada' });
  }

  perfil(req, res) {
    res.json(req.usuario); // toJSON() hace que NO se envíe la contraseña
  }

  actualizarPerfil(req, res) {
    req.usuario.actualizarDatos(req.body);
    this.usuarioRepositorio.guardar(req.usuario);
    res.json(req.usuario);
  }

  cambiarContrasena(req, res) {
    const { actual, nueva } = req.body;
    this.authServicio.cambiarContrasena(req.usuario, actual, nueva);
    res.json({ mensaje: 'Contraseña actualizada' });
  }
}

module.exports = AuthControlador;
