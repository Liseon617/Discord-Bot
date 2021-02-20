module.exports = {
    name: "play-commands",
    description: "This is a play-commands command!",
    execute(message, args) {
        message.channel.send("pong!");
    }
}