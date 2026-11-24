const Repositorio = require('./Repositorio');
const Materia = require('../modelos/Materia');

/**
 * Repositorio de materias (hereda de Repositorio).
 */
class MateriaRepositorio extends Repositorio {
  constructor(baseDatos) {
    super(baseDatos, 'materias');
  }

  /** POLIMORFISMO: aquí se crean objetos Materia. */
  crearInstancia(registro) {
    return new Materia(registro);
  }

  buscarPorUsuario(usuarioId) {
    return this.filtrar((materia) => materia.perteneceA(usuarioId));
  }

  /** Crea las 5 materias iniciales para un usuario recién registrado. */
  crearPorDefecto(usuarioId) {
    Materia.POR_DEFECTO.forEach((datos) => {
      this.guardar(new Materia({ ...datos, usuarioId }));
    });
  }
}

module.exports = MateriaRepositorio;
