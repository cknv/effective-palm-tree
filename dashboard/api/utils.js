/**
 * Fills a timeseries array of objects with a date and a value, with the filler
 * if there are any gaps in the between the dates in the objects.
 * @param {array} timeSeries - The timeseries to fill.
 * @param {object} filler - What to fill the timeseries with.
**/

function fillTimeSeries(timeSeries, filler) {
    const quickMap = new Map(timeSeries.map((each) => [each.date.getTime(), each.value]))

    const earliestDate = timeSeries[0].date
    const latestDate = timeSeries[timeSeries.length - 1].date
    for (let current of dateMaker(earliestDate, latestDate)) {
        // Using the dates as keys resulted in duplicates keys, using the epoch
        // turned out to be more reliable, even though it requires conversion
        // back to dates afterwards.
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

function* dateMaker(since, until, daysStep = 1) {
    const current = new Date(since)
    while (current <= until) {
        yield current
        current.setDate(current.getDate() + daysStep)
    }
}

module.exports = {
    fillTimeSeries: fillTimeSeries,
}
