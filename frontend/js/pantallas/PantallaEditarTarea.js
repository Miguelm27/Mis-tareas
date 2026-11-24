import { PantallaAgregarTarea } from './PantallaAgregarTarea.js';
import { Iconos } from '../utilidades/Iconos.js';

/**
 * ============================================================
 *  PANTALLA 4: Editar tarea  (hereda de PantallaAgregarTarea)
 * ============================================================
 * ¡Ejemplo claro de HERENCIA y POLIMORFISMO!
 * Reutiliza TODO el formulario de "Agregar tarea" y solo
 * SOBRESCRIBE los métodos que son diferentes:
 *   - titulo e icono
 *   - valoresIniciales()  -> llena el formulario con la tarea actual
 *   - camposExtraHtml()   -> agrega el campo "Estado"
 *   - botonesHtml()       -> "Cancelar" y "Guardar cambios"
 *   - guardar()           -> actualiza en vez de crear
 */
export class PantallaEditarTarea extends PantallaAgregarTarea {
  get menuActivo() {
    return null;
  }

  get titulo() {
    return 'Editar tarea';
  }

  get icono() {
    return 'lapiz';
  }

  async cargarDatos() {
    await super.cargarDatos(); // carga las materias (método de la clase padre)
    this.tarea = await this.app.api.obtenerTarea(this.parametros.id);
  }

  valoresIniciales() {
    return this.tarea;
  }

  camposExtraHtml(valores) {
    const opcion = (estado) =>
      `<option value="${estado}" ${valores.estado === estado ? 'selected' : ''}>${estado}</option>`;
    return `
      <div class="campo">
        <label for="estado">Estado</label>
        <select id="estado" name="estado">${opcion('Pendiente')}${opcion('Completada')}</select>
      </div>`;
  }

  botonesHtml() {
    return `
      <div class="botones-2">
        <button class="boton boton-secundario" type="button" id="cancelar">Cancelar</button>
        <button class="boton boton-primario" type="submit">${Iconos.obtener('guardar', 16)} Guardar cambios</button>
      </div>`;
  }

  async guardar(datos) {
    await this.app.api.actualizarTarea(this.tarea.id, datos);
    this.app.mostrarMensaje('Cambios guardados');
    this.app.volver(); // regresa al detalle de la tarea
  }
}
