const WebSocketServer = require('websocket').server;
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const store = require('./store')

const app = express();
app.use(bodyParser.json())

app.post('/', (request, response) => {
    store.appendCallEntry(
        request.body.deviceId,
        request.body.createdAt,
        request.body.predictionTime,
        request.body.cardiacArrest,
    ).then(console.log('not pushing'))
    .catch(err => setImmediate(() => { throw err }))
    response.send('received');
});

const httpServer = http.createServer(app);

httpServer.listen(8080, function() {});

const wsServer = new WebSocketServer({
    httpServer: httpServer
});

const connections = [];

store.registerCallsListener((msg) => pushToConnections(connections))

function pushToConnections(connections) {
    if (connections.length == 0) {
        console.log('no connections, skipping push')
        return
    }

    pushLatestData(connections)
        .then(res => console.log('pushed data.'))
        .catch(err => setImmediate(() => { throw err}))
}

async function pushLatestData(connections) {
    const devices = store.readUniqueDevices()
    const totalCalls = store.readTotalCalls()
    const avgDetectionTime = store.avgDetectionTime()
    const timeSeries = store.timeSeries()
    const cardiacArrestsDetected = store.cardiacArrestsDetected()
    const daysSinceStart = store.daysSinceStart()

    const payload = JSON.stringify({
        uniqueDevices: await devices,
        totalCalls: await totalCalls,
        avgDetectionTime: await avgDetectionTime,
        timeSeries: await timeSeries,
        cardiacArrestsDetected: await cardiacArrestsDetected,
        daysSinceStart: await daysSinceStart,
    })

    console.log('pushing to ' + connections.length + ' connections.')

    for (let connection of connections) {
        connection.sendUTF(payload)
    }
}

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.')

    const connectionIndex = connections.push(connection) - 1;
    console.log('Connection accepted, Current connections: ' + connections.length);

    connection.on('close', function(connection) {
        connections.splice(connectionIndex, 1);
        console.log('Connection closed, Remaining connections: ' + connections.length);
    });

    pushToConnections([connection]);
})
