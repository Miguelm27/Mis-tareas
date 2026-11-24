const Controlador = require('./Controlador');
const Materia = require('../modelos/Materia');
const ErrorApp = require('../errores/ErrorApp');

/**
 * ============================================================
 *  CLASE: MateriaControlador  (hereda de Controlador)
 * ============================================================
 * Rutas de materias (necesitan sesión iniciada):
 *   GET  /api/materias  -> lista de mis materias
 *   POST /api/materias  -> agregar materia
 */
class MateriaControlador extends Controlador {
  constructor(materiaRepositorio, authServicio) {
    super();
    this.materiaRepositorio = materiaRepositorio;
    this.authServicio = authServicio;
  }

  /** POLIMORFISMO: rutas propias de este controlador. */
  registrarRutas() {
    this.router.use(this.authServicio.middleware());
    this.ruta('get', '/', this.listar);
    this.ruta('post', '/', this.crear);
  }

  listar(req, res) {
    res.json(this.materiaRepositorio.buscarPorUsuario(req.usuario.id));
  }

  crear(req, res) {
    const materia = new Materia({ ...req.body, usuarioId: req.usuario.id });
    const repetida = this.materiaRepositorio
      .buscarPorUsuario(req.usuario.id)
      .some((m) => m.nombre.toLowerCase() === materia.nombre.toLowerCase());
    if (repetida) throw new ErrorApp('Ya tienes una materia con ese nombre', 409);
    this.materiaRepositorio.guardar(materia);
    res.status(201).json(materia);
  }
}

module.exports = MateriaControlador;
