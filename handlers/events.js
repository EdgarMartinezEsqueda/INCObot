const fs = require('fs');
const events = [];

module.exports = ( client, userStates ) => {
    let eventsN = 0;
    const loadEvents = dir => {
        const files = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));
        for(let file of files){
            const evt = require(`../events/${dir}/${file}`);
            let eName = file.split('.')[0];
            client.on( eName, evt.bind( null, client, userStates ) );
            events.push(eName);
            eventsN++;
        }
    };
    ["client", "guild"].forEach( e => loadEvents(e) );
    console.log(`Loaded ${eventsN} events`);
};