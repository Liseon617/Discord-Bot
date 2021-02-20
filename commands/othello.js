module.exports = {
    name: "othello",
    description: "This is a othello command!",
    execute(message, args, Discord, Colours) {
        var searchTimes = new Array();
        class Board {
            constructor (state = [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 2, 0, 0, 0],
                [0, 0, 0, 2, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
              ],
              score,
              turn,
              pieces = ["","\u25CB", "\u25CF", "\u0078"]//["","⚫", "⚪", x]
              //index == number for checking to provide the relevant emoji and determining turn
              //black goes first
              ){
                this.state = state; //numbers to indicate pieces
                this.score = {
                    'black': { 
                        'score': 0
                    },
                    'white': { 
                        'score': 0
                    },
                };
                this.turn = 1; //alternate between 1 and 2 to determine whose turn it is
                this.pieces = pieces;
            }
            passTurn(){
                var turn = (this.turn == 1) ? 2 : 1;
                this.turn = turn;
            }
            setTurn(turnState){
                this.turn = turnState;

                var isBlack = (turnState === 1);
                var WhichTurn
                WhichTurn = isBlack ? "Black's Turn" : "White's Turn";//black & white turn
                return WhichTurn
            }
            setScore(blackScore ,whiteScore){
                this.score.black.score = blackScore
                this.score.white.score = whiteScore
            }
            isVisibleItem(row, col){
                return (this.state[row][col] != 0 || this.state[row][col] === "\u0078")
            }
            isValidPosition(row, col){
                return ((row >=0 && row < 8) && (col >= 0 && col < 8))
            }
            setItemState(row, col, turn){
                if (!this.isValidPosition(row, col)){
                    return
                }

                this.state[row][col] = turn
            }
            recalculateScore() {
                var scoreWhite = 0,
                    scoreBlack = 0;
                for (var i = 0; i < 8; i++){
                    for (var j =0; j < 8; j++){
                        if (this.isValidPosition(i,j) && this.isVisibleItem(i,j)){
                            if(this.state[i][j] === 1){
                                scoreBlack++
                            } else {
                                scoreWhite++
                            }
                        }
                    }
                }
                this.setScore(scoreBlack,scoreWhite)
            }
            isValidMove(row, col){
                var current = this.turn,
                    rowCheck,
                    colCheck,
                    toCheck = (current == 1) ? 2 : 1;
                if (!this.isValidPosition(row, col) || this.isVisibleItem(row, col)){
                    return false;
                }
                //check all directions
                for (var rowDir = -1; rowDir <= 1; rowDir++) {
                    for (var colDir = -1; colDir <= 1; colDir++) {
                        //don't check the current position
                        if (rowDir === 0 && colDir === 0){
                            continue;
                        }
                        //move onto the next cell
                        rowCheck = row + rowDir;
                        colCheck = col + colDir;
                        //itemfinder
                        var itemfound = false;

                        while(this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck) && this.state[rowCheck][colCheck] === toCheck) {
                            rowCheck += rowDir;
                            colCheck += colDir;

                            itemfound = true
                        }
                        //if item found
                        if (itemfound){
                            if (this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck) && this.state[rowCheck][colCheck] === current) {
                                return true //identified valid move
                            }
                        }
                    }
                }
                return false;
            }
            getAvailableMoves(){
                const moves = [];
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        if(this.isValidMove(i, j)){
                            moves.push([i, j]);
                        }
                    }
                }
                //need to format moves
                return moves
            }
            canMove(){// determine if the player can move
                for (var i = 0; i < 8; i++){
                    for (var j = 0; j < 8; j++){
                        if (this.isValidMove(i,j)){
                            return true;
                        }
                    }
                }
                return false;
            }
            checkEndGame(){
                for (var i = 0; i < 8; i++){
                    for (var j = 0; j < 8; j++){
                        if(this.isValidPosition(i,j) && !this.isVisibleItem(i,j)){
                            return false;
                        }
                    }
                }
                let x = 1
                let TurnHolder = this.turn
                let TotalAvailableTurns = 0
                do {
                    this.setTurn(x)
                    TotalAvailableTurns += this.getAvailableMoves().length
                } while (x <= 2)
                board.setTurn(TurnHolder)
                if (TotalAvailableTurns == 0){
                    var result = (this.score.black.score > this.score.white.score)
                    ? 
                        1 
                    : (this.score.white.score > this.score.black.score) ? -1 : 0;
    
                    switch(result){
                        case 1:
                            return {winner: "Black", message: "Black Won!"};
                        case -1:
                            return {winner: "White", message: "White Won!"};
                        case 0:
                            return {winner: "Tie", message: "Tie. We're all winners!"}
                    }
                }
                
                var result = (this.score.black.score > this.score.white.score)
                ? 
                    1 
                : (this.score.white.score > this.score.black.score) ? -1 : 0;

                switch(result){
                    case 1:
                        return {winner: "Black", message: "Black Won!"};
                    case -1:
                        return {winner: "White", message: "White Won!"};
                    case 0:
                        return {winner: "Tie", message: "Tie. We're all winners!"}
                }
            }
            Move(row, col){
                var finalItems = [],
                    current = this.turn,
                    rowCheck,
                    colCheck,
                    toCheck = (current == 1) ? 2 : 1;
                
                //check all directions
                for (var rowDir = -1; rowDir <= 1; rowDir++) {
                    for (var colDir = -1; colDir <= 1; colDir++) {
                        //don't check the current position
                        if (rowDir === 0 && colDir === 0){
                            continue;
                        }
                        //move onto the next cell
                        rowCheck = row + rowDir;
                        colCheck = col + colDir;

                        var possibleItems = [];
                        //look for valid flips
                        //look for cells of opposite colour
                        while(this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck) && this.state[rowCheck][colCheck] === toCheck) {
                            possibleItems.push ([rowCheck, colCheck]);

                            rowCheck += rowDir;
                            colCheck += colDir;
                        }
                        //if shit was found
                        if (possibleItems.length) {
                            if (this.isValidPosition(rowCheck, colCheck) && this.isVisibleItem(rowCheck, colCheck) && this.state[rowCheck][colCheck] === current){
                                finalItems.push([row, col])
                                for (var item of possibleItems) {
                                    finalItems.push(item)
                                }
                            }
                        }
                    }
                }
                if (finalItems.length){
                    for(var item of finalItems){
                        this.setItemState(item[0], item[1], current);
                    }
                }
                this.setTurn(toCheck);
                this.recalculateScore();
            }
            printFormatBoard() {
                let formattedString = ""; //holds boards
                let alpha = [" ","🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭"];
                let numeric = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣'];
                let xAxis = ""; //alpha

                for (let i = 0; i < alpha.length; i++) {
                    xAxis += `\u2004\u2004${alpha[i]}\u2004\u2004|`;
                    if (i === alpha.length - 1) {
                        xAxis = xAxis.slice(0, -1);
                        xAxis += `\n\u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014\n ${numeric[0]}  |`;
                    }
                };

                formattedString = xAxis + formattedString;
                
                this.state.forEach((row, rowindex) => {
                    this.state[rowindex].forEach((cell, cellindex) => {
                        if(this.isValidMove(rowindex, cellindex)) {
                            cell = 3 //show available moves on board
                            formattedString += cell ? `\u2004\u2004${this.pieces[Number(cell)]}\u2004\u2004|` : "\u2004\u2004\u2004\u2004\u2004|";
                        } else {
                            formattedString += cell ? `\u2004\u2004${this.pieces[Number(cell)]}\u2004\u2004|` : "\u2004\u2004\u2004\u2004\u2004|";
                        }
                        if ((cellindex + 1) % 8 === 0) {
                            formattedString = formattedString.slice(0,-1); //add yAxis
                            if (rowindex < 7)
                            formattedString += 
                            `\n\u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014 \u2014\u2014\u2014\u2014\u2014\n ${numeric[rowindex + 1]}  |`;
                        }
                    });
                })
                return "`" + formattedString + "`";
            }
        }
        //player AI
        class Player {
            constructor(maxDepth = 5) {
                this.maxDepth = maxDepth;
            }
            Minimax(board, depth, maximizing, maxDepth, alpha, beta){
                var score, move, bestMove;
                var moves = board.getAvailableMoves();
                if (board.checkEndGame() || depth === this.maxDepth) {
                    board.setTurn(1)
                    var human = board.getAvailableMoves().length
                    board.setTurn(2)
                    var ai = board.getAvailableMoves().length
                    return Math.ceil((human + ai) === 0 ? 0 : 100 * ((ai - human)/(ai + human)));
                }
                if(maximizing) {
                    for (var i = moves.length - 1; i >= 0; i--) {
                        move = moves[i];
                        const child = new Board([...board.state]);
                        child.Move(move[0], move[1]);
                        score = this.Minimax(child, depth + 1, false, maxDepth, alpha, beta)
                        if (score > alpha) {
                            alpha = score;
                            bestMove = move
                        }
                        if (beta <= alpha) {
                            break;
                        }
                    } 
                    if (depth == 0){
                        return bestMove
                    } else {
                        return alpha
                    }
                } 
                if(!maximizing) {
                    for (var i = moves.length - 1; i >= 0; i--) {
                        move = moves[i];
                        const child = new Board([...board.state]);
                        child.Move(move[0], move[1]);
                        score = this.Minimax(child, depth + 1, true, maxDepth, alpha, beta);
                        if(score < beta){
                            beta = score;
                            bestMove = move
                        }
                        if(beta <= alpha){
                            break;
                        }
                    }
                    if (depth == 0){
                        return bestMove
                    } else {
                        return beta
                    }
                }
            }
            getBestMove(board, maximizing){
                return this.Minimax(board, 0, maximizing, this.maxDepth, -Infinity, +Infinity)
            }
        }
        function newGame(depth = 5){
            const player = new Player(parseInt(depth));
            const board = new Board([
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 2, 0, 0, 0],
                [0, 0, 0, 2, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
              ]);
            board.setScore(2,2);
            const starting = parseInt(Math.floor(Math.random() * 2) + 1),
                maximizing = !(starting - 1);
            let currentTurn = board.setTurn(starting)
            let firstPlayer = message.author.username;
            let botmove = ""
            if (starting === 2){
                firstPlayer = "The Bot"
                const firstChoice = board.getAvailableMoves()[Math.floor(Math.random()*board.getAvailableMoves().length)]
                board.Move(firstChoice[0],firstChoice[1])
                botmove = `\nThe Bot's Last Move: ${(firstChoice[1] + 10).toString(36).toUpperCase()}${firstChoice[0] + 1}`
            }
            const embed = new Discord.MessageEmbed()
            .setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White: ${board.score.white.score}**`)
            .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + botmove)
            .setColor(Colours.blue_dark)
            message.channel.send(embed).then(embedMessage => {
                let NewEmbed = new Discord.MessageEmbed()
                function resultSummary(statusObject) {
                    if(!statusObject) return;

                    const CurrentPlayer = playerTurn - 1 ? message.author.username : "The Bot";
                    const {winner, message} = statusObject;
                    let totalTime = 0;
                    let totalMoves = searchTimes.filter(time => time > 0);
                    for(const times of searchTimes){
                        totalTime += times 
                    }
                    const AvgTime = totalTime/searchTimes.length;
                    if (winner === "Tie"){
                        NewEmbed.addFields({
                            name: "**Result Summary**",
                            value: "Tie",
                            inline: true
                        }, {
                            name: "Average Computational Time Taken",
                            value: "`" + AvgTime + "` " + `for ${totalMoves.length} moves`,
                            inline: false
                        })
                    } else {
                        NewEmbed.addFields({
                            name: "**Result Summary**",
                            value: `Winner: ${CurrentPlayer} (${winner})\n`,
                            inline: true
                        }, {
                            name: "Average Computational Time Taken",
                            value: "`" + AvgTime + "` " + `for ${totalMoves.length} moves`,
                            inline: false
                        })
                    }
                }
                function CheckAvailableMoves(){
                    board.passTurn();//Pass turn
                    //print new game board
                    NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White: ${board.score.white.score}**`)
                    .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n ${(board.turn == 1) ? message.author.username : "The Bot" }'s Turn was skipped due to no available moves`)
                    .setColor(Colours.blue_dark)
                    embedMessage.edit(NewEmbed)

                    if(board.turn == 1){
                        if(board.isValidMove(moveRow, moveCol)){
                            board.Move(moveRow, moveCol)
                            if(board.checkEndGame()){
                                NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White: ${board.score.white.score}\n**`)
                                .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n${message.author.username}'s Last Move: ${contents[0]}${contents[1]}`)
                                .setColor(Colours.blue_dark)
                                resultSummary(board.checkEndGame());
                                embedMessage.edit(NewEmbed)
                                collector.stop();
                            } else {
                                NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White:${board.score.white.score}**`)
                                .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n${message.author.username}'s Last Move: ${contents[0]}${contents[1]}`)
                                .setColor(Colours.blue_dark)
                                embedMessage.edit(NewEmbed);
                                if(board.getAvailableMoves().length == 0){
                                    CheckAvailableMoves()
                                }
                            }
                        }
                    } else if (board.turn == 2){
                        let bestBotMove = player.getBestMove(board, !maximizing)
                        board.Move(bestBotMove[0], bestBotMove[1])
                        let PrevBotmove = (bestBotMove[1] + 10).toString(36).toUpperCase() + (bestBotMove[0] + 1)
                        if (board.checkEndGame()) {
                            NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White: ${board.score.white.score}**`)
                            .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n The Bot's Last Move: ${PrevBotmove}`)
                            .setColor(Colours.blue_dark)
                            resultSummary(board.checkEndGame());
                            embedMessage.edit(NewEmbed)
                            collector.stop();
                        } else {
                            NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\neading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White: ${board.score.white.score}**`)
                            .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n The Bot's Last Move: ${PrevBotmove}`)
                            .setColor(Colours.blue_dark)
                            embedMessage.edit(NewEmbed)
                            if(board.getAvailableMoves().length == 0){
                                CheckAvailableMoves()
                            }
                        }
                    }

                }
                const filter = (m) => m.author.id === message.author.id && m.content.startsWith(`move `);
                message.reply("Please chose a move according to grid")
                    .then(r => r.delete({timeout: 60000}))
                    .catch((err) => console.log(err))
                const collector = embedMessage.channel.createMessageCollector(filter)
                collector.on('collect', (move) => {                            
                    if(collector.collected.size > 0){
                        //clean movement controls
                        let open = false;
                        let contents = [];
                        for (const i in move.content) {
                            if (open && contents.length <= 2) {
                                contents.push(move.content[i])
                            }
                            if (move.content[i] == " ") {
                                open = true;
                            }
                        }
                        let moveCol = contents[0];
                        let moveRow = Number(contents[1]) - 1;
                        if(moveCol.match(/^[0-9a-zA-Z]+$/)  && !isNaN(moveRow)) {//check if input command for move is correct, Alphabet for col, Number for row 
                            moveCol = moveCol.toLowerCase().charCodeAt(0) - 97
                            if(board.isValidMove(moveRow, moveCol)){
                                board.Move(moveRow, moveCol)
                                if(board.checkEndGame()){
                                    NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White: ${board.score.white.score}**`)
                                    .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n${message.author.username}'s Last Move: ${contents[0]}${contents[1]}`)
                                    .setColor(Colours.blue_dark)
                                    resultSummary(board.checkEndGame());
                                    embedMessage.edit(NewEmbed)
                                    collector.stop();
                                } else {
                                    NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White:${board.score.white.score}**`)
                                    .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n${message.author.username}'s Last Move: ${contents[0]}${contents[1]}`)
                                    .setColor(Colours.blue_dark)
                                    embedMessage.edit(NewEmbed);
                                    if(board.getAvailableMoves().length == 0){
                                        CheckAvailableMoves()
                                    }

                                    let bestBotMove = player.getBestMove(board, !maximizing)
                                    board.Move(bestBotMove[0], bestBotMove[1])
                                    let PrevBotmove = (bestBotMove[1] + 10).toString(36).toUpperCase() + (bestBotMove[0] + 1)
                                    if (board.checkEndGame()) {
                                        NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White: ${board.score.white.score}**`)
                                        .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n The Bot's Last Move: ${PrevBotmove}`)
                                        .setColor(Colours.blue_dark)
                                        resultSummary(board.checkEndGame());
                                        embedMessage.edit(NewEmbed)
                                        collector.stop();
                                    } else {
                                        NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White: ${board.score.white.score}**`)
                                        .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n The Bot's Last Move: ${PrevBotmove}`)
                                        .setColor(Colours.blue_dark)
                                        embedMessage.edit(NewEmbed)
                                        if(board.getAvailableMoves().length == 0){
                                            CheckAvailableMoves()
                                        }
                                    }
                                }
                            } else {
                                let availMoves = ""
                                board.getAvailableMoves().forEach(value => availMoves += (" " + (value[1]+ 10).toString(36).toUpperCase() + (value[0] + 1) + ","))
                                availMoves = availMoves.slice(0, -1)
                                NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White: ${board.score.white.score}**`)
                                .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n\n**Error Message**\n Invalid Move was not registered\n Available moves:[${availMoves}]`)
                                .setColor(Colours.blue_dark)
                                embedMessage.edit(NewEmbed)
                            }
                        } else {
                            let availMoves = ""
                            board.getAvailableMoves().forEach(value => availMoves += (" " + (value[1]+ 10).toString(36).toUpperCase() + (value[0] + 1) + ","))
                            availMoves = availMoves.slice(0, -1)
                            NewEmbed.setTitle(`**⚫ Othello ⚪ (🎲 ${message.author.username} VS The Bot 🤖)\n${currentTurn}\nLeading: ${(board.score.black.score > board.score.white.score) ? "Black" : (board.score.white.score > board.score.black.score) ? "White" : "Tie"} || Black: ${board.score.black.score}  Vs  White: ${board.score.white.score}**`)
                            .setDescription(`${firstPlayer} won the coinflip and is going first.\n Movement Controls: Type "move <Grid No>" (e.g move A1)\n\n` + board.printFormatBoard() + `\n\n**Error Message**\n Invalid Move was not registered\n Available moves:[${availMoves}]`)
                            .setColor(Colours.blue_dark)
                            embedMessage.edit(NewEmbed)
                        }
                        message.channel.messages.fetch({limit: 1})
                        .then((msg) => {
                            const FetchedMsgs = [];
                            msg.filter(filter).forEach(m => FetchedMsgs.push(m));
                            message.channel.bulkDelete(FetchedMsgs.slice(0, 1));
                        }).catch(error => console.log(error.stack))
                    }
                    collector.collected.clear();
                })
            })
        } 
        newGame();
    }
}