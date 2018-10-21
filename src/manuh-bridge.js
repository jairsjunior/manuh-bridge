const manuhLocal = require('manuh');
const info = require('debug')('ManuhBridge');
const MqttClient = require("./modules/mqtt.js").MqttClient;
const ManuhClient = require("./modules/manuh.js").ManuhClient;

class ManuhBridge {

    constructor(manuh, mqttConfig, connectionsCompleted){
        this.__manuhClient = new ManuhClient(manuh);
        this.__mqttClient = new MqttClient(mqttConfig);

        const _self = this

        manuhLocal.subscribe('__message/manuh/mqtt', 'id', function(msg, info){
            _self.__mqttClient.publish(msg.topic, msg.message);
        });

        manuhLocal.subscribe('__message/mqtt/manuh', 'id', function(msg, info){
            _self.__manuhClient.publish(msg.topic, msg.message);
        });

        this.__mqttClient.connect(() => {
            _self.__manuhClient.connect();
            info("Connections Completed. Bridge ready to receive pub/sub.")
            connectionsCompleted()
        });
    }

    subscribeBridge(topics){
        for(let index in topics){
            this.__mqttClient.subscribe(topics[index]);
            this.__manuhClient.subscribe(topics[index]);
        }
    }

    subscribeRemote2LocalTopics(topics){
        for(let index in topics){
            this.__mqttClient.subscribe(topics[index]);
        }
    }

    subscribeLocal2RemoteTopics(topics){
        for(let index in topics){
            this.__manuhClient.subscribe(topics[index]);
        }
    }

}

exports.ManuhBridge = ManuhBridge;