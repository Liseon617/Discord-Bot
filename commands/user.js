module.exports = {
    name: "user",
    description: "This is a user command!",
    execute(message, args, Discord, DateTimeFormat) {
        //check nickname; return "no nickname" if none is found
        function nickName() {
            if (message.member.nickname === undefined || message.member.nickname === null) {
                return "No Nickname";
            }
            else
                return message.member.nickname
        }

        //get user activities; accomodate users that are not doing anything at the moment
        function UserActivies() {
            if (message.author.presence.activities[0] === undefined) {
                return "Touching his penis"
            }
            else {
                return `${message.author.presence.activities[0].type}  "${message.author.presence.activities[0]}"`
            }
        }
        //get the voice channel that the user is in
        function GetVc() {
            var vc
            const constant = vc
            const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'voice');
            for (const [id, voiceChannel] of voiceChannels) {
                voiceChannel.members.forEach(function (x) {
                    if (x.user.id === message.author.id) {
                        vc = `Currently in ${voiceChannel.name}`;
                    }
                })
            }
            if (vc !== constant) {
                return vc;
            }
            else {
                return "in the bathroom";
            }
        }

        const embed = new Discord.MessageEmbed()

            .setTitle("User's Information")
            .setThumbnail(message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
            //{ format: 'png', dynamic: true, size: 1024 }
            .setAuthor(`${message.author.username} Information`, message.author.displayAvatarURL())
            .addFields(
                { name: "**Username**", value: `${message.author.username}`, inline: true },
                { name: "**Discriminator**", value: "#" + `${message.author.discriminator}`, inline: true },
                { name: "**ID**", value: `${message.author.id}`, inline: true },
                { name: "**Status**", value: `${message.author.presence.status}`, inline: true },
                { name: "**Nickname**", value: nickName(), inline: true },
                { name: "**Created At**", value: `${DateTimeFormat.format(message.author.createdAt)}`, inline: true },
                { name: "**Activity**", value: UserActivies(), inline: true },
                { name: "**Voice Channel**", value: GetVc(), inline: true },
                { name: "**User's Role(s)**", value: `${message.member.roles.cache.map(role => role.name).join(", ")}`, inline: false }
            )
            .setFooter("suck my pp")
            .setTimestamp()
            .setColor(message.member.displayHexColor)
        message.channel.send(embed);
    }
}