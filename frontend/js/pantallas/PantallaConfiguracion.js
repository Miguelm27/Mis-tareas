import { Pantalla } from './Pantalla.js';
import { Iconos } from '../utilidades/Iconos.js';
import { Utilidades } from '../utilidades/Utilidades.js';

/**
 * ============================================================
 *  PANTALLA 6: Perfil / Configuración  (hereda de Pantalla)
 * ============================================================
 */
export class PantallaConfiguracion extends Pantalla {
  get menuActivo() {
    return 'configuracion';
  }

  render() {
    const u = this.app.usuario;
    const pref = this.app.preferencias;
    const flecha = `<span class="flecha">${Iconos.obtener('flecha', 16)}</span>`;
    return `
      <h2 class="titulo-seccion">Configuración</h2>

      <div class="tarjeta perfil-resumen" id="perfil">
        <span class="avatar">${Iconos.obtener('usuario', 26)}</span>
        <div class="texto" style="flex:1;min-width:0">
          <div class="nombre">${Utilidades.escapar(`${u.nombre} ${u.apellido}`)}</div>
          <div class="correo">${Utilidades.escapar(u.correo)}</div>
        </div>
        ${flecha}
      </div>

      <div class="tarjeta separacion">
        <ul class="lista-opciones">
          <li class="opcion" id="contrasena">
            ${Iconos.obtener('candado', 18)}
            <span class="texto">Cambiar contraseña</span>${flecha}
          </li>
          <li class="opcion" id="notificaciones">
            ${Iconos.obtener('campana', 18)}
            <span class="texto">Notificaciones</span>
            <span class="interruptor ${pref.notificaciones ? 'encendido' : ''}"></span>
          </li>
          <li class="opcion" id="tema">
            ${Iconos.obtener('luna', 18)}
            <span class="texto">Tema</span>
            <span class="valor">${pref.tema}</span>${flecha}
          </li>
          <li class="opcion peligro" id="cerrarSesion">
            ${Iconos.obtener('salir', 18)}
            <span class="texto">Cerrar sesión</span>
          </li>
        </ul>
      </div>`;
  }

  alMontar() {
    const pref = this.app.preferencias;

    this.buscar('#perfil').addEventListener('click', () => this.app.navegar('perfil'));
    this.buscar('#contrasena').addEventListener('click', () => this.app.navegar('contrasena'));

    this.buscar('#notificaciones').addEventListener('click', () => {
      pref.notificaciones = !pref.notificaciones; // usa el "setter" de Preferencias
      this.app.mostrarMensaje(pref.notificaciones ? 'Notificaciones activadas' : 'Notificaciones desactivadas');
      this.app.dibujar();
    });

    this.buscar('#tema').addEventListener('click', () => {
      pref.tema = pref.tema === 'Claro' ? 'Oscuro' : 'Claro';
      this.app.dibujar();
    });

    this.buscar('#cerrarSesion').addEventListener('click', () => {
      if (confirm('¿Quieres cerrar sesión?')) this.app.cerrarSesion();
    });
  }
}
