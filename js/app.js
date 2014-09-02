define([
  'jquery',
  'underscore',
  'backbone',

  'socket.io',

  'models/Connection',
  'models/DoodleImageModel',

  'collections/ConnectionList',

  'views/ConnectionListView',
  'views/DrawDoodleView',
  'views/DoodleImageView',
  'views/CaptureImageView'
], function(
  $,
  _,
  Backbone,

  io,

  Connection,
  DoodleImageModel,

  ConnectionList,

  ConnectionListView,
  DrawDoodleView,
  DoodleImageView,
  CaptureImageView
) {


  var App = Backbone.View.extend({

    el: '#app',

    template: _.template(function() {/*
      <h1>Doodle</h1>
      <h3><%- name %> <small>id: <%- connectionId %></small></h3>
      <div>
        <button id="btn-take_picture">Take picture</button>
      </div>
    */}.toString().split('\n').slice(1, -1).join('')),

    events: {
      'click #btn-take_picture': 'takePicture'
    },

    initialize: function() {
      _.bindAll(this, 'setupIO', 'render', 'takePicture', 'onConnectionSelected');

      this.connectionList = new ConnectionList();
      this.connectionListView = new ConnectionListView();
      this.connectionListView.setConnectionList(this.connectionList);
      this.connectionListView.on('connection:select', this.onConnectionSelected);

      window.collection = this.connectionList;

      var names = ['Hektor', 'Gustav', 'Mikaela', 'Emma', 'Anders', 'Henrik'];
      this.name = names[parseInt(Math.random() * names.length, 10)];

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
        this.$('small').html(this.connectionId);
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
          });
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

      socket.on('doodle.request', _.bind(function(data) {

        var model = new DoodleImageModel({
          dataURI: data.dataURI
        });

        var doodleView = new DrawDoodleView({
          doodleImageModel: model,
          connectionId: data.from
        });
        this.$el.html(doodleView.render().$el);

        doodleView.on('request:back', function() {
          this.render();
        }, this);
        doodleView.on('request:send', function(data) {

          socket.emit('app.emit', {
            event: 'doodle.response',
            to: data.connectionId,
            data: {
              dataURI: data.doodleImageModel.get('dataURI'),
              from: this.connectionId
            }
          });

          this.render();

        }, this);

      }, this));

      socket.on('doodle.response', _.bind(function(data) {

        var model = new DoodleImageModel({
          dataURI: data.dataURI
        });

        var view = new DoodleImageView({
          doodleImageModel: model
        });
        this.$el.html(view.render().$el);

        view.on('request:back', function() {
          this.render();
        }, this);

      }, this));
    },

    render: function() {
      this.$el.html(this.template({
        name: this.name,
        connectionId: this.connectionId
      }));

      return this;
    },

    takePicture: function() {
      var imageView = new CaptureImageView();
      this.$el.html(imageView.render().$el);
      
      imageView.on('picture:captured', this.onImageCaptured, this);
    },
    onImageCaptured: function(data) {   
      this.doodleImageModel = data.doodleImageModel;

      this.$el.html(this.connectionListView.render().$el);
      
    },

    onConnectionSelected: function(data) {
      if (this.doodleImageModel) {
        this.socket.emit('app.emit', {
          event: 'doodle.request',
          to: data.connectionId,
          data: {
            from: this.connectionId,
            dataURI: this.doodleImageModel.get('dataURI')
          }
        });
        this.render();
      }
    }

  });


  return App;
});