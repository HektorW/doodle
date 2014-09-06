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

    // Template
    template: _.template(function() {/*

      <h2>Send image</h2>

      <ul class="connection-list" style="margin-top:20px;">
        <% _.each(models, function(model) { %>
          <li class="connection-list--item" data-connection_id="<%- model.attributes.connectionId %>">
            <span class="glyphicon glyphicon-user"></span>
            <%- model.attributes.name %>
          </li>
        <% }); %>
      </ul>

    */}.toString().split('\n').slice(1, -1).join('')),
   
    events: {
      'click li': 'selectConnection'
    },


    initialize: function(options) {
      console.log('connection init');
      _.bindAll(this, 'render', 'selectConnection');
      this.collection.on('change add remove reset', this.render);
      this.render();
    },
   
    render: function() {
      console.log('connection render');
      this.$el.html(this.template(this.collection));

      this.delegateEvents();

      return this;
    },

    selectConnection: function(event) {
      console.log('connection select');
      var $target = $(event.target).closest('[data-connection_id]');
      var connectionId = $target.attr('data-connection_id');

      this.trigger('connection:select', {
        connectionId: connectionId
      });
    }
  });


  return ConnectionListView;
});