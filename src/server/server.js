import path from 'path';
import Express from 'express';
import SocketIO from 'socket.io';

import http from 'http';
import Debug from 'debug';

import Graylog from './graylog';
import socket from './socket';

var debug = Debug('worker');

var app = Express();
var server;

const PATH_DIST = path.resolve(__dirname, '../../dist');

app.use(Express.static(PATH_DIST));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

server = app.listen(process.env.PORT || 1664, () => {
    var port = server.address().port;

    debug('Server is listening at %s', port);
});

var io = SocketIO.listen( server );
io.sockets.on('connection', socket);

