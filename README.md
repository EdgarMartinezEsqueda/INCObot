# INCObot

Las carpetas tienen lo siguiente:

- **commands**: Todos los comandos que obtendrá el bot, los dividí en carpetas (info, mentadas, musica, random y tenor) para no tener todo desordenado.
- **config**: Los eventos de Distube, el paquete que controla todo lo referente a la música, ahi se agregan los eventos y lo que retorna al servidor de Discord.
- **controllers**: Los controladores para los comandos que involucren algo relacionado con una DB.
- **database**: La conexión a MongoDB mediante el ORM Sequelize.
- **events**: 
- - client: eventos propios del bot, cuando inicie sesión por ejemplo se ejecutará el archivo 'ready.js'.
- - guild: todos los eventos que realicen los miembros del servidor, hasta ahora tengo 2, cuando alguien escriba y cuando alguien borre un mensaje.
- **handlers**: Pa' que cargue todos los eventos.
- **models**: El modelo de las 'tablas' de la DB, aunque como se usa NOSQL más bien sería: El modelado de las colecciones de datos (?)

Los demás archivos son:
- index.js: creación de todo esto, lo principal.
- server.js: un servidor en Express para mantener 24/7 este bot.