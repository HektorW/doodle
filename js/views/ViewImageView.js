define([
  'jquery',
  'underscore',
  'backbone'
], function(
  $,
  _,
  Backbone
) {

  var ViewImageView = Backbone.View.extend({
    
    template: _.template((function() {/*
      <div class="image-view">
        <img src="<%- dataURI %>">
        <button id="btn-back"><span class="glyphicon glyphicon-step-backward"></span></button>
      </div>
    */}.toString().split('\n').slice(1, -1).join('\n'))),

    events: {
      'click #btn-back': 'requestBack'
    },

    initialize: function(options) {
      _.bindAll(this, 'render', 'requestBack');
    },

    setActive: function(data) {
      this.imageModel = data.imageModel;
    },

    render: function() {
      this.$el.html(this.template({
        dataURI: this.imageModel.get('dataURI')
      }));
      return this;
    },

    requestBack: function() {
      this.trigger('request.screen', {
        screen: 'previous'
      });
    }

  });

  return ViewImageView;
});