module.exports = {
    name: "minesweeper",
    description: "This is a minesweeper command!",
    execute(message, args) {
        function genMineSweeper(gridX, gridY, mines) {

            function genGridMatrix(x, y) {
                let fill = 0
                let out_ = [];

                while (y--) {
                    out_.push((new Array(x)).fill(fill));
                }

                return out_;
            }

            function getSurroundingInMatrix(arr, x, y) {
                let i = 0;

                if (arr[y - 1] && arr[y - 1][x - 1] == "|| 💥 ||") i++;
                if (arr[y - 1] && arr[y - 1][x] == "|| 💥 ||") i++;
                if (arr[y - 1] && arr[y - 1][x + 1] == "|| 💥 ||") i++;
                if (arr[y] && arr[y][x - 1] == "|| 💥 ||") i++;
                if (arr[y] && arr[y][x] == "|| 💥 ||") i++;
                if (arr[y] && arr[y][x + 1] == "|| 💥 ||") i++;
                if (arr[y + 1] && arr[y + 1][x - 1] == "|| 💥 ||") i++;
                if (arr[y + 1] && arr[y + 1][x] == "|| 💥 ||") i++;
                if (arr[y + 1] && arr[y + 1][x + 1] == "|| 💥 ||") i++;

                let e = ["|| 0️⃣ ||", "|| 1️⃣ ||", "|| 2️⃣ ||", "|| 3️⃣ ||", "|| 4️⃣ ||", "|| 5️⃣ ||", "|| 6️⃣ ||", "|| 7️⃣ ||", "|| 8️⃣ ||"];

                return e[i];
            }

            function genMines(arr, x, y, mines_) {
                while (mines_--) {
                    let ranX = Math.floor(Math.random() * x);
                    let ranY = Math.floor(Math.random() * y);

                    while (arr[ranY][ranX] == "|| 💥 ||") {
                        ranX = Math.floor(Math.random() * x);
                        ranY = Math.floor(Math.random() * y);
                    }

                    arr[ranY][ranX] = "|| 💥 ||";
                }

                return arr;
            }

            let matrix = genGridMatrix(gridX, gridY);
            matrix = genMines(matrix, gridX, gridY, mines);
            matrix = matrix.map((x1, y) => {
                return x1.map((x2, x) => {
                    if (x2 != "|| 💥 ||") {
                        return getSurroundingInMatrix(matrix, x, y);
                    } else {
                        return x2;
                    }
                });
            });

            let allZeros = [];

            for (let y in matrix) {
                for (let x in matrix[y]) {
                    if (matrix[y][x] == "|| 0️⃣ ||") {
                        allZeros.push({
                            x: x,
                            y: y
                        });
                    }
                }
            }

            let ran = allZeros[Math.floor(Math.random() * allZeros.length)];

            if (ran && matrix[ran.y] && matrix[ran.y][ran.x]) matrix[ran.y][ran.x] = "|| 0️⃣ ||";

            let fullGrid = matrix.map(c => {
                return c.join("");
            }).join("\n");

            /*.replace(/:[^ \n:]+:/g, c => {
                return "|| " + c + " ||";
            });*/

            return fullGrid;
        }


        let width = Math.round(parseInt(args[1]));
        let height = Math.round(parseInt(args[2]));
        let mines = Math.round(parseInt(args[3]));

        // Check game widths
        if (isNaN(width)) {
            width = 8;
        }
        //check game height
        if (isNaN(height)) {
            height = 8;
        }

        //check game relations to discord
        if (width * height > 198) {
            return message.channel.send("That's way too large! Discord is too shit too allow any more!");
        } else if (width <= 0 || height <= 0) {
            return message.channel.send(`Uh, I'm not smart enough to generate a maze sized ${gameWidth} by ${gameHeight}. I can only use positive numbers. Sorry :cry:`);
        }

        // Check mine count
        if (isNaN(mines)) {
            mines = Math.round((width * height) / 4);
        } else {
            if (mines <= 0) {
                return message.channel.send("You think you can look clever by solving a Minesweeper game without mines? Not gonna happen my friend.");
            } else if (mines > width * height) {
                return message.channel.send("I can't fit that many mines in this game!");
            } else if (mines === width * height) {
                return message.channel.send("How do you want to solve a Minesweeper game when the entire grid is filled with mines? ");
            }
        }

        let grid = genMineSweeper(width, height, mines);

        message.channel.send(`A ${width}x${height} Minefield with ${mines} mines created \n` + grid)

    }
}