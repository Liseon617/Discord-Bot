const Discord = require("discord.js")
const fs = require('fs');
const {
    Client,
    Attachment
} = require("discord.js");
const {
    prefix,
    token
} = require("./config.json");
const Colours = require("./colours.json")
const deck = require('./deck.js');
let Deck = new deck()
const {
    totalmem, platform
} = require("os");
const bot = new Client();
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const {ChartJSNodeCanvas } = require('chartjs-node-canvas')

const { cpuUsage } = require("process");

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}

const DateTimeFormat = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
});

bot.on("ready", () => {
    console.log("This bot is online!");
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity("Knack II", {
        type: "PLAYING"
    }).catch(console.error);
    //bot.user.setAvatar("https://cdn.discordapp.com/attachments/387944458575937558/792025609575858226/unknown.jpeg")
    bot.user.setPresence({activity: {name: "Knack II", type: "PLAYING"}, status: "dnd"})
});

bot.on("guildMemberAdd", member => {
    const channel = member.guild.channels.cache.find(channel => channel.name === "discord-bot-test");
    if (!channel) return;

    channel.send(`Welcome , ${member}, to ${member.guild.name}`);
});

/*bot.on("guildMemberSpeaking", (member, speaking) => {
    const channel = member.guild.channels.cache.find(channel => channel.name === "discord-bot-test");
    if (!channel) return console.log("fuck");
    if (speaking) {
        channel.send(`SHUT UP @${member}`)
    }
    else {
        channel.send(`DON'T SHUT UP @${member}`)
    }
})*/

/*bot.on("typingStart", function (channel, user) {
    console.log(`${user.username} has started typing`);
    if (user.id === "181384538310705152" || "192882928554868747") {
        user.send(`Fuck you , ${user.username}`);
    }
    else
        user.send(`Have fun , ${user.username}`);
});*/

bot.on("message", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
    const command = args.shift();
    //let args = message.content.toLowerCase().slice(prefix.length).split(" ");

    if (command === "ping") {
        bot.commands.get('ping').execute(message, args);
    } else if (command === "website") {
        bot.commands.get('website').execute(message, args);
    } else if (command === "info") {
        if (args[0] === "version") {
            bot.commands.get('version').execute(message, args, Discord);
        } else if (args[0] === "server") {
            bot.commands.get('server').execute(message, args, Discord, DateTimeFormat, Colours);
        } else if (args[0] === "user") {
            bot.commands.get('user').execute(message, args, Discord, DateTimeFormat);
        } else if (args[0] === "members") {
            bot.commands.get('members').execute(message, args, Discord);
        } else {
            bot.commands.get('invalid').execute(message, args);
        }
    } else if (command === "play") {
        if (args[0] === "commands") {
            //bot.commands.get('play-commands').execute(message, args, Deck, Discord);
        } else if (args[0] === "blackjack") {
            bot.commands.get('blackjack').execute(message, args, Deck, Discord);
        } else if (args[0] === "baccarat") {
            bot.commands.get('baccarat').execute(message, args, Deck, Discord);
        } else if (args[0] === "minesweeper") {
            bot.commands.get('minesweeper').execute(message, args);
        } else if (args[0] === "2048") {
            bot.commands.get('2048').execute(message, args, Discord, Colours);
        } else if (args[0] === "tictactoe") {
            bot.commands.get('tictactoe').execute(message, args, Discord, Colours); 
        } else if (args[0] === "coinflip") {
            bot.commands.get('coinflip').execute(message, args, Discord, Colours);
        } else if (args[0] === "rps") {
            //bot.commands.get('rockpaperscissors').execute(message, args, Discord, Colours);

            
        } else if (args[0] === "chess") {
            //bot.commands.get('chess').execute(message, args, Discord, Colours);
        } else if (args[0] === "othello") {
            bot.commands.get('othello').execute(message, args, Discord, Colours);
        } else if (args[0] === "dice") {
            bot.commands.get('dice').execute(message, args, Discord, Colours);
        } else {
            bot.commands.get('invalid').execute(message, args);
        }
    } else if (command === "rng") {
        bot.commands.get('RNG').execute(message, args, Discord, Colours);
    } else if (command === "anime") {
        bot.commands.get('anime').execute(message, args, Discord, puppeteer, fs, Colours);
    } else if (command === "covid-19") {
        bot.commands.get('covid-19').execute(message, args, Discord, puppeteer, fs, Colours);
    } else if (command === "news") {
        bot.commands.get('news').execute(message, args, Discord, Colours, fetch);
    } else if (command === "poll") {
        //bot.commands.get('poll').execute(message, args, Discord, Colours);
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
                    //create chart with options and votes
                    const width = 800;
                    const height = 600;
                    /*const chartCallback = (ChartJS) => {
                        ChartJS.plugins.register({
                            beforeDraw: (chartInstance) => {
                            const { chart } = chartInstance
                            const { ctx } = chart
                            ctx.fillStyle = 'white'
                            ctx.fillRect(0, 0, chart.width, chart.height)
                            },
                        })
                    }*/

                    collector.on('collect', (reaction, user) => {
                        let Optionvotes = [];
                        optionEmoji.forEach(function (x) {
                            Optionvotes.push(embedReact.reactions.cache.filter(a => a.emoji.name == x).map(reactn => reactn.count)[0]);
                        })
                        const canvas = new ChartJSNodeCanvas (
                            {width: width,
                            height: height}
                            //chartCallback
                        )
                        const configuration = {
                            type: 'bar',
                            data : {
                                labels: options,
                                datasets: [
                                        {
                                        label: "Poll options",
                                        data: Optionvotes, 
                                        backgroundColor: Colours.blue_light
                                    },
                                ],
                            },
                        }
                        const image = canvas.renderToBuffer(configuration)
                        const attachment = new Discord.MessageAttachment (image)
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
                            .attachFiles(attachment)
                            //add chart
                        embedReact.edit(awaitReact)
                    })

                    collector.on('remove', (reaction, user) => {
                        let Optionvotes = [];
                        optionEmoji.forEach(function (x) {
                            Optionvotes.push(embedReact.reactions.cache.filter(a => a.emoji.name == x).map(reactn => reactn.count)[0]);
                        })
                        const canvas = new ChartJSNodeCanvas (
                            {width: width,
                            height: height}
                            //chartCallback
                        )
                        const configuration = {
                            type: 'bar',
                            data : {
                                labels: options,
                                datasets: [
                                        {
                                        label: "Poll options",
                                        data: Optionvotes, 
                                        backgroundColor: Colours.blue_light
                                    },
                                ],
                            },
                        }
                        const image = canvas.renderToBuffer(configuration)
                        const attachment = new Discord.MessageAttachment (image)
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
                            .attachFiles(attachment)
                            //add chart
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
    } else if (command === "clear") {
        bot.commands.get('clear').execute(message, args);
    } else if (command === "prune") {
        bot.commands.get('prune').execute(message, args);
    } else if (command === 'test') {

    } else {
        message.channel.send("Invalid Argument");
    }
});

bot.login(token);