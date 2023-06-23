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
    "scattered clouds": "Nubes dispersas: 25 - 50%",
    "broken clouds": "Nubes entrecortadas: 50 - 84%",
    "overcast clouds": "Nublado: 85 - 100%"
};

function getColorCode(number) {
    const hue = 210 - ((number / 50) * 210); //obtener el valor del numero, 0 -> azul y 210 -> rojo
    const rgb = hslToRgb(hue / 360, 1, 0.5); //valor normalizado del valor, una saturación de 1 y una luminosidad de 0.5
    return rgb.map(component => Math.round(component * 255));   // redondear cada valor en un rango de 0 a 255
}

function hslToRgb(h, s, l) {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue2rgb = (p, q, t) => {  //conversión a RGB
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    return [
        hue2rgb(p, q, h + 1 / 3),
        hue2rgb(p, q, h),
        hue2rgb(p, q, h - 1 / 3)
    ];
}

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
                
                const color = getColorCode( data.main.temp );

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