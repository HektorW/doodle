requirejs.config({
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery',
    'underscore': '../bower_components/underscore/underscore',
    'backbone': '../bower_components/backbone/backbone',
    'socket.io': '/socket.io/socket.io'
  }
});

require(['app'], function(App) {
  var app = new App();
});