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
      <ul>
        <% _.each(models, function(model) { %>
          <li><%- model.attributes.name %></li>
        <% }); %>
      </ul>
    */}.toString().split('\n').slice(1, -1).join('')),
   

    initialize: function() {
      _.bindAll(this, 'render', 'setConnectionList');

    },

    setConnectionList: function(collection) {
      this.collection = collection;
      this.collection.on('change add remove reset', this.render);
    },
   
    render: function() {
      this.$el.html(this.template(this.collection));

      console.log(this.$el.html());

      return this;
    }
  });


  return ConnectionListView;
});