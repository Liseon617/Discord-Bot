module.exports = {
    name: "server",
    description: "This is a server command!",
    execute(message, args, Discord, DateTimeFormat, Colours) {
        //count the number of channels; used for both voice and text channels
        function ChannelCount(x, type) {
            var TextchannelList = [];
            var VoicechannelList = [];
            var i = 0;

            x.forEach(function (key, value) {
                if (type === "Text") { //check for text channels
                    if (message.guild.channels.cache.get(value).type === "text") {
                        TextchannelList.push(value);
                    }
                }
                if (type === "Voice") { //check for vocie channels
                    if (message.guild.channels.cache.get(value).type === "voice") {
                        VoicechannelList.push(value);
                    }
                    return VoicechannelList.length;
                }
            })
            if (type === "Text") {
                return TextchannelList.length;
            }
            if (type === "Voice") {
                return VoicechannelList.length;
            }
        }

        const embed = new Discord.MessageEmbed()
            .setTitle("Server's Information")
            .setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }))
            //{ format: 'png', dynamic: true, size: 1024 }
            .setAuthor(`${message.guild.name} Information`, message.guild.iconURL())
            .addFields(
                { name: "**Server name**", value: `${message.guild.name}`, inline: true },
                { name: "**Channel name**", value: `${message.channel.name}(${message.channel.type} channel)`, inline: true },
                { name: "**Server Owner**", value: `${message.guild.owner.displayName}`, inline: true },
                { name: "**Member Count**", value: `${message.guild.memberCount}`, inline: true },
                { name: "**Role Count**", value: `${message.guild.roles.cache.size}`, inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: "**Text Channels**", value: `\n ${ChannelCount(message.guild.channels.cache, "Text")}`, inline: true },
                { name: "**Voice Channels**", value: `${ChannelCount(message.guild.channels.cache, "Voice")}`, inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: "**Region**", value: `${message.guild.region}`, inline: true },
                { name: "**Created At**", value: `${DateTimeFormat.format(message.guild.createdAt)}`, inline: true }
            )
            .setFooter("suck my pp")
            .setTimestamp()
            .setColor(Colours.blue_dark)
        message.channel.send(embed);
    }
}