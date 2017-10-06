const { Pool } = require('pg')

const pool = new Pool({
    user: 'dashboard',
    host: 'localhost',
    database: 'dashboard_db',
    port: 5435,
})

async function readFromDb(sql) {
    const result = await pool.query(sql)
    return result.rows
}

async function readUniqueDevices() {
    const rows = await readFromDb("SELECT COUNT(DISTINCT deviceId) AS devices FROM calls;")
    return parseInt(rows[0].devices)
}

async function readTotalCalls() {
    const rows = await readFromDb("SELECT COUNT(*) AS calls FROM calls;")
    return parseInt(rows[0].calls)
}

async function avgDetectionTime() {
    const rows = await readFromDb("SELECT AVG(predictionTime) as detectiontime FROM calls;")
    return parseFloat(rows[0].detectiontime)
}

async function timeSeries() {
    const rows = await readFromDb("SELECT COUNT(*), date_trunc('day', to_timestamp(createdAt)) AS date FROM calls GROUP BY date;")
    return rows
}

async function cardiacArrestsDetected() {
    const rows = await readFromDb("SELECT COUNT(*) AS cardiacarrests FROM calls WHERE predictionCardiacArrest;")
    return parseInt(rows[0].cardiacarrests)
}

async function appendCallEntry(deviceId, createdAt, predictionTime, cardiacArrest) {
    const sql = "INSERT INTO calls (deviceId, createdAt, predictionTime, predictionCardiacArrest) values ($1, $2, $3, $4);"
    await pool.query(sql, [deviceId, createdAt, predictionTime, cardiacArrest])
    console.log('inserted data.')
}

module.exports = {
    readUniqueDevices: readUniqueDevices,
    readTotalCalls: readTotalCalls,
    avgDetectionTime: avgDetectionTime,
    timeSeries: timeSeries,
    cardiacArrestsDetected: cardiacArrestsDetected,
    appendCallEntry: appendCallEntry,
}
