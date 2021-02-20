module.exports = {
    name: "version",
    description: "This is a version command!",
    execute(message, args, Discord) {
        message.channel.send("Version " + Discord.version);
    }
}