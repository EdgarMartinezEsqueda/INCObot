const fetch = require("node-fetch");
const { EmbedBuilder } = require('discord.js');

const opcionesClima = {
    Clouds: "Nublado",
    Clear: "Despejado",
    Rain: "Lluvia",
    Drizzle: "Llovizna",
    Thunderstorm: "Tormenta Eléctrica",
    Mist: "Neblina",
    Fog: "Niebla",
    Squall: "Chubasco"
};
const opcionesNublado = {
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
            const location = args.join(" ");
            try{
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env['APICLIMA']}&units=metric`);
                const data = await response.json();
                
                if( data.cod == "404" )
                    return message.channel.send(`Se mas especifico con el lugar, no encontré nada en esta API 😢`);
                
                const description = data.weather[0].main === "Clouds" 
                    ? opcionesNublado[data.weather[0].description] 
                    : opcionesClima[data.weather[0].main];
                
                const hue = (data.main.temp / 50) * 240; // Calculate the hue value based on the number
                const saturation = 100; // Set a constant saturation value
                const lightness = 50; // Set a constant lightness value

                const convertedHue = Math.floor((hue / 360) * 255); // Convert the hue value to RGB range (0-255)
                const convertedSaturation = Math.floor((saturation / 100) * 255); // Convert the saturation value to RGB range (0-255)
                const convertedLightness = Math.floor((lightness / 100) * 255); // Convert the lightness value to RGB range (0-255)

                const rgbColor = `rgb(${convertedHue}, ${convertedSaturation}, ${convertedLightness})`; // Create an RGB color string

                const color = "#" + ((1 << 24) + (convertedHue << 16) + (convertedSaturation << 8) + convertedLightness).toString(16).slice(1); // Convert the color to HEX format

                const Embed = new EmbedBuilder()
                    .setTitle(`Clima en ${location}`)
                    .setDescription( description )
                    .addFields(
                        { name: "Temperatura", value: data.main.temp + "°C", inline: true },
                        { name: "Humedad", value: data.main.humidity + "%", inline: true},
                    )
                    .setThumbnail(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
                    .setColor( color );
                
                message.channel.send( { embeds: [Embed] } );
            } catch(e){
                message.channel.send(`Ha surgido un error al obtener los datos del clima ${e}`);
            }
        }
        else
            return message.channel.send(`Tienes que poner algún lugar, wey`);
    }
};