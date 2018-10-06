var manuhLocal = require('manuh');
var debug = require('debug')('debug');
var info = require('debug')('manuhClient');

class _ManuhClient {

    constructor(manuh){
        this.manuh = manuh;
        this.topics = [];
        this.connected = false;
        this.clientId = 'manuh2mqtt_' + Math.random().toString(16).substr(2, 8);
        this.id = 0;
    }

    connect() {
        info(`==> Connecting to manuh`);
        this.connected = true;
    } 

    publish(topic, message) {
        if (this.connected == false) {
            return;
        }
        info(`Publish message ${topic} '${message}'`);
        this.manuh.publish(topic.toString(), message.toString(), { retained: false });
    }

    subscribedFunctions(message, inf) {
        info(`Message ${this.id} '${this}'`, message);
        const msg = { topic: this, message: message };
        manuhLocal.publish('__message/manuh/mqtt', msg, { retained: true });
    }

    subscribe(topic) {
        this.topics.push(topic);
        if (this.connected) {
            info(`Subscribed '${topic}'`);
            this.manuh.subscribe(topic, this.clientId, this.subscribedFunctions.bind(topic));
        }
    }

}

exports._ManuhClient = _ManuhClient;