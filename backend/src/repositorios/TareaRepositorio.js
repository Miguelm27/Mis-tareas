const Repositorio = require('./Repositorio');
const Tarea = require('../modelos/Tarea');

/**
 * Repositorio de tareas (hereda de Repositorio).
 */
class TareaRepositorio extends Repositorio {
  constructor(baseDatos) {
    super(baseDatos, 'tareas');
  }

  /** POLIMORFISMO: aquí se crean objetos Tarea. */
  crearInstancia(registro) {
    return new Tarea(registro);
  }

  /** Devuelve las tareas de un usuario, ordenadas por fecha de entrega. */
  buscarPorUsuario(usuarioId) {
    return this.filtrar((tarea) => tarea.perteneceA(usuarioId)).sort((a, b) =>
      a.fechaEntrega.localeCompare(b.fechaEntrega)
    );
  }
}

module.exports = TareaRepositorio;
