module.exports = {
    name: "leave",
    aliases: ["salte"],
    run: async (client, message) => {
      	client.DisTube.voices.leave(message)
    }
}
