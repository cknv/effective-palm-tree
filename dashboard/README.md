Dashboard
=========

A simple dashboard displaying metrics saved in a postgres database.

The communication works via a WebSocket, which pushes the latest data to the client upon connection and whenever changes happen in the database.

Trying it out
-------------

- Get Node 8, or above.
- Run `$ npm install`.
- Run `$ docker-compose up`.
- Run the API via `$ node api/server.js`.
- Open the `frontend/index.html` page in your preferred webbrowser.
- Optionally run `$ python feeder.py` to put data in the database and watch the dashboard update.

Recommened Changes
------------------

- There should be a proxy in front of the API to allow running multiple instances.
- Inserts should happen via the API itself, to allow for isolation of the database - which it already it, but not being taken advantage of.
- Before pushing data to the connected clients, the data should be loaded only once, and saved in a temporary store. Such as a redis, this could also mean that the trigger could be ommitted and replaced by a listener to a pubsub event in the same redis.
- The frontend should not use CDN JS, but rather be built with a Node build tool.
- The frontend should take more advantage of Vue componets.
- The frontend should be better at reconnecting to the API in the event that something went wrong.
