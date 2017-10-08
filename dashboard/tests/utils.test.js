import test from 'ava';
import utils from '../api';

test(t => {
  const withGaps = [
    {
      date: new Date(2017, 10, 8),
      value: 10,
    },
    {
      date: new Date(2017, 10, 10),
      value: 10,
    },
  ]
  const withoutGaps = [
    {
      date: new Date(2017, 10, 8),
      value: 10,
    },
    {
      date: new Date(2017, 10, 9),
      value: 0,
    },
    {
      date: new Date(2017, 10, 10),
      value: 10,
    },
  ]

  t.deepEqual(utils.fillTimeSeries(withGaps, 0), withoutGaps)
})
