# 🧱 Dónde está la Programación Orientada a Objetos (POO)

Guía para mostrarle al profe que el proyecto está orientado a objetos.
Todo el código está escrito con **clases**, y se usan los **4 pilares de la POO**.

---

## 1. Clases y objetos

Una **clase** es un molde y un **objeto** es algo creado con ese molde usando `new`.

| Dónde mirar | Qué mostrar |
|---|---|
| `backend/src/modelos/Tarea.js` | La clase `Tarea` con **atributos** (nombre, fechaEntrega, estado…) y **métodos** (`actualizar()`, `validar()`, `perteneceA()`). |
| `backend/server.js` (al final) | `const servidor = new Servidor(4000);` → se crea un **objeto**. |
| `frontend/js/main.js` | `const app = new App(...)` → objeto principal del frontend. |
| `frontend/js/App.js`, método `navegar()` | `new ClasePantalla(this, parametros)` → cada vez que cambias de pantalla se crea un objeto pantalla. |

---

## 2. Encapsulamiento 🔒
Ocultar los datos internos de un objeto y permitir usarlos **solo a través de sus métodos**.
En JavaScript los atributos **privados** se escriben con `#`.

| Dónde mirar | Qué mostrar |
|---|---|
| `backend/src/modelos/Usuario.js` | `#contrasenaHash` es **privado**. Nadie puede leer la contraseña desde fuera; solo se usa con `establecerContrasena()` y `verificarContrasena()`. Por eso la contraseña **nunca** se envía al celular. ⭐ *El mejor ejemplo.* |
| `backend/src/basedatos/BaseDatos.js` | `#ruta`, `#datos` y el método privado `#cargar()`. |
| `backend/src/servicios/AuthServicio.js` | `#sesiones` (privado) y el método privado `#crearSesion()`. |
| `frontend/js/servicios/ApiServicio.js` | `#token` y `#peticion()` son privados. |
| `frontend/js/servicios/Preferencias.js` | **getters y setters** (`get tema()` / `set tema(valor)`). |

---

## 3. Herencia 👨‍👦
Una clase hija **hereda** atributos y métodos de una clase padre con `extends`, y usa `super(...)` para llamar al constructor del padre.

| Clase padre | Clases hijas | Dónde |
|---|---|---|
| `Entidad` | `Usuario`, `Tarea`, `Materia` | `backend/src/modelos/` |
| `Repositorio` | `UsuarioRepositorio`, `TareaRepositorio`, `MateriaRepositorio` | `backend/src/repositorios/` |
| `Controlador` | `AuthControlador`, `TareaControlador`, `MateriaControlador` | `backend/src/controladores/` |
| `Error` (de JavaScript) | `ErrorApp` | `backend/src/errores/ErrorApp.js` |
| `Pantalla` | Todas las pantallas (`PantallaInicio`, `PantallaLogin`…) | `frontend/js/pantallas/` |
| `PantallaAgregarTarea` | `PantallaEditarTarea` ⭐ | `frontend/js/pantallas/PantallaEditarTarea.js` |

⭐ **Ejemplo para explicar en clase:** `PantallaEditarTarea` hereda de `PantallaAgregarTarea`.
El formulario es el mismo, así que **no se repite el código**: la pantalla de editar solo
cambia el título, los botones, agrega el campo "Estado" y lo que pasa al guardar.

Gracias a la herencia, `Repositorio` tiene `guardar()`, `buscarPorId()` y `eliminar()` **una sola vez**
y los tres repositorios hijos los pueden usar.

---

## 4. Polimorfismo 🎭
"Muchas formas": el **mismo método** se comporta distinto según el objeto.
Se logra **sobrescribiendo** métodos del padre en las clases hijas.

| Método | Clase padre | Cada hija lo hace diferente |
|---|---|---|
| `validar()` | `Entidad` | `Usuario` revisa correo y nombre; `Tarea` revisa fecha y materia; `Materia` revisa el color. |
| `crearInstancia()` | `Repositorio` | Cada repositorio crea un `Usuario`, una `Tarea` o una `Materia`. |
| `registrarRutas()` | `Controlador` | Cada controlador registra sus propias rutas. |
| `render()` | `Pantalla` | Cada pantalla devuelve su propio HTML. |
| `aRegistro()` | `Entidad` | `Usuario` lo sobrescribe para guardar también la contraseña encriptada. |

⭐ **Ejemplo para explicar en clase** (`backend/src/repositorios/Repositorio.js`, método `guardar()`):
```js
guardar(entidad) {
  entidad.validar();   // ← no sabe si es Usuario, Tarea o Materia
  ...
}
```
El repositorio llama `validar()` sin saber qué objeto es, y **cada objeto se valida a su manera**. Eso es polimorfismo.

Lo mismo en el frontend (`frontend/js/App.js`, método `dibujar()`):
```js
pantalla.render();     // ← cada pantalla dibuja algo diferente
pantalla.alMontar();
```

---

## 5. Abstracción 🧩
Mostrar solo lo importante y esconder los detalles. Las clases padre definen **qué** se debe hacer
pero no **cómo**: si una clase hija se olvida de implementar el método, se lanza un error.

```js
// backend/src/modelos/Entidad.js
validar() {
  throw new Error(`La clase ${this.constructor.name} debe implementar validar()`);
}
```
También en `Repositorio.crearInstancia()`, `Controlador.registrarRutas()` y `Pantalla.render()`.

---

## Extra: otros conceptos que puedes mencionar

- **Métodos y atributos estáticos** (`static`): `Entidad.generarId()`, `Tarea.ESTADOS`, `Materia.POR_DEFECTO`, `Iconos.obtener()`.
- **Composición** ("un objeto tiene otros objetos"): `Servidor` tiene repositorios y controladores; `App` tiene un `ApiServicio` y unas `Preferencias`; una `Tarea` del frontend tiene un objeto `Materia`.
- **Getters**: `usuario.nombreCompleto`, `tarea.estaCompletada`, `tarea.fechaFormateada` (se usan como atributos pero son métodos).

---

## 🗣️ Resumen para decirle al profe (30 segundos)

> "Todo el proyecto está hecho con clases. Tengo **herencia** con clases padre como `Entidad`,
> `Repositorio`, `Controlador` y `Pantalla`. Uso **encapsulamiento** con atributos privados (`#`),
> por ejemplo la contraseña del `Usuario` no se puede leer desde fuera. Hay **polimorfismo**
> porque cada modelo sobrescribe `validar()` y cada pantalla sobrescribe `render()`, y el código
> que los llama no necesita saber qué objeto es. Y hay **abstracción** porque las clases padre
> obligan a las hijas a implementar esos métodos."
