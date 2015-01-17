#!/usr/bin/env node

var net = require('net');
var ip = require('ip');
var colors = require('colors');

/*
 * Port to listen on.
 */
var port = 6666;

/*
 * Name of the speaking chat robot
 */
var bot = 'Ivashka';

var connectionsCount = 0;
var users = {};

var server = net.createServer(function (conn) {

  // executes every time a new connection to the server is established.
  var nickname;

  conn.setEncoding('utf8');

  conn.on('data', function (data) {
    data = data.replace(/[\n\r]/g, '') // strip the "new line" character
    if (!nickname) {
      if (users[data]) {
        var message = {
          author: bot,
          text: 'nickname already in use. try again: '
        };
        unicast(message, conn);
        return;
      } else {
        nickname = data;
        users[nickname] = conn;
        var message = {
          author: bot,
          text: nickname + ' joined the room'
        };
        broadcast(message, conn);
        console.log(colors.grey(' > ' + nickname + ' joined the room'));
      }
    } else {

      // a chat message
      var message = {
        author: nickname,
        text: data
      };
      broadcast(message, true);
    }
  });

  conn.on('close', function () {
    connectionsCount--;
    delete users[nickname];
    var message = {
      author: bot,
      text: nickname + ' left the room'
    };
    broadcast(message);
    console.log(colors.grey(' > ' + nickname + ' left the room'));
  });

  unicast({
    author: 'Welcome',
    text: connectionsCount
  }, conn);

  connectionsCount++;

  function broadcast(msg, exceptMyself) {
    for (var i in users) {
      if (!exceptMyself || i != nickname) {
        users[i].write(JSON.stringify(msg));
      }
    }
  }

});

function unicast(msg, user) {
  user.write(JSON.stringify(msg));
}


server.listen(port, function () {
  console.log(colors.cyan('\tserver listening on *:' + port));
  console.log(colors.cyan('\tlocal network ip ' + ip.address()));
});