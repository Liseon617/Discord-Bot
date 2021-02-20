module.exports = {
    name: "dice",
    description: "This is a dice command!",
    execute(message, args, Discord, Colours) {
        if(args[1] && !isNaN(args[1])) {
            const embed = new Discord.MessageEmbed()
            .setTitle("🎲 Dice roll 🎲")
            .setThumbnail("https://thumbs.gfycat.com/SecondTartCygnet-max-1mb.gif")
            .setColor(Colours.blue_dark)
            .setFooter("Bless RNGesus!")
            .setTimestamp()
            //Number of dice used to be determined by args[1]
            const DieFace = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]
            let DiceList = "";
            let TotalValue = 0;
            for (let i = 0; i < Number(args[1]); i++) {
                let DiceNo = Math.floor(Math.random() * (6));//random numbers from 0 to 5
                DiceList += (DieFace[DiceNo] +"|");
                TotalValue += DiceNo + 1;
            }
            if (Number(args[1]) === 1)
                embed.setDescription(`${message.author.username} has decided to roll ${args[1]} die\n**Total Amount Rolled: ${TotalValue}**\n${DiceList}`)
            else
                embed.setDescription(`${message.author.username} has decided to roll ${args[1]} dice\n**Total Amount Rolled: ${TotalValue}**\n${DiceList}`)

            if(embed.description.length >= 2048 ){
                message.channel.send("The bot cannot roll that many dice at once. Please input another secondary command to indicate the amount of dice to roll (%play dice 20)");
            } else
                message.channel.send(embed);

        } else {
            message.channel.send("Please input a valid secondary command to indicate the amount of dice to roll (%play dice 20)");
        }
    }
}