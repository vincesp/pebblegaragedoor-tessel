var http = require('http');
var tessel = require('tessel');
var relay = require('relay-mono').use(tessel.port.B);
var ws = require("nodejs-websocket");
var wifi = require('wifi-cc3000');

// INSERT IP ADDRESS HERE. 
// Always prepend with 'ws://' to indicate websocket
var webSocketUrl = 'ws://your-instance.herokuapp.com';

var relayChannel = 1;
var onDuration = 300; //ms
var connection;

function connect() {
    if (connection) {
        console.log('disconnecting ...');
        connection.close(1000);
    }

    console.log('connecting ...');
    tessel.led[0].write(0);

    var thisConnection = connection = ws.connect(webSocketUrl, function () {
        // When we connect to the server, send some catchy text
        console.log('connected');
        tessel.led[0].write(1);
        thisConnection.sendText("Tessel garage door opener");
    });

    // When we get text back
    thisConnection.on('text', function (text) {
        // print it out
        console.log("Echoed back from server:", text);

        if (text === 'trigger') {
            console.log('turnOn');
            relay.turnOn(relayChannel);
            setTimeout(function () {
                console.log('turnOff');
                relay.turnOff(relayChannel);
            }, onDuration);
        }
    });

    thisConnection.on('close', function (code, reason) {
        console.log('Connection closed', code, reason);
        if (thisConnection === connection) {
            tessel.led[0].write(0);
        }
    });

    thisConnection.on('error', function (error) {
        console.log('Connection error', error);
        if (thisConnection === connection) {
            tessel.led[0].write(0);
        }
    });
}

relay.on('ready', function () {
    if (wifi.isConnected()) {
        connect();
    } else {
        wifi.on('connect', connect);
    }
    //watchdog
    var resetPin = tessel.port['A'].digital[2]; //G3
    var start = new Date().getTime();
    setInterval(function () {
        if (!wifi.isConnected() || (new Date() - start > 4000000)) {
            console.log('disconnecting ...');
            if (connection) connection.close(1000);
            console.log('resetting ...');
            resetPin.output(0);
        } else if (!connection || connection.readyState != connection.OPEN) {
            tessel.led[0].write(0);
            connect();
        }
    }, 15000);
});
