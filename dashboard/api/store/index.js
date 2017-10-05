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
    var rows = await readFromDb("SELECT COUNT(DISTINCT deviceId) AS devices FROM calls;")
    return rows
}

async function readTotalCalls() {
    const rows = await readFromDb("SELECT COUNT(*) AS calls FROM calls;")
    return rows
}

module.exports = {
    readUniqueDevices: () => {
        return readUniqueDevices()
    },
    readTotalCalls: () => {
        return readTotalCalls()
    }
}
