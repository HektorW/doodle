define([
  'jquery',
  'underscore',
  'backbone',

  'collections/ConnectionList'
], function(
  $,
  _,
  Backbone,

  ConnectionList
) {
  
  var ConnectionListView = Backbone.View.extend({
    template: _.template(function() {/*
      <ul style="margin-top:20px;">
        <% _.each(models, function(model) { %>
          <li data-connection_id="<%- model.attributes.connectionId %>" style="font-size:30px;margin:20px 10px;"><%- model.attributes.name %></li>
        <% }); %>
      </ul>
    */}.toString().split('\n').slice(1, -1).join('')),
   
    events: {
      'click li': 'selectConnection'
    },


    initialize: function() {
      _.bindAll(this, 'render', 'setConnectionList', 'selectConnection');

    },

    setConnectionList: function(collection) {
      this.collection = collection;
      this.collection.on('change add remove reset', this.render);
    },
   
    render: function() {
      this.$el.html(this.template(this.collection));

      return this;
    },

    selectConnection: function(event) {
      var $target = $(event.target).closest('[data-connection_id]');
      var connectionId = $target.attr('data-connection_id');

      this.trigger('connection:select', {
        connectionId: connectionId
      });
    }
  });


  return ConnectionListView;
});