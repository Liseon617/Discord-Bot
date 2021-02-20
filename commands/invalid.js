module.exports = {
    name: "invalid",
    description: "This is an invalid command!",
    execute(message, args) {
        message.channel.send("Please give a valid secondary command");
    }
}