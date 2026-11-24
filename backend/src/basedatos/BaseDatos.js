const fs = require('fs');
const path = require('path');

/**
 * ============================================================
 *  CLASE: BaseDatos
 * ============================================================
 * Base de datos MUY sencilla: guarda todo en un archivo JSON
 * (backend/almacenamiento/db.json). Así no hay que instalar MySQL
 * ni nada extra.
 *
 * El archivo tiene esta forma:
 *   { "usuarios": [...], "tareas": [...], "materias": [...] }
 *
 * POO -> ENCAPSULAMIENTO: #datos y #ruta son privados. Los demás
 * objetos solo pueden usar leer() y escribir().
 */
class BaseDatos {
  #ruta;
  #datos;

  constructor(rutaArchivo) {
    this.#ruta = rutaArchivo;
    this.#datos = this.#cargar();
  }

  /** Método PRIVADO: lee el archivo (o lo crea si no existe). */
  #cargar() {
    if (!fs.existsSync(this.#ruta)) {
      fs.mkdirSync(path.dirname(this.#ruta), { recursive: true });
      const vacio = { usuarios: [], tareas: [], materias: [] };
      fs.writeFileSync(this.#ruta, JSON.stringify(vacio, null, 2));
      return vacio;
    }
    return JSON.parse(fs.readFileSync(this.#ruta, 'utf-8'));
  }

  /** Devuelve una copia de la lista de una colección (ej: "tareas"). */
  leer(coleccion) {
    return [...(this.#datos[coleccion] || [])];
  }

  /** Reemplaza la lista de una colección y guarda el archivo. */
  escribir(coleccion, lista) {
    this.#datos[coleccion] = lista;
    fs.writeFileSync(this.#ruta, JSON.stringify(this.#datos, null, 2));
  }
}

module.exports = BaseDatos;
