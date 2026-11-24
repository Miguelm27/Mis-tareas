const express = require('express');
const ErrorApp = require('../errores/ErrorApp');

/**
 * ============================================================
 *  CLASE BASE: Controlador
 * ============================================================
 * Un controlador recibe las peticiones del celular (rutas de la API)
 * y responde. Esta clase base tiene lo común a todos:
 *   - crear el "router" de Express
 *   - atrapar los errores y responder con un mensaje claro
 *
 * POO -> HERENCIA: AuthControlador, TareaControlador y
 *        MateriaControlador heredan de aquí.
 * POO -> POLIMORFISMO: cada hijo implementa registrarRutas() a su manera.
 */
class Controlador {
  constructor() {
    this.router = express.Router();
  }

  /** Método "abstracto": cada controlador define sus propias rutas. */
  registrarRutas() {
    throw new Error('Cada controlador debe implementar registrarRutas()');
  }

  /**
   * Registra una ruta y se asegura de que si algo falla
   * se responda con el error (en vez de que el servidor se caiga).
   * @param {string} metodo  'get' | 'post' | 'put' | 'delete'
   * @param {string} camino  ej: '/:id'
   * @param {Function} accion método del controlador que atiende la ruta
   */
  ruta(metodo, camino, accion) {
    this.router[metodo](camino, async (req, res) => {
      try {
        await accion.call(this, req, res);
      } catch (error) {
        this.responderError(res, error);
      }
    });
  }

  responderError(res, error) {
    const estado = error instanceof ErrorApp ? error.estadoHttp : 500;
    if (estado === 500) console.error(error);
    res.status(estado).json({
      error: estado === 500 ? 'Ocurrió un error en el servidor' : error.message,
    });
  }

  /** Devuelve el router listo para conectarlo al servidor. */
  rutas() {
    this.registrarRutas();
    return this.router;
  }
}

module.exports = Controlador;
