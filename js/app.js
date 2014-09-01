define([
  'jquery',
  'underscore',
  'backbone',

  'socket.io',

  'models/Connection',

  'collections/ConnectionList',

  'views/ConnectionListView',
  'views/CaptureImageView'
], function(
  $,
  _,
  Backbone,

  io,

  Connection,

  ConnectionList,

  ConnectionListView,
  CaptureImageView
) {


  var App = Backbone.View.extend({

    el: '#app',

    template: _.template(function() {/*
      <h1>Doodle</h1>
      <h3><%- name %> <small>id: <%- connectionId %></small></h3>
      <div>
        <h4>Other connected</h4>
        <div id="connections"></div>
      </div>
      <div>
        <button id="btn-take_picture">Take picture</button>
      </div>
    */}.toString().split('\n').slice(1, -1).join('')),

    events: {
      'click #btn-take_picture': 'takePicture'
    },

    initialize: function() {
      _.bindAll(this, 'setupIO', 'render', 'takePicture');

      this.connectionList = new ConnectionList();
      this.connectionListView = new ConnectionListView();
      this.connectionListView.setConnectionList(this.connectionList);

      window.collection = this.connectionList;

      this.name = ['Hektor', 'Gustav', 'Mikaela', 'Emma'][parseInt(Math.random() * 4, 10)];

      this.setupIO();
    },

    setupIO: function() {
      var socket = this.socket = io();

      socket.on('connect', _.bind(function() {
        this.connectionId = socket.io.engine.id;
        console.log('connected');

        socket.emit('app.connect', {
          appId: 'doodle'
        });

        socket.emit('app.connections');
      }, this));

      socket.on('app.connections', _.bind(function(data) {

        // set sockets
        this.connectionList.setConnections(data.connections);

        // request name from all
        _.each(data.connections, function(connection) {

          socket.emit('app.emit', {
            event: 'requestName',
            to: connection.id,
            data: {
              target: this.connectionId
            }
          })
        }, this);

      }, this));

      socket.on('requestName', _.bind(function(data) {
        socket.emit('app.emit', {
          event: 'connection.name',
          to: data.target,
          data: {
            connectionId: this.connectionId,
            name: this.name
          }
        });
      }, this));

      socket.on('connection.name', _.bind(function(data) {
        var connection = this.connectionList.getById(data.connectionId);
        if (connection) {
          connection.set('name', data.name);
        }
      }, this));
    },

    render: function() {
      this.$el.html(this.template({
        name: this.name,
        connectionId: this.connectionId
      }));
      this.$('#connections').html(this.connectionListView.render().$el);

      return this;
    },

    takePicture: function() {
      var imageView = new CaptureImageView();
      this.$el.html(imageView.render().$el);
    }

  });


  return App;
});