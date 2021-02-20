module.exports = {
    name: "baccarat",
    description: "This is a baccarat command!",
    execute(message, args, Deck, Discord) {
        Deck.generate_deck();
        Deck.shuffle();

        Deck.Playerdeal(2);

        let playerCard = []
        let playerSuit = []
        let playerValue = []
        for (let p = 0; p < Deck.playerCards.length; p++) {
            playerCard.push(Deck.playerCards[p][1])
            playerSuit.push(Deck.playerCards[p][2])
            playerValue.push(Deck.playerCards[p][3])
        }

        Deck.Botdeal(2)

        let botCard = []
        let botSuit = []
        let botValue = []
        for (let b = 0; b < Deck.botCards.length; b++) {
            botCard.push(Deck.botCards[b][1])
            botSuit.push(Deck.botCards[b][2])
            botValue.push(Deck.botCards[b][3])
        }
         
        let totalValue = (x) => x.reduce(function (a, b) {
            return Number(a) + Number(b);
        });

        function ArrayShow(givenArray) {
            var input = ""
            for (let i = 0; i < givenArray.length; i++) {
                input += " " + givenArray[i]
            }
            return input
        }

        function Acecheck(givenArray, givenValue) {
            for (let i = 0; i < givenArray.length; i++) {
                if (givenArray[i] === '🇦' && givenValue[i] === '11') {
                    givenValue[i] = '1';
                }
            }
        }

        function botHit() {
            Deck.Botdeal(1)
            for (let b = 0; b < Deck.botCards.length; b++) {
                botCard.push(Deck.botCards[b][1])
                botSuit.push(Deck.botCards[b][2])
                botValue.push(Deck.botCards[b][3])
                Acecheck(botCard, botValue)
            }
        }
        
        function playerHit() {
            Deck.Playerdeal(1)
            for (let p = 0; p < Deck.playerCards.length; p++) {
                playerCard.push(Deck.playerCards[p][1])
                playerSuit.push(Deck.playerCards[p][2])
                playerValue.push(Deck.playerCards[p][3])
            }
            Acecheck(playerCard, playerValue);
        }

        let embed = new Discord.MessageEmbed()
        embed.setTitle("Baccarat") 
        .setDescription(`**🤖 Bot's Hand | Value: ❓**\n ❓ ❓ \n ❓ ❓\n👤 **${message.author.username}'s Hand | Value: ❓**\n ❓ ❓\n ❓ ❓`)

        /*if (totalValue(playerValue).toString()[1] == 8 || totalValue(playerValue).toString()[1] == 9) {
            //player wins
        } else if (totalValue(botValue).toString()[1] == 8 || totalValue(botValue).toString()[1] == 9){
            //bot wins
        } */
        message.channel.send(embed).then(embdReact => {
        embdReact.react('🤖');
        embdReact.react('⚖️');
        embdReact.react('👤');
        
        let Newembed = new Discord.MessageEmbed()

        function toHit(value, hitFunc){
            let hitCount = 0
            do {
                hitFunc()
                hitCount++
            } while (hitCount < 1 && Number(Number(totalValue(value).toString()[1])) <= 5)
        }

        const filter = function (reaction, user) {
            return ['🤖', '⚖️', '👤'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        const collector = embdReact.createReactionCollector(filter);
        
        collector.on('collect', (reaction, user) => {
            reaction.users.remove(user.id);// remove the reaction
            const chosen = {"reaction" : reaction.emoji.name, "choice" : (reaction.emoji.name == '🤖') ? "Bot" : ((reaction.emoji.name == '⚖️') ? "Tie" : "Player")}
            if (user.id === message.author.id && reaction.emoji.name === '🤖' || reaction.emoji.name === '⚖️' || reaction.emoji.name === '👤') {
                
                if (Number(totalValue(playerValue).toString()[1]) >= 8 || Number(totalValue(botValue).toString()[1] >= 8)) {
                    //check for draw where both got 9
                    if (totalValue(playerValue).toString()[1] == totalValue(botValue).toString()[1]){
                        if (chosen.reaction == '⚖️'){
                            //player won
                            Newembed.setTitle("🃏Baccarat🃏")
                            Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                            Newembed.addField("**Result Summary:**", "**Player Won!** \nOutcome: Tie \n Chosen: " + `${chosen.choice}`)
                            embdReact.edit(Newembed)
                            collector.stop()
                        }
                        else {
                            //player lose
                            Newembed.setTitle("🃏Baccarat🃏")
                            Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                            Newembed.addField("**Result Summary:**", "**Player Lost!** \nOutcome: Tie \n Chosen: " + `${chosen.choice}`)
                            embdReact.edit(Newembed)
                            collector.stop()
                        }
                    }  else if (Number(totalValue(playerValue).toString()[1]) > Number(totalValue(botValue).toString()[1])) {//check whose higher 
                        if (chosen.reaction == '👤') {
                            Newembed.setTitle("🃏Baccarat🃏")
                            Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                            Newembed.addField("**Result Summary:**", "**Player Won!** \nOutcome: Player \n Chosen: " + `${chosen.choice}`)
                            embdReact.edit(Newembed)
                            collector.stop()
                        } else {
                            Newembed.setTitle("🃏Baccarat🃏")
                            Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                            Newembed.addField("**Result Summary:**", "**Player Lost!** \nOutcome: Player \n Chosen: " + `${chosen.choice}`)
                            embdReact.edit(Newembed)
                            collector.stop()
                        }
                    } else if (Number(totalValue(botValue).toString()[1]) > Number(totalValue(playerValue).toString()[1])) {
                        if (chosen.reaction == '🤖') {
                            Newembed.setTitle("🃏Baccarat🃏")
                            Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                            Newembed.addField("**Result Summary:**", "**Player Won!** \nOutcome: Bot \n Chosen: " + `${chosen.choice}`)
                            embdReact.edit(Newembed)
                            collector.stop()
                        } else {
                            Newembed.setTitle("🃏Baccarat🃏")
                            Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                            Newembed.addField("**Result Summary:**", "**Player Lost!** \nOutcome: Bot \n Chosen: " + `${chosen.choice}`)
                            embdReact.edit(Newembed)
                            collector.stop()
                        }
                    }
                } else if (Number(totalValue(playerValue).toString()[1]) < 8 || Number(totalValue(botValue).toString()[1]) < 8) {
                    toHit(playerValue, playerHit)
                    toHit(botValue, botHit)
                        if (totalValue(playerValue).toString()[1] == totalValue(botValue).toString()[1]){
                            if (chosen.reaction == '⚖️'){
                                //player won
                                Newembed.setTitle("🃏Baccarat🃏")
                                Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                                Newembed.addField("**Result Summary:**", "**Player Won!** \nOutcome: Tie \n Chosen: " + `${chosen.choice}`)
                                embdReact.edit(Newembed)
                                collector.stop()
                            }
                            else {
                                //player lose
                                Newembed.setTitle("🃏Baccarat🃏")
                                Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                                Newembed.addField("**Result Summary:**", "**Player Lost!** \nOutcome: Tie \n Chosen: " + `${chosen.choice}`)
                                embdReact.edit(Newembed)
                                collector.stop()
                            }
                        }  else if (Number(totalValue(playerValue).toString()[1]) > Number(totalValue(botValue).toString()[1])) {//check whose higher 
                            if (chosen.reaction == '👤') {
                                Newembed.setTitle("🃏Baccarat🃏")
                                Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                                Newembed.addField("**Result Summary:**", "**Player Won!** \nOutcome: Player \n Chosen: " + `${chosen.choice}`)
                                embdReact.edit(Newembed)
                                collector.stop()
                            } else {
                                Newembed.setTitle("🃏Baccarat🃏")
                                Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                                Newembed.addField("**Result Summary:**", "**Player Lost!** \nOutcome: Player \n Chosen: " + `${chosen.choice}`)
                                embdReact.edit(Newembed)
                                collector.stop()
                            }
                        } else if (Number(totalValue(botValue).toString()[1]) > Number(totalValue(playerValue).toString()[1])) {
                            if (chosen.reaction == '🤖') {
                                Newembed.setTitle("🃏Baccarat🃏")
                                Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                                Newembed.addField("**Result Summary:**", "**Player Won!** \nOutcome: Bot \n Chosen: " + `${chosen.choice}`)
                                embdReact.edit(Newembed)
                                collector.stop()
                            } else {
                                Newembed.setTitle("🃏Baccarat🃏")
                                Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue).toString()[1]}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue).toString()[1]}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                                Newembed.addField("**Result Summary:**", "**Player Lost!** \nOutcome: Bot \n Chosen: " + `${chosen.choice}`)
                                embdReact.edit(Newembed)
                                collector.stop()
                            }
                        }
                    }
                }
            })
        })
    }
}