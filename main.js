const TMIO = require("trackmania.io")
const axios = require("axios")
const client = new TMIO.Client()

client.setUserAgent("@Padster01 doing some testing.")

async function getPlayer(username) {
    const results = await client.players.search(username)
    return await client.players.get(results[0].id)
}

async function getPlayerRankedHistory(playerInfo) {
    const rankedHistory = await playerInfo.matchmaking().history()

    const lids = []
    for (let match of rankedHistory) {
        lids.push([match._data.lid, match._data.starttime])
    }

    return lids
}

function checkWinningTeam(matchData) {
    if (matchData.teams[0].score < matchData.teams[1].score) return 0
    else return 1
}

async function getSingleMatchStats(matchlid, date) {
    const unfiltedMatchData = (
        await axios.get(`https://trackmania.io/api/match/${matchlid}`, {
            headers: { "User-Agent": "@Padster01 doing some Testing" },
        })
    ).data

    //Winning Team
    const winningTeamID = checkWinningTeam(unfiltedMatchData)
    let winningTeam
    if (winningTeamID === 0) winningTeam = "blue"
    else winningTeam = "red"

    //Date

    //Position out of players

    const playerInfo = []

    for (let i of unfiltedMatchData.players) {
        const playerName = i.player.name
        const playerScore = i.score
        const playerPos = i.rank
        let playerteam
        if (i.team === 0) {
            playerteam = "blue"
        } else {
            playerteam = "red"
        }

        playerInfo.push({ playerName, playerScore, playerPos, playerteam })
    }

    //Map
    const map = unfiltedMatchData.maps[0].name.slice(-2)

    //Date
    return { date, map, winningTeam, playerInfo }
}

async function main() {
    const player = await getPlayer("WirtualTM")
    console.log("MM history for ", player.name)
    const lids = await getPlayerRankedHistory(player)
    console.log(lids)
    console.log(await getSingleMatchStats(...lids[0]))
}

main()
