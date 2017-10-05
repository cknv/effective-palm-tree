var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		devices: null,
		totalCalls: null,
	}
})

var connection = new WebSocket('ws://localhost:1337');

connection.onmessage = function (message) {
	try {
		var parsed = JSON.parse(message.data)
	} catch (e) {
		console.log('Received invalid json: ' + message.data)
		return
	}
	console.log(parsed)

	app.devices = parsed.uniqueDevices
	app.totalCalls = parsed.totalCalls
}
