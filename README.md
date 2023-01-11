# INCObot

Las carpetas tienen lo siguiente:

- **commands**: Todos los comandos que obtendrá el bot, los dividí en carpetas para no tener todo desordenado.
- **config**: Conexión a la base de datos en MongoDB, por si deseara reactivar los comandos con contadores.
- **events**: 
- - client: eventos propios del bot, cuando inicie sesión por ejemplo se ejecutará el archivo 'ready.js'.
- - guild: todos los eventos que realicen los miembros del servidor, hasta ahora tengo 2, cuando alguien escriba y cuando alguien borre un mensaje.
- **handlers**: Pa' que cargue todos los eventos.

Los demás archivos son:
- index.js: creación de todo esto, lo principal.
- server.js: un servidor en Express para mantener 24/7 este bot.