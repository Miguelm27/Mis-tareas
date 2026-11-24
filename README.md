# 📋 Mis Tareas

App para celular que sirve para organizar las tareas de la universidad.
Tiene **inicio de sesión, registro**, lista de tareas, materias y configuración.

- **Frontend:** HTML + CSS + JavaScript (con clases, sin frameworks)
- **Backend:** Node.js + Express (con clases)
- **Base de datos:** un archivo JSON (`backend/almacenamiento/db.json`), que se crea solo

---

## ▶️ Cómo ejecutarla

### Requisito (solo una vez)
Tener instalado **Node.js** → https://nodejs.org (versión LTS).

### Opción fácil
Doble clic en **`iniciar.bat`**.

### Opción desde Visual Studio Code
1. Abre la carpeta `MisTareas` en VS Code.
2. Abre la terminal (`Ctrl + ñ` o menú *Terminal → Nueva terminal*).
3. Escribe:
   ```bash
   cd backend
   npm install
   npm start
   ```

En la terminal aparecerá algo así:
```
   En este computador:  http://localhost:4000
   En tu celular:       http://192.168.1.15:4000
```

## 📱 Abrirla en el celular
1. El celular y el computador deben estar conectados al **mismo WiFi**.
2. En el celular abre Chrome y escribe la dirección que dice **"En tu celular"**.
3. Si Windows pregunta por el **Firewall**, dale **Permitir acceso**.
   (Si no abre, revisa que la red WiFi esté como "Privada" en Windows).
4. Para que quede como app: en Chrome toca los **⋮ → "Agregar a la pantalla principal"**.
   Te queda un ícono como cualquier otra app.

> El computador debe quedarse con el servidor encendido mientras usas la app.

---

## 📁 Organización de carpetas

```
MisTareas/
├── backend/                      ← SERVIDOR
│   ├── server.js                 ← Punto de entrada (clase Servidor)
│   ├── package.json
│   └── src/
│       ├── modelos/              ← Clases de datos
│       │   ├── Entidad.js        (clase padre)
│       │   ├── Usuario.js        (hereda de Entidad)
│       │   ├── Tarea.js          (hereda de Entidad)
│       │   └── Materia.js        (hereda de Entidad)
│       ├── repositorios/         ← Guardan y buscan en la base de datos
│       │   ├── Repositorio.js    (clase padre)
│       │   ├── UsuarioRepositorio.js
│       │   ├── TareaRepositorio.js
│       │   └── MateriaRepositorio.js
│       ├── controladores/        ← Reciben las peticiones (rutas de la API)
│       │   ├── Controlador.js    (clase padre)
│       │   ├── AuthControlador.js
│       │   ├── TareaControlador.js
│       │   └── MateriaControlador.js
│       ├── servicios/
│       │   └── AuthServicio.js   ← Registro, login y sesiones
│       ├── basedatos/
│       │   └── BaseDatos.js      ← Lee/escribe el archivo JSON
│       └── errores/
│           └── ErrorApp.js       ← Error personalizado (hereda de Error)
│
└── frontend/                     ← LO QUE SE VE EN EL CELULAR
    ├── index.html
    ├── manifest.json             ← Permite instalarla como app
    ├── css/estilos.css
    └── js/
        ├── main.js               ← Punto de entrada
        ├── App.js                ← Clase principal (navegación)
        ├── modelos/              ← Tarea.js, Materia.js
        ├── servicios/            ← ApiServicio.js, Preferencias.js
        ├── utilidades/           ← Iconos.js, Utilidades.js
        └── pantallas/            ← Una clase por pantalla
            ├── Pantalla.js       (clase padre)
            ├── PantallaLogin.js
            ├── PantallaRegistro.js
            ├── PantallaInicio.js          (1. Lista de tareas)
            ├── PantallaAgregarTarea.js    (2. Agregar tarea)
            ├── PantallaDetalleTarea.js    (3. Detalle)
            ├── PantallaEditarTarea.js     (4. Editar – hereda de Agregar)
            ├── PantallaMaterias.js        (5. Materias)
            ├── PantallaConfiguracion.js   (6. Configuración)
            ├── PantallaPerfil.js
            └── PantallaCambiarContrasena.js
```

## 🔌 Rutas de la API (backend)

| Método | Ruta                   | Qué hace                  |
|--------|------------------------|---------------------------|
| POST   | `/api/auth/registro`   | Crear cuenta              |
| POST   | `/api/auth/login`      | Iniciar sesión            |
| POST   | `/api/auth/logout`     | Cerrar sesión             |
| GET    | `/api/auth/perfil`     | Ver mis datos             |
| PUT    | `/api/auth/perfil`     | Editar mis datos          |
| PUT    | `/api/auth/contrasena` | Cambiar contraseña        |
| GET    | `/api/tareas`          | Listar mis tareas         |
| POST   | `/api/tareas`          | Crear tarea               |
| GET    | `/api/tareas/:id`      | Ver una tarea             |
| PUT    | `/api/tareas/:id`      | Editar tarea              |
| DELETE | `/api/tareas/:id`      | Eliminar tarea            |
| GET    | `/api/materias`        | Listar materias           |
| POST   | `/api/materias`        | Crear materia             |

Para entender **dónde está la Programación Orientada a Objetos**, lee
[EXPLICACION_POO.md](EXPLICACION_POO.md).
