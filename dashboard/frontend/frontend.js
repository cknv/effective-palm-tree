var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    devices: null,
    totalCalls: null,
    cardiacArrestsDetected: null,
    avgDetectionTime: null,
    daysSinceStart: null,
  }
})

var connection = new WebSocket('ws://localhost:8080');

function renderChart(timeSeries) {
  const labels = timeSeries.map((each) => { return each.date.slice(0, 10) })
  const values = timeSeries.map((each) => { return each.value })

  const data = {
    labels: labels,
    series: [values],
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
  app.avgDetectionTime = Math.round(parsed.avgDetectionTime * 100) / 100
  app.cardiacArrestsDetected = parsed.cardiacArrestsDetected
  app.daysSinceStart = Math.round(parsed.daysSinceStart * 100) / 100

  renderChart(parsed.timeSeries)
}
