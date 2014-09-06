define([
  'jquery',
  'underscore',
  'backbone'
], function(
  $,
  _,
  Backbone
) {
  
  var UserSelectView = Backbone.View.extend({

    // Template
    template: _.template(function() {/*

      <h2>Select image</h2>

      <ul class="image-list">
        <% _.each(items, function(item) { %>
          <li class="image-list--item" data-id="<%- item.id %>">
            <span class="glyphicon flaticon-picture11"></span>
            <%- item.name %>
          </li>
        <% }); %>
      </ul>

    */}.toString().split('\n').slice(1, -1).join('')),
   
    events: {
      'click [data-id]': 'selectImage'
    },


    initialize: function() {
    },

    setData: function(data) {
      this.collection = data.collection;

      this.listenTo(this.collection, 'add remove change reset', this.render);

      this.action = data.action;
      this.nextScreen = data.nextScreen || 'start-view';
    },
   
    render: function() {
      var data = {
        items: _.map(this.collection.models, function(model) {
          return {
            id: model.cid,
            name: model.get('user').get('name')
          };
        })
      };

      this.$el.html(this.template(data));
      return this;
    },

    selectImage: function(event) {
      var $target = $(event.target).closest('[data-id]');
      var id = $target.attr('data-id');

      var model = this.collection.get(id);

      if (model) {
        if (this.action) {
          this.trigger('request.action', {
            action: this.action,
            data: {
              imageModel: model
            }
          });
        }
        this.trigger('request.screen', {
          screen: this.nextScreen,
          data: {
            imageModel: model
          }
        });
      }

      this.collection.remove(model); 
    }
  });


  return UserSelectView;
});