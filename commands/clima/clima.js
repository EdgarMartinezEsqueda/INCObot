const fetch = require("node-fetch");
const { EmbedBuilder } = require('discord.js');

let opcionesClima = {
    Clouds: "Nublado",
    Clear: "Despejado",
    Rain: "Lluvia",
    Drizzle: "Llovizna",
    Thunderstorm: "Tormenta Eléctrica",
    Mist: "Neblina",
    Fog: "Niebla",
    Squall: "Chubasco"
};
let opcionesNublado = {
    "few clouds": "Algunas nubes: 11 - 25%",
    "scattered clouds:": "Nubes dispersas: 25 - 50%",
    "broken clouds": "Nubes entrecortadas: 50 - 84%",
    "overcast clouds": "Nublado: 85 - 100%"
};

module.exports = {
    name: "clima",
    aliases: ["temperatura", "temp"],
    desc: "Obtenrr el clima de algún lugar",
    run: async (client, message, args) => {
        
        if( args.length > 0 ){
            let location = args.join(" ");
            try{
                let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env['APICLIMA']}&units=metric`);
                let data = await response.json();
                
                if( data.cod == "404" )
                    return message.channel.send(`Se mas especifico con el lugar, no encontré nada en esta API 😢`);
                
                let description = data.weather[0].main === "Clouds" 
                    ? opcionesNublado[data.weather[0].description] 
                    : opcionesClima[data.weather[0].main];
                                
                const Embed = new EmbedBuilder()
                    .setTitle(`Clima en ${location}`)
                    .setDescription( description )
                    .addFields(
                        { name: "Temperatura", value: data.main.temp + "°C", inline: true },
                        { name: "Humedad", value: data.main.humidity + "%", inline: true},
                    )
                    .setThumbnail(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
                    .setColor('#48555a');
                
                message.channel.send( { embeds: [Embed] } );
            } catch(e){
                message.channel.send(`Ha surgido un error al obtener los datos del clima ${e}`);
            }
        }
        else
            return message.channel.send(`Tienes que poner algún lugar, wey`);
    }
};