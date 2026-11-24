/**
 * ============================================================
 *  CLASE BASE: Repositorio
 * ============================================================
 * Un "repositorio" es el objeto encargado de guardar y buscar
 * datos en la base de datos. Esta clase tiene las operaciones
 * comunes (CRUD = Crear, Leer, Actualizar, Eliminar) para no
 * repetir el mismo código en cada repositorio.
 *
 * POO -> HERENCIA: UsuarioRepositorio, TareaRepositorio y
 *        MateriaRepositorio heredan de esta clase.
 * POO -> POLIMORFISMO: crearInstancia() se sobrescribe en cada hijo
 *        para convertir el dato guardado en el objeto correcto
 *        (un Usuario, una Tarea o una Materia).
 */
class Repositorio {
  /**
   * @param {BaseDatos} baseDatos  Objeto de la base de datos.
   * @param {string} coleccion     Nombre de la lista: "usuarios", "tareas"...
   */
  constructor(baseDatos, coleccion) {
    this.baseDatos = baseDatos;
    this.coleccion = coleccion;
  }

  /** Método "abstracto": cada hijo decide qué clase de objeto crear. */
  crearInstancia(registro) {
    throw new Error('Las clases hijas deben implementar crearInstancia()');
  }

  /** Devuelve TODOS los objetos de la colección. */
  obtenerTodos() {
    return this.baseDatos.leer(this.coleccion).map((registro) => this.crearInstancia(registro));
  }

  /** Busca un objeto por su id. Devuelve null si no existe. */
  buscarPorId(id) {
    return this.obtenerTodos().find((entidad) => entidad.id === id) || null;
  }

  /** Busca todos los objetos que cumplan una condición. */
  filtrar(condicion) {
    return this.obtenerTodos().filter(condicion);
  }

  /** Guarda un objeto: si ya existe lo actualiza, si no, lo agrega. */
  guardar(entidad) {
    entidad.validar(); // Antes de guardar, el objeto se valida a sí mismo
    const lista = this.baseDatos.leer(this.coleccion);
    const posicion = lista.findIndex((registro) => registro.id === entidad.id);
    if (posicion >= 0) {
      lista[posicion] = entidad.aRegistro();
    } else {
      lista.push(entidad.aRegistro());
    }
    this.baseDatos.escribir(this.coleccion, lista);
    return entidad;
  }

  /** Elimina un objeto por su id. */
  eliminar(id) {
    const lista = this.baseDatos.leer(this.coleccion).filter((registro) => registro.id !== id);
    this.baseDatos.escribir(this.coleccion, lista);
  }
}

module.exports = Repositorio;
