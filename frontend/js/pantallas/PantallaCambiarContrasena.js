import { Pantalla } from './Pantalla.js';
import { Iconos } from '../utilidades/Iconos.js';
import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  PANTALLA: Cambiar contraseña  (hereda de Pantalla)
 * ============================================================
 */
export class PantallaCambiarContrasena extends Pantalla {
  get menuActivo() {
    return 'configuracion';
  }

  render() {
    return `
      <div class="tarjeta">
        <div class="encabezado-form">
          <span class="cuadro-icono">${Iconos.obtener('candado', 18)}</span>
          <h2>Cambiar contraseña</h2>
        </div>
        <form id="formulario" novalidate>
          <div class="campo">
            <label for="actual">Contraseña actual *</label>
            <input id="actual" name="actual" type="password" autocomplete="current-password" />
          </div>
          <div class="campo">
            <label for="nueva">Nueva contraseña *</label>
            <input id="nueva" name="nueva" type="password" autocomplete="new-password" />
          </div>
          <div class="campo">
            <label for="confirmar">Confirmar nueva contraseña *</label>
            <input id="confirmar" name="confirmar" type="password" autocomplete="new-password" />
          </div>
          <button class="boton boton-primario mt" type="submit">${Iconos.obtener('guardar', 16)} Guardar</button>
        </form>
      </div>`;
  }

  alMontar() {
    const formulario = this.buscar('#formulario');
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const { actual, nueva, confirmar } = Utilidades.datosFormulario(formulario);
      if (!actual || !nueva) {
        this.app.mostrarMensaje('Completa todos los campos', 'error');
        return;
      }
      if (nueva !== confirmar) {
        this.app.mostrarMensaje('Las contraseñas nuevas no coinciden', 'error');
        return;
      }
      this.ejecutar(formulario.querySelector('button[type=submit]'), async () => {
        await this.app.api.cambiarContrasena(actual, nueva);
        this.app.mostrarMensaje('Contraseña actualizada');
        this.app.volver();
      });
    });
  }
}
