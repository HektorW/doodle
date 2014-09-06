define([
  'jquery',
  'underscore',
  'backbone'
], function(
  $,
  _,
  Backbone
) {

  var StartView = Backbone.View.extend({
    
    template: _.template(function() {/*
      <div class="start-view">
        <div class="start-view--header">
          <h1 class="title">Doodle</h1>
          <h4 class="start-view--header-name"><%- name %></h4>
        </div>
        <button class="start-view--capture-image">
          <span class="glyphicon glyphicon-camera"></span>
        </button>
        <div class="start-view--footer">
          <button class="start-view--footer-item" data-requests>Requests [<%= requests %>]</button>
          <button class="start-view--footer-item" data-responses>Responses [<%= responses %>]</button>
        </div>
      </div>
    */}.toString().split('\n').slice(1, -1).join('')),
  
    events: {
      'click .title': 'toggleFullscreen',
      'click .start-view--capture-image': 'requestCaptureImageScreen'
    },
  
    initialize: function(options) {
      this.user = options.user;

      this.userCollection = options.userCollection;
      this.responseImageCollection = options.responseImageCollection;
      this.requestImageCollection = options.requestImageCollection;


      this.listenTo(this.user, 'change', this.render);
      this.listenTo(this.responseImageCollection, 'change add remove reset', this.render);
      this.listenTo(this.requestImageCollection, 'change add remove reset', this.render);
    },

    render: function() {
      var data = {
        name: this.user.get('name'),
        responses: this.responseImageCollection.length,
        requests: this.requestImageCollection.length
      }

      this.$el.empty().html(this.template(data));

      this.$('[data-requests]').attr('disabled', data.requests === 0);
      this.$('[data-responses]').attr('disabled', data.responses === 0);

      return this;
    },

    toggleFullscreen: function() {
      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    },


    requestCaptureImageScreen: function() {
      this.trigger('request.screen', {
        screen: 'capture-image'
      });
    }

  });

  return StartView;
});