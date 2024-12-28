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
- `tenor` - buscar gifs en Tenor sobre ciertos temas

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