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
  const data = {
    labels: timeSeries.map((each) => each.date.slice(0, 10)),
    series: [timeSeries.map((each) => each.value)],
  }

  const options = {
    axisY: {
      onlyInteger: true,
    },
    chartPadding: {
      bottom: 30,
    },
  }
  new Chartist.Bar('.ct-chart', data, options);
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
