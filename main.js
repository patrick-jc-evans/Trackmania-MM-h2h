const TMIO = require("trackmania.io")
const axios = require("axios")
const client = new TMIO.Client()
const { Client, Pool } = require("pg")
const format = require("pg-format")
const {getMatchHistory} = require("./apiCalls.js")

client.setUserAgent("@Padster01 doing some testing.")

const db = new Client({
    database: "trackmania_matchmaking",
})
db.connect()

async function addSingleMatchToDatabase(singleMD) {

    console.log(`Adding ${singleMD.lid}`)

    const matchDataInsertStr = format(
        `INSERT INTO match_info (lid, date, map, winning_team) VALUES %L;`,
        [[singleMD.lid, singleMD.date, singleMD.map, singleMD.winningTeam]]
    )
    await db.query(matchDataInsertStr)
}


async function addAllMatchesToDatabase(matchHistory) {

    console.log(db.database)

    console.log("dropping table")
    await db.query("DROP TABLE IF EXISTS match_info")
    console.log("Table dropped, creating new table")
    await db.query("CREATE TABLE match_info(lid VARCHAR(40) PRIMARY KEY, date VARCHAR(40), map VARCHAR(2), winning_team VARCHAR(4))")
    console.log("created table")

    for(let match of matchHistory){
        console.log(match)
        await addSingleMatchToDatabase(match)
    }

    return undefined
}

async function main() {
    // const matchHistory = await getMatchHistory("SunlessSoph")
    // await addAllMatchesToDatabase(matchHistory)
    console.log((await db.query("SELECT * FROM match_info")).rows)
}

main()