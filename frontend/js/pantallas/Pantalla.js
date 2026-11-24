import { Materia } from '../modelos/Materia.js';
import { Tarea } from '../modelos/Tarea.js';

/**
 * ============================================================
 *  CLASE BASE: Pantalla
 * ============================================================
 * Todas las pantallas de la app (Inicio, Agregar tarea, Materias...)
 * HEREDAN de esta clase.
 *
 * POO -> ABSTRACCIÓN: define QUÉ debe tener una pantalla (render, alMontar...)
 *        sin decir CÓMO se ve cada una.
 * POO -> HERENCIA: class PantallaInicio extends Pantalla { ... }
 * POO -> POLIMORFISMO: la clase App llama pantalla.render() sin saber
 *        qué pantalla es; cada una responde con SU propio HTML.
 */
export class Pantalla {
  /**
   * @param {App} app            la aplicación (para navegar, usar la API, etc.)
   * @param {object} parametros  datos extra (ej: { id: 'abc' } de una tarea)
   */
  constructor(app, parametros = {}) {
    this.app = app;
    this.parametros = parametros;
  }

  // ---------- Propiedades que las pantallas hijas pueden sobrescribir ----------

  /** ¿Muestra la barra azul y el menú lateral? (Login y Registro dicen que no) */
  get usaLayout() {
    return true;
  }

  /** Qué opción del menú lateral se marca en azul. */
  get menuActivo() {
    return null;
  }

  /** Ícono de la esquina superior izquierda: 'menu' (≡) o 'atras' (←). */
  get iconoCabecera() {
    return 'atras';
  }

  /** Clase CSS extra para el área de contenido. */
  get claseContenido() {
    return '';
  }

  // ---------- Ciclo de vida de una pantalla ----------

  /** 1) Pide al servidor los datos que necesita (antes de dibujarse). */
  async cargarDatos() {}

  /** 2) Devuelve el HTML de la pantalla. OBLIGATORIO en cada hija. */
  render() {
    throw new Error(`${this.constructor.name} debe implementar render()`);
  }

  /** 3) Se ejecuta después de dibujarse: aquí se conectan los botones. */
  alMontar() {}

  // ---------- Métodos de ayuda para las pantallas hijas ----------

  /** Busca un elemento dentro de la pantalla. */
  buscar(selector) {
    return this.app.raiz.querySelector(selector);
  }

  /** Trae las materias del servidor y las convierte en objetos Materia. */
  async cargarMaterias() {
    const lista = await this.app.api.obtenerMaterias();
    return lista.map((datos) => new Materia(datos));
  }

  /** Trae las tareas y a cada una le asigna su objeto Materia. */
  async cargarTareas(materias) {
    const lista = await this.app.api.obtenerTareas();
    return lista.map((datos) => new Tarea(datos, materias.find((m) => m.id === datos.materiaId)));
  }

  /**
   * Ejecuta una acción (ej: guardar) desactivando el botón mientras tanto
   * y mostrando el error si algo sale mal.
   */
  async ejecutar(boton, accion) {
    boton.disabled = true;
    try {
      await accion();
    } catch (error) {
      this.app.manejarError(error);
    } finally {
      boton.disabled = false;
    }
  }
}
