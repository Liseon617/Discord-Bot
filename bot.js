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
        } else if (args[0] === "sudoku") {
            //bot.commands.get('sudoku').execute(message, args, Discord, Colours);
            //args[1] for easy medium or hard or very hard
            class Board {
                constructor (digits,
                    rows,
                    cols,
                    squares,
                    units,
                    sqaure_unit_map,
                    sqaure_peers_map,
                    min_givens,
                    nr_square,
                    difficulty)
            }
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
        bot.commands.get('poll').execute(message, args, Discord, Colours);
    } else if (command === "clear") {
        bot.commands.get('clear').execute(message, args);
    } else if (command === "prune") {
        bot.commands.get('prune').execute(message, args);
    } else if (command === "pandacon") {
        //bot.commands.get('pandacon').execute(message, args);
        /*const writeStream = fs.createWriteStream("restaurants.csv")
        WriteStream.write ('Restaurants\n')

        (async() => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`https://www.instagram.com/pandaconnoisseur/`, {
                withUntil: "networkidle2"
            });
            await page.waitForSelector('input[name="username"]');
            await page.type('input[name="username"]', 'blzl.l.gtsj@gmail.com');
            await page.type('input[name="password"]', 'T0020212B')
            await page.click('button[type="submit"]');
        })*/
    } else if (command === 'test') {

    } else {
        message.channel.send("Invalid Argument");
    }
});

bot.login(token);