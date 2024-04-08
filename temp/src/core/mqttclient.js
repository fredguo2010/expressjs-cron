import * as mqtt from 'mqtt'; // import everything inside the mqtt module and give it the namespace "mqtt"
import { socketio } from './socketio';

export class mqttclient {
  static client;

  // 类的访问器方法
  static init(mqttserver) {
    this.client = mqtt.connect(mqttserver); // create a client

    this.client.on('connect', () => {
      this.client.subscribe('presence', err => {
        if (err != null) {
          console.log(err);
          this.client.publish('presence', 'Hello mqtt');
        }
      });
      this.client.subscribe('CEC', err => {
        if (err != null) {
          console.log(err);
          this.client.publish('presence', 'Hello mqtt');
        }
      });
    });

    this.client.on('message', (topic, message) => {
      // message is Buffer
      console.log(message.toString());
      const msgArray = message.toString().split(';');
      const [v1, v2, v3, v4, v5, v6] = msgArray;

      socketio.io.emit('message', {
        ctype: 'device',
        data: {
          v1,
          v2,
          v3,
          v4,
          v5,
          v6,
        },
      });
      //   this.client.end();
    });
  }
}
