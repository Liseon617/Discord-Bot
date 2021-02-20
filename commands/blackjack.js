module.exports = {
    name: "blackjack",
    description: "This is a blackjack command!",
    execute(message, args, Deck, Discord) {
        Deck.generate_deck();
        Deck.shuffle();

        Deck.Playerdeal(2)

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
            if (totalValue(givenValue) > 21) {
                for (let i = 0; i < givenArray.length; i++) {
                    if (givenArray[i] === '🇦' && givenValue[i] === '11') {
                        givenValue[i] = '1';
                    }
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
        if (totalValue(playerValue) === 21) {
            embed.setTitle("🃏Blackjack🃏")
            embed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue)}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue)}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)

            embed.addField("**Result:**", "You Win")
        } else if (totalValue(botValue) === 21) {
            embed.setTitle("🃏Blackjack🃏")
            embed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue)}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue)}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)

            embed.addField("**Result:**", "You Lose")
        } else {
            embed.setTitle("🃏Blackjack🃏")
            embed.setDescription(`**🤖 Bot's Hand | Value: ${botValue[0]}**\n ${botCard[0]} ❓ \n ${botSuit[0]} ❓\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue)}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)


            message.channel.send(embed).then(embdReact => {
                embdReact.react('👍');
                embdReact.react('👎');
                let Newembed = new Discord.MessageEmbed()

                while (totalValue(botValue) < 17) {
                    botHit();
                }

                const filter = function (reaction, user) {
                    return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                const collector = embdReact.createReactionCollector(filter);

                collector.on('collect', (reaction, user) => {

                    reaction.users.remove(user.id);
                    // remove the reaction
                    if (reaction.emoji.name === '👍' && user.id === message.author.id) {
                        // your code
                        playerHit();
                        //edit embed
                        Newembed.setTitle("🃏Blackjack🃏")
                        Newembed.setDescription(`🤖 **Bot's Hand | Value: ${botValue[0]}**\n ${botCard[0]} ❓ \n ${botSuit[0]} ❓\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue)}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)

                        embdReact.edit(Newembed)
                    }
                    if ((reaction.emoji.name === '👎' && user.id === message.author.id) || totalValue(playerValue) >= 21) {
                        // your code
                        if (totalValue(botValue) > 21 && totalValue(playerValue) > 21) {
                            //ties
                            Newembed.setTitle("🃏Blackjack🃏")
                            Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue)}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue)}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                            Newembed.addField("**Result:**", "Tie")
                            embdReact.edit(Newembed)

                        } else if (totalValue(botValue) > totalValue(playerValue)) {
                            if (totalValue(botValue) > 21) {
                                //bot loses
                                Newembed.setTitle("🃏Blackjack🃏")
                                Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue)}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue)}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                                Newembed.addField("**Result:**", "Player Wins")
                                embdReact.edit(Newembed)

                            } else if (totalValue(botValue) <= 21) {
                                //bot wins
                                Newembed.setTitle("🃏Blackjack🃏")
                                Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue)}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue)}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                                Newembed.addField("**Result:**", "Bot Win")
                                embdReact.edit(Newembed)
                            }
                        } else if (totalValue(botValue) < totalValue(playerValue)) {
                            if (totalValue(playerValue) > 21) {
                                //player loses
                                Newembed.setTitle("🃏Blackjack🃏")
                                Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue)}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue)}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                                Newembed.addField("**Result:**", "Bot Wins")
                                embdReact.edit(Newembed)
                            } else if (totalValue(playerValue) <= 21) {
                                //player wins
                                Newembed.setTitle("🃏Blackjack🃏")
                                Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue)}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue)}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                                Newembed.addField("**Result:**", "Player Wins")
                                embdReact.edit(Newembed)
                            }
                        } else if (totalValue(botValue) === totalValue(playerValue)) {
                            //ties
                            Newembed.setTitle("🃏Blackjack🃏")
                            Newembed.setDescription(`🤖 **Bot's Hand | Value: ${totalValue(botValue)}**\n ${ArrayShow(botCard)} \n ${ArrayShow(botSuit)}\n👤 **${message.author.username}'s Hand | Value: ${totalValue(playerValue)}**\n${ArrayShow(playerCard)} \n ${ArrayShow(playerSuit)}`)
                            Newembed.addField("**Result:**", "Tie")
                            embdReact.edit(Newembed)
                        }
                        collector.stop(); //stop the game
                    }
                })
            })
        }
    }
}