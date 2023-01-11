const express = require('express');

const server = express();

server.all("/", (req, res) => {
  res.json( { message: "Bot encendido" } );
});

function noPares(){
  server.listen( process.env.PORT, () => {
    console.log("Server listo en el puerto ", process.env.PORT);
  });
}

module.exports = noPares;