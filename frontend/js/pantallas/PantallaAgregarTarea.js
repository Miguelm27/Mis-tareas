import { Pantalla } from './Pantalla.js';
import { Iconos } from '../utilidades/Iconos.js';
import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  PANTALLA 2: Agregar nueva tarea  (hereda de Pantalla)
 * ============================================================
 * Formulario para registrar una tarea.
 *
 * OJO: PantallaEditarTarea HEREDA de esta clase y solo cambia
 * algunas partes (título, valores iniciales, botones y qué hacer
 * al guardar). Así reutilizamos el mismo formulario. ¡Herencia!
 */
export class PantallaAgregarTarea extends Pantalla {
  get menuActivo() {
    return 'agregar';
  }

  // ---------- Partes que la clase hija (Editar) sobrescribe ----------
  get titulo() {
    return 'Agregar nueva tarea';
  }

  get icono() {
    return 'mas';
  }

  /** Valores con los que empieza el formulario (vacío al agregar). */
  valoresIniciales() {
    const materiaId = this.parametros.materiaId || '';
    return { nombre: '', materiaId, fechaEntrega: '', descripcion: '', estado: 'Pendiente' };
  }

  /** Campos adicionales (al agregar no hay; al editar se agrega "Estado"). */
  camposExtraHtml() {
    return '';
  }

  botonesHtml() {
    return `<button class="boton boton-primario mt" type="submit">${Iconos.obtener('guardar', 16)} Guardar</button>`;
  }

  /** Qué hacer con los datos al guardar. */
  async guardar(datos) {
    await this.app.api.crearTarea(datos);
    this.app.mostrarMensaje('Tarea guardada');
    this.app.irA('inicio');
  }
  // --------------------------------------------------------------------

  async cargarDatos() {
    this.materias = await this.cargarMaterias();
  }

  render() {
    const v = this.valoresIniciales();
    const opciones = this.materias
      .map(
        (m) =>
          `<option value="${m.id}" ${m.id === v.materiaId ? 'selected' : ''}>${Utilidades.escapar(m.nombre)}</option>`
      )
      .join('');

    return `
      <div class="tarjeta">
        <div class="encabezado-form">
          <span class="cuadro-icono">${Iconos.obtener(this.icono, 20)}</span>
          <h2>${this.titulo}</h2>
        </div>

        <form id="formulario" novalidate>
          <div class="campo">
            <label for="nombre">Nombre de la tarea *</label>
            <input id="nombre" name="nombre" placeholder="Ej. Leer capítulo 4" value="${Utilidades.escapar(v.nombre)}" />
          </div>

          <div class="campo">
            <label for="materiaId">Materia *</label>
            <select id="materiaId" name="materiaId">
              <option value="" disabled ${v.materiaId ? '' : 'selected'}>Selecciona una materia</option>
              ${opciones}
            </select>
          </div>

          <div class="campo">
            <label for="fechaEntrega">Fecha de entrega *</label>
            <input id="fechaEntrega" name="fechaEntrega" type="date" value="${v.fechaEntrega}" />
          </div>

          <div class="campo">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" placeholder="Ej. Resolver los ejercicios del capítulo 5">${Utilidades.escapar(v.descripcion)}</textarea>
          </div>

          ${this.camposExtraHtml(v)}
          ${this.botonesHtml()}
        </form>
      </div>`;
  }

  alMontar() {
    const formulario = this.buscar('#formulario');
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const datos = Utilidades.datosFormulario(formulario);
      if (!datos.nombre?.trim() || !datos.materiaId || !datos.fechaEntrega) {
        this.app.mostrarMensaje('Completa los campos obligatorios (*)', 'error');
        return;
      }
      this.ejecutar(formulario.querySelector('button[type=submit]'), () => this.guardar(datos));
    });

    this.buscar('#cancelar')?.addEventListener('click', () => this.app.volver());
  }
}
