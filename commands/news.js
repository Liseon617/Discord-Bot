module.exports = {
    name: "news",
    description: "This is a news command that shows news from not more than a month ago",
    execute(message, args, Discord, Colours, fetch) {
        let APIkey = "5c5cb111110c4a08a243d5a5d1a4cdaf";
        let country = "sg";
        let countryList = 
        ["ar", "au", "at", "be", "br", "bg", "ca", "cn", "co", "cu", "cz", "eg", "fr", "de", "ge", "hk", "hu", "in", "id", "ie", "il", "it", "jp", "lv", "lt", "my" , "mx", "ma", "nl", "nz", "ng", "no", "ph", "pl", "pt", "ro", "ru", "sa", "rs", "sg", "sk", "si", "za", "kr", "se", "ch", "tw", "th", "tr", "ae", "ua", "gb", "us", "ve"]
        let topic = "";
        
        if (args[0] && countryList.includes(args[0].toLowerCase())) {
            country = args[0].toLowerCase()
        }
        if (args[1]) {
            topic += "&q=" + args[1].toLowerCase()
        }
        const url = `https://newsapi.org/v2/top-headlines?country=${country}${topic}&apiKey=${APIkey}`
        fetch(url).then(res=> {
            return res.json()
        }).then((data) => {
            //console.log(data)
            let formatURL = (url) => url.substring(url.indexOf("https"))
            let formatDis = (display) => display == null ? "" : display
            let arrLength = data.articles.length;
            let pageCounter = 0
            let embed = new Discord.MessageEmbed()
            .setTitle(formatDis(data.articles[pageCounter].title))
            .setURL(formatURL(formatDis(data.articles[pageCounter].url)))
            .setAuthor("Source: " + formatDis(data.articles[pageCounter].source.name))
            .setDescription(formatDis(data.articles[pageCounter].description) + `\n\n **Page ${pageCounter + 1}/${arrLength}**`)
            .setThumbnail(formatURL(formatDis(data.articles[pageCounter].urlToImage)))
            .setTimestamp(formatDis(data.articles[pageCounter].publishedAt))
            .setColor(Colours.cyan)
            .setFooter(`powered by NewsAPI.org`)
            message.channel.send(embed).then(embedMessage => {
                embedMessage.react('◀️')
                embedMessage.react('▶️')
                const filter = function (reaction, user) {
                    return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === message.author.id
                };
                const collector = embedMessage.createReactionCollector(filter);

                collector.on('collect', (reaction, user) => {

                    reaction.users.remove(user.id);
                    let NewEmbed = new Discord.MessageEmbed()
                    if (reaction.emoji.name === '◀️' && user.id === message.author.id && pageCounter > 0) {
                        pageCounter -= 1
                        NewEmbed.setTitle(formatDis(data.articles[pageCounter].title))
                        .setURL(formatURL(formatDis(data.articles[pageCounter].url)))
                        .setAuthor("Source: " + formatDis(data.articles[pageCounter].source.name))
                        .setDescription(formatDis(data.articles[pageCounter].description) + `\n\n **Page ${pageCounter + 1}/${arrLength}**`)
                        .setThumbnail(formatURL(formatDis(data.articles[pageCounter].urlToImage)))
                        .setTimestamp(formatDis(data.articles[pageCounter].publishedAt))
                        .setColor(Colours.cyan)
                        .setFooter(`powered by NewsAPI.org`)
                        embedMessage.edit(NewEmbed)

                    } 
                    if (reaction.emoji.name === '▶️' && user.id === message.author.id && pageCounter < arrLength - 1) {
                        pageCounter +=  1
                        NewEmbed.setTitle(formatDis(data.articles[pageCounter].title))
                        .setURL(formatURL(formatDis(data.articles[pageCounter].url)))
                        .setAuthor("Source: " + formatDis(data.articles[pageCounter].source.name))
                        .setDescription(formatDis(data.articles[pageCounter].description) + `\n\n **Page ${pageCounter + 1}/${arrLength}**`)
                        .setThumbnail(formatURL(formatDis(data.articles[pageCounter].urlToImage)))
                        .setTimestamp(formatDis(data.articles[pageCounter].publishedAt))
                        .setColor(Colours.cyan)
                        .setFooter(`powered by NewsAPI.org`)
                        embedMessage.edit(NewEmbed)
                    }
                })
            })
        }).catch((error) => {
            let errorEmbed = new Discord.embedMessage()
            .setTitle("**:x: Something failed along the way!**")
            .setDescription(`The default country of news is Singapore, while inputting invalid countries will default country to Singapore\nCommand Format: %news <country(optional)> <topic(optional)>\nValid Countries:${countryList}`)
            message.channel.send(errorEmbed)
            console.log(error)
        })
    }
}