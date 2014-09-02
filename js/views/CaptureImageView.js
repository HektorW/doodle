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
      <video autoplay="true" width="320" height="240" style="position:fixed;"></video>
      <button id="btn-capture" style="position:fixed;bottom:20px;width:20%;left:50%;margin-left:-10%;text-align:center;">Take picture</button>
      <canvas></canvas>
    */}.toString().split('\n').slice(1, -1).join('\n'))),
   
    events: {
      'click #btn-capture': 'capture'
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
    onMediaStreamFail: function() {
      console.log(err);
    },

    capture: function() {
      var canvas = this.$('canvas').get(0);
      var video = this.$('video').get(0);

      canvas.width = video.width;
      canvas.height = video.height;
      canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height);

      this.videoStream.stop();

      var doodleImageModel = new DoodleImageModel({
        dataURI: canvas.toDataURL('image/png')
      });

      this.trigger('picture:captured', doodleImageModel);
    }

  });

  return CaptureImageView;
});