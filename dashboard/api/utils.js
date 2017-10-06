function fillTimeSeries(timeSeries, filler) {
    const quickMap = new Map(timeSeries.map((each) => [each.date.getTime(), each.value]))

    const earliestDate = timeSeries[0].date
    const latestDate = timeSeries[timeSeries.length - 1].date
    for (let current = new Date(earliestDate); current <= latestDate; current.setDate(current.getDate() + 1)) {
        const currentEpoch = current.getTime()

        if (quickMap.has(currentEpoch)) {
            continue
        }
        quickMap.set(currentEpoch, filler)
    }

    const filledTimeSeries = Array.from(quickMap.entries()).map((each) => {
        return {
            date: new Date(each[0]),
            value: each[1],
        }
    })

    return filledTimeSeries.sort((each, other) => {return each.date - other.date})
}

module.exports = {
    fillTimeSeries: fillTimeSeries,
}