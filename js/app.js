define([
  'jquery',
  'underscore',
  'backbone',

  'sockethandler',

  'models/UserModel',
  'models/ImageModel',

  'collections/UserCollection',
  'collections/ImageCollection',

  'views/StartView',
  'views/UserSelectView',
  'views/DrawImageView',
  'views/ViewImageView',
  'views/CaptureImageView'
], function(
  $,
  _,
  Backbone,

  SocketHandler,

  UserModel,
  ImageModel,

  UserCollection,
  ImageCollection,

  StartView,
  UserSelectView,
  DrawImageView,
  ViewImageView,
  CaptureImageView
) {


  var App = Backbone.View.extend({

    screens: {},
    previousScreen: null,
    activeScreen: null,

    el: '#app',

    events: {
      'click #btn-take_picture': 'captureImage'
    },

    initialize: function() {
      // Models
      var names = ['Hektor', 'Gustav', 'Mikaela', 'Emma', 'Anders', 'Henrik'];
      this.user = new UserModel({
        name: names[parseInt(Math.random() * names.length, 10)]
      });

      // Collections
      this.userCollection = new UserCollection();
      this.requestImageCollection = new ImageCollection();
      this.responseImageCollection = new ImageCollection();


      // Screens
      this.screens['start-view'] = new StartView({
        user: this.user,
        userCollection: this.userCollection,
        requestImageCollection: this.requestImageCollection,
        responseImageCollection: this.responseImageCollection
      });
      this.listenTo(this.screens['start-view'], 'request.screen', this.requestScreen);

      this.screens['capture-image'] = new CaptureImageView();
      this.listenTo(this.screens['capture-image'], 'request.screen', this.requestScreen);

      this.screens['user-select'] = new UserSelectView({
        user: this.user,
        userCollection: this.userCollection
      });
      this.listenTo(this.screens['user-select'], 'request.screen', this.requestScreen);
      this.listenTo(this.screens['user-select'], 'request.action', this.requestAction);

      this.screens['draw-image'] = new DrawImageView();
      this.listenTo(this.screens['draw-image'], 'request.screen', this.requestScreen);
      this.listenTo(this.screens['draw-image'], 'request.action', this.requestAction);

      this.screens['view-image'] = new ViewImageView();
      this.listenTo(this.screens['view-image'], 'request.screen', this.requestScreen);



      // Socket
      SocketHandler.init({
        user: this.user,
        userCollection: this.userCollection,
        requestImageCollection: this.requestImageCollection,
        responseImageCollection: this.responseImageCollection
      });



      this.setActiveScreen(this.screens['start-view']);
    },


    requestScreen: function(data) {
      var screen = this.screens[data.screen];

      if (data.screen === 'previous') {
        screen = this.previousScreen;
      }

      if (!screen) {
        throw 'Request screen failed. There is no ' + data.screen + ' screen in the application';
      }

      this.setActiveScreen(screen, data.data);
    },

    setActiveScreen: function(screen, data) {
      if (this.activeScreen) {
        this.activeScreen.remove();
      }

      if (data) {
        screen.setActive(data);
      }

      this.$el.empty().html(screen.render().el);
      screen.delegateEvents();

      this.previousScreen = this.activeScreen;
      this.activeScreen = screen;
    },


    requestAction: function(data) {
      switch(data.action) {
        case 'send.doodle.request': {
          SocketHandler.sendDoodleRequest(data.data.imageModel);
        } break;
        case 'send.doodle.response': {
          SocketHandler.sendDoodleRequest(data.data.imageModel);
        } break;
      }
    }
    

  });


  return App;
});