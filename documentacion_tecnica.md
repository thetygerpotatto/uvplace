# UVplace - Documentación Técnica

## Resumen General

Esta aplicación Flask es una plataforma colaborativa de arte pixel en tiempo real que permite a múltiples usuarios dibujar en un lienzo compartido de 100x100 píxeles. La aplicación cuenta con autenticación de usuarios, actualizaciones en tiempo real vía WebSockets y almacenamiento persistente de datos de píxeles.

## Arquitectura

### Stack Tecnológico
- **Framework Backend**: Flask (framework web de Python)
- **Comunicación en Tiempo Real**: Flask-SocketIO (implementación WebSocket)
- **Base de Datos**: SQLite con manejo integrado de base de datos de Flask
- **Autenticación**: Autenticación basada en sesiones con hash de contraseñas
- **Frontend**: Plantillas HTML con actualizaciones JavaScript en tiempo real

### Estructura de la Aplicación
```
flaskr/
├── __init__.py          # Punto de entrada de la factory de aplicación
├── createApp.py         # Factory principal de aplicación y configuración
├── auth.py              # Blueprint de autenticación (login/registro/logout)
├── game.py              # Lógica principal del juego y manejo del mapa
├── db.py                # Conexión e inicialización de base de datos
└── schema.sql           # Definición del esquema de base de datos
```

## Componentes Principales

### 1. Factory de Aplicación (`createApp.py`)

La aplicación utiliza el patrón factory para configuración e inicialización.

**Características Principales:**
- Crea instancia de aplicación Flask con configuración relativa a la instancia
- Inicializa Flask-SocketIO para comunicación en tiempo real
- Configura la ruta de base de datos y clave secreta
- Registra blueprints para autenticación y lógica del juego
- Crea directorio de instancia para base de datos SQLite

**Configuración:**
- `SECRET_KEY`: Establecida como 'dev' (debe cambiarse para producción)
- `DATABASE`: Archivo SQLite ubicado en directorio de instancia
- Ruta de instancia: Carpeta de instancia Flask creada automáticamente

### 2. Sistema de Autenticación (`auth.py`)

Implementa autenticación de usuarios basada en sesiones con los siguientes endpoints:

#### Endpoints:
- `GET/POST /auth/register` - Registro de usuarios
- `GET/POST /auth/login` - Inicio de sesión de usuarios
- `GET /auth/logout` - Cierre de sesión de usuarios
- `GET /auth/init-db1119150376` - Endpoint oculto de inicialización de base de datos

#### Características de Seguridad:
- Hash de contraseñas usando utilidades de seguridad de Werkzeug
- Validación de unicidad de nombre de usuario
- Manejo de sesiones con almacenamiento de user_id
- Decorador de requerimiento de login para rutas protegidas

#### Flujo de Autenticación:
1. Usuario envía formulario de registro con usuario/contraseña
2. La contraseña se hashea usando `generate_password_hash()`
3. Datos de usuario se almacenan en base de datos SQLite
4. Login valida credenciales contra contraseña hasheada
5. Login exitoso almacena `user_id` en sesión
6. `load_logged_in_user()` se ejecuta antes de cada request para poblar `g.user`

### 3. Capa de Base de Datos (`db.py`)

Maneja conexiones de base de datos SQLite e inicialización.

#### Funciones:
- `get_db()`: Retorna conexión de base de datos, crea si no existe
- `close_db()`: Cierra conexión de base de datos
- `init_db()`: Inicializa esquema de base de datos desde schema.sql
- `init_map()`: Puebla tabla de mapa con 10,000 píxeles blancos (grid 100x100)

#### Comandos CLI:
- `flask init-db`: Inicializar tablas de base de datos
- `flask init-map-db`: Poblar mapa con píxeles blancos por defecto

### 4. Lógica del Juego (`game.py`)

Maneja la funcionalidad principal del arte pixel y actualizaciones en tiempo real.

#### Endpoints:
- `GET /` - Interfaz principal del juego
- `GET /map` - Retorna estado actual del mapa como JSON
- `POST /update` - Actualiza color de píxel y transmite cambio

#### Características en Tiempo Real:
- Usa Flask-SocketIO para comunicación WebSocket
- Transmite actualizaciones de píxeles a todos los clientes conectados
- Protocolo de comunicación basado en JSON

#### Estructura de Datos del Mapa:
```json
{
  "map": [
    [["#FFFFFF", "#FF0000", ...], // Fila 0
     ["#00FF00", "#0000FF", ...], // Fila 1
     ...                          // 100 filas total
    ]
  ]
}
```

## Esquema de Base de Datos

### Tabla User (Usuario)
```sql
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

### Tabla Map (Mapa)
```sql
CREATE TABLE map (
  cordx INTEGER NOT NULL,           -- Coordenada X (0-99)
  cordy INTEGER NOT NULL,           -- Coordenada Y (0-99)  
  color TEXT NOT NULL,              -- Código de color hexadecimal
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  author_id INTEGER NOT NULL,       -- Usuario que creó/modificó el píxel
  PRIMARY KEY (cordx, cordy),
  FOREIGN KEY (author_id) REFERENCES user (id)
);
```

## Referencia de API

### Endpoints de Autenticación

#### POST /auth/register
Registrar una nueva cuenta de usuario.

**Cuerpo de Petición (Datos de Formulario):**
- `username` (string, requerido): Nombre de usuario único
- `password` (string, requerido): Contraseña de usuario

**Respuesta:**
- Éxito: Redirección a página de login
- Error: Mensaje flash con descripción del error

#### POST /auth/login  
Autenticar usuario y crear sesión.

**Cuerpo de Petición (Datos de Formulario):**
- `username` (string, requerido): Nombre de usuario
- `password` (string, requerido): Contraseña

**Respuesta:**
- Éxito: Redirección a página principal del juego, establece cookie de sesión
- Error: Mensaje flash con descripción del error

#### GET /auth/logout
Limpiar sesión de usuario y cerrar sesión.

**Respuesta:**
- Redirección a página principal

### Endpoints del Juego

#### GET /
Página principal de interfaz del juego.

**Respuesta:**
- Plantilla HTML para interfaz del juego

#### GET /map
Recuperar estado actual del mapa de píxeles.

**Respuesta:**
```json
{
  "map": [
    [["#FFFFFF", "#FF0000", ...], // Array 2D 100x100 de colores hex
     [...],
     ...
    ]
  ]
}
```

#### POST /update
Actualizar color de un píxel y transmitir cambio a todos los clientes.

**Cuerpo de Petición (JSON):**
```json
{
  "x": 25,          // Coordenada X (0-99)
  "y": 50,          // Coordenada Y (0-99) 
  "color": "#FF0000" // Código de color hexadecimal
}
```

**Respuesta:**
- Estado: 200
- Efecto Secundario: Transmite evento `map-update` vía WebSocket

### Eventos WebSocket

#### map-update (Salida)
Transmitido cuando un píxel es actualizado.

**Payload:**
```json
{
  "x": 25,
  "y": 50, 
  "color": "#FF0000"
}
```

## Instalación y Configuración

### Prerrequisitos
- Python 3.7+
- Administrador de paquetes pip

### Pasos de Instalación

1. **Clonar/Descargar los archivos de la aplicación**

2. **Instalar dependencias:**
```bash
pip install flask flask-socketio werkzeug
```

3. **Establecer variables de entorno:**
```bash
export FLASK_APP=flaskr
export FLASK_ENV=development  # Solo para desarrollo
```

4. **Inicializar la base de datos:**
```bash
flask init-db
flask init-map-db
```

5. **Ejecutar la aplicación:**
```bash
flask run
```

La aplicación estará disponible en `http://localhost:5000`

### Consideraciones de Configuración para Producción

**Seguridad:**
- Cambiar `SECRET_KEY` de 'dev' a una cadena aleatoria segura
- Usar variables de entorno para configuración sensible
- Remover o asegurar el endpoint oculto de inicialización de base de datos
- Implementar HTTPS
- Añadir limitación de velocidad para endpoints de autenticación

**Base de Datos:**
- Considerar PostgreSQL o MySQL para producción
- Implementar pooling de conexiones de base de datos
- Añadir procedimientos de respaldo de base de datos
- Indexar columnas consultadas frecuentemente

**Rendimiento:**
- Implementar Redis para almacenamiento de sesiones
- Añadir caché para datos del mapa
- Considerar sharding de base de datos para mapas grandes
- Implementar límites de conexión de usuarios

## Notas de Desarrollo

### Limitaciones Actuales
- Tamaño de mapa fijo de 100x100
- Sin permisos de usuario o restricciones de dibujo
- Manejo básico de errores
- Configuración solo para desarrollo
- Sin características de gestión de usuarios

### Mejoras Potenciales
- Tamaños de mapa variables
- Roles y permisos de usuario
- Herramientas de dibujo (tamaños de pincel, formas)
- Capas de mapa o múltiples lienzos
- Historial de arte de usuarios
- Funcionalidad de exportación
- Panel de administración para gestión de usuarios

### Consideraciones de Calidad de Código
- Añadir manejo comprehensivo de errores
- Implementar validación de entrada
- Añadir logging a través de la aplicación
- Crear pruebas unitarias para funcionalidad principal
- Añadir documentación de API (OpenAPI/Swagger)
- Implementar gestión apropiada de configuración

## Solución de Problemas

### Problemas Comunes

**Base de datos no encontrada:**
- Asegurar que `flask init-db` ha sido ejecutado
- Verificar que el directorio de instancia existe y es escribible

**Conexiones WebSocket fallando:**
- Verificar que Flask-SocketIO está instalado apropiadamente
- Verificar que socketio está inicializado en createApp.py

**Autenticación no funcionando:**
- Verificar que SECRET_KEY está establecida
- Verificar que la tabla user existe en la base de datos
- Asegurar que las cookies de sesión están habilitadas en el navegador

**Mapa no cargando:**
- Ejecutar `flask init-map-db` para poblar tabla de mapa
- Verificar permisos de base de datos
- Verificar que la tabla map tiene 10,000 entradas (100x100)
