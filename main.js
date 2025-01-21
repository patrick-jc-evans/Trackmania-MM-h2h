const TMIO = require("trackmania.io")
const axios = require("axios")
const client = new TMIO.Client()
const { Client } = require("pg")
const format = require("pg-format")

client.setUserAgent("@Padster01 doing some testing.")

const db = new Client({
    database: "matchmaking",
})
db.connect()

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
    if (matchData.teams[0].score > matchData.teams[1].score) return 0
    else return 1
}

async function getSingleMatchStats(lid, date) {
    const unfiltedMatchData = (
        await axios.get(`https://trackmania.io/api/match/${lid}`, {
            headers: { "User-Agent": "@Padster01 doing some Testing" },
        })
    ).data

    //Winning Team
    const winningTeamID = checkWinningTeam(unfiltedMatchData)
    console.log(winningTeamID, "<----------")
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
        let win_match
        if (playerteam === winningTeam) {
            win_match = true
        } else {
            win_match = false
        }

        playerInfo.push({
            playerName,
            playerScore,
            playerPos,
            playerteam,
            win_match,
        })
    }

    //Map
    const map = unfiltedMatchData.maps[0].name.slice(-2)

    //Date
    return { lid, date, map, winningTeam, playerInfo }
}

async function addToDatabase(singleMD) {
    const matchDataInsertStr = format(
        `INSERT INTO match_info (lid, date, map, winning_team) VALUES %L;`,
        [[singleMD.lid, singleMD.date, singleMD.map, singleMD.winningTeam]]
    )
    await db.query(matchDataInsertStr)
}

async function main() {
    // const player = await getPlayer("Padster_01")
    // console.log("MM history for ", player.name)
    // const lids = await getPlayerRankedHistory(player)
    // console.log(lids)
    // const singleMatchData = await getSingleMatchStats(...lids[0])
    // console.log(singleMatchData)
    // addToDatabase(singleMatchData)

    console.log(
        (
            await db.query(
                "SELECT COUNT(*) FROM match_info WHERE lid = 'LID-MTCH-ys3b3wqwua2oie3'"
            )
        ).rows
    )
}

main()
