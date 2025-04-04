module.exports = async (client,  userStates, member) => {
    const images = [
        "https://pm1.aminoapps.com/6623/950f8ae66208a0afcab7bfe7374994549e9378d5_00.jpg",
        "https://i.pinimg.com/originals/fb/e2/f3/fbe2f31edcf006afa50a3c3b950553ad.jpg",
        "https://images3.memedroid.com/images/UPLOADED355/607743e627991.jpeg",
        "https://i.pinimg.com/564x/71/71/c0/7171c0817a43567a9dfdf7135ac8abea.jpg"
    ]
    const random = Math.floor( Math.random() * images.length );
    const channel = member.guild.channels.cache.find(ch => ch.name === "puros-pretextos" || ch.name === "general");
    await channel.fetch();

    channel.send( { // Mandar un mensaje de bienvenida random
        content: `Bienvenido ${member.user}!`,
        files: [images[random]]
    } );
    // Asignarle el rol de 'Estudiantes' al nuevo miembro
    await member.roles.add("Estudiantes");
};
