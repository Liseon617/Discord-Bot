module.exports = {
    name: "chess",
    description: "This is a chess command!",
    execute(message, args) {
        message.channel.send("pong!");
    }
}