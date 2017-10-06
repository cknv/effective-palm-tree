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
    const rows = await readFromDb("SELECT COUNT(*), createdAt FROM calls GROUP BY createdAt;")
    return rows
}

async function cardiacArrestsDetected() {
    const rows = await readFromDb("SELECT COUNT(*) AS cardiacarrests FROM calls WHERE predictionCardiacArrest;")
    return parseInt(rows[0].cardiacarrests)
}

module.exports = {
    readUniqueDevices: readUniqueDevices,
    readTotalCalls: readTotalCalls,
    avgDetectionTime: avgDetectionTime,
    timeSeries: timeSeries,
    cardiacArrestsDetected: cardiacArrestsDetected,
}
