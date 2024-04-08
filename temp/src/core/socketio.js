const { instrument } = require('@socket.io/admin-ui');

class socketio {
  static io;

  constructor(_io) {
    this.io = _io;
  }

  // 类的访问器方法
  static init(_io) {
    this.io = _io;
    // 在这里可以设置拦截访问操作
    instrument(this.io, {
      auth: false,
      mode: 'development',
    });

    this.io.on('connection', (socket) => {
      console.log(`socket.io connected: ${socket.id}`);

      // client ask device status
      socket.on('device-status', () => {
        socket.emit('device-status');
      });

      socket.on('disconnect', () => {
        console.log(`Client ${socket.id} diconnected`);
        socket.broadcast.emit('Disconnect', socket.id);
      });

      socket.on('broadcastata', (data) => {
        console.log(`Client ${socket.id} data`);
        const date = new Date();
        const time = `0${date.getHours()}`.slice(-2) + `0${date.getMinutes()}`.slice(-2);
        socket.broadcast.emit('broadcastata', { time, message: data });
      });

      const timer = setInterval(() => {
        const trand = Math.ceil(Math.random() * 1000);
        socket.emit('message', { ctype: 'irst', data: trand });
      }, 5000);
    });
  }
}

module.exports = { socketio };
