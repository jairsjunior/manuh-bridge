# Manuh x MQTT bridge

This project creates a bridge between topics on Manuh (client-side pub/sub interface) with MQTT (server pub/sub iterface)

## How to use

1. Install this package on your project
    ```sh
    npm install --save manuh-bridge
    ```
    
2. Then use it as follows:
    ```js
    const manuh = require('manuh');
    const { ManuhBridge } = require('manuh-bridge');
    const mqtt = require('mqtt');

    // Configure MQTT connection
    const mqttConfig = { protocol: 'wss', host: 'iot.eclipse.org', port: 443, context: 'ws' };

    // Create of ManuhBridge
    const manuhBridge = new ManuhBridge(manuh, mqttConfig, () => {
        console.log('Manuh Bridge connected!');
        //Sign bridged topics when MQTT is connected
        manuhBridge.subscribeRemote2LocalTopics([ 'door/status/set' ]);
        manuhBridge.subscribeLocal2RemoteTopics([ 'window/status/set' ]);        

        // Subscribe Manuh Topic
        manuh.subscribe('door/status/set', 'door', function(msg, info){
            message = JSON.parse(msg);
            console.log('Received message on Manuh topic', JSON.stringify(message));

            if(message.message == "Hi!"){
                //Publish package on Manuh Topic
                let package = { message:'Hello!', topicToRespond:'' }
                manuh.publish(message.topicToRespond, JSON.stringify(package), { retained: false });
                console.log('Publish message on Manuh topic', JSON.stringify(package));
            }
        });

        //Start MQTT Client
        start();
    });

    function start() {
        // Connect to MQTT broker
        const clientMqtt = mqtt.connect('wss://iot.eclipse.org/ws');

        // On Connected MQTT
        clientMqtt.on('connect', function () {
        // Subscribe MQTT Topic
        clientMqtt.subscribe('window/status/set');

        // Publish MQTT Topic
        let message = { message:'Hi!', topicToRespond: 'window/status/set' };
        clientMqtt.publish('door/status/set', JSON.stringify(message));
        console.log('Publish Message on MQTT Topic', JSON.stringify(message));
        });

        // On Message Received on MQTT Topic
        clientMqtt.on('message', function (topic, message) {
        console.log('Received Message by MQTT');
        console.log('Topic: ', topic);
        console.log('Message:', JSON.parse(message.toString()));
        clientMqtt.end();
        });
    }
    ```
