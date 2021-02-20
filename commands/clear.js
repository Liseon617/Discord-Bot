module.exports = {
    name: "clear",
    description: "This is a clear command!",
    execute(message, args) {
        if (!args[0]) return message.reply("please state the number of message to be cleared")
        const amount = Number(args[0]) + 1;
        message.channel.bulkDelete(amount);
        //a small summary of the deleted messages that disappears
        message.channel.send(`${args[0]} messages has been deleted in ${message.channel.name}`)
            .then(msg => { msg.delete({ timeout: 5000 }) })
            .catch(console.error);
    }
}