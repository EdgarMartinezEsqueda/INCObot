module.exports = async (client,  userStates, message) => {
    const images = [
        "https://plantillasdememes.com/img/plantillas/pluto-muerto-y-mickey-mouse-llorando01576572909.jpg",
        "https://i.postimg.cc/nzpLnhgL/317648644-207491841668668-7552572720474324509-n.jpg",
        "https://i.postimg.cc/HsHF375n/276111087-1892508040950442-5144807186762423371-n.jpg"
    ]
    const random = Math.floor( Math.random() * images.length );
	message.reply( images[random] );
};
