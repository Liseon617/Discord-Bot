module.exports = {
    name: "poll",
    description: "This is a poll command!",
    execute(message, args, Discord, Colours) {
        const embed = new Discord.MessageEmbed()

            .setTitle("How to Initiate Poll")
            .setDescription('(%poll "<subject>", "<option 1>", "<option 2>" ...) to initiate poll for subject, with options following')
            .setColor(Colours.green_dark)

        if (!args[0]) {
            message.channel.send(embed)
        } else if (args[0]) {
            try {
                function findContent(poll) {

                    let open = false;
                    let string = "";
                    let source = "";
                    let contents = [];

                    poll.forEach(i => source += i + " ")


                    for (const e in source) {

                        if (source[e] == '"')
                            open = !open;

                        // If the current string is open and the actual char is not "
                        // Then concatenate the char
                        if (open && (source[e] != '"'))
                            string += source[e];

                        // If the current string is not empty
                        // Then add the string to the contents array and clear the string
                        else if (string != "") {
                            contents.push(string);
                            string = "";
                        }
                    }

                    // If the string is still open
                    // Then the source is invalid
                    if (open)
                        throw new Error("ErrorOpen");

                    let title = contents[0];
                    contents.shift();
                    let options = contents;

                    return [title, options]; //get title and options of poll
                }

                // Take a number from one to ten and returns the corresponding discord emote
                // The returned emote is the string name, does not work if you try to add it has a reaction
                function numberToEmote(number) {

                    let emote;

                    switch (number) {

                        case 1:
                            emote = "1️⃣";
                            break;
                        case 2:
                            emote = "2️⃣";
                            break;
                        case 3:
                            emote = "3️⃣";
                            break;
                        case 4:
                            emote = "4️⃣";
                            break;
                        case 5:
                            emote = "5️⃣";
                            break;
                        case 6:
                            emote = "6️⃣";
                            break;
                        case 7:
                            emote = "7️⃣";
                            break;
                        case 8:
                            emote = "8️⃣";
                            break;
                        case 9:
                            emote = "9️⃣";
                            break;
                        case 10:
                            emote = "🔟";
                            break;
                        default:
                            throw new Error("UnknowEmote : The number sent to the numberToEmote method reached the limit. THIS SHOULD NOT HAPPEN");
                    }

                    return emote;
                }

                let [title, options] = findContent(args)

                let pollOptions = []
                for (let o = 0; o < options.length; o++) {
                    pollOptions.push(numberToEmote(o + 1) + " " + options[o]);
                }

                if (options.length > 10) {
                    message.reply("You have provided more than 10 options, please create a new poll with lesser options")
                } else {
                    let embedPoll = new Discord.MessageEmbed()
                        .setTitle("📋 **New Poll**")
                        .setDescription(title)
                        .addFields({
                            name: "**Creator**",
                            value: message.author.username,
                            inline: true
                        }, {
                            name: "**Instructions**",
                            value: "React accordingly to vote",
                            inline: true
                        }, {
                            name: "**Options**",
                            value: pollOptions,
                            inline: false
                        })
                        .setTimestamp()
                        .setColor(Colours.blue_light)

                    message.channel.send(embedPoll).then(embedReact => {
                        let optionEmoji = []
                        for (let opt = 0; opt < options.length; opt++) {
                            embedReact.react(numberToEmote(opt + 1));
                            optionEmoji.push(numberToEmote(opt + 1));
                        }
                        const filter = function (reaction, user) {
                            return optionEmoji.includes(reaction.emoji.name) && user.id != "737604119535288350";
                        };

                        const collector = embedReact.createReactionCollector(filter, {dispose: true});

                        function onlyUnique(value, index, self) {
                            return self.indexOf(value) === index;
                        }

                        let voters = [];

                        collector.on('collect', (reaction, user) => {

                            function totalVote() {
                                let totalVote = 0
                                optionEmoji.forEach(function (x) {
                                    totalVote += embedReact.reactions.cache.filter(a => a.emoji.name == x).map(reactn => reactn.count)[0];
                                })

                                return totalVote
                            }

                            function winner() {
                                let votes = [];
                                optionEmoji.forEach(function (x) {
                                    votes.push(embedReact.reactions.cache.filter(a => a.emoji.name == x).map(reactn => reactn.count)[0]);
                                })


                                var indexes = [];
                                var Tie = [];

                                for (i = 0; i < votes.length; i++) {
                                    if (votes[i] === Math.max(...votes))
                                        indexes.push(i);
                                }
                                if (indexes.length >= 2) {

                                    for (let x = 0; x < indexes.length; x++) {
                                        Tie.push(options[indexes[x]]);
                                    }
                                    return `Tie between ${Tie}`
                                } else {
                                    var winner = votes.indexOf(Math.max(...votes));

                                    return options[winner]
                                }
                            }
                            voters.push(user.username);
                            var UniqueVoters = voters.filter(onlyUnique);
                            //console.log(reaction.count)

                            let awaitReact = new Discord.MessageEmbed()
                                .setTitle("📋 **New Poll**")
                                .setDescription(title)
                                .addFields({
                                    name: "**Creator**",
                                    value: message.author.username,
                                    inline: true
                                }, {
                                    name: "**Instructions**",
                                    value: "React accordingly to vote",
                                    inline: true
                                }, {
                                    name: "**Options**",
                                    value: pollOptions,
                                    inline: false
                                })
                                .setTimestamp()
                                .setColor(Colours.blue_light)
                                .addField(`**Votes: ** ${totalVote() - options.length}`, `**Voters: ** ${UniqueVoters}`)
                                .addField(`**Winner(s): ** ${winner()}`, '\u200B')
                            embedReact.edit(awaitReact)
                        })

                        collector.on('remove', (reaction, user) => {
                            
                            function totalVote() {
                                let totalVote = 0
                                optionEmoji.forEach(function (x) {
                                    totalVote += embedReact.reactions.cache.filter(a => a.emoji.name == x).map(reactn => reactn.count)[0];
                                })

                                return totalVote
                            }

                            function winner() {
                                let votes = [];
                                optionEmoji.forEach(function (x) {
                                    votes.push(embedReact.reactions.cache.filter(a => a.emoji.name == x).map(reactn => reactn.count)[0]);
                                })


                                var indexes = [];
                                var Tie = [];

                                for (i = 0; i < votes.length; i++) {
                                    if (votes[i] === Math.max(...votes))
                                        indexes.push(i);
                                }
                                if (indexes.length >= 2) {

                                    for (let x = 0; x < indexes.length; x++) {
                                        Tie.push(options[indexes[x]]);
                                    }
                                    return `Tie between ${Tie}`
                                } else {
                                    var winner = votes.indexOf(Math.max(...votes));

                                    return options[winner]
                                }
                            }
                            voters.push(user.username);
                            var UniqueVoters = voters.filter(onlyUnique);
                            //console.log(reaction.count)

                            let awaitReact = new Discord.MessageEmbed()
                                .setTitle("📋 **New Poll**")
                                .setDescription(title)
                                .addFields({
                                    name: "**Creator**",
                                    value: message.author.username,
                                    inline: true
                                }, {
                                    name: "**Instructions**",
                                    value: "React accordingly to vote",
                                    inline: true
                                }, {
                                    name: "**Options**",
                                    value: pollOptions,
                                    inline: false
                                })
                                .setTimestamp()
                                .setColor(Colours.blue_light)
                                .addField(`**Votes: ** ${totalVote() - options.length}`, `**Voters: ** ${UniqueVoters}`)
                                .addField(`**Winner(s): ** ${winner()}`, '\u200B')
                            embedReact.edit(awaitReact)
                        })
                    });
                }
                message.delete(message, {
                    time: 2000
                })
            } catch(err) {
            message.channel.send('Use the "%poll" command to understand how the function works')
            .then(message.delete(message, {time: 2000}))
            } 
        }
    }
}