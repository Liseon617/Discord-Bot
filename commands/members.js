module.exports = {
    name: "members",
    description: "This is a members command!",
    execute(message, args, Discord) {

        //get user activities; accomodate users that are not doing anything at the moment
        function UserActivies(activities) {
            if (activities[0] === undefined) {
                return "Touching his penis"
            } else {
                return `${activities[0].type}  "${activities[0]}"`
            }
        }

        const embed = new Discord.MessageEmbed()

            .setTitle("Members' Information")
            .setThumbnail(message.guild.iconURL({
                format: 'png',
                dynamic: true,
                size: 1024
            }))
            //{ format: 'png', dynamic: true, size: 1024 }
            .setAuthor(`${message.guild.name} Members' Information`, message.guild.iconURL())
            .setFooter("suck my pp")
            .setTimestamp()
            .setColor(message.member.displayHexColor)

        //list.members.forEach(member => console.log(member.user.username));
        //message.guild.members.cache.forEach(function (x) { console.log(x.user.username); })
        //message.guild.members.cache.forEach(function (x) { message.channel.send(x.user.username); })

        const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'voice');
        let count = 0;
        for (const [id, voiceChannel] of voiceChannels) {
            if (voiceChannel.members.size > 0) {
                embed.addField("**Voice Channel**", voiceChannel.name, false)
                voiceChannel.members.forEach(function (x) {
                    embed.addFields({
                        name: "**Member**",
                        value: x.user.username,
                        inline: true
                    }, {
                        name: "**Member's Activities**",
                        value: UserActivies(x.presence.activities),
                        inline: true
                    }, {
                        name: '\u200b',
                        value: '\u200b',
                        inline: true
                    })
                })
            }
            count += voiceChannel.members.size; // count members in voice channels
            //console.log(voiceChannel.)
            //console.log(message.guild.member(get(id)).user.username);
        }
        embed.addField("**Live Member Count**", count)
        message.channel.send(embed);
    }
}