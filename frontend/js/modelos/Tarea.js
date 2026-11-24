import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  CLASE: Tarea (lado del frontend)
 * ============================================================
 * Representa una tarea en el celular. Además de los datos, tiene
 * métodos útiles: formatear la fecha, saber si está completada,
 * saber cuántos días faltan, etc.
 *
 * POO -> COMPOSICIÓN: una Tarea "tiene" un objeto Materia dentro.
 */
export class Tarea {
  static MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  /**
   * @param {object} datos    datos que llegan del servidor
   * @param {Materia} materia objeto Materia al que pertenece
   */
  constructor(datos, materia) {
    this.id = datos.id;
    this.nombre = datos.nombre;
    this.materiaId = datos.materiaId;
    this.fechaEntrega = datos.fechaEntrega;
    this.descripcion = datos.descripcion;
    this.estado = datos.estado;
    this.materia = materia;
  }

  /** GETTER: true si la tarea ya está completada. */
  get estaCompletada() {
    return this.estado === 'Completada';
  }

  /** Convierte "2025-04-20" en "20 abr 2025". */
  get fechaFormateada() {
    const [anio, mes, dia] = this.fechaEntrega.split('-');
    return `${Number(dia)} ${Tarea.MESES[Number(mes) - 1]} ${anio}`;
  }

  /** Días que faltan para la entrega (negativo si ya pasó). */
  diasRestantes() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const entrega = new Date(`${this.fechaEntrega}T00:00:00`);
    return Math.round((entrega - hoy) / 86400000);
  }

  /** true si el texto buscado aparece en el nombre o en la materia. */
  coincideCon(texto) {
    const buscado = texto.trim().toLowerCase();
    return (
      this.nombre.toLowerCase().includes(buscado) ||
      (this.materia?.nombre || '').toLowerCase().includes(buscado)
    );
  }

  /** Etiqueta de estado: rosada (Pendiente) o verde (Completada). */
  estadoHtml() {
    const clase = this.estaCompletada ? 'completada' : 'pendiente';
    return `<span class="badge-estado ${clase}">${Utilidades.escapar(this.estado)}</span>`;
  }
}
