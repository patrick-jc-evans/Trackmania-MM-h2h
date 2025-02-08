const pg = require("pg")
const { Client } = pg

const db = new Client({
    database: "trackmania_matchmaking",
})
db.connect()

async function getAveragePosition(uuid){


    // Get the average position for the players last 25 matches.
    // limit 25 sort_by date

    // Note, this can be done cleaner with aggregate functions
    const requestStr = `SELECT position FROM player_performances WHERE uuid='${uuid}' ORDER BY date asc LIMIT 25`

    const averageValues = (await db.query(requestStr)).rows

    const averageValue = averageValues.reduce((acca, val) => {return acca+val.position}, 0)/averageValues.length

    return Math.round(100*averageValue)/100

}

async function getWinRate(uuid){

    // Count the number of wins/losses in the last 25 matches.
    // Divide through for the winrate
    const matchesWon = await db.query(`SELECT * FROM player_performances WHERE uuid='${uuid}' AND win_match=true ORDER BY date asc LIMIT 25`)
    const matchesTotal = await db.query(`SELECT * FROM player_performances WHERE uuid='${uuid}' ORDER BY date asc LIMIT 25`)

    const winRate = (matchesWon.rowCount/matchesTotal.rowCount)

    return Math.round(100*winRate)

}

async function getPositionCountArray(uuid){

    // Count the number of each cases for each position.
    // This will be messy pure SQL.

}

module.exports = {getWinRate, getAveragePosition}