import { Pantalla } from './Pantalla.js';
import { Materia } from '../modelos/Materia.js';
import { Iconos } from '../utilidades/Iconos.js';
import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  PANTALLA 5: Materias  (hereda de Pantalla)
 * ============================================================
 * Lista de materias. Al tocar una, se ven sus tareas.
 * El botón "Agregar materia" abre una ventana para crear otra.
 */
export class PantallaMaterias extends Pantalla {
  get menuActivo() {
    return 'materias';
  }

  async cargarDatos() {
    this.materias = await this.cargarMaterias();
  }

  render() {
    return `
      <h2 class="titulo-seccion">Materias</h2>
      <div class="tarjeta">
        <ul class="lista-opciones" id="lista">
          ${this.materias
            .map(
              (m) => `
            <li class="opcion" data-id="${m.id}">
              ${m.iconoHtml()}
              <span class="texto">${Utilidades.escapar(m.nombre)}</span>
              <span class="flecha">${Iconos.obtener('flecha', 16)}</span>
            </li>`
            )
            .join('')}
        </ul>
        <button class="boton boton-primario mt" id="agregar">${Iconos.obtener('mas', 16)} Agregar materia</button>
      </div>`;
  }

  alMontar() {
    this.buscar('#lista').addEventListener('click', (evento) => {
      const item = evento.target.closest('.opcion');
      if (item) this.app.navegar('inicio', { materiaId: item.dataset.id });
    });
    this.buscar('#agregar').addEventListener('click', () => this.abrirVentana());
  }

  /** Muestra la ventana emergente para crear una materia nueva. */
  abrirVentana() {
    let color = Materia.COLORES[0];
    let icono = Materia.ICONOS[0];

    const fondo = document.createElement('div');
    fondo.className = 'modal-fondo';
    fondo.innerHTML = `
      <form class="modal" novalidate>
        <h2>Nueva materia</h2>
        <div class="campo">
          <label for="nombreMateria">Nombre *</label>
          <input id="nombreMateria" name="nombre" placeholder="Ej. Inglés" />
        </div>
        <div class="campo">
          <label>Color</label>
          <div class="selector colores">
            ${Materia.COLORES.map((c, i) => `<button type="button" data-color="${c}" class="${i === 0 ? 'elegido' : ''}" style="background:${c}"></button>`).join('')}
          </div>
        </div>
        <div class="campo">
          <label>Ícono</label>
          <div class="selector iconos">
            ${Materia.ICONOS.map((ic, i) => `<button type="button" data-icono="${ic}" class="${i === 0 ? 'elegido' : ''}">${Iconos.obtener(ic, 17)}</button>`).join('')}
          </div>
        </div>
        <div class="botones-2">
          <button type="button" class="boton boton-secundario" id="cerrarVentana">Cancelar</button>
          <button type="submit" class="boton boton-primario">${Iconos.obtener('guardar', 16)} Guardar</button>
        </div>
      </form>`;
    document.body.appendChild(fondo);
    fondo.querySelector('input').focus();

    const cerrar = () => fondo.remove();
    fondo.addEventListener('click', (e) => e.target === fondo && cerrar());
    fondo.querySelector('#cerrarVentana').addEventListener('click', cerrar);

    // Elegir color e ícono
    fondo.querySelectorAll('[data-color]').forEach((b) =>
      b.addEventListener('click', () => {
        color = b.dataset.color;
        fondo.querySelectorAll('[data-color]').forEach((x) => x.classList.toggle('elegido', x === b));
      })
    );
    fondo.querySelectorAll('[data-icono]').forEach((b) =>
      b.addEventListener('click', () => {
        icono = b.dataset.icono;
        fondo.querySelectorAll('[data-icono]').forEach((x) => x.classList.toggle('elegido', x === b));
      })
    );

    const formulario = fondo.querySelector('form');
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const nombre = formulario.nombre.value.trim();
      if (!nombre) {
        this.app.mostrarMensaje('Escribe el nombre de la materia', 'error');
        return;
      }
      this.ejecutar(formulario.querySelector('button[type=submit]'), async () => {
        await this.app.api.crearMateria({ nombre, color, icono });
        cerrar();
        this.app.mostrarMensaje('Materia agregada');
        this.app.irA('materias'); // recarga la lista
      });
    });
  }
}
