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

httpServer.listen(8080, function() {});

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
    const devices = store.readUniqueDevices()
    const totalCalls = store.readTotalCalls()
    const avgDetectionTime = store.avgDetectionTime()
    const timeSeries = store.timeSeries()
    const cardiacArrestsDetected = store.cardiacArrestsDetected()

    connection.sendUTF(
        JSON.stringify({
            uniqueDevices: await devices,
            totalCalls: await totalCalls,
            avgDetectionTime: await avgDetectionTime,
            timeSeries: await timeSeries,
            cardiacArrestsDetected: await cardiacArrestsDetected,
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
