import { Pantalla } from './Pantalla.js';
import { Tarea } from '../modelos/Tarea.js';
import { Iconos } from '../utilidades/Iconos.js';
import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  PANTALLA 3: Detalle de una tarea  (hereda de Pantalla)
 * ============================================================
 * Muestra toda la información de una tarea y los botones
 * Editar y Eliminar.
 */
export class PantallaDetalleTarea extends Pantalla {
  async cargarDatos() {
    const materias = await this.cargarMaterias();
    const datos = await this.app.api.obtenerTarea(this.parametros.id);
    this.tarea = new Tarea(datos, materias.find((m) => m.id === datos.materiaId));
  }

  render() {
    const t = this.tarea;
    const descripcion = t.descripcion ? Utilidades.escapar(t.descripcion) : 'Sin descripción.';
    return `
      <div class="tarjeta detalle">
        ${t.materia ? t.materia.etiquetaHtml() : ''}
        <h2>${Utilidades.escapar(t.nombre)}</h2>
        <span class="fecha">${Iconos.obtener('calendario', 15)} Fecha de entrega: ${t.fechaFormateada}</span>

        <h3>Descripción:</h3>
        <p>${descripcion}</p>

        <h3>Estado:</h3>
        ${t.estadoHtml()}

        <div class="botones-detalle">
          <button class="boton boton-primario" id="editar">${Iconos.obtener('lapiz', 16)} Editar</button>
          <button class="boton boton-peligro" id="eliminar">${Iconos.obtener('basura', 16)} Eliminar</button>
        </div>
      </div>`;
  }

  alMontar() {
    this.buscar('#editar').addEventListener('click', () => {
      this.app.navegar('editar', { id: this.tarea.id });
    });

    const botonEliminar = this.buscar('#eliminar');
    botonEliminar.addEventListener('click', () => {
      if (!confirm(`¿Seguro que quieres eliminar "${this.tarea.nombre}"?`)) return;
      this.ejecutar(botonEliminar, async () => {
        await this.app.api.eliminarTarea(this.tarea.id);
        this.app.mostrarMensaje('Tarea eliminada');
        this.app.irA('inicio');
      });
    });
  }
}
