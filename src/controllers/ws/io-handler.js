/**
 * io-router.js
 * handles io events from clients
 */

'use strict';

var ioHandler = module.exports;

// Setup event handlers
ioHandler.onConnect = socket => {
  socket.on('subscribe', id => {
    socket.join(id)
  });
}
