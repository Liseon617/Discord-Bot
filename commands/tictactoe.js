module.exports = {
    name: "tictactoe",
    description: "This is a tic tac toe command! It uses a minimax algorithm alongside alpha-beta pruning to work while being most efficient.",
    execute(message, args, Discord, Colours) {
        var searchTimes = new Array();
        class Board {
            //initialising the board
            constructor(state = ["", "", "","", "", "","", "", ""]){
                this.state = state;
            }
            //logs a visualized board with the current state of the board
            printedFormatBoard() {
                let formattedString = "";
                this.state.forEach((cell, index) => {
                    formattedString += cell ? `\u2004\u2004${cell}\u2004\u2004|` : "\u2004\u2004\u2004\u2004\u2004|";
                    if ((index + 1) % 3 === 0) {
                        formattedString = formattedString.slice(0,-1);
                        if (index < 8)
                            formattedString += "\n\u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014\n";
                    }
                });
                return "`" + formattedString + "`";
            }

            //check if board has no symbols yet
            isEmpty(){
                return this.state.every(cell => !cell);
            }
            //check if board has no spaces available
            isFull(){
                return this.state.every(cell => cell);
            }

            insert(symbol, position) {
                if (![0, 1, 2, 3, 4, 5, 6, 7, 8].includes(position)){
                    throw new Error("cell index does not exist!")
                }
                if (!["X", "O"].includes(symbol)) {
                    throw new Error('The symbol can only be x or o!')
                }
                if(this.state[position]) {
                    return false;
                }
                this.state[position] = symbol;
                return true;
            }

            getAvailableMoves(){
                const moves = [];
                this.state.forEach((cell, index) => {
                    if (!cell) moves.push(index);
                })
                return moves
            }
            //check if any player won
            isTerminal() {
                //Return False if board in empty
                if (this.isEmpty()) return false;
                //Checking Horizontal Wins
                if (this.state[0] === this.state[1] && this.state[0] === this.state[2] && this.state[0]) {
                    return { winner: this.state[0], direction: "row 1" };
                }
                if (this.state[3] === this.state[4] && this.state[3] === this.state[5] && this.state[3]) {
                    return { winner: this.state[3], direction: "row 2"};
                }
                if (this.state[6] === this.state[7] && this.state[6] === this.state[8] && this.state[6]) {
                    return { winner: this.state[6], direction: "row 3" };
                }

                //Checking Vertical Wins
                if (this.state[0] === this.state[3] && this.state[0] === this.state[6] && this.state[0]) {
                    return { winner: this.state[0], direction: "column 1" };
                }
                if (this.state[1] === this.state[4] && this.state[1] === this.state[7] && this.state[1]) {
                    return { winner: this.state[1], direction: "column 2" };
                }
                if (this.state[2] === this.state[5] && this.state[2] === this.state[8] && this.state[2]) {
                    return { winner: this.state[2], direction: "column 3" };
                }

                //Checking Diagonal Wins
                if (this.state[0] === this.state[4] && this.state[0] === this.state[8] && this.state[0]) {
                    return { winner: this.state[0], direction: "main diagonal" };
                }
                if (this.state[2] === this.state[4] && this.state[2] === this.state[6] && this.state[2]) {
                    return { winner: this.state[2], direction: "counter diagonal" };
                }

                //If no winner but the board is full, then it's a draw
                if (this.isFull()) {
                    return { winner: "draw" };
                }

                //return false otherwise
                return false;
            }
        }
        
        class Player {
            constructor(maxDepth = -1) {
                this.maxDepth = maxDepth;
                this.nodesMap = new Map();
            }
            getBestMove(board, maximizing = true, callback = () => {}, depth = 0, alpha = -Infinity, beta = +Infinity) {
                //clear nodesMap if the function is called for a new move
                //get computational time
                var start, end, time;
                start = new Date().getTime() / 1000;

                if (depth == 0) this.nodesMap.clear();
                //If the board state is a terminal one, return the heuristic value
                if (board.isTerminal() || depth === this.maxDepth) {
                    if (board.isTerminal().winner === "X") {
                        return 100 - depth;
                    } else if (board.isTerminal().winner === "O") {
                        return -100 + depth;
                    }
                    return 0;
                }
                if (maximizing) {
                    //Initialize best to the lowest possible value
                    let best = -100;
                    //Loop through all empty cells
                    board.getAvailableMoves().forEach(index => {
                        //Initialize a new board with a copy of our current state
                        const child = new Board([...board.state]);
                        //Create a child node by inserting the maximizing symbol x into the current empty cell
                        child.insert("X", index);
                        //Recursively calling getBestMove this time with the new board and minimizing turn and incrementing the depth
                        const nodeValue = this.getBestMove(child, false, callback, depth + 1, alpha, beta);
                        //Updating best value
                        best = Math.max(best, nodeValue);
                        alpha = Math.max(alpha, nodeValue);
                        if (beta <= alpha){
                            return alpha;
                        }
                        //If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
                        if (depth == 0) {
                            //Comma separated indices if multiple moves have the same heuristic value
                            const moves = this.nodesMap.has(nodeValue)
                                ? `${this.nodesMap.get(nodeValue)},${index}`
                                : index;
                            this.nodesMap.set(nodeValue, moves);
                        }
                    });
                    //If it's the main call, return the index of the best move or a random index if multiple indices have the same value
                    if (depth == 0) {
                        let returnValue;
                        if (typeof this.nodesMap.get(best) == "string") {
                            const arr = this.nodesMap.get(best).split(",");
                            const rand = Math.floor(Math.random() * arr.length);
                            returnValue = arr[rand];
                        } else {
                            returnValue = this.nodesMap.get(best);
                        }
                        //run a callback after calculation and return the index
                        callback(returnValue);
                        return returnValue;
                    }
                    //If not main call (recursive) return the heuristic value for next calculation
                    return best;
                }

                if (!maximizing) {
                    //Initialize best to the highest possible value
                    let best = 100;
                    //Loop through all empty cells
                    board.getAvailableMoves().forEach(index => {
                        //Initialize a new board with a copy of our current state
                        const child = new Board([...board.state]);

                        //Create a child node by inserting the minimizing symbol o into the current empty cell
                        child.insert("O", index);

                        //Recursively calling getBestMove this time with the new board and maximizing turn and incrementing the depth
                        let nodeValue = this.getBestMove(child, true, callback, depth + 1, alpha, beta);
                        //Updating best value
                        best = Math.min(best, nodeValue);
                        beta = Math.min(beta, nodeValue)
                        if (beta <= alpha){
                            return beta;
                        }
                        //If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
                        if (depth == 0) {
                            //Comma separated indices if multiple moves have the same heuristic value
                            const moves = this.nodesMap.has(nodeValue)
                                ? this.nodesMap.get(nodeValue) + "," + index
                                : index;
                            this.nodesMap.set(nodeValue, moves);
                        }
                    });
                    //If it's the main call, return the index of the best move or a random index if multiple indices have the same value
                    if (depth == 0) {
                        let returnValue;
                        if (typeof this.nodesMap.get(best) == "string") {
                            const arr = this.nodesMap.get(best).split(",");
                            const rand = Math.floor(Math.random() * arr.length);
                            returnValue = arr[rand];
                        } else {
                            returnValue = this.nodesMap.get(best);
                        }
                        //run a callback after calculation and return the index
                        callback(returnValue);
                        return returnValue;
                    }
                    //If not main call (recursive) return the heuristic value for next calculation
                    end = new Date().getTime() / 1000;
                    time = end - start;
                    searchTimes.push(time);
                    return best;
                }
            }
        }
        //Starts a new game with a certain depth and a startingPlayer of 1 if human is going to start
        //change starting player number to coinflip (RNG)
        function newGame(depth = -1){
            const player = new Player(parseInt(depth));
            const board = new Board(['','','','','','','','','']);
            const starting = parseInt(Math.floor(Math.random() * (2))),
                maximizing = starting;
            let playerTurn = starting;
            let firstPlayer = message.author.username;
            //If bot is going to start, choose a random cell as long as its the center or a corner

            if(!starting){
                firstPlayer = "The Bot"
                const centerAndCorners = [0, 2, 4, 6, 8];
                const firstChoice = centerAndCorners[Math.floor(Math.random()*centerAndCorners.length)];
                const symbol = !maximizing ? "X" : "O";
                board.insert(symbol, firstChoice);
                playerTurn = 1//Switch turns
            }
            const embed = new Discord.MessageEmbed()
            .setTitle(`**❌ Tic Tac Toe ⭕ (🎲 ${message.author.username} VS The Bot 🤖)**`)
            .setDescription(`${firstPlayer} won the coinflip and is going first.\n\n` + board.printedFormatBoard())
            .setColor(Colours.blue_dark)
            message.channel.send(embed).then(embedReact => {
                let movesEmotes = ["↖️", "⬆️", "↗️", "⬅️", "⏺️", "➡️", "↙️", "⬇️", "↘️"];
                movesEmotes.forEach(elt => {embedReact.react(elt)});
                let NewEmbed = new Discord.MessageEmbed()
                .setTitle(`**❌ Tic Tac Toe ⭕ (🎲 ${message.author.username} VS Bot 🤖)**`)
                .setColor(Colours.blue_dark)
                const filter = function (reaction, user) {
                    return ["↖️", "⬆️", "↗️", "⬅️", "⏺️", "➡️", "↙️", "⬇️", "↘️"].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                const collector = embedReact.createReactionCollector(filter);

                collector.on('collect', (reaction, user) => {
                    reaction.users.remove(user.id);
                    movesEmotes.forEach((element, index) => {
                        const symbol = maximizing ? "X" : "O";

                        function resultSummary(statusObject){
                            if(!statusObject) return;

                            const CurrentPlayer = playerTurn ? message.author.username : "The Bot";
                            const { winner, direction } = statusObject;
                            let totalTime = 0;
                            let totalMoves = searchTimes.filter(time => time > 0);
                            for(const times of searchTimes){
                                totalTime += times
                            }//get average compuational time
                            const AvgTime = totalTime/searchTimes.length;
                            if (winner === 'draw') {
                                NewEmbed.addFields({
                                    name: "**Result Summary**",
                                    value: "Draw",
                                    inline: true
                                }, {
                                    name: "Average Computational Time Taken",
                                    value: "`" + AvgTime + "` " + `for ${totalMoves.length} moves`,
                                    inline: false
                                })
                            }
                            else {
                                NewEmbed.addFields({
                                    name: "**Result Summary**",
                                    value: `Winner: ${CurrentPlayer} (${winner})\nDirection: ${direction}`,
                                    inline: true
                                }, {
                                    name: "Average Computational Time Taken",
                                    value: "`" + AvgTime + "` " + `for ${totalMoves.length} moves`,
                                    inline: false
                                })
                            }
                        }
                        if (reaction.emoji.name === element && user.id === message.author.id) {
                        //check if cell has an input already
                            if(board.state[index] || !playerTurn) {
                                NewEmbed.setDescription(`${firstPlayer} won the coinflip and is going first.\n\n` + board.printedFormatBoard() + "\n\n**Error Message**\n Invalid Move was not registered, click another cell emoji.")
                                embedReact.edit(NewEmbed)
                            } else {
                                board.insert(symbol, index)
                                if (board.isTerminal()) {
                                    NewEmbed.setDescription(`${firstPlayer} won the coinflip and is going first.\n\n` + board.printedFormatBoard())
                                    resultSummary(board.isTerminal());
                                    embedReact.edit(NewEmbed)
                                    collector.stop(); //stop the game
                                    
                                } else {
                                    NewEmbed.setDescription(`${firstPlayer} won the coinflip and is going first.\n\n` + board.printedFormatBoard())
                                    embedReact.edit(NewEmbed)
                                    playerTurn = 0; //Switch turns
                                } 

                                player.getBestMove(board, !maximizing, best => {
                                    const symbol = !maximizing ? "X" : "O";
                                    board.insert(symbol, parseInt(best));
                                    if (board.isTerminal()) {
                                        NewEmbed.setDescription(`${firstPlayer} won the coinflip and is going first.\n\n` + board.printedFormatBoard())
                                        resultSummary(board.isTerminal());
                                        embedReact.edit(NewEmbed)
                                        collector.stop(); //stop the game
                                    } else {
                                        NewEmbed.setDescription(`${firstPlayer} won the coinflip and is going first.\n\n` + board.printedFormatBoard())
                                        embedReact.edit(NewEmbed)
                                        playerTurn = 1; //Switch turns
                                    }
                                });
                            }
                        }
                    });
                })
            });
        }
        newGame();
    }
}