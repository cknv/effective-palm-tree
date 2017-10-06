const WebSocketServer = require('websocket').server;
const http = require('http');
const express = require('express');
const redis = require('redis');

const store = require('./store')

const app = express();

app.post('/', (request, response) => {
    response.send('received');
    for (var i = 0; i < connections.length; i++) {
        pushLatestData(connections[i]);
    }
});
const httpServer = http.createServer(app);

httpServer.listen(1337, function() {});

const wsServer = new WebSocketServer({
    httpServer: httpServer
});

connections = [];

function pushLatestDataWrapper(connection) {
    pushLatestData(connection)
        .then(res => console.log('pushed data.'))
        .catch(err => setImmediate(() => { throw err}))
}

async function pushLatestData(connection) {
    const devices = await store.readUniqueDevices()
    const totalCalls = await store.readTotalCalls()
    const avgDetectionTime = await store.avgDetectionTime()
    const timeSeries = await store.timeSeries();

    connection.sendUTF(
        JSON.stringify({
            uniqueDevices: parseInt(devices[0].devices),
            totalCalls: parseInt(totalCalls[0].calls),
            avgDetectionTime: parseInt(avgDetectionTime[0].detectiontime),
            timeSeries: timeSeries,
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
