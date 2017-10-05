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

function pushLatestData(connection) {
	pushLatestData2(connection)
		.then(res => console.log('pushed data.'))
		.catch(err => setImmediate(() => { throw err}))


	// uniqueDevices
	// totalCalls
	// CAs detected
	// avgDetectionTime
	// timeSeries
	// console.log('pushed data.');
}

async function pushLatestData2(connection) {
	const devices = await store.readUniqueDevices()
	connection.sendUTF(
		JSON.stringify({
			uniqueDevices: parseInt(devices[0].devices),
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

	pushLatestData(connection);
})
