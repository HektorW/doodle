define([
  'underscore',
  'socket.io',

  'models/ImageModel'
], function(
  _,
  io,

  ImageModel
) {
  
  var SocketHandler = {

    appId: 'doodleapp',

    socket: null,
    connectionId: null,




    init: function(options) {
      this.user = options.user;

      this.userCollection = options.userCollection;
      this.responseImageCollection = options.responseImageCollection;
      this.requestImageCollection = options.requestImageCollection;

      this.setupSocket();
    },

    setupSocket: function() {
      var socket = this.socket = io();

      socket.on('connect', _.bind(this.onConnect, this));

      socket.on('app.connections', _.bind(this.onAppConnections, this));

      socket.on('connection.name.response', _.bind(this.onConnectionNameResponse, this));
      socket.on('connection.name.request', _.bind(this.onConnectionNameRequest, this));

      socket.on('connection.doodle.request', _.bind(this.onConnectionDoodleRequest, this));
      socket.on('connection.doodle.response', _.bind(this.onConnectionDoodleResponse, this));
    },

    onConnect: function() {
        console.log('connected');
        var socket = this.socket;
        this.user.set('connectionId', socket.io.engine.id);

        socket.emit('app.connect', {
          appId: this.appId
        });
        socket.emit('app.connections');
    },

    onAppConnections: function(data) {
      var socket = this.socket;

      this.userCollection.setUsers(data.connections);

      _.each(data.connections, function(connection) {
        socket.emit('app.emit', {
          event: 'connection.name.request',
          to: connection.id,
          data: {
            target: this.user.get('connectionId')
          }
        });
      }, this);
    },

    onConnectionNameResponse: function(data) {
      var connection = this.userCollection.getById(data.connectionId);
      if (connection) {
        connection.set('name', data.name);
      }
    },

    onConnectionNameRequest: function(data) {
      this.socket.emit('app.emit', {
        event: 'connection.name.response',
        to: data.target,
        data: {
          connectionId: this.user.get('connectionId'),
          name: this.user.get('name')
        }
      });
    },


    onConnectionDoodleRequest: function(data) {
      var user = this.userCollection.getById(data.from);

      var model = new ImageModel({
        dataURI: data.dataURI,
        width: data.width,
        height: data.height,
        user: user
      });

      this.requestImageCollection.add(model);
    },

    onConnectionDoodleResponse: function(data) {
      var user = this.userCollection.getById(data.from);

      var model = new ImageModel({
        dataURI: data.dataURI,
        width: data.width,
        height: data.height,
        user: user
      });

      this.responseImageCollection.add(model);
    },



    //////////////////////
    // Public functions //
    //////////////////////

    sendDoodleResponse: function(imageModel) {
      this.socket.emit('app.emit', {
        event: 'connection.doodle.response',
        to: imageModel.get('user').get('connectionId'),
        data: {
          dataURI: imageModel.get('dataURI'),
          width: imageModel.get('width'),
          height: imageModel.get('height'),
          from: this.user.get('connectionId')
        }
      });
    },

    sendDoodleRequest: function(imageModel) {
      this.socket.emit('app.emit', {
        event: 'connection.doodle.request',
        to: imageModel.get('user').get('connectionId'),
        data: {
          dataURI: imageModel.get('dataURI'),
          width: imageModel.get('width'),
          height: imageModel.get('height'),
          from: this.user.get('connectionId')
        }
      });
    }
  };


  return SocketHandler;

});