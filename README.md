# 🦾 **INCObot** 🤖

**INCObot** es un bot para Discord organizado y modular. A continuación, se detalla la estructura de carpetas y los archivos principales que componen el proyecto.

---

## 📂 **Estructura de Carpetas**

### **commands** 📜
Contiene todos los comandos del bot, organizados por categorías para mantener el proyecto ordenado. Ejemplos de categorías:
- `canvas` - para la creación de citas cuando alguien ponga una frase digna
- `clima`   - obtener el clima de una ciudad
- `encuesta` - crear encuestas
- `info` - comando para mostrar todos los comandos disponibles
- `juegos` - actualmente solo esta disponible el blackjack, el 2048 va en proceso
- `mentadas` - recordarle a alguien muy preciado a la comunidad
- `musica`  - chulada de libreria
- `random` - comandos que involucren el azar
- `recordatorio` - recordarle a alguien algo
- `gifs` - buscar gifs en KLIPY sobre ciertos temas

### **config** ⚙️
Contiene la configuración de eventos relacionados con `Distube`, el paquete que maneja la música. Aquí se gestionan los eventos y las respuestas que el bot enviará al servidor de Discord.

### **controllers** 🎮
Contiene los controladores para aquellos comandos que interactúan con la base de datos.

### **database** 💾
Configuración para la conexión con la base de datos MySQL utilizando el ORM **Sequelize**.

### **events** 🔔
- **client**: Eventos propios del bot. Por ejemplo, cuando el bot inicia sesión, se ejecuta el archivo `ready.js`.
- **guild**: Eventos relacionados con la actividad de los miembros del servidor, como cuando alguien envía o elimina un mensaje.

### **handlers** 🔧
Gestiona la carga y ejecución de todos los eventos del bot.

### **models** 🗂️
Define los modelos de las "tablas" de la base de datos, incluyendo:
- Contadores de mentadas.
- Recordatorios de usuarios.
- Progreso del año en curso.

---

## 📝 **Archivos Principales**

- **`index.js`**: El archivo principal donde se inicializa y configura el bot.
- **`server.js`**: Un servidor en **Express** que permite mantener el bot activo 24/7.

---

## 🎵 **Cuando la música no suena**

Todo YouTube pasa por **yt-dlp** (`config/youtubePlugin.js`), porque los scrapers
que trae `@distube/youtube` se rompen cada vez que YouTube cambia su HTML.

Lo primero, siempre:

```bash
npm run musica:diagnostico            # o: npm run musica:diagnostico -- una canción
```

Recorre la misma cadena que el comando `!play` (buscar → sacar la URL del audio →
leerla con ffmpeg) y dice en qué paso se rompe. Según lo que salga:

| Síntoma | Causa | Qué hacer |
|---|---|---|
| Falla el paso 2 o 3 | yt-dlp desactualizado; YouTube cambió algo | `npm run ytdlp:update` con el bot detenido |
| Paso 3 con **HTTP 403** | YouTube bloquea la IP del servidor | Define `YTDLP_COOKIES` o `YTDLP_PROXY` en el `.env` |
| Todo OK pero no se oye nada | Conexión de voz (UDP), no YouTube | Revisa el firewall (UDP saliente) y el permiso de *Hablar* |

El bloqueo por IP es lo típico en un VPS: YouTube marca los rangos de los centros
de datos. Se resuelve exportando las cookies de una sesión de YouTube en formato
Netscape y apuntando `YTDLP_COOKIES` al archivo. Todas las variables están
documentadas en `.env.example`.

Para ver la línea exacta de ffmpeg y los logs internos de DisTube, pon
`DISTUBE_DEBUG=1` en el `.env`.

---