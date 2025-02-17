const express = require("express")
const { getHealthcheck, getMatchmakingPlayerSummary } = require("./controller")
const app = express()
const port = 9090

console.log(getHealthcheck)

app.use(express.json())

app.get("/api/healthcheck", getHealthcheck)

app.get("/api/mm/player/:player_name", getMatchmakingPlayerSummary)
// app.all("-*", (req, res) => {
//     res.status(404).send("Page not found")
// })

app.listen(port, () => {
    console.log(`app.js is listening on port ${port}`)
})
