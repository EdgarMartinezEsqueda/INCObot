const fs = require('fs');

module.exports = ( client ) => {
    try{
        let comandos = 0;
        fs.readdirSync("./commands/").forEach( directory =>{
            const commands = fs.readdirSync(`./commands/${directory}/`).filter( file => file.endsWith(".js"));
            for(let file of commands){
                let command = require(`../commands/${directory}/${file}`);
                if( command.name ){
                    client.commands.set(command.name, command);
                    comandos++;
                }
                else
                    console.log(`Command ${command.name} does not exist`);
                if ( command.aliases && Array.isArray(command.aliases) )
                    command.aliases.forEach( alias  => client.aliases.set(alias, command.name) );
            }
        });
        console.log(`Loaded ${comandos} commands`);
    }
    catch(err){
        console.log(err);
    }
}
