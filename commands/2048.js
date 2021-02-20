module.exports = {
    name: "2048",
    description: "This is a 2048 command!",
    execute(message, args, Discord, Colours) {
        let plan = [];
        let numStartTiles = 2;
        let goal = 2048;
        let gridHeight = 4;
        let gridWidth = 4;
        let ended = false

        for (var i = 0; i < gridWidth; i++) {
            plan.push([]);
            for (var j = 0; j < gridHeight; j++) {
                plan[i][j] = 0;
            }
        }

        function addRandomTile() {
            var randomIndex, rowIndex, colIndex;
            tileContent = Math.random() > 0.3 ? 2 : 4;

            do {
                randomIndex = Math.floor(Math.random() * gridHeight * gridWidth);
                rowIndex = Math.floor(randomIndex / gridWidth);
                colIndex = randomIndex % gridHeight;
            } while (plan[rowIndex][colIndex] !== 0);

            plan[rowIndex][colIndex] = tileContent;
        }

        for (var i = 0; i < numStartTiles; i++) {
            addRandomTile();
            //checkResult();
        }

        let copyPlan = plan
        for (let y in copyPlan) {
            for (let x in copyPlan[y]) {
                if (copyPlan[y][x] == 0) {
                    copyPlan[y][x] = " ";
                }
                copyPlan[y][x] = copyPlan[y][x].toString().padStart(5, " ");
            }
        }
        let grid = copyPlan.map(c => {
            return c.join(" | ");
        }).join("\n");

        const embed = new Discord.MessageEmbed()
            .setTitle("**2️⃣0️⃣4️⃣8️⃣ GAME**")
            .setDescription("```" + grid + "```")
            .setTimestamp()
            .setColor(Colours.blue_light)

        message.channel.send(embed).then(MoveReact => {
            MoveReact.react('⬆️');
            MoveReact.react('⬇️');
            MoveReact.react('⬅️');
            MoveReact.react('➡️');
            var score = 0;
            var scoreAdd = 0;
            let Newembed = new Discord.MessageEmbed()

            function WithinBorders(x, y) {
                return (x >= 0 && y >= 0 &&
                    x < gridWidth && y < gridHeight);
            }

            function checkResult() {
                var planFull = true;
                var highestTile = 0;
                var state = -1;
                plan.forEach(function (row) {
                    row.forEach(function (val) {
                        if (val === goal) {
                            state = 1;
                            goal *= 2;
                            result(state, goal);
                        } else if (val === 0) {
                            planFull = false;
                        }
                    });
                });

                //get highest tile value
                for (var i = 0; i < gridHeight; i++) {
                    for (var j = 0; j < gridWidth; j++) {
                        highestTile = (plan[i][j] > highestTile) ? plan[i][j] : highestTile;
                    }
                }

                // Check if there are any more valable moves
                if (planFull) {
                    for (var i = 0; i < gridHeight; i++) {
                        for (var j = 0; j < gridWidth; j++) {
                            if (WithinBorders(i, j + 1) && plan[i][j] === plan[i][j + 1] ||
                                WithinBorders(i + 1, j) && plan[i][j] === plan[i + 1][j]) {
                                return;
                            }
                        }
                    }
                    //result
                    state = 0;
                    result(state, highestTile);
                }
                result(state, highestTile);
            }

            function result(state) {
                var lostMessage = "GAME OVER",
                    wonMessages = ["AWESOME", "WELL DONE", "NICE PLAY", "BRILLIANT", "GREAT", "NEAT", "RIGHT ON",
                        "FANTASTIC", "SUPERB", "EXCELLENT", "BRAVO", "CONGRATS", "WAY TO GO", "TERRIFIC"
                    ]
                copyPlan = plan
                for (let y in copyPlan) {
                    for (let x in copyPlan[y]) {
                        if (copyPlan[y][x] === 0) {
                            copyPlan[y][x] = " ";
                        }
                        copyPlan[y][x] = copyPlan[y][x].toString().padStart(5, " ");
                    }
                }
                let grid = copyPlan.map(c => {
                    return c.join(" | ");
                }).join("\n");

                //display score
                var ShowScore
                if (scoreAdd === 0)
                    ShowScore = score
                else ShowScore = score + "(+" + scoreAdd + ")";

                if (state === -1) {
                    return Newembed.setDescription("**Results**" + "\n" + "**Score: **" + ShowScore + "\n" + "```" + grid + "```")
                } else if (state === 0) {
                    return Newembed.setDescription(lostMessage + "\n" + "**Results**" + "\n" + "**Score: **" + ShowScore + "\n" + "```" + grid + "```")

                } else if (state === 1) {
                    return Newembed.setDescription(wonMessages[Math.floor(Math.random() * wonMessages.length)] + "\n" + "**Results**" + "\n" + "**Score: **" + ShowScore + "\n" + "```" + grid + "```")
                }
            }
            //directions
            function moveUp() {
                for (var col = 0; col < plan.length; col++) { // run for each column
                    for (var j = 0; j < 3; j++) { // run each column 3 times
                        for (var i = 0; i < 3; i++) { // iterate through column
                            if (plan[i][col] == 0) {
                                plan[i][col] = Number(plan[i][col]) + Number(plan[i + 1][col]);
                                plan[i + 1][col] = 0;
                            } else if (plan[i][col] == plan[i + 1][col] && plan[i][col] != 0) {
                                plan[i][col] = Number(plan[i][col]) + Number(plan[i + 1][col]);
                                plan[i + 1][col] = 0;
                                j++;
                                score += parseInt(plan[i][col]);
                                scoreAdd += parseInt(plan[i][col]);
                            }
                        }
                    }
                }
                addRandomTile();
            }

            function moveDown() {
                for (var col = 0; col < plan.length; col++) {
                    for (var j = 0; j < 3; j++) { // 3 times per column
                        for (var i = 3; i > 0; i--) { //iterate through column from bottom up
                            if (plan[i][col] == 0) {
                                plan[i][col] = Number(plan[i][col]) + Number(plan[i - 1][col]);
                                plan[i - 1][col] = 0;
                            } else if (plan[i][col] == plan[i - 1][col] && plan[i][col] != 0) {
                                plan[i][col] = Number(plan[i][col]) + Number(plan[i - 1][col]);
                                plan[i - 1][col] = 0;
                                j++;
                                score += parseInt(plan[i][col]);
                                scoreAdd += parseInt(plan[i][col]);
                            }
                        }
                    }
                }
                addRandomTile();
            }

            function moveLeft() {
                for (var row = 0; row < plan.length; row++) {
                    for (var j = 0; j < 3; j++) {
                        for (var i = 0; i < 3; i++) {
                            if (plan[row][i] == 0) {
                                plan[row][i] = Number(plan[row][i]) + Number(plan[row][i + 1]);
                                plan[row][i + 1] = 0;
                            } else if (plan[row][i] == plan[row][i + 1] && plan[row][i] != 0) {
                                plan[row][i] = Number(plan[row][i]) + Number(plan[row][i + 1]);
                                plan[row][i + 1] = 0;
                                j++;
                                score += parseInt(plan[row][i]);
                                scoreAdd += parseInt(plan[row][i]);
                            }
                        }
                    }
                }
                addRandomTile();
            }

            function moveRight() {
                for (var row = 0; row < plan.length; row++) {
                    for (var j = 0; j < 3; j++) {
                        for (var i = 3; i > 0; i--) {
                            if (plan[row][i] == 0) {
                                plan[row][i] = Number(plan[row][i]) + Number(plan[row][i - 1]);
                                plan[row][i - 1] = 0;
                            } else if (plan[row][i] == plan[row][i - 1] && plan[row][i] != 0) {
                                plan[row][i] = Number(plan[row][i]) + Number(plan[row][i - 1]);
                                plan[row][i - 1] = 0;
                                j++;
                                score += parseInt(plan[row][i]);
                                scoreAdd += parseInt(plan[row][i]);
                            }
                        }
                    }
                }
                addRandomTile();
            }

            const filter = function (reaction, user) {
                return ['⬆️', '⬇️', '⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
            }
            const collector = MoveReact.createReactionCollector(filter);

            collector.on('collect', (reaction, user) => {

                reaction.users.remove(user.id);

                if (reaction.emoji.name === '⬆️' && user.id === message.author.id) {
                    //move("up")
                    moveUp()
                    checkResult()
                    Newembed.setTitle("**2️⃣0️⃣4️⃣8️⃣ GAME**")
                    //Newembed.setDescription("```" + grid + "```")
                    Newembed.setTimestamp()
                    Newembed.setColor(Colours.blue_light)
                    MoveReact.edit(Newembed)
                    scoreAdd = 0;
                    collector.empty(); //empty  collection to prevent collector from stopping from too many emojis collected
                }
                if (reaction.emoji.name === '⬇️' && user.id === message.author.id) {
                    //move("down")
                    moveDown()
                    checkResult()
                    Newembed.setTitle("**2️⃣0️⃣4️⃣8️⃣ GAME**")
                    //Newembed.setDescription("```" + grid + "```")
                    Newembed.setTimestamp()
                    Newembed.setColor(Colours.blue_light)
                    MoveReact.edit(Newembed)
                    scoreAdd = 0;
                    collector.empty(); //empty  collection to prevent collector from stopping from too many emojis collected
                }
                if (reaction.emoji.name === '⬅️' && user.id === message.author.id) {
                    //move("left")
                    moveLeft()
                    checkResult()
                    Newembed.setTitle("**2️⃣0️⃣4️⃣8️⃣ GAME**")
                    //Newembed.setDescription("```" + grid + "```")
                    Newembed.setTimestamp()
                    Newembed.setColor(Colours.blue_light)
                    MoveReact.edit(Newembed)
                    scoreAdd = 0;
                    collector.empty(); //empty  collection to prevent collector from stopping from too many emojis collected
                }
                if (reaction.emoji.name === '➡️' && user.id === message.author.id) {
                    //move("right")
                    moveRight()
                    checkResult()
                    Newembed.setTitle("**2️⃣0️⃣4️⃣8️⃣ GAME**")
                    //Newembed.setDescription("```" + grid + "```")
                    Newembed.setTimestamp()
                    Newembed.setColor(Colours.blue_light)
                    MoveReact.edit(Newembed)
                    scoreAdd = 0;
                    collector.empty(); //empty  collection to prevent collector from stopping from too many emojis collected
                }
            });
        });
    }
}