# Garage door opener for your Pebble watch

This is the application for a [Tessel board](https://tessel.io/).

It uses a [Relay module](https://tessel.io/modules#module-relay) to "push" the button of your garage door.

The original Tessel's WiFi module has an instable firmware. For that reason, the code reboots the Tessel on an interval. For this feature to work, you have to connect the G3 pin with the reset pin.

The garage door connects to the Heroku instance through a websocket.

Before installing on the board, make sure you configure the URL your Heroku instance:

```javascript
// INSERT IP ADDRESS HERE. 
// Always prepend with 'ws://' to indicate websocket
var webSocketUrl = 'ws://your-instance.herokuapp.com';
```
