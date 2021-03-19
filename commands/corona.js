module.exports = {
    name: "covid-19",
    description: "This is a covid-19 command!",
    execute(message, args, Discord, puppeteer, fs, Colours) {
        if (!args[0]) {

            const writeStream = fs.createWriteStream('countries.csv');
            writeStream.write(`Countries\n`);

            (async() => {
                const browser = await puppeteer.launch({args:['--no-sandbox']});
                const page = await browser.newPage();
                await page.goto(`https://www.worldometers.info/coronavirus/`, {
                    withUntil: "networkidle2"
                });

                await page.setViewport({
                    width: 800,
                    height: 1000000,
                });

                const result = await page.evaluate(() => {
                    let headingFromWeb = document.querySelectorAll(".mt_a");
                    const headingList = [...headingFromWeb];
                    headingList.splice(215);
                    return headingList.map(h => h.innerText);
                });
                for (let country of result){
                    writeStream.write(`${country} \n`)
                }

                message.channel.send({
                    files:[{
                        attachment: "./countries.csv",
                        name: "countries.csv"
                    }]
                })
                .then(message.channel.send('Please give a valid country as a secondary command (e.g covid-19 uk); Please review the accompanying csv file to see available countries and fill any spaces between country names with a "-"'))
                .catch(console.error);
                await browser.close();
            })();

        } else {
            var country = args[0].toLowerCase()
            if (country === "usa" || country === "america" || country === "united-states") {
                country = "us";
            } else if (country === "britain" || country === "united-kingdom") {
                country = "uk";
            } else if (country === "uae"){
                country = "united-arab-emirates";
            } else if (country === "car"){
                country = "central-african-republic";
            } else if (country === "s. korea"){
                country = "south-korea";
            } else if (country === "drc" || country ==="dr congo"){
                country = "democratic-republic-of-the-congo";
            }

            var covid_link = `https://www.worldometers.info/coronavirus/country/${country}/`;
            (async () => {
                try {
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    //page.setViewport({ width: 1000, height: 600, deviceScaleFactor: 1 });
                    //https://www.worldometers.info/coronavirus/
                    await page.goto(covid_link, {
                        withUntil: "networkidle2"
                    });

                    //get covid-19 cases data
                    //total cases graph
                    await page.setViewport({
                        width: 800,
                        height: 1000000,
                    });

                    if (page.url() === "https://www.worldometers.info/404.shtml") {
                        message.channel.send('Country inputted does not exist please use the "%covid-19" command to get a list of available countries')
                        .catch(console.error);
                        await browser.close();
                    }

                    const total_cases = await page.$('div#coronavirus-cases-linear');
                    const tc_bounding_box = await total_cases.boundingBox();
                    await total_cases.screenshot({
                        path: 'graph_total_cases.png',
                        clip: {
                            x: tc_bounding_box.x,
                            y: tc_bounding_box.y,
                            width: Math.min(tc_bounding_box.width, page.viewport().width),
                            height: Math.min(tc_bounding_box.height, page.viewport().height),
                        },
                    });

                    const country_flag = await page.$('div.content-inner > div:nth-child(5) > h1 > div > img');
                    const cf_bounding_box = await country_flag.boundingBox();
                    await country_flag.screenshot({
                        path: 'country_flag.png',
                        clip: {
                            x: cf_bounding_box.x,
                            y: cf_bounding_box.y,
                            width: Math.min(cf_bounding_box.width, page.viewport().width),
                            height: Math.min(cf_bounding_box.height, page.viewport().height),
                        },
                    });

                    //collect key data
                    const MainNumbers = await page.evaluate(() => {
                        let NumCounters = document.querySelectorAll(".maincounter-number");
                        const NumList = [...NumCounters];
                        return NumList.map(n => n.innerText);
                    });
                    const TotalCases = MainNumbers[0];
                    const TotalDeaths = MainNumbers[1];
                    var RecoveredCases = MainNumbers[2];

                    var ClosedCases 
                    var ActiveCases 

                    if (isNaN(RecoveredCases.replace(/,/g, ""))) {
                        ClosedCases = "INDEFINABLE";
                        ActiveCases = "INDEFINABLE";
                        RecoveredCases = "INDEFINABLE";
                    } else {
                        ClosedCases = (parseInt(TotalDeaths.replace(/,/g, "")) + parseInt(RecoveredCases.replace(/,/g, ""))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        ActiveCases = (parseInt(TotalCases.replace(/,/g, "")) - parseInt(ClosedCases.replace(/,/g, ""))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }

                    const PanelCheck = await page.evaluate(() => {
                        let panelHeader = document.querySelectorAll(".panel-title");
                        const headers = [...panelHeader];
                        return headers.map(n => n.innerText);
                    });

                    /*var today = new Date();
                    var yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);

                    var dd = yesterday.getDate();
                    var mm = yesterday.getMonth()+1; //January is 0!

                    var yyyy = yesterday.getFullYear();
                    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} yesterday = yyyy+'-'+mm+'-'+dd;

                    const newUpdate = await page.$eval(`#newsdate${yesterday} > div > div > ul > li`,
                        el => el.innerText);
                    const DailyUpdate = newUpdate.replace(/\[source\]/g,"").replace(/\s+(\W)/g, "$1");*/


                    const newUpdate = await page.evaluate(() => {
                        let newsUpdate = document.querySelectorAll(".news_li");
                        const updates = [...newsUpdate];
                        return updates.map(n => n.innerText);
                    });

                    const DailyUpdate = newUpdate[0].replace(/\[source\]/g,"").replace(/\s+(\W)/g, "$1");

                    const embed = new Discord.MessageEmbed()
                    .setTitle(`🤧 ${country[0].toUpperCase() + country.slice(1)}'s COVID-19 Information 🤧`)
                    .attachFiles(["./country_flag.png"])
                    .setThumbnail("attachment://country_flag.png")
                    .addFields({
                        name: `**Total Cases:**`,
                        value: TotalCases,
                        inline: true
                    }, {
                        name: `**Active Cases:**`,
                        value: ActiveCases,
                        inline: true
                    }, {
                        name: `**Closed Case:**`,
                        value: ClosedCases,
                        inline: true
                    })
                    .attachFiles(["./graph_total_cases.png"])
                    .setImage("attachment://graph_total_cases.png")
                    .setFooter(`All information gathered from ${covid_link}`)
                    .setColor(Colours.blue_dark)

                    if(PanelCheck[0] == "ACTIVE CASES"){
                        const ActiveConditions = await page.evaluate(() => {
                            let NumCounters = document.querySelectorAll(".number-table");
                            const NumList = [...NumCounters];
                            return NumList.map(n => n.innerText);
                    });
                        const MildConditions = ActiveConditions[0];
                        const SeriousConditions = ActiveConditions[1]

                        embed.addField("\u200B", "**Active Cases**", false)
                        embed.addFields({
                            name: `**Mild Condition:**`,
                            value: MildConditions,
                            inline: true
                        }, {
                            name: `**Critical Condition:**`,
                            value: SeriousConditions,
                            inline: true
                        })
                    }
                    embed.addField("\u200B", "**Closed Cases**", false)
                    embed.addFields({
                        name: `**Recovered:**`,
                        value: RecoveredCases,
                        inline: true
                    }, {
                        name: `**Death:**`,
                        value: TotalDeaths,
                        inline: true
                    })
                    embed.addField("\u200B", `**(Daily Update) ${DailyUpdate}**`, false)
                    message.channel.send(embed);
                    await browser.close();
                } catch (err) {}
            })();
        }
    }
}
