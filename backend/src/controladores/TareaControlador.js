const Controlador = require('./Controlador');
const Tarea = require('../modelos/Tarea');
const ErrorApp = require('../errores/ErrorApp');

/**
 * ============================================================
 *  CLASE: TareaControlador  (hereda de Controlador)
 * ============================================================
 * Rutas de tareas (todas necesitan sesión iniciada):
 *   GET    /api/tareas      -> lista de mis tareas
 *   POST   /api/tareas      -> crear tarea
 *   GET    /api/tareas/:id  -> ver una tarea
 *   PUT    /api/tareas/:id  -> editar tarea
 *   DELETE /api/tareas/:id  -> eliminar tarea
 */
class TareaControlador extends Controlador {
  constructor(tareaRepositorio, materiaRepositorio, authServicio) {
    super();
    this.tareaRepositorio = tareaRepositorio;
    this.materiaRepositorio = materiaRepositorio;
    this.authServicio = authServicio;
  }

  /** POLIMORFISMO: rutas propias de este controlador. */
  registrarRutas() {
    this.router.use(this.authServicio.middleware());
    this.ruta('get', '/', this.listar);
    this.ruta('post', '/', this.crear);
    this.ruta('get', '/:id', this.obtener);
    this.ruta('put', '/:id', this.actualizar);
    this.ruta('delete', '/:id', this.eliminar);
  }

  listar(req, res) {
    res.json(this.tareaRepositorio.buscarPorUsuario(req.usuario.id));
  }

  crear(req, res) {
    const tarea = new Tarea({ ...req.body, usuarioId: req.usuario.id });
    this.#verificarMateria(tarea.materiaId, req.usuario.id);
    this.tareaRepositorio.guardar(tarea);
    res.status(201).json(tarea);
  }

  obtener(req, res) {
    res.json(this.#buscarTareaDelUsuario(req));
  }

  actualizar(req, res) {
    const tarea = this.#buscarTareaDelUsuario(req);
    tarea.actualizar(req.body);
    this.#verificarMateria(tarea.materiaId, req.usuario.id);
    this.tareaRepositorio.guardar(tarea);
    res.json(tarea);
  }

  eliminar(req, res) {
    const tarea = this.#buscarTareaDelUsuario(req);
    this.tareaRepositorio.eliminar(tarea.id);
    res.json({ mensaje: 'Tarea eliminada' });
  }

  /** PRIVADO: busca la tarea y revisa que sea del usuario que la pide. */
  #buscarTareaDelUsuario(req) {
    const tarea = this.tareaRepositorio.buscarPorId(req.params.id);
    if (!tarea || !tarea.perteneceA(req.usuario.id)) {
      throw new ErrorApp('La tarea no existe', 404);
    }
    return tarea;
  }

  /** PRIVADO: revisa que la materia exista y sea del usuario. */
  #verificarMateria(materiaId, usuarioId) {
    const materia = this.materiaRepositorio.buscarPorId(materiaId);
    if (!materia || !materia.perteneceA(usuarioId)) {
      throw new ErrorApp('Debes seleccionar una materia');
    }
  }
}

module.exports = TareaControlador;
