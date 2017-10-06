const WebSocketServer = require('websocket').server;
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const store = require('./store')

const app = express();
app.use(bodyParser.json())

app.post('/', (request, response) => {
    store.appendCallEntry(
        request.body.deviceId,
        request.body.createdAt,
        request.body.predictionTime,
        request.body.cardiacArrest,
    ).then(pushToAllConnections())
    .catch(err => setImmediate(() => { throw err }))
    response.send('received');
});

const httpServer = http.createServer(app);

httpServer.listen(1337, function() {});

const wsServer = new WebSocketServer({
    httpServer: httpServer
});

const connections = [];

function pushToAllConnections() {
    for (let connection of connections) {
        pushLatestDataWrapper(connection)
    }
}

function pushLatestDataWrapper(connection) {
    pushLatestData(connection)
        .then(res => console.log('pushed data.'))
        .catch(err => setImmediate(() => { throw err}))
}

async function pushLatestData(connection) {
    const devices = await store.readUniqueDevices()
    const totalCalls = await store.readTotalCalls()
    const avgDetectionTime = await store.avgDetectionTime()
    const timeSeries = await store.timeSeries()
    const cardiacArrestsDetected = await store.cardiacArrestsDetected()

    connection.sendUTF(
        JSON.stringify({
            uniqueDevices: devices,
            totalCalls: totalCalls,
            avgDetectionTime: avgDetectionTime,
            timeSeries: timeSeries,
            cardiacArrestsDetected: cardiacArrestsDetected,
        })
    );
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

    pushLatestDataWrapper(connection);
})
