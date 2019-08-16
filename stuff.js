const utils = require('./classes/utils');
const colors = require('./classes/mocks/twitter_light.css.json');
const core = './public/styles/twitter_core.bundle.css';
const fritease = './public/styles/twitter_core.fritease.css';
const knex = require('./classes/db/knex');
const twitter = require('./classes/twitter').twitter;

const updateCSS = () => new Promise((resolve, reject) => {
    console.log(`Updating css...`);
    utils.fs.readFileAsync(core)
        .then(results => {
            let data = results.toString();
            colors.forEach(c => {
                count = 0;
                console.log(`${c.current} -> ${c.replace}`);
                while (data.indexOf(c.current) >= 0) {
                    data = data.replace(c.current, c.replace);
                    count++;
                }
                console.log(`\tReplaced ${count} instances`);
            });
            utils.fs.writeFileAsync(fritease, data)
                .then(result => {
                    console.log(`Wrote ${fritease}`);
                    resolve(0);
                });

        })
        .catch(e => {
            console.error(e);
            reject(1);
        });
});

const updateUsers = () => new Promise((resolve, reject) => {
    try {
        const ff5_users = [
            "winter_cecily",
            "thewritelist",
            "thewovenwords",
            "ta_hernandez5",
            "sweetgirlmandy",
            "sbaileyauthor",
            "ryen_lesli",
            "rowena_tisdale",
            "razumishin",
            "purpleluvrain",
            "pawharter",
            "mrssexybook",
            "mollyneely",
            "livezformusic",
            "libby_m_iriks",
            "khubbard91",
            "katgauton",
            "juderoy29",
            "jfxmcl",
            "jestypist",
            "jeffwass",
            "howler0502",
            "essdotcurr",
            "dmshepard13",
            "dkmarie2216s",
            "danielleswritin",
            "cpearson",
            "christopheresl2",
            "chell22_7",
            "caytlyn_brooke",
            "carlyspade",
            "bencassauthor",
            "azdesertr0se",
            "atheart62",
            "anniescribes",
            "anaskewauthor",
            "amina_leeds",
            "afosterauthor",
            "ae_mckenna",
            "WriterSkyeMcD",
            "WordsMeanMuch",
            "TheImprovisor",
            "TavorieWrites",
            "SisterQuill",
            "Simpson_Romance",
            "SimonPsychosis",
            "ShadowsEclipsed",
            "SIwanisziw",
            "PromptList",
            "PromptAdvant",
            "PretentiousAho",
            "OverthinkerJess",
            "OliviaMagdelene",
            "OffshootBooks",
            "NelsonBrooks15",
            "Nathaniel_Kaine",
            "MadQueenStorm",
            "LilyMichaels25",
            "Lilsweetnspice",
            "LillianBlaire",
            "KM_West_",
            "Jessica_Hendy",
            "JessShaut",
            "ItsOkImAWriter",
            "HansonOak",
            "Hannajill1",
            "Gradyperlson",
            "GeneVatow",
            "EvieDrae",
            "EdenSleepwalker",
            "EJFisch",
            "EA_Bowie",
            "DesireeHoogerh2",
            "Darksun_always",
            "DaniGraceWrites",
            "CallMeChel_324",
            "CBethAnderson",
            "AutumnFaraday",
            "Anyechka",
            "AnneBohannon_",
            "AllisonDamMillr",
            "AdenPolydoros",
            "razumishin",
            "amina_leeds",
            "K_E_Huston",
            "authorCM_Turner",
            "GHMonroe",
            "Alicia_Dean_",
            "LunsfordMichael",
            "authorecfarrell",
            "EdiesHaven"
        ];
        const current_users = require('./seeds/ff_users.json')
            , newPath = utils.path.join(__dirname, './seeds/new_ff_users.json');

        console.log(`Updating users...`);
        twitter.get('users/lookup', { screen_name: ff5_users.join() })
            .then(users => {
                let data = users.data.map((u, i) => {
                    console.log(`\tFound ${u.screen_name}`);
                    let match = current_users.find(c => c.name === u.screen_name);

                    if (match) {
                            console.log(`\t\tMATCHED`);
                    }
                    else {
                        console.log(`\t\t$No match for ${u.screen_name}`);
                        match = {"id": i,"name": "","ff_dates": {},"follows": false,"following": false,"tweets": 0,"followers": 0,"ft_retweets": 0,"ft_tweets": 0};
                    }
                    return {...match, ...u};
                });

                let jsonData = JSON.stringify(data,null,2);

                utils.fs.writeFileAsync(newPath, jsonData)
                    .then(res => {
                        // console.log(data);
                        resolve(0);
                    })
                    .catch(e => {
                        console.log(JSON.stringify(e.message));
                        reject(1);
                    })
            })
            .catch(e => {
                console.log(`Error fetching ${JSON.stringify(e.message)}`);
                reject(1);
            });
    }
    catch (e) {
        console.log(e.message);
        reject(1);
    }
});

const args = [
    { command: 'css', callback: updateCSS },
    { command: 'users', callback: updateUsers }
];

process.argv.forEach(function (val, index, array) {
    let run = args.find(a => a.command === val);
    if (run) {
        try {
            run.callback()
                .then(r => process.exit(r))
                .catch(e => process.exit(e));
        }
        catch (e) {
            console.log(JSON.stringify(e.message));
            process.exit(1);
        }
    }
});