import { Pantalla } from './Pantalla.js';
import { Iconos } from '../utilidades/Iconos.js';
import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  PANTALLA: Mi perfil (datos personales)  (hereda de Pantalla)
 * ============================================================
 * Muestra y permite editar los datos con los que la persona se registró.
 */
export class PantallaPerfil extends Pantalla {
  get menuActivo() {
    return 'configuracion';
  }

  render() {
    const u = this.app.usuario;
    const e = Utilidades.escapar;
    return `
      <div class="tarjeta">
        <div class="perfil-centro">
          <span class="avatar grande">${Iconos.obtener('usuario', 40)}</span>
          <h2>${e(`${u.nombre} ${u.apellido}`)}</h2>
          <p>${e(u.correo)}</p>
        </div>

        <form id="formulario" novalidate>
          <div class="fila-2">
            <div class="campo">
              <label for="nombre">Nombre *</label>
              <input id="nombre" name="nombre" value="${e(u.nombre)}" />
            </div>
            <div class="campo">
              <label for="apellido">Apellido *</label>
              <input id="apellido" name="apellido" value="${e(u.apellido)}" />
            </div>
          </div>
          <div class="campo">
            <label for="correo">Correo (no se puede cambiar)</label>
            <input id="correo" value="${e(u.correo)}" disabled />
          </div>
          <div class="campo">
            <label for="telefono">Teléfono</label>
            <input id="telefono" name="telefono" type="tel" value="${e(u.telefono)}" />
          </div>
          <div class="campo">
            <label for="carrera">Carrera</label>
            <input id="carrera" name="carrera" value="${e(u.carrera)}" />
          </div>
          <button class="boton boton-primario mt" type="submit">${Iconos.obtener('guardar', 16)} Guardar cambios</button>
        </form>
      </div>`;
  }

  alMontar() {
    const formulario = this.buscar('#formulario');
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const datos = Utilidades.datosFormulario(formulario);
      this.ejecutar(formulario.querySelector('button[type=submit]'), async () => {
        this.app.usuario = await this.app.api.actualizarPerfil(datos);
        this.app.mostrarMensaje('Datos actualizados');
        this.app.dibujar();
      });
    });
  }
}
