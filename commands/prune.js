module.exports = {
    name: "prune",
    description: "This is a prune command! It follows the format of (%prune 'valid user id' 'optional amount')",
    execute(message, args) {
        const user = args[0]; //user based on prune command format
        const FetchedMsgs = [];
        var amount = Number(args[1]) //optional amount variable

        if (!user) return message.channel.send('Must specify a user id whose messages to purge!');

        // Fetch 100 messages (will be filtered and lowered up to max amount requested)
        message.channel.messages.fetch({
            limit: 100
        }).then(messages => {
            messages.filter(m => m.author.id === user).forEach(msg => FetchedMsgs.push(msg));

            if (isNaN(amount)) {
                amount = FetchedMsgs.length
            } else {
                if (user === message.author.id) {
                    amount += 1
                }//if the author wants to delete his own messages
            }

            message.channel.bulkDelete(FetchedMsgs.slice(0, amount));
            if (FetchedMsgs.length === 0) return message.channel.send(`User "${user}" is an invalid user id, Must specify a valid user id whose messages to purge!`);

            //a small summary of the deleted messages that disappears
            message.channel.send(`${amount} of User "${user}" messages has been deleted in ${message.channel.name}`)
                .then(msg => { msg.delete({ timeout: 5000 }) })
                .catch(console.error);

        }).catch(error => console.log(error.stack));
    }
}