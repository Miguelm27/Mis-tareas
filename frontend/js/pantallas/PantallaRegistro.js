import { Pantalla } from './Pantalla.js';
import { Iconos } from '../utilidades/Iconos.js';
import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  PANTALLA: Registro (crear cuenta)  (hereda de Pantalla)
 * ============================================================
 * Pide los datos personales del estudiante.
 */
export class PantallaRegistro extends Pantalla {
  get usaLayout() {
    return false;
  }

  render() {
    return `
      <div class="app-contenedor pantalla-acceso">
        <div class="acceso-cabecera">
          <div class="logo">${Iconos.obtener('portapapeles', 32)}</div>
          <h1>Mis Tareas</h1>
          <p>Crea tu cuenta en menos de un minuto</p>
        </div>

        <form class="tarjeta acceso-tarjeta" id="formulario" novalidate>
          <h2>Crear cuenta</h2>
          <p class="subtitulo">Completa tus datos personales</p>

          <div class="fila-2">
            <div class="campo">
              <label for="nombre">Nombre *</label>
              <input id="nombre" name="nombre" placeholder="Ej. Ana" autocomplete="given-name" />
            </div>
            <div class="campo">
              <label for="apellido">Apellido *</label>
              <input id="apellido" name="apellido" placeholder="Ej. Gómez" autocomplete="family-name" />
            </div>
          </div>

          <div class="campo">
            <label for="correo">Correo electrónico *</label>
            <div class="con-icono">
              ${Iconos.obtener('correo', 17)}
              <input id="correo" name="correo" type="email" placeholder="estudiante@correo.com" autocomplete="email" />
            </div>
          </div>

          <div class="campo">
            <label for="telefono">Teléfono</label>
            <div class="con-icono">
              ${Iconos.obtener('telefono', 17)}
              <input id="telefono" name="telefono" type="tel" placeholder="300 123 4567" autocomplete="tel" />
            </div>
          </div>

          <div class="campo">
            <label for="carrera">Carrera</label>
            <div class="con-icono">
              ${Iconos.obtener('birrete', 17)}
              <input id="carrera" name="carrera" placeholder="Ej. Desarrollo de Software" />
            </div>
          </div>

          <div class="campo">
            <label for="contrasena">Contraseña * (mínimo 6 caracteres)</label>
            <div class="con-icono">
              ${Iconos.obtener('candado', 17)}
              <input id="contrasena" name="contrasena" type="password" placeholder="••••••" autocomplete="new-password" />
            </div>
          </div>

          <div class="campo">
            <label for="confirmar">Confirmar contraseña *</label>
            <div class="con-icono">
              ${Iconos.obtener('candado', 17)}
              <input id="confirmar" name="confirmar" type="password" placeholder="••••••" autocomplete="new-password" />
            </div>
          </div>

          <button class="boton boton-primario mt" type="submit">Crear cuenta</button>

          <p class="cambiar-acceso">
            ¿Ya tienes cuenta? <button type="button" id="irLogin">Inicia sesión</button>
          </p>
        </form>
      </div>`;
  }

  alMontar() {
    this.buscar('#irLogin').addEventListener('click', () => this.app.irA('login'));

    const formulario = this.buscar('#formulario');
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const datos = Utilidades.datosFormulario(formulario);

      // Validaciones sencillas antes de enviar al servidor
      if (!datos.nombre || !datos.apellido || !datos.correo || !datos.contrasena) {
        this.app.mostrarMensaje('Completa los campos obligatorios (*)', 'error');
        return;
      }
      if (datos.contrasena !== datos.confirmar) {
        this.app.mostrarMensaje('Las contraseñas no coinciden', 'error');
        return;
      }

      this.ejecutar(formulario.querySelector('button[type=submit]'), async () => {
        delete datos.confirmar; // el servidor no necesita la confirmación
        this.app.usuario = await this.app.api.registrar(datos);
        this.app.mostrarMensaje(`¡Bienvenido/a, ${this.app.usuario.nombre}!`);
        this.app.irA('inicio');
      });
    });
  }
}
