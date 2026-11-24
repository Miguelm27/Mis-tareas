/**
 * ============================================================
 *  PUNTO DE ENTRADA DEL FRONTEND
 * ============================================================
 * Aquí empieza todo: se crea el OBJETO app (instancia de la clase App)
 * y se le dice que inicie.
 */
import { App } from './App.js';

const app = new App(document.getElementById('app'));
app.iniciar();
