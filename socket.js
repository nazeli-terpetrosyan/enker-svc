    var socketIO = require('socket.io');
var db = require('./db');

function connect(server) {
  const io = socketIO(server);
  
  // TODO: Create namespaces
  usersNamespace(io);
}

// TODO: List namespace will provide list of logged in users
function usersNamespace(io) {
  const users = io.of('/users');
  users.on('connection', socket => {
    // TODO: add listener for starting chat
        socket.on('start-chat', (toUser, fromUser) => {
          if (toUser) {
            users.in(toUser.email).emit('start-chat', fromUser);
          }
        });
    
    // TODO: add listener to chat message
    socket.on('chat', (newMessage, toUser) => {
      if (toUser) {
        users.in(toUser.email).emit('chat', newMessage);
      }
    });

    // TODO: add listener for editor message WYSIWIG

    // TODO: add listener for drawing

    // TODO: add listener for logging in, update flag loggedIn in Database, join room
    socket.on('login', user => {
      socket.join(user.email);

      db.getClient().collection("students").findOneAndUpdate(
        {email: user.email},
        {$set: {'loggedIn': true}},
        {returnOriginal: false},
        function(err, results) {
          if(err){
            socekt.emit('list error', err);
          }
          else if(results.value == null) {
            socket.emit('list error', {error: "Student with email "});
          }
          else{
            users.emit('logged in', results.value);
          }
        }
      )
    });

    // TODO: add listener on 'disconnect' to log out user, and emit
    socket.on('logout', user => {
      socket.join(user.email);

      db.getClient().collection("students").findOneAndUpdate(
        {email: user.email},
        {$set: {'loggedIn': false}},
        {returnOriginal: false},
        function(err, results) {
          if(err){
            socekt.emit('list error', err);
          }
          else if(results.value == null) {
            socket.emit('list error', {error: "Student with email "});
          }
          else{
            users.emit('logged out', results.value);
          }
        }
      )
    });

    socket.on('disconnect', user => {
      socket.join(user.email);

      db.getClient().collection("students").findOneAndUpdate(
        {email: user.email},
        {$set: {'loggedIn': false}},
        {returnOriginal: false},
        function(err, results) {
          if(err){
            socket.emit('list error', err);
          }
          else if(results.value == null) {
            socket.emit('list error', {error: "Student with email "});
          }
          else{
            users.emit('logged out', results.value);
          }
        }
      )
    });
    // TODO: add listener for logout message, update db, emit
    
    // TODO: add listener to search query
    socket.on('search', (query, fn) => {
      let criteria = {};
      if(query){
        const textCriteria = {$text: {$search: query}};
        const learningTargetCriteria = {learningTargets: query};
        criteria = {$or: [textCriteria, learningTargetCriteria]};
      }
      db.getClient().collection("students").find(criteria).sort({}).toArray(
        function(err, results) {
          if(err){
            socket.emit('list error', err);
          }
          else{  
            fn(results);
          }
        }
      )
    });
  });
}

module.exports = {
  connect,
}
