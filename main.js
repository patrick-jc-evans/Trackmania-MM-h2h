const TMIO = require("trackmania.io")
const axios = require("axios")
const client = new TMIO.Client()
const { Client, Pool } = require("pg")
const format = require("pg-format")
const { getMatchHistory } = require("./apiCalls.js")

client.setUserAgent("@Padster01 doing some testing.")

const db = new Client({
    database: "trackmania_matchmaking",
})
db.connect()

async function checkKeyExists(key, keyName, table) {
    // TODO replace with $ syntax
    const queryStr = `SELECT * FROM ${table} WHERE ${keyName} = '${key}'`

    const dbOutput = await db.query(queryStr)

    if (dbOutput.rows.length === 0) return false
    return true
}

async function addSingleMatchToDatabase(singleMD) {
    console.log(`Adding ${singleMD.lid}`)

    const keyExists = await checkKeyExists(singleMD.lid, "lid", "matches_info")

    if (keyExists === false) {
        const matchDataInsertStr = format(
            `INSERT INTO matches_info (lid, date, map, winning_team) VALUES %L;`,
            [[singleMD.lid, singleMD.date, singleMD.map, singleMD.winningTeam]]
        )

        await db.query(matchDataInsertStr)

        console.log("Added to match_info table")

        for (let player of singleMD.playerInfo) {
            const playerPerformanceInsertStr = format(
                "INSERT INTO player_performances (uuid, lid, points, position, team, win_match) VALUES %L;",
                [
                    [
                        player.uuid,
                        singleMD.lid,
                        player.points,
                        player.position,
                        player.team,
                        player.win_match,
                    ],
                ]
            )

            console.log(playerPerformanceInsertStr)

            await db.query(playerPerformanceInsertStr)
        }
    } else {
        console.log("match already exists in db")
    }
}

async function addAllMatchesToDatabase(matchHistory) {
    for (let match of matchHistory) {
        await addSingleMatchToDatabase(match)
    }

    // console.log((await db.query("SELECT * FROM matches_info")).rows)
    // console.log((await db.query("SELECT * FROM player_performances")).rows)
}

async function main() {
    const matchHistory = await getMatchHistory("Padster_01")
    await addAllMatchesToDatabase(matchHistory)
    // console.log((await db.query("SELECT * FROM matches_info")).rows)
}
main()
