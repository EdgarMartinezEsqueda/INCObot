module.exports = async (client,  userStates, message) => {
    const images = [
        "https://scontent.fgdl14-1.fna.fbcdn.net/v/t1.6435-9/40484279_466330137213593_2540222282249273344_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=iYLmGWWInQ8AX9mOyLT&_nc_ht=scontent.fgdl14-1.fna&oh=00_AfAbnpruRErVc5XYFVoOtP2irp95jPNqNH3AnSDtVibRhQ&oe=6521A6A6",
        "https://i.pinimg.com/originals/fb/e2/f3/fbe2f31edcf006afa50a3c3b950553ad.jpg",
        "https://images3.memedroid.com/images/UPLOADED355/607743e627991.jpeg",
        "https://i.pinimg.com/564x/71/71/c0/7171c0817a43567a9dfdf7135ac8abea.jpg"
    ]
    const random = Math.floor( Math.random() * images.length );
	message.reply( images[random] );
};
