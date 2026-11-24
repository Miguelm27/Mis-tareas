const Entidad = require('./Entidad');
const ErrorApp = require('../errores/ErrorApp');

/**
 * ============================================================
 *  CLASE: Tarea  (hereda de Entidad)
 * ============================================================
 * Representa una tarea del estudiante (ej: "Ejercicios de integrales").
 *
 * Atributos: nombre, materiaId, fechaEntrega, descripcion, estado
 *            y usuarioId (a quién pertenece la tarea).
 */
class Tarea extends Entidad {
  // Atributo ESTÁTICO: es igual para todas las tareas.
  static ESTADOS = ['Pendiente', 'Completada'];

  constructor({ id, usuarioId, nombre, materiaId, fechaEntrega, descripcion, estado, fechaCreacion }) {
    super(id, fechaCreacion);
    this.usuarioId = usuarioId;
    this.nombre = (nombre || '').trim();
    this.materiaId = materiaId;
    this.fechaEntrega = fechaEntrega; // formato "AAAA-MM-DD"
    this.descripcion = (descripcion || '').trim();
    this.estado = estado || 'Pendiente';
  }

  /** Actualiza solo los campos que lleguen (los demás se quedan igual). */
  actualizar({ nombre, materiaId, fechaEntrega, descripcion, estado }) {
    if (nombre !== undefined) this.nombre = nombre.trim();
    if (materiaId !== undefined) this.materiaId = materiaId;
    if (fechaEntrega !== undefined) this.fechaEntrega = fechaEntrega;
    if (descripcion !== undefined) this.descripcion = descripcion.trim();
    if (estado !== undefined) this.estado = estado;
  }

  /** Devuelve true si la tarea es del usuario indicado. */
  perteneceA(usuarioId) {
    return this.usuarioId === usuarioId;
  }

  /** POLIMORFISMO: reglas propias de una Tarea. */
  validar() {
    if (!this.nombre) throw new ErrorApp('El nombre de la tarea es obligatorio');
    if (!this.materiaId) throw new ErrorApp('Debes seleccionar una materia');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.fechaEntrega || '')) {
      throw new ErrorApp('La fecha de entrega es obligatoria');
    }
    if (!Tarea.ESTADOS.includes(this.estado)) throw new ErrorApp('Estado no válido');
  }
}

module.exports = Tarea;
