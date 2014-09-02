define([
  'jquery',
  'underscore',
  'backbone'
], function(
  $,
  _,
  Backbone
) {

  var DoodleImageView = Backbone.View.extend({
    
    template: _.template((function() {/*
      <img src="<%- dataURI %>">
      <button id="btn-back"><span class="glyphicon glyphicon-step-backward"></span></button>
    */}.toString().split('\n').slice(1, -1).join('\n'))),

    events: {
      'click #btn-back': 'requestBack'
    },

    initialize: function(options) {
      this.doodleImageModel = options.doodleImageModel;
      _.bindAll(this, 'render', 'requestBack');
    },

    render: function() {
      this.$el.html(this.template({
        dataURI: this.doodleImageModel.get('dataURI')
      }));
      return this;
    },

    requestBack: function() {
      this.trigger('request:back');
    }

  });

  return DoodleImageView;
});