import { Pantalla } from './Pantalla.js';
import { Iconos } from '../utilidades/Iconos.js';
import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  PANTALLA: Iniciar sesión  (hereda de Pantalla)
 * ============================================================
 */
export class PantallaLogin extends Pantalla {
  /** POLIMORFISMO: esta pantalla NO usa la barra azul ni el menú. */
  get usaLayout() {
    return false;
  }

  render() {
    return `
      <div class="app-contenedor pantalla-acceso">
        <div class="acceso-cabecera">
          <div class="logo">${Iconos.obtener('portapapeles', 32)}</div>
          <h1>Mis Tareas</h1>
          <p>Organiza tus tareas de la universidad</p>
        </div>

        <form class="tarjeta acceso-tarjeta" id="formulario" novalidate>
          <h2>Iniciar sesión</h2>
          <p class="subtitulo">Ingresa con tu correo y contraseña</p>

          <div class="campo">
            <label for="correo">Correo electrónico</label>
            <div class="con-icono">
              ${Iconos.obtener('correo', 17)}
              <input id="correo" name="correo" type="email" placeholder="estudiante@correo.com" autocomplete="email" required />
            </div>
          </div>

          <div class="campo">
            <label for="contrasena">Contraseña</label>
            <div class="con-icono">
              ${Iconos.obtener('candado', 17)}
              <input id="contrasena" name="contrasena" type="password" placeholder="••••••" autocomplete="current-password" required />
            </div>
          </div>

          <button class="boton boton-primario mt" type="submit">Ingresar</button>

          <p class="cambiar-acceso">
            ¿No tienes cuenta? <button type="button" id="irRegistro">Regístrate</button>
          </p>
        </form>
      </div>`;
  }

  alMontar() {
    this.buscar('#irRegistro').addEventListener('click', () => this.app.irA('registro'));

    const formulario = this.buscar('#formulario');
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault(); // evita que la página se recargue
      const { correo, contrasena } = Utilidades.datosFormulario(formulario);
      if (!correo || !contrasena) {
        this.app.mostrarMensaje('Escribe tu correo y contraseña', 'error');
        return;
      }
      this.ejecutar(formulario.querySelector('button[type=submit]'), async () => {
        this.app.usuario = await this.app.api.iniciarSesion(correo, contrasena);
        this.app.irA('inicio');
      });
    });
  }
}
