const mqtt = require('mqtt');
const manuhLocal = require('manuh');
const debug = require('debug')('debug');
const info = require('debug')('mqttClient');

class MqttClient {

    constructor(config){
        this.config = config;
        this.topics = [];
        this.connected = false;
        this.config.clientId = 'mqtt2manuh_' + Math.random().toString(16).substr(2, 8);
        this.id = 0;
    }

    connect() {
        info(`==> Connecting to ${this.config.protocol}://${this.config.host}:${this.config.port} (client ID ${this.config.clientId})`);

        var client = this.client  = mqtt.connect(this.config);

        client.on('connect', () => {
            info('Connected ==> ');
        
            this.topics.forEach(t => {
                info(`Subscribe to ${t}`);
                client.subscribe(t);
            });

            this.connected = true; 
        });
        
        client.on('reconnect', (e) => {
            debug('Try to reconnect', e);
        });

        client.on('offline', (e) => {
            info('Broker is offline', e);
        });

        client.on('error', (e) => {
            info('error', e);
        });

        client.on('message', (topic, message) => {
            this.id++;
            info(`Message ${this.id} '${topic}'`, message.toString());

            const msg = { topic: topic, message: message.toString() };
            manuhLocal.publish('__message/mqtt/manuh', msg, { retained: false } );
        });
    }

    publish(topic, message) {
        if (this.connected == false) {
            return;
        }
        info(`Publish message ${topic} '${message}'`);
        this.client.publish(topic.toString(), message.toString(), {qos: 0, retain: false});
    }

    subscribe(topic) {
        this.topics.push(topic);
        if (this.connected) {
            this.client.subscribe(topic);
        }
    }

    

}

exports.MqttClient = MqttClient;