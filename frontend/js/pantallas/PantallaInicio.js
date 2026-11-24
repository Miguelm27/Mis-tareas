import { Pantalla } from './Pantalla.js';
import { Iconos } from '../utilidades/Iconos.js';
import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  PANTALLA 1: Inicio (lista de tareas)  (hereda de Pantalla)
 * ============================================================
 * Muestra el saludo, el buscador, los filtros (Todas / Pendientes /
 * Completadas) y la lista de tareas.
 * Si llega parametros.materiaId, solo muestra las tareas de esa materia.
 */
export class PantallaInicio extends Pantalla {
  static FILTROS = ['Todas', 'Pendientes', 'Completadas'];

  constructor(app, parametros) {
    super(app, parametros); // primero se ejecuta el constructor de Pantalla
    this.filtro = 'Todas';
    this.textoBusqueda = '';
    this.tareas = [];
    this.materias = [];
  }

  // POLIMORFISMO: estas propiedades cambian el comportamiento de la base
  get menuActivo() {
    return this.parametros.materiaId ? 'materias' : 'inicio';
  }

  get iconoCabecera() {
    return this.parametros.materiaId ? 'atras' : 'menu';
  }

  get claseContenido() {
    return 'blanco';
  }

  async cargarDatos() {
    this.materias = await this.cargarMaterias();
    this.tareas = await this.cargarTareas(this.materias);
  }

  /** Aplica la búsqueda y los filtros a la lista de tareas. */
  tareasFiltradas() {
    return this.tareas.filter((tarea) => {
      if (this.parametros.materiaId && tarea.materiaId !== this.parametros.materiaId) return false;
      if (this.filtro === 'Pendientes' && tarea.estaCompletada) return false;
      if (this.filtro === 'Completadas' && !tarea.estaCompletada) return false;
      return tarea.coincideCon(this.textoBusqueda);
    });
  }

  /** Aviso de tareas que vencen pronto (si las notificaciones están activas). */
  avisoHtml() {
    if (!this.app.preferencias.notificaciones) return '';
    const proximas = this.tareas.filter((t) => !t.estaCompletada && t.diasRestantes() >= 0 && t.diasRestantes() <= 2);
    if (proximas.length === 0) return '';
    const texto = proximas.length === 1 ? '1 tarea vence' : `${proximas.length} tareas vencen`;
    return `<div class="aviso">${Iconos.obtener('campana', 15)} ${texto} en los próximos 2 días</div>`;
  }

  filtroMateriaHtml() {
    const materia = this.materias.find((m) => m.id === this.parametros.materiaId);
    if (!materia) return '';
    return `<div class="filtro-materia">
        <span>Materia: ${materia.etiquetaHtml()}</span>
        <button id="quitarFiltro">Ver todas</button>
      </div>`;
  }

  render() {
    const nombre = Utilidades.escapar(this.app.usuario?.nombre || 'Estudiante');
    return `
      <div class="saludo">
        <h2>¡Hola, ${nombre}!</h2>
        <p>Aquí tienes tus tareas pendientes.</p>
      </div>

      <label class="buscador">
        ${Iconos.obtener('buscar', 15)}
        <input id="busqueda" type="search" placeholder="Buscar tarea..." value="${Utilidades.escapar(this.textoBusqueda)}" />
      </label>

      <div class="pestanas">
        ${PantallaInicio.FILTROS.map(
          (f) => `<button class="pestana ${f === this.filtro ? 'activa' : ''}" data-filtro="${f}">${f}</button>`
        ).join('')}
      </div>

      ${this.filtroMateriaHtml()}
      ${this.avisoHtml()}

      <ul class="lista-tareas" id="lista"></ul>`;
  }

  /** Dibuja SOLO la lista (así el buscador no pierde el foco al escribir). */
  dibujarLista() {
    const tareas = this.tareasFiltradas();
    const lista = this.buscar('#lista');
    if (tareas.length === 0) {
      lista.innerHTML = `<li class="vacio">No hay tareas para mostrar.<br/>Usa "Agregar tarea" para crear una.</li>`;
      return;
    }
    lista.innerHTML = tareas
      .map(
        (tarea) => `
        <li class="tarea-item" data-id="${tarea.id}">
          ${tarea.materia ? tarea.materia.etiquetaHtml() : '<span></span>'}
          ${tarea.estadoHtml()}
          <span class="tarea-nombre">${Utilidades.escapar(tarea.nombre)}</span>
          <span class="flecha">${Iconos.obtener('flecha', 16)}</span>
          <span class="fecha">${Iconos.obtener('calendario', 13)} ${tarea.fechaFormateada}</span>
        </li>`
      )
      .join('');
  }

  alMontar() {
    this.dibujarLista();

    // Buscador: filtra mientras escribes
    this.buscar('#busqueda').addEventListener('input', (evento) => {
      this.textoBusqueda = evento.target.value;
      this.dibujarLista();
    });

    // Pestañas Todas / Pendientes / Completadas
    this.app.raiz.querySelectorAll('[data-filtro]').forEach((boton) => {
      boton.addEventListener('click', () => {
        this.filtro = boton.dataset.filtro;
        this.app.raiz.querySelectorAll('[data-filtro]').forEach((b) => b.classList.toggle('activa', b === boton));
        this.dibujarLista();
      });
    });

    // Tocar una tarea abre su detalle
    this.buscar('#lista').addEventListener('click', (evento) => {
      const item = evento.target.closest('.tarea-item');
      if (item) this.app.navegar('detalle', { id: item.dataset.id });
    });

    this.buscar('#quitarFiltro')?.addEventListener('click', () => this.app.irA('inicio'));
  }
}
