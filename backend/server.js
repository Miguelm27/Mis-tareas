/**
 * ============================================================
 *  PUNTO DE ENTRADA DEL BACKEND (servidor)
 * ============================================================
 * Para encenderlo:   npm start
 *
 * Este archivo crea la clase Servidor, que "arma" todas las piezas:
 *   BaseDatos -> Repositorios -> Servicio de autenticación -> Controladores
 * y además entrega el frontend (la carpeta /frontend) para que el
 * celular pueda abrir la app desde el navegador.
 */
const express = require('express');
const path = require('path');
const os = require('os');

const BaseDatos = require('./src/basedatos/BaseDatos');
const UsuarioRepositorio = require('./src/repositorios/UsuarioRepositorio');
const TareaRepositorio = require('./src/repositorios/TareaRepositorio');
const MateriaRepositorio = require('./src/repositorios/MateriaRepositorio');
const AuthServicio = require('./src/servicios/AuthServicio');
const AuthControlador = require('./src/controladores/AuthControlador');
const TareaControlador = require('./src/controladores/TareaControlador');
const MateriaControlador = require('./src/controladores/MateriaControlador');
const Tarea = require('./src/modelos/Tarea');

class Servidor {
  constructor(puerto) {
    this.puerto = puerto;
    this.app = express();

    // 1. Base de datos (archivo JSON)
    const baseDatos = new BaseDatos(path.join(__dirname, 'almacenamiento', 'db.json'));

    // 2. Repositorios (cada uno maneja una colección)
    this.usuarioRepositorio = new UsuarioRepositorio(baseDatos);
    this.tareaRepositorio = new TareaRepositorio(baseDatos);
    this.materiaRepositorio = new MateriaRepositorio(baseDatos);

    // 3. Servicio de autenticación
    this.authServicio = new AuthServicio(this.usuarioRepositorio, this.materiaRepositorio);

    this.configurar();
    this.crearDatosDemo();
  }

  /**
   * Si la base de datos está vacía (por ejemplo, recién publicada en internet),
   * crea una cuenta de demostración con algunas tareas para poder probar la app:
   *   correo: demo@mistareas.com   contraseña: demo123
   */
  crearDatosDemo() {
    if (this.usuarioRepositorio.obtenerTodos().length > 0) return;

    const { usuario } = this.authServicio.registrar({
      nombre: 'Estudiante',
      apellido: 'Demo',
      correo: 'demo@mistareas.com',
      carrera: 'Desarrollo de Software',
      contrasena: 'demo123',
    });

    // Fecha de hoy + "dias", en formato AAAA-MM-DD
    const fecha = (dias) => {
      const d = new Date();
      d.setDate(d.getDate() + dias);
      return d.toISOString().slice(0, 10);
    };
    const materias = this.materiaRepositorio.buscarPorUsuario(usuario.id);
    const materia = (nombre) => materias.find((m) => m.nombre === nombre).id;

    [
      { nombre: 'Ejercicios de integrales', materiaId: materia('Matemáticas'), fechaEntrega: fecha(2), descripcion: 'Resolver los ejercicios del capítulo 5 del libro.' },
      { nombre: 'Proyecto final', materiaId: materia('Programación'), fechaEntrega: fecha(7), descripcion: 'App de tareas con Programación Orientada a Objetos.' },
      { nombre: 'Leer capítulo 4', materiaId: materia('Historia'), fechaEntrega: fecha(-1), estado: 'Completada' },
    ].forEach((datos) => this.tareaRepositorio.guardar(new Tarea({ ...datos, usuarioId: usuario.id })));

    console.log('   Cuenta demo creada: demo@mistareas.com / demo123');
  }

  /** Conecta los controladores (rutas de la API) y el frontend. */
  configurar() {
    this.app.use(express.json()); // Permite leer JSON en las peticiones

    this.app.use('/api/auth', new AuthControlador(this.authServicio, this.usuarioRepositorio).rutas());
    this.app.use(
      '/api/tareas',
      new TareaControlador(this.tareaRepositorio, this.materiaRepositorio, this.authServicio).rutas()
    );
    this.app.use('/api/materias', new MateriaControlador(this.materiaRepositorio, this.authServicio).rutas());

    // Entrega los archivos del frontend (HTML, CSS, JS)
    this.app.use(express.static(path.join(__dirname, '..', 'frontend')));
  }

  /** Busca la IP de este computador en la red WiFi (para abrir desde el celular). */
  obtenerIpsLocales() {
    return Object.values(os.networkInterfaces())
      .flat()
      .filter((red) => red && red.family === 'IPv4' && !red.internal)
      .map((red) => red.address);
  }

  iniciar() {
    this.app.listen(this.puerto, '0.0.0.0', () => {
      console.log('\n==============================================');
      console.log('   ✅ Mis Tareas está funcionando');
      console.log('==============================================');
      console.log(`   En este computador:  http://localhost:${this.puerto}`);
      this.obtenerIpsLocales().forEach((ip) => {
        console.log(`   En tu celular:       http://${ip}:${this.puerto}`);
      });
      console.log('   (El celular debe estar en la MISMA red WiFi)');
      console.log('==============================================\n');
    });
  }
}

// Creamos el objeto servidor y lo encendemos
const servidor = new Servidor(process.env.PORT || 4000);
servidor.iniciar();
