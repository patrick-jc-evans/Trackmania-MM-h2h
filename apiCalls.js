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
    if (matchData.teams[0].score > matchData.teams[1].score) return 0
    else return 1
}

async function getSingleMatchStats(lid, date) {
    try{
        const unfiltedMatchData = (
            await axios.get(`https://trackmania.io/api/match/${lid}`, {
                headers: { "User-Agent": "@Padster01 doing some Testing" },
            })
        ).data

        //Winning Team
        const winningTeamID = checkWinningTeam(unfiltedMatchData)

        // TODO: Convert to ternary
        let winningTeam
        if (winningTeamID === 0) winningTeam = "blue"
        else winningTeam = "red"

        const playerInfo = []

        for (let i of unfiltedMatchData.players) {
            const uuid = i.player.name
            const points = i.score
            const position = i.rank
            let team
            if (i.team === 0) {
                team = "blue"
            } else {
                team = "red"
            }
            let win_match
            if (team === winningTeam) {
                win_match = true
            } else {
                win_match = false
            }

            playerInfo.push({
                uuid,
                points,
                position,
                team,
                win_match,
            })
        }

        const map = unfiltedMatchData.maps[0].name.slice(-2)

        return { lid, date, map, winningTeam, playerInfo }
    }
    catch{
        console.log("500 Data Expired")
    }
}

async function getMatchHistory(playername){

    const player = await getPlayer(playername)
    console.log("MM history for ", player.name)
    const lids = await getPlayerRankedHistory(player)

    const filteredMatchesData = []
    for(let lid of lids) {
        const data = await getSingleMatchStats(...lid)
        if(data) filteredMatchesData.push(data)
        else break;
    }

    return filteredMatchesData
}

module.exports = {getMatchHistory}