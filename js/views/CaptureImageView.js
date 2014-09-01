define([
  'jquery',
  'underscore',
  'backbone'
], function(
  $,
  _,
  Backbone
) {
  
  var CaptureImageView = Backbone.View.extend({

    template: _.template((function() {/*
      <video autoplay="true" width="320" height="280" style="position:fixed;"></video>
      <button id="btn-capture" style="position:fixed;bottom:20px;width:20%;left:50%;margin-left:-10%;text-align:center;">Take picture</button>
      <img>
    */}.toString().split('\n').slice(1, -1).join('\n'))),
   
    events: {
      'click #btn-capture': 'capture'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'capture', 'setupCamera');
    },

    render: function() {
      this.$el.html(this.template());

      this.setupCamera();

      return this;
    },

    setupCamera: function() {
      var $video = this.$('video');
      var video = $video.get(0);

      navigator.getMedia = (navigator.getMedia || navigator.getUserMedia || navigator.webkitGetUserMedia);

      navigator.getMedia({ video: true }, _.bind(function(stream) {
        this.videoStream = stream;
        video.src = window.URL.createObjectURL(stream);
        video.play();
      }, this), function(err) {
        console.log(err);
      });
    },

    capture: function() {
      var canvas = document.createElement('canvas');
      var video = this.$('video').get(0);
      canvas.width = video.width;
      canvas.height = video.height;
      canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height);
      var data = canvas.toDataURL('image/png');

      this.videoStream.stop();

      var $img = this.$('img');
      $img.attr('src', data);

      this.$('*').hide();
      $img.show();
    }

  });

  return CaptureImageView;
});