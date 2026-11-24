import { Iconos } from '../utilidades/Iconos.js';
import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  CLASE: Materia (lado del frontend)
 * ============================================================
 * Recibe los datos que manda el servidor y sabe "dibujarse":
 * cada materia sabe crear su propia etiqueta de color y su ícono.
 */
export class Materia {
  // Colores e íconos que se pueden elegir al crear una materia
  static COLORES = ['#6D4AE0', '#22A559', '#F59E0B', '#E8384F', '#2A9BD6', '#EC4899', '#0F9F8F', '#64748B'];
  static ICONOS = ['libro', 'calculadora', 'codigo', 'edificio', 'matraz', 'paleta', 'birrete'];

  constructor({ id, nombre, color, icono }) {
    this.id = id;
    this.nombre = nombre;
    this.color = color;
    this.icono = icono;
  }

  /** Etiqueta pequeña de color (como "Matemáticas" en morado). */
  etiquetaHtml() {
    return `<span class="badge-materia" style="background:${this.color}">${Utilidades.escapar(this.nombre)}</span>`;
  }

  /** Cuadro de color con el ícono (pantalla de Materias). */
  iconoHtml() {
    return `<span class="cuadro-materia" style="background:${this.color}">${Iconos.obtener(this.icono, 17)}</span>`;
  }
}
