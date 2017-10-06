var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    devices: null,
    totalCalls: null,
    cardiacArrestsDetected: null,
    avgDetectionTime: null,
  }
})

var connection = new WebSocket('ws://localhost:1337');

function renderChart() {
  const data = {
    // labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    series: [
      [5, 2, 4, 2, 0.5, 4, 5, 6, 2, 2, 2, 2, 2]
    ],
  }
  new Chartist.Bar('.ct-chart', data);
}

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
  app.avgDetectionTime = parsed.avgDetectionTime
  app.cardiacArrestsDetected = parsed.cardiacArrestsDetected

  renderChart()
}
