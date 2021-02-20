module.exports = {
    name: "RNG",
    description: "This is a Random Number Generator command!",
    execute(message, args, Discord, Colours) {
        let EmojiArray = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
        let blessRNG = "https://pbs.twimg.com/media/C3ttW_bVUAQWKvH.jpg"
        const GetRNG = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const embed = new Discord.MessageEmbed()
        .setTitle("🎲 Random Number Generator 🎲")
        //if no field given then send an embed indicating that at least one arg should be given 
        //if 1 arg is given min == 0 and max is args[0]
        //if 2 arg is given min == args[0] and max is args[1]
        if (!args[0]) {
            embed.setDescription("No minimum and/or maximum value input. Please give a valid whole number as a secondary command, following the format: %rng Min-int Max-int")
            .addField("**Command Interaction**", "If only 1 integer is provided, the minimum value is defaulted to 0 while the maximum value takes the given value" + "\n" + "If 2 integers are provided, the first number will be the minimum value while the second value becomes the maximum value")
            .setThumbnail(blessRNG)
            .setColor(Colours.blue_dark)
            .setFooter("Bless RNGesus!")
            .setTimestamp()

            message.channel.send(embed);
        } else if (args[0] && !args[1]) {
            //ensure that input is a whole integer
            if (Number.isInteger(Number(args[0]))) {
                let Rando = GetRNG(0, Number(args[0])).toString();
                let NumberArray = [];
                for (const No of Rando) {
                    NumberArray.push(EmojiArray[0]);
                }

                embed.setDescription(`**Min Value: 0  Max Value: ${args[0]} \n Generated: \n${NumberArray.join('')}**`)
                .setThumbnail(blessRNG)
                .setColor(Colours.blue_dark)
                .setTimestamp()
                .setFooter(`Generated random number from 0 to ${args[0]}...`)
                message.channel.send(embed).then (AniEmbed => {
                    let NewEmbed = new Discord.MessageEmbed()
                    for (let i = 1; i < Rando.length + 1; i++) {
                        NumberArray[NumberArray.length - i] = EmojiArray[Rando[Rando.length - i]]

                        NewEmbed.setTitle("🎲 Random Number Generator 🎲")
                        .setDescription(`**Min Value: 0  Max Value: ${args[0]} \n Generated: \n${NumberArray.join('')}**`)
                        .setThumbnail(blessRNG)
                        .setColor(Colours.blue_dark)
                        .setFooter(`Generated random number from 0 to ${args[0]}...`)
                        .setTimestamp()
                        AniEmbed.edit(NewEmbed)
                    }
                })
            } else {
                embed.setDescription("Secondary input was not a proper integer, please input a proper integer in the following format: %rng int")
                .setThumbnail(blessRNG)
                .setColor(Colours.blue_dark)
                .setFooter("Bless RNGesus!")
                .setTimestamp()
                message.channel.send(embed);
            }
        } else if (args[0] && args[1]) {
            //ensure that inputs are whole integers
            if (Number.isInteger(Number(args[0])) && Number.isInteger(Number(args[1]))) {
                //after int check, ensure that min value is lesser than max value
                if (Number(args[0]) < Number(args[1])) {
                let Rando = GetRNG(Number(args[0]), Number(args[1])).toString();
                let NumberArray = [];
                for (const No of Rando) {
                    NumberArray.push(EmojiArray[0]);
                }
                embed.setDescription(`**Min Value: ${args[0]}  Max Value: ${args[1]} \n Generated: \n${NumberArray.join('')}**`)
                .setThumbnail(blessRNG)
                .setColor(Colours.blue_dark)
                .setTimestamp()
                .setFooter(`Generated random number from ${args[0]} to ${args[1]}...`)
                message.channel.send(embed).then (AniEmbed => {
                    let NewEmbed = new Discord.MessageEmbed()
                    for (let i = 1; i < Rando.length + 1; i++) {
                        NumberArray[NumberArray.length - i] = EmojiArray[Rando[Rando.length - i]]

                        NewEmbed.setTitle("🎲 Random Number Generator 🎲")
                        .setDescription(`**Min Value: ${args[0]}  Max Value: ${args[1]} \n Generated: \n${NumberArray.join('')}**`)
                        .setThumbnail(blessRNG)
                        .setColor(Colours.blue_dark)
                        .setTimestamp()
                        .setFooter(`Generated random number from ${args[0]} to ${args[1]}...`)
                        AniEmbed.edit(NewEmbed)
                    }
                })
                } else {
                    //error for min being greater than or equal to max
                    embed.setDescription("The minimum value inputted is larger than the the maximum value, please give proper inputs in following the format: %rng Min-int Max-int, with the minimum value being smaller than the maximum value")
                    .setThumbnail(blessRNG)
                    .setColor(Colours.blue_dark)
                    .setFooter("Bless RNGesus!")
                    .setTimestamp()
                    message.channel.send(embed);
                }
            } else {
                embed.setDescription("Some of the inputs are not proper integers, please input a proper integer in the following format: %rng int")
                .setThumbnail(blessRNG)
                .setColor(Colours.blue_dark)
                .setFooter("Bless RNGesus!")
                .setTimestamp()
                message.channel.send(embed);
            }
        }
    }
}