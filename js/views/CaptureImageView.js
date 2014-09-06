define([
  'jquery',
  'underscore',
  'backbone',

  'models/DoodleImageModel'
], function(
  $,
  _,
  Backbone,

  DoodleImageModel
) {
  
  var CaptureImageView = Backbone.View.extend({

    template: _.template((function() {/*
      <div class="capture-image">
        <video autoplay="true"></video>
        <button class="capture-button"><span class="glyphicon glyphicon-camera"></span></button>
        <canvas></canvas>
      </div>
    */}.toString().split('\n').slice(1, -1).join('\n'))),
   
    events: {
      'click .capture-button': 'capture'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'capture', 'setupCamera', 'onMediaStreamSuccess', 'onMediaStreamFail');
    },

    render: function() {
      this.$el.html(this.template());

      this.setupCamera();

      return this;
    },

    setupCamera: function() {
      navigator.getMedia = (navigator.getMedia || navigator.getUserMedia || navigator.webkitGetUserMedia);
      navigator.getMedia({ video: true }, this.onMediaStreamSuccess, this.onMediaStreamFail);
    },

    onMediaStreamSuccess: function(stream) {
      var video = this.$('video').get(0);

      video.src = window.URL.createObjectURL(stream);
      video.play();

      this.videoStream = stream;
    },
    onMediaStreamFail: function(err) {
      console.log(err);
    },

    capture: function() {
      var canvas = this.$('canvas').get(0);
      var video = this.$('video').get(0);

      var wWidth = window.innerWidth;
      var wHeight = window.innerHeight;

      var width;
      var height;

      if (wWidth < wHeight) {
        width = wWidth;
        height = video.videoHeight * (wWidth / video.videoWidth);
      } else {
        width = video.videoWidth * (wHeight / videoHeight);
        height = video.videoHeight;
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(video, 0, 0, width, height);

      this.videoStream.stop();

      var doodleImageModel = new DoodleImageModel({
        dataURI: canvas.toDataURL('image/png'),
        width: width,
        height: height
      });

      this.trigger('picture:captured', {
        doodleImageModel: doodleImageModel
      });
    }

  });

  return CaptureImageView;
});