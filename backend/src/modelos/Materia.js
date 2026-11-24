const Entidad = require('./Entidad');
const ErrorApp = require('../errores/ErrorApp');

/**
 * ============================================================
 *  CLASE: Materia  (hereda de Entidad)
 * ============================================================
 * Representa una materia (Matemáticas, Programación, Historia...).
 * Cada materia tiene un color y un ícono para mostrarse en la app.
 */
class Materia extends Entidad {
  // Materias que se crean automáticamente cuando alguien se registra.
  static POR_DEFECTO = [
    { nombre: 'Matemáticas', color: '#6D4AE0', icono: 'calculadora' },
    { nombre: 'Programación', color: '#22A559', icono: 'codigo' },
    { nombre: 'Historia', color: '#F59E0B', icono: 'edificio' },
    { nombre: 'Lengua', color: '#E8384F', icono: 'libro' },
    { nombre: 'Biología', color: '#2A9BD6', icono: 'matraz' },
  ];

  constructor({ id, usuarioId, nombre, color, icono, fechaCreacion }) {
    super(id, fechaCreacion);
    this.usuarioId = usuarioId;
    this.nombre = (nombre || '').trim();
    this.color = color || '#4C63DB';
    this.icono = icono || 'libro';
  }

  perteneceA(usuarioId) {
    return this.usuarioId === usuarioId;
  }

  /** POLIMORFISMO: reglas propias de una Materia. */
  validar() {
    if (!this.nombre) throw new ErrorApp('El nombre de la materia es obligatorio');
    if (!/^#[0-9A-Fa-f]{6}$/.test(this.color)) throw new ErrorApp('Color no válido');
  }
}

module.exports = Materia;
