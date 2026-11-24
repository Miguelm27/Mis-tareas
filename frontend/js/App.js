import { ApiServicio } from './servicios/ApiServicio.js';
import { Preferencias } from './servicios/Preferencias.js';
import { Iconos } from './utilidades/Iconos.js';
import { PantallaLogin } from './pantallas/PantallaLogin.js';
import { PantallaRegistro } from './pantallas/PantallaRegistro.js';
import { PantallaInicio } from './pantallas/PantallaInicio.js';
import { PantallaAgregarTarea } from './pantallas/PantallaAgregarTarea.js';
import { PantallaDetalleTarea } from './pantallas/PantallaDetalleTarea.js';
import { PantallaEditarTarea } from './pantallas/PantallaEditarTarea.js';
import { PantallaMaterias } from './pantallas/PantallaMaterias.js';
import { PantallaConfiguracion } from './pantallas/PantallaConfiguracion.js';
import { PantallaPerfil } from './pantallas/PantallaPerfil.js';
import { PantallaCambiarContrasena } from './pantallas/PantallaCambiarContrasena.js';

/**
 * ============================================================
 *  CLASE PRINCIPAL: App
 * ============================================================
 * Es el "director" de la aplicación:
 *  - Sabe qué pantalla se está mostrando.
 *  - Cambia de pantalla (navegar / volver).
 *  - Dibuja la barra azul y el menú lateral.
 *  - Guarda el usuario que inició sesión.
 *
 * POO -> COMPOSICIÓN: App "tiene" un ApiServicio, unas Preferencias
 *        y la Pantalla actual.
 * POO -> POLIMORFISMO: en dibujar() se llama pantalla.render() y
 *        pantalla.alMontar() sin importar qué pantalla sea.
 */
export class App {
  // Mapa: nombre de la pantalla -> la CLASE que la dibuja
  static PANTALLAS = {
    login: PantallaLogin,
    registro: PantallaRegistro,
    inicio: PantallaInicio,
    agregar: PantallaAgregarTarea,
    detalle: PantallaDetalleTarea,
    editar: PantallaEditarTarea,
    materias: PantallaMaterias,
    configuracion: PantallaConfiguracion,
    perfil: PantallaPerfil,
    contrasena: PantallaCambiarContrasena,
  };

  // Opciones del menú lateral
  static MENU = [
    { pantalla: 'inicio', texto: 'Inicio', icono: 'casa', iconoActivo: 'casaRelleno' },
    { pantalla: 'agregar', texto: 'Agregar tarea', icono: 'mas' },
    { pantalla: 'materias', texto: 'Materias', icono: 'libroAbierto' },
    { pantalla: 'configuracion', texto: 'Configuración', icono: 'ajustes' },
  ];

  constructor(raiz) {
    this.raiz = raiz; // el <div id="app">
    this.api = new ApiServicio();
    this.preferencias = new Preferencias();
    this.usuario = null;
    this.pantallaActual = null;
    this.historial = []; // pantallas anteriores (para la flecha ←)
    this.menuVisible = true;
  }

  /** Arranca la app: si ya había sesión va a Inicio, si no, al Login. */
  async iniciar() {
    this.preferencias.aplicarTema();
    if (this.api.tieneSesion()) {
      try {
        this.usuario = await this.api.obtenerPerfil();
        return this.irA('inicio');
      } catch {
        this.api.borrarSesion();
      }
    }
    this.irA('login');
  }

  /**
   * Abre una pantalla y guarda la actual en el historial.
   * @param {string} nombre      clave de App.PANTALLAS (ej: 'detalle')
   * @param {object} parametros  datos para la pantalla (ej: { id })
   */
  async navegar(nombre, parametros = {}, guardarEnHistorial = true) {
    const ClasePantalla = App.PANTALLAS[nombre];
    const pantalla = new ClasePantalla(this, parametros); // ¡se crea un OBJETO pantalla!
    try {
      await pantalla.cargarDatos();
    } catch (error) {
      this.manejarError(error);
      return;
    }
    if (guardarEnHistorial && this.pantallaActual) {
      this.historial.push({ nombre: this.pantallaActual.nombre, parametros: this.pantallaActual.parametros });
    }
    pantalla.nombre = nombre;
    this.pantallaActual = pantalla;
    this.dibujar();
    window.scrollTo(0, 0);
  }

  /** Va a una pantalla principal y borra el historial (desde el menú). */
  irA(nombre, parametros = {}) {
    this.historial = [];
    this.pantallaActual = null;
    return this.navegar(nombre, parametros);
  }

  /** Regresa a la pantalla anterior (flecha ←). */
  volver() {
    const anterior = this.historial.pop();
    if (anterior) this.navegar(anterior.nombre, anterior.parametros, false);
    else this.irA('inicio');
  }

  async cerrarSesion() {
    await this.api.cerrarSesion();
    this.usuario = null;
    this.irA('login');
  }

  /** Dibuja la pantalla actual (con o sin barra azul y menú). */
  dibujar() {
    const pantalla = this.pantallaActual;

    if (!pantalla.usaLayout) {
      this.raiz.innerHTML = pantalla.render();
    } else {
      this.raiz.innerHTML = `
        <div class="app-contenedor">
          <header class="cabecera">
            <button id="botonCabecera" aria-label="${pantalla.iconoCabecera === 'menu' ? 'Mostrar menú' : 'Volver'}">
              ${Iconos.obtener(pantalla.iconoCabecera, 22)}
            </button>
            <h1>Mis Tareas</h1>
            <button id="botonPerfil" aria-label="Mi perfil">${Iconos.obtener('usuario', 22)}</button>
          </header>
          <div class="cuerpo">
            <nav class="menu-lateral ${this.menuVisible ? '' : 'oculto'}">${this.#menuHtml(pantalla.menuActivo)}</nav>
            <main class="contenido ${pantalla.claseContenido}">${pantalla.render()}</main>
          </div>
        </div>`;
      this.#conectarLayout(pantalla);
    }

    pantalla.alMontar();
  }

  /** PRIVADO: HTML de las opciones del menú lateral. */
  #menuHtml(activo) {
    return App.MENU.map((opcion) => {
      const esActivo = opcion.pantalla === activo;
      const icono = esActivo && opcion.iconoActivo ? opcion.iconoActivo : opcion.icono;
      return `<button class="menu-item ${esActivo ? 'activo' : ''}" data-ir="${opcion.pantalla}">
          ${Iconos.obtener(icono, 17)} <span>${opcion.texto}</span>
        </button>`;
    }).join('');
  }

  /** PRIVADO: conecta los botones de la barra azul y del menú. */
  #conectarLayout(pantalla) {
    this.raiz.querySelector('#botonCabecera').addEventListener('click', () => {
      if (pantalla.iconoCabecera === 'menu') {
        this.menuVisible = !this.menuVisible; // ≡ muestra / oculta el menú
        this.raiz.querySelector('.menu-lateral').classList.toggle('oculto', !this.menuVisible);
      } else {
        this.volver(); // ← regresa
      }
    });
    this.raiz.querySelector('#botonPerfil').addEventListener('click', () => this.navegar('perfil'));
    this.raiz.querySelectorAll('[data-ir]').forEach((boton) => {
      boton.addEventListener('click', () => this.irA(boton.dataset.ir));
    });
  }

  /** Muestra un mensaje corto abajo de la pantalla. */
  mostrarMensaje(texto, tipo = 'exito') {
    const caja = document.getElementById('mensaje');
    caja.textContent = texto;
    caja.className = `mensaje visible ${tipo}`;
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => caja.classList.remove('visible'), 2600);
  }

  /** Muestra el error; si la sesión venció, manda al Login. */
  manejarError(error) {
    this.mostrarMensaje(error.message, 'error');
    if (error.estado === 401 && this.usuario) {
      this.api.borrarSesion();
      this.usuario = null;
      this.irA('login');
    }
  }
}
