const manuh = require('manuh');
const ManuhBridge = require('../src/manuh-bridge').ManuhBridge;
const mosca = require("mosca");
const mqtt = require('mqtt');
const assert = require('assert');

let server = undefined;

describe('#Case tests of manuh-bridge', function(){

    it('--> Start MQTT server', function(done) {
        server = new mosca.Server({ port:1883 });
        server.on('ready', () => {
            // fired when the mqtt server is ready
            done();
        });	//on init it fires up setup()
        
    });

    it('--> Create Bridge between Manuh and MQTT', function(done){
        // Create of manuhBridge and signChannels
        const mqttConfig = { protocol: 'mqtt', host: 'localhost', port: 1883 };
        const manuhBridge = new ManuhBridge(manuh, mqttConfig, () => {
            manuhBridge.subscribeRemote2LocalTopics([ 'door/status/set' ]);
            manuhBridge.subscribeLocal2RemoteTopics([ 'window/status/set' ]);        
            done();
        });
    });

    it('--> Subscribe bridged Manuh Topic "door/status/set" on receive message and respond in Another Manuh topic bridged to MQTT', function(){
        manuh.subscribe('door/status/set', 'door', function(msg, info){
            message = JSON.parse(msg);
            if(message.message == "Hi!"){
                let package = { message:'Hello!', topicToRespond:'' }
                manuh.publish(message.topicToRespond, JSON.stringify(package), { retained: false });
            }
            assert(message, { message:'Hi!', topicToRespond: 'window/status/set' });
        });
    });

    it('--> Connect to MQTT Server and Try the Bridge', function(done){
        const clientMqtt = mqtt.connect('mqtt://localhost');
        //Starting MQTT CLIENT
        clientMqtt.on('connect', function () {
            clientMqtt.subscribe('window/status/set');
            let message = { message:'Hi!', topicToRespond: 'window/status/set' };
            clientMqtt.publish('door/status/set', JSON.stringify(message));
        });

        clientMqtt.on('message', function (topic, message) {
            clientMqtt.end();
            done();
        });
    });

    it('--> Close MQTT server', function(){
        server.close();
    });
});








