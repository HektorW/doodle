define([
  'underscore',
  'backbone'
], function(
  _,
  Backbone
) {
  
  var SupportCheck = {
    _checks: {
      getUserMedia: function() {
        
      }
    },

    check: function() {

    },


  };

  _.extend(SupportCheck, Backbone.Events);

  return SupportCheck;

});