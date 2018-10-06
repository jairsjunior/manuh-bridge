var manuhLocal = require('manuh');
var MqttClient = require("./modules/mqtt.js")._MqttClient;
var ManuhClient = require("./modules/manuh.js")._ManuhClient;

var __manuhClient;
var __mqttClient;

class ManuhBridge {

    constructor(manuh, mqttConfig){
        __manuhClient = new ManuhClient(manuh);
        __mqttClient = new MqttClient(mqttConfig);

        manuhLocal.subscribe('__message/manuh/mqtt', 'id', function(msg, info){
            __mqttClient.publish(msg.topic, msg.message);
        });

        manuhLocal.subscribe('__message/mqtt/manuh', 'id', function(msg, info){
            __manuhClient.publish(msg.topic, msg.message);
        });

        __manuhClient.connect();
        __mqttClient.connect();
    }

    subscribeBridge(topics){
        for(var index in topics){
            __mqttClient.subscribe(topics[index]);
            __manuhClient.subscribe(topics[index]);
        }
    }

    subscribeRemote2LocalTopics(topics){
        for(var index in topics){
            __mqttClient.subscribe(topics[index]);
        }
    }

    subscribeLocal2RemoteTopics(topics){
        for(var index in topics){
            __manuhClient.subscribe(topics[index]);
        }
    }

}

exports.ManuhBridge = ManuhBridge;