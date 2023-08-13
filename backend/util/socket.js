const socketio = require('socket.io');
const http = require('http');
const app = require('express')();

const httpServer = http.createServer(app);

const sock = socketio(httpServer, {
    cors: { origin: '*' }
});

sock.on('connection', (socket) => {
    console.log(`Client connected [id=${socket.id}]`);
    socket.join(socket.request._query.id);
    socket.on('disconnect', () => {
        console.info(`Client disconnected [id=${socket.id}]`);
    });
});

exports.sendMessage = (event, message) => {
    console.log(message);
    sock.emit(event, message);
}

exports.server = httpServer;
exports.app = app;