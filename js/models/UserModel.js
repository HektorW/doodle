define([
  'jquery',
  'underscore',
  'backbone'
], function(
  $,
  _,
  Backbone
) {
  
  var User = Backbone.Model.extend({
    defaults: {
      name: 'Unknown',
      connectionId: -1
    }
  });

  return User;
});