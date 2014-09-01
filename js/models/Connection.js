define([
  'jquery',
  'underscore',
  'backbone'
], function(
  $,
  _,
  Backbone
) {
  
  var Connection = Backbone.Model.extend({
    defaults: {
      name: 'Unknown',
      connectionId: -1
    }
  });

  return Connection;
});