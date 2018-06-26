const manuh = require('manuh');
const ManuhBridge = require('../src/manuh-bridge').ManuhBridge;
const mosca = require("mosca");
const mqtt = require('mqtt');

// ==================== START MOSCA SERVER TO TEST MQTT ===============================
const server = new mosca.Server({ port:1883 });
server.on('ready', setup);	//on init it fires up setup()
// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running');
}
// ====================================================================================

const mqttConfig = {
    protocol: 'mqtt',
    host: 'localhost',
    port: 1883
}

// Create of manuhBridge and signChannels
const manuhBridge = new ManuhBridge(manuh, mqttConfig);
manuhBridge.subscribeRemote2LocalTopics([ 'door/#' ]);
manuhBridge.subscribeLocal2RemoteTopics([ 'window/#' ]);

manuh.subscribe('door/status/set', 'door', function(msg, info){
    console.log(`Manuh received message on topic door/status/set =>`, JSON.stringify(msg));
    message = JSON.parse(msg);
    if(message.message == "Hi!"){
        let package = { message:'Hello!', topicToRespond:'' }
        manuh.publish(message.topicToRespond, JSON.stringify(package), { retained: false });
    }
});

setTimeout(function() {
    const clientMqtt = mqtt.connect('mqtt://localhost');
    //Starting MQTT CLIENT
    clientMqtt.on('connect', function () {
        console.log('MQTT client is connected');
        clientMqtt.subscribe('window/status/set');
        let message = { message:'Hi!', topicToRespond: 'window/status/set' };
        clientMqtt.publish('door/status/set', JSON.stringify(message));
    });
    clientMqtt.on('message', function (topic, message) {
        // message is Buffer
        console.log(`MQTT received message on topic ${topic} =>`, JSON.stringify(message.toString()));
        clientMqtt.end();
    });
}, 2000);








