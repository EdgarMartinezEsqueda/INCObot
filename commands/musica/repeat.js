const modos = {
  'no' : 0,
  'song' : 1,
  'queue' : 2
};

module.exports = {
  name: 'repeat',
  aliases: ['loop', 'rp'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.DisTube.getQueue(message)
    if (!queue)
      return message.channel.send(`No hay nada wey, que repetimos?`);
    let mode = modos[ args[0].toLowerCase() ];
    mode = queue.setRepeatMode(mode);
    mode = mode ? (mode === 2 ? 'Repetir TODAS las canciones' : 'Repetir CANCIÖN') : 'NO';
    return message.channel.send(`🔁 Modo repetir | \`${mode}\``);
  }
}
