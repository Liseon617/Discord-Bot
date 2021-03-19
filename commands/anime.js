module.exports = {
    name: "anime",
    description: "This is an anime command to get anime for the current season!",
    execute(message, args, Discord, puppeteer, fs, Colours) {
         const anime_link = "https://myanimelist.net/anime/season";

        (async() => {
            const browser = await puppeteer.launch({args:['--no-sandbox']});
            const page = await browser.newPage();
            await page.goto(anime_link, {
                withUntil: "networkidle2"
            });

            await page.setViewport({
                width: 800,
                height: 1000000,
            });
            
            const Seasons = 
            [{Name: "Spring", Emoji: "🌸", Colour: Colours.spring, Link: "https://i.pinimg.com/originals/74/67/b4/7467b4f737ddc69e06adeeb859091857.gif" },
            {Name: "Summer", Emoji: "🏖️", Colour: Colours.summer, Link: "https://i.pinimg.com/originals/d0/25/16/d02516cf15f7b7b7b9c8ee95e0110deb.gif"},
            {Name: "Fall", Emoji: "🍂", Colour: Colours.fall, Link: "https://i.pinimg.com/originals/ac/f3/0e/acf30ee54206580bca0cb291eab559f4.gif"},
            {Name: "Winter", Emoji: "🌨️", Colour: Colours.winter, Link: "https://i.pinimg.com/originals/57/3b/68/573b688fbac605dde5807bf57b725bd5.gif"}]

            const season = await page.evaluate(() => { 
                let AnimeSeason = document.querySelector("head > title").innerText.split(" ");

                return AnimeSeason[0].trim()
            });
            //determine current anime season 
            for (const s of Seasons){
                if (s.Name === season){
                    var currentSeason = s;
                }
            }
            //if statements for if no secondary arg is given
            if (!args[0]) {
                const clean_data = await page.evaluate(() => {
                        //get all anime titles of the season
                        let container = document.querySelectorAll(".js-categories-seasonal > div:nth-child(1) > .js-seasonal-anime:not(.kids)");

                        var title = [];
                        var hyperlink = [];
                        for (let i = 0; i < container.length; i++) {
                            title.push(container[i].querySelector("div.title > h2 > a").innerText);
                            hyperlink.push(container[i].querySelector("div.title > h2 > a").getAttribute("href"));
                        }
                        //get scores of all anime titles this season
                        let AnimeScr = document.querySelectorAll(".js-categories-seasonal > div:nth-child(1) > .js-seasonal-anime:not(.kids)> .information > .scormem > .score");
                        let ScoreList = [...AnimeScr].map(n => n.innerText);
                    
                        //get members of all anime titles this season
                        let AnimeMembers = document.querySelectorAll(".js-categories-seasonal > div:nth-child(1) > .js-seasonal-anime:not(.kids)> .information > .scormem > .member");
                        let memberList = [...AnimeMembers].map(n => n.innerText);

                        title.splice(25, title.length);
                        hyperlink.splice(25, hyperlink.length);
                        ScoreList.splice(25, ScoreList.length);
                        memberList.splice(25, memberList.length);
                        return [title, ScoreList,memberList,hyperlink]
                    })
                    
                    let [title, ScoreList,memberList, hyperlink] = clean_data;
                    
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`${currentSeason.Emoji}${currentSeason.Name} Anime List${currentSeason.Emoji}`)
                    .setDescription('No genre(s) provide. Showing top 25 anime titles of the season...\n Please provide genres to view associated animes (e.g. %anime "action" "adventure")')
                    .setColor(currentSeason.Colour)
                    .setFooter(`All information gathered from ${anime_link}`)
                    .setImage(currentSeason.Link)
                    for (const anime in title){
                        embed.addField(
                            "**Title (Score: **" + "`" + ScoreList[anime] + "`" + "** Members: **" + "`" + memberList[anime] + "`" + "**)**",
                            `[${title[anime]}](${hyperlink[anime]})`, 
                            false
                        )
                    }
                    message.channel.send(embed);
            } else {
                const genre_check = await page.evaluate(() => {
                    let getGenres = document.querySelectorAll("#genres > li");
                    const genreList = [...getGenres].map(i => i.innerText);
                    const genreIDList = [...getGenres].map(i => i.id);
                    return [genreList, genreIDList]
                });

                let [gList, genreIDList] = genre_check;

                const genreList = gList.map(gnrs => gnrs.toLowerCase());

                if(args[0][0] != '"'){
                    const writeStream = fs.createWriteStream('genres.csv');
                    writeStream.write(`Genres\n`);
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Invalid input format detected.📔")
                    .setDescription('To view relavant anime accoring to given genre please input a valid genre in this format: e.g. %anime "genre 1" "genre 2".\nAll valid genres can be found in the collection below.', false)
                    .setColor(Colours.blue_dark)
                    .setFooter(`All information gathered from ${anime_link}`)
                    
                    for (const genre of genreList){
                        writeStream.write(`${genre} \n`)
                    };
                    message.channel.send(embed)
                    .then(message.channel.send({
                        files:[{
                            attachment:"./genres.csv",
                            name: "genres.csv"
                        }]
                    }))
                } else {
                    let open = false;
                    let string = "";
                    let source = "";
                    let genres = [];
    
                    args.forEach(i => source += i + "")
    
                    for (const e in source) {
    
                        if (source[e] == '"')
                            open = !open;
    
                        // If the current string is open and the actual char is not "
                        // Then concatenate the char
                        if (open && (source[e] != '"'))
                            string += source[e];
    
                        // If the current string is not empty
                        // Then add the string to the genres array and clear the string
                        else if (string != "") {
                            genres.push(string);
                            string = "";
                        }
                    }
    
                    if (open)
                        throw new Error("ErrorOpen")
    
                    //check if genre given is allowed or not
                    let genre_checker = (given, allowed) => given.every(g => allowed.includes(g.toLowerCase()));
    
                    if(genre_checker(genres,genreList)){
                        const clean_data = await page.evaluate(() => {
                            //get genre data of all anime
                            //get all anime titles of the season
                            let container = document.querySelectorAll(".js-categories-seasonal > div:nth-child(1) > .js-seasonal-anime:not(.kids)");
    
                            var genre_data = [];
                            var title = [];
                            var hyperlink = [];
                            for (let i = 0; i < container.length; i++) {
                                genre_data.push(container[i].getAttribute("data-genre"));
                                title.push(container[i].querySelector("div.title > h2 > a").innerText);
                                hyperlink.push(container[i].querySelector("div.title > h2 > a").getAttribute("href"));
                            }
                            //get scores and flush out "N/A" scores
                            let AnimeScr = document.querySelectorAll(".js-categories-seasonal > div:nth-child(1) > .js-seasonal-anime:not(.kids)> .information > .scormem > .score");
                            let ScoreList = [...AnimeScr].map(n => n.innerText);
                            var naList = [];
                            for (let score in ScoreList){
                                if(ScoreList[score] == "N/A"){
                                    naList.push(score);
                                }
                            }
                            //get members of all anime titles this season
                            let AnimeMembers = document.querySelectorAll(".js-categories-seasonal > div:nth-child(1) > .js-seasonal-anime:not(.kids)> .information > .scormem > .member");
                            let memberList = [...AnimeMembers].map(n => n.innerText);
    
                            for (let i = naList.length -1; i >= 0; i--) {
                                genre_data.splice(naList[i], 1); 
                                title.splice(naList[i], 1); 
                                ScoreList.splice(naList[i], 1); 
                                memberList.splice(naList[i], 1);
                            }
                            
                            return [genre_data, title, ScoreList,memberList, hyperlink]
                        })
                        
                        let [genre_data, title, ScoreList,memberList, hyperlink] = clean_data;
    
                        function findMatch(longer, shorter) {
                            var newArr = new Array();
                            for (let i = 0; i < shorter.length; i++) {
                                for (let y = 0; y < longer.length; y++) {
                                    if(longer[y] == shorter[i]){
                                        newArr.push(y);
                                    }
                                }
                            }
                            return newArr
                        }
    
                        let genreID_Index = findMatch(genreList, genres); // compare genres with genreList to extract id index to be stored in list
    
                        let genreIDs = []
                        //get the actual genre ids of the users' given genre
                        for (let i = 0; i < genreID_Index.length; i++) {
                            genreIDs.push(genreIDList[genreID_Index[i]]);
                        }
                        
                        //get relevant anime titles based on genre
                        let GenreTitles = [];
                        let TitleHyperlinks =[];
                        let FinalScore = [];
                        let Finalmembers = [];
                        let contains = (arr, target) => target.every(v => arr.includes(v));
                        for(const el in genre_data){
                            if (contains(genre_data[el].split(','), genreIDs)){
                                GenreTitles.push(title[el]);
                                TitleHyperlinks.push(hyperlink[el]);
                                FinalScore.push(ScoreList[el]);
                                Finalmembers.push(memberList[el]);
                            }
                        }
    
                        const embed = new Discord.MessageEmbed()
                        if (GenreTitles.length === 0){
                            embed.setTitle("No suitable anime found within the current season")
                            .setDescription("The genre(s) provided yield no available anime titles. Please try another genre set")
                            .setColor(Colours.blue_dark)
                            .setFooter(`All information gathered from ${anime_link}`)
                            message.channel.send(embed); //no anime that suits given genre in this season
                        } else {
                            embed.setTitle(`${currentSeason.Emoji}${currentSeason.Name} Anime List${currentSeason.Emoji}`)
                            .setDescription(`${GenreTitles.length} anime titles found`)
                            .setColor(currentSeason.Colour)
                            .setFooter(`All information gathered from ${anime_link}`)
                            .setImage(currentSeason.Link)
                            for (const anime in GenreTitles){
                                embed.addField(
                                    "**Title (Score: **" + "`" + FinalScore[anime] + "`" + "** Members: **" + "`" + Finalmembers[anime] + "`" + "**)**",
                                    `[${GenreTitles[anime]}](${TitleHyperlinks[anime]})`, 
                                    false
                                )
                            }
                            message.channel.send(embed);
                        }                
                    } else {
                        const writeStream = fs.createWriteStream('genres.csv');
                        writeStream.write(`Genres\n`);
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Available Anime Genres📔")
                        .setDescription('Invalid genre inputted. Please input one or more genres from the collection below. Use the following format: %anime "genre 1" "genre 2"', false)
                        .setColor(Colours.blue_dark)
                        .setFooter(`All information gathered from ${anime_link}`)
                        
                        for (const genre of genreList){
                            writeStream.write(`${genre} \n`)
                        };
                        message.channel.send(embed)
                        .then(message.channel.send({
                            files:[{
                                attachment:"./genres.csv",
                                name: "genres.csv"
                            }]
                        }))
                    }
                }
            }
            await browser.close();
        })();
    }
}