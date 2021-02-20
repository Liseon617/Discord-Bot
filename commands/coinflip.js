module.exports = {
    name: "coinflip",
    description: "This is a coinflip command!",
    execute(message, args, Discord, Colours) {
        if (args[1] && (args[1].toLowerCase() == "heads" || args[1].toLowerCase() == "tails")){
            const coinFlip =  Math.floor(Math.random() * (2));
            const coinSide = coinFlip ? "heads" : "tails"; //tails = 0; heads = 1
            let coinSides = ["https://gitlab.com/mikk.villem/simple-coin-toss-heads-or-tails/-/raw/master/assets/Coin_T.png", "https://gitlab.com/mikk.villem/simple-coin-toss-heads-or-tails/-/raw/master/assets/Coin_H.png"]
            const embed = new Discord.MessageEmbed()
            .setTitle("💰 Coinflip 💰")
            .setThumbnail("https://www.mikkvillem.com/images/Coin_anim_H-02.gif")
            .setColor(Colours.blue_dark)
            .setFooter("Bless RNGesus!")
            .setTimestamp()
            if (args[1].toLowerCase() == coinSide){
                //win coinflip
                embed.setDescription(`**Winning Side: ${coinSide.toUpperCase()}\nYour Choice: ${args[1].toUpperCase()}**`)
                embed.addField("**Results:**", "**COINFLIP WON.** Noice but the through prize are the friendships made along the way!")
                .setImage(coinSides[coinFlip])

            } else {
                //lost coinflip
                embed.setDescription(`**Winning Side: ${coinSide.toUpperCase()}\nYour Choice: ${args[1].toUpperCase()}**`)
                embed.addField("**Results:**", "**COINFLIP LOST.** Sucks that you can't even win a 50-50, better luck next time!")
                .setImage(coinSides[coinFlip])
            }
            message.channel.send(embed);
        } else {
            message.channel.send("Coinflip failed. Please input a valid secondary command to indicate chosen side (%play coinflip heads or tails)");
        }
    }
}