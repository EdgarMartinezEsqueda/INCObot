module.exports = {
    name: "equipos",
    desc: "¿Cansado de no saber como formar equipos para la escuela? ¡Este comando te ayuda en eso!",
    run: async (client, message, args) => {
        try{
            let partes = message.content.split(" ");  //Se le hace split de los espacios
            let num = partes.pop(); // se quita el ultimo, el cual es el numero
            partes.shift(); //se quita la primera posicion es decir el comando (!equipos)
            let equipos = [];
            let loop = partes.length / num;
            for(let i = 0;  i < loop; i++){
                let aux = [];
                for(let j = 0; j < num; j++){
                    let pos = Math.floor( Math.random() * (partes.length - 0) );
                    aux.push(partes[pos]);
                    partes.splice(pos,1);
                }
                equipos.push(aux);
            }
            message.channel.send("Equipos creados");
            for(let i = 0; i < equipos.length; i ++){
                message.channel.send(`**Equipo #${i+1}**`);
                message.channel.send(`${equipos[i]}`);
            }
        }
        catch (e){
            message.channel.send(`${message.author}`,{files:["images/?.jpg"]});
        }
    }
};