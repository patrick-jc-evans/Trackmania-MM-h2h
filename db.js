const pg = require("pg")
const { Client } = pg

const db = new Client({
    database: "matchmaking",
})
db.connect()

async function createMMTables(reset = false) {
    if (reset === true) {
        await db.query("DROP TABLE IF EXISTS match_info")
        await db.query("DROP TABLE IF EXISTS player_mm_histories")
    }

    console.log("CREATE MATCH_INFO")
    await db.query(
        "CREATE TABLE IF NOT EXISTS match_info (lid VARCHAR(40) PRIMARY KEY, date VARCHAR(40), map VARCHAR(2), winning_team VARCHAR(4));"
    )

    console.log("CREATE player_mm_histories")
    await db.query(
        "CREATE TABLE IF NOT EXISTS player_mm_histories (id SERIAL PRIMARY KEY, uuid VARCHAR(40), lid VARCHAR(40), display_name VARCHAR(40), player_score INT, player_position INT, playerTeam VARCHAR(40), win_match BOOLEAN)"
    )
}

async function printTables() {
    console.log("printingTables")
    const matchInfoColumns = await db.query(
        "SELECT column_name FROM INFORMATION_SCHEMA.Columns WHERE table_name = 'match_info'"
    )
    const matchInfoPrint = await db.query("SELECT * FROM match_info")
    console.log(matchInfoColumns.rows)
    console.log(matchInfoPrint.rows)

    const playerMMHistoriesColumns = await db.query(
        "SELECT column_name FROM INFORMATION_SCHEMA.Columns WHERE table_name = 'player_mm_histories'"
    )
    console.log(playerMMHistoriesColumns.rows)
}

async function main() {
    console.log("STARTING MAIN")
    await createMMTables()
    await printTables()
    db.end()
}

main()
