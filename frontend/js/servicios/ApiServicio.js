/**
 * ============================================================
 *  CLASE: ApiServicio
 * ============================================================
 * Es el "puente" entre el celular (frontend) y el servidor (backend).
 * Todas las peticiones al servidor pasan por aquí usando fetch().
 *
 * POO -> ENCAPSULAMIENTO: el token de sesión es PRIVADO (#token).
 * Las pantallas no lo tocan; solo llaman métodos como obtenerTareas().
 */
export class ApiServicio {
  #token;

  constructor(urlBase = '/api') {
    this.urlBase = urlBase;
    this.#token = localStorage.getItem('token');
  }

  tieneSesion() {
    return Boolean(this.#token);
  }

  #guardarToken(token) {
    this.#token = token;
    localStorage.setItem('token', token);
  }

  borrarSesion() {
    this.#token = null;
    localStorage.removeItem('token');
  }

  /**
   * Método general para hablar con el servidor.
   * @param {string} metodo 'GET' | 'POST' | 'PUT' | 'DELETE'
   * @param {string} ruta   ej: '/tareas'
   * @param {object} cuerpo datos a enviar (opcional)
   */
  async #peticion(metodo, ruta, cuerpo) {
    let respuesta;
    try {
      respuesta = await fetch(this.urlBase + ruta, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.#token || ''}`,
        },
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      });
    } catch {
      throw new Error('No hay conexión con el servidor');
    }
    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
      const error = new Error(datos.error || 'Ocurrió un error');
      error.estado = respuesta.status; // 401 = sesión vencida
      throw error;
    }
    return datos;
  }

  // ---------- Usuario / sesión ----------
  async registrar(datos) {
    const resultado = await this.#peticion('POST', '/auth/registro', datos);
    this.#guardarToken(resultado.token);
    return resultado.usuario;
  }

  async iniciarSesion(correo, contrasena) {
    const resultado = await this.#peticion('POST', '/auth/login', { correo, contrasena });
    this.#guardarToken(resultado.token);
    return resultado.usuario;
  }

  async cerrarSesion() {
    await this.#peticion('POST', '/auth/logout').catch(() => {});
    this.borrarSesion();
  }

  obtenerPerfil() {
    return this.#peticion('GET', '/auth/perfil');
  }

  actualizarPerfil(datos) {
    return this.#peticion('PUT', '/auth/perfil', datos);
  }

  cambiarContrasena(actual, nueva) {
    return this.#peticion('PUT', '/auth/contrasena', { actual, nueva });
  }

  // ---------- Tareas ----------
  obtenerTareas() {
    return this.#peticion('GET', '/tareas');
  }

  obtenerTarea(id) {
    return this.#peticion('GET', `/tareas/${id}`);
  }

  crearTarea(datos) {
    return this.#peticion('POST', '/tareas', datos);
  }

  actualizarTarea(id, datos) {
    return this.#peticion('PUT', `/tareas/${id}`, datos);
  }

  eliminarTarea(id) {
    return this.#peticion('DELETE', `/tareas/${id}`);
  }

  // ---------- Materias ----------
  obtenerMaterias() {
    return this.#peticion('GET', '/materias');
  }

  crearMateria(datos) {
    return this.#peticion('POST', '/materias', datos);
  }
}
