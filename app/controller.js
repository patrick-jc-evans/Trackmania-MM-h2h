const getDisplayData = require("../dataHandling/getDisplayData")

exports.getHealthcheck = (req, res) => {
    console.log("Getting Healthcheck")
    res.sendStatus(200)
}

exports.getMatchmakingPlayerSummary = async (req, res) => {
    const mmStats = await getDisplayData(req.params.player_name)

    res.status(200)
    res.send({ mmStats })
}
