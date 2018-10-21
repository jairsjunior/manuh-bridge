const manuhLocal = require('manuh');
const info = require('debug')('ManuhBridge');
const MqttClient = require("./modules/mqtt.js").MqttClient;
const ManuhClient = require("./modules/manuh.js").ManuhClient;

let __manuhClient = undefined;
let __mqttClient = undefined;

class ManuhBridge {

    constructor(manuh, mqttConfig, connectionsCompleted){
        __manuhClient = new ManuhClient(manuh);
        __mqttClient = new MqttClient(mqttConfig);

        manuhLocal.subscribe('__message/manuh/mqtt', 'id', function(msg, info){
            __mqttClient.publish(msg.topic, msg.message);
        });

        manuhLocal.subscribe('__message/mqtt/manuh', 'id', function(msg, info){
            __manuhClient.publish(msg.topic, msg.message);
        });

        __mqttClient.connect(() => {
            __manuhClient.connect();
            info("Connections Completed. Bridge ready to receive pub/sub.")
            connectionsCompleted()
        });
    }

    subscribeBridge(topics){
        for(let index in topics){
            __mqttClient.subscribe(topics[index]);
            __manuhClient.subscribe(topics[index]);
        }
    }

    subscribeRemote2LocalTopics(topics){
        for(let index in topics){
            __mqttClient.subscribe(topics[index]);
        }
    }

    subscribeLocal2RemoteTopics(topics){
        for(let index in topics){
            __manuhClient.subscribe(topics[index]);
        }
    }

}

exports.ManuhBridge = ManuhBridge;