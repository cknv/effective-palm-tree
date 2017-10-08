import random
from datetime import datetime
from datetime import timedelta
from uuid import uuid4

import requests


def prediction_time():
    return random.randint(30, 120)


def created_time():
    now = datetime.utcnow()
    interval = timedelta(hours=1)
    a_little_while_ago = now - interval * random.randint(0, 24 * 60)
    return int(a_little_while_ago.timestamp())


def ca_prediction():
    return random.random() > 0.94


def main():
    device_id = str(uuid4())
    url = 'http://localhost:8080'

    for __ in range(2250):
        resp = requests.post(
            url,
            json={
                'deviceId': device_id,
                'createdAt': created_time(),
                'predictionTime': prediction_time(),
                'cardiacArrest': ca_prediction(),
            },
        )
        print(resp)


if __name__ == '__main__':
    main()
