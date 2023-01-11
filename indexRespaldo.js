require('dotenv').config();
const Discord = require("discord.js");
const noPares = require("./server.js");
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://".concat(process.env.USUARIO).concat(":").concat(process.env.CONTRA).concat("@cluster0.gwpid.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

const client = new Discord.Client();

const Tenor = require("tenorjs").client({
    "Key": process.env['APITENOR'], // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});    

let vecesCTMC = 0, vecesPRO = 0, vecesHoracio = 0, vecesCTMPro = 0;

let tagAlBot = [`<- Este wey le escribió a un Bot <:KEKW:815733223149010964>`, `¿Por que le hablas a un bot? <:o_:887001307444023367> `, `¿Por que estas tan obsesionado conmigo? <:REEeee:901173179106623538>`, `¿Estás consciente que solo soy un bot, cierto? <:o_:887001307444023367>`, `No se que quieres pero si quieres que haga algo usa un comando 👍`, `Debes estar desesperado como para hablarle a un bot`];

let respuestasLOL = [`Cuidado, ahí viene el MALANDR♿`, `Abranle paso al PARK♿UR`, `¿Alguien dijo lolsito? <:TFT:814009993157541928>`, `lolsito???`, `Hola gamer, juguemos League of Legends`, `¿lolsito? Ni idea de que es eso. Perdon por andar ocupado leyendo Tux, ¿Héroe o Villano? del maestro Horacio Gomez. Casi no me queda tiempo para preocuparme por cosas irrelevantes que no dejan volar mi imaginación como los libros. <:EZ:901173179882565703> 🍷`, `https://enportada.cl/wp-content/uploads/2021/01/129777541_1001070707082796_3087180726802880299_n.jpg`, `https://pbs.twimg.com/media/E1wr5VkWUAUD4Gx?format=jpg&name=medium`, `https://i.imgur.com/a4Hb1Id.jpg`, `https://scontent.fgdl5-3.fna.fbcdn.net/v/t1.6435-9/82414362_2901614076536059_8291604488582594560_n.jpg?stp=cp0_dst-jpg_e15_fr_q65&_nc_cat=106&ccb=1-7&_nc_sid=2d5d41&efg=eyJpIjoidCJ9&_nc_ohc=XT3rUj11KXgAX-WVxee&_nc_ht=scontent.fgdl5-3.fna&oh=00_AT9spoTYi5SdX8QQnRfzb4zfL1RltZxWTjD4AoekinY6Qg&oe=636B0711`, `https://images7.memedroid.com/images/UPLOADED910/61dcad8897745.jpeg`, `https://images7.memedroid.com/images/UPLOADED889/5ee44276d7b6c.jpeg`, `https://images7.memedroid.com/images/UPLOADED908/634464da8dc6b.webp`];

const respuestasMaicra = [`https://pbs.twimg.com/media/E-4tZBiXEAIc5HH?format=jpg`, `https://scontent.fgdl5-1.fna.fbcdn.net/v/t1.6435-9/133668663_2586958651595153_1967801021403527009_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=uqIe16pfrO8AX-M6MWO&_nc_ht=scontent.fgdl5-1.fna&oh=00_AT_nETgu2GhScfsKT_wQxm1cJoYYaQQjueQBJD0SsCxoeQ&oe=6364B771`, `https://img.ifunny.co/images/f8aa32faa118f039f7dc1060c8438daba958bf9bd36ba415e799cbd143993d89_1.webp`]

MongoClient.connect(uri, (err,db) => {
    if (err) throw err;
    db.db("mentadas").collection("todas").find({}).toArray( (err, result) => {
        if (err) throw err;
        vecesCTMC = result[ 0 ].cornejo;
        vecesPRO = result[ 0 ].pro;
        vecesHoracio = result[ 0 ].horacio;
        vecesCTMPro = result[ 0 ].ctmpro;
        console.log(result);
    })
});

client.on("message", msg => {
  //Cuando alguien mencione 'lolsito'
  if(msg.content.toLowerCase().includes("lolsito")){
    n = Math.floor(( Math.random() * (respuestasLOL.length) ) );
    msg.channel.send(respuestasLOL[n]); 
  }
  //Cuando alguien mencione 'maicra'
  else if(msg.content.toLowerCase().includes("maicra")){
    n = Math.floor(( Math.random() * (respuestasMaicra.length) ) );
    msg.channel.send(respuestasMaicra[n]); 
  }
  //Cuando alguien mencione 'Halo'
  else if(msg.content.toLowerCase().includes("halo")){
    msg.channel.send(`Uff retas de Halo a las 6 de la mañana <:PHP:787130988152094720>`); 
  }
  //Si alguien tagea al bot
  else if (msg.mentions.has(client.user) ) {
    n = Math.floor(( Math.random() * (tagAlBot.length) ) );
    msg.channel.send(`${msg.author}, ${tagAlBot[n]}`);
  }
  //comando !equipos <usuarios> <cantidad de miembros>
  //comandos individuales, o simples
  switch (msg.content){
    case  "!cornejo":
      vecesCTMC++;
      MongoClient.connect(uri, (err,db) => {
    if (err) throw err; 
        db.db("mentadas").collection("todas").updateOne({_id : {$eq:1}}, {$set: {cornejo: vecesCTMC}}); 
        msg.channel.send(`Chinga tu madre Cornejo! <:REEeee:901173179106623538> \nCornejo ha chingado a su madre ${vecesCTMC} veces <:prolog:896153967044739184> \nY de una vez tú también ${msg.author} <:kk:786772794389168140>`);
      });
      break;
    case  "!horacio":
      vecesHoracio++;
      MongoClient.connect(uri, (err,db) => {
    if (err) throw err; 
        db.db("mentadas").collection("todas").updateOne({_id : {$eq:1}}, {$set: {horacio: vecesHoracio}}); 
        msg.channel.send(`Chinga tu madre Horacio! <:REEeee:901173179106623538> \nHoracio ha chingado a su madre ${vecesHoracio} veces <:linux:821495324149415946> `);
      });
      break;
    case  "!ctmpro":
      vecesCTMPro++;
      MongoClient.connect(uri, (err,db) => {
    if (err) throw err; 
        db.db("mentadas").collection("todas").updateOne({_id : {$eq:1}}, {$set: {ctmpro: vecesCTMPro}}); 
        msg.channel.send(`Chinga tu madre PRO! <:REEeee:901173179106623538> \nEl PRO ha chingado a su madre ${vecesCTMPro} veces <:pront:888504671470252083> `);
      });
      break;
    case "!pro":
      vecesPRO++;
      MongoClient.connect(uri, (err,db) => {
    if (err) throw err; 
        db.db("mentadas").collection("todas").updateOne({_id : {$eq:1}}, {$set: {pro: vecesPRO}}); 
        msg.channel.send(`Eso está PRO 😎\nRoberto a dicho PRO ${vecesPRO} veces`); 
      });
      break;
  }
});

client.on('ready', () =>{
  console.log(`Logeado como ${client.user.tag}!`);client.user.setActivity('hacerme pendejo', { type: 'PLAYING' })
});

client.login(process.env['TOKEN']);

noPares();