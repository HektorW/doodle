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
      <video autoplay="true" width="<%= size %>" height="<%= size %>" style="position:absolute;margin:0;top:0;left:0;"></video>
      <button id="btn-capture" style="position:fixed;bottom:20px;width:50%;left:50%;margin-left:-25%;text-align:center;">Take picture</button>
      <canvas></canvas>
    */}.toString().split('\n').slice(1, -1).join('\n'))),
   
    events: {
      'click #btn-capture': 'capture'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'capture', 'setupCamera', 'onMediaStreamSuccess', 'onMediaStreamFail');
    },

    render: function() {
      var maxSize = 640;
      var size = Math.min(maxSize, window.innerWidth, window.innerHeight);

      this.$el.html(this.template({
        size: size
      }));

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

      this.trigger('picture:captured', {
        doodleImageModel: doodleImageModel
      });
    }

  });

  return CaptureImageView;
});