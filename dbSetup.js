const pg = require("pg")
const { Client } = pg

const db = new Client({
    database: "trackmania_matchmaking",
})
db.connect()

async function printTableColumns() {
    console.log("printing Table Columns")


    const player_performances = await db.query(
        "SELECT column_name FROM INFORMATION_SCHEMA.Columns WHERE table_name = 'player_performances'"
    )
    console.log(player_performances.rows)

    const matches_info = await db.query(
        "SELECT column_name FROM INFORMATION_SCHEMA.Columns WHERE table_name = 'matches_info'"
    )
    console.log(matches_info.rows)

    const player_names = await db.query(
        "SELECT column_name FROM INFORMATION_SCHEMA.Columns WHERE table_name = 'player_names'"
    )
    console.log(player_names.rows)
}

async function printTableContents() {

    const player_performances = await db.query("SELECT * FROM player_performances")
    console.log(JSON.stringify(player_performances.rows))
    const matches_info = await db.query("SELECT * FROM matches_info")
    console.log(matches_info.rows)
    const player_names = await db.query("SELECT * FROM player_names")
    console.log(player_names.rows)

}

async function main() {
    console.log("STARTING MAIN")
    // await createMMTables()
    await printTableColumns()
    await printTableContents()
    db.end()
}

main()
