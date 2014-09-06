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

      <h2>Send image</h2>

      <ul class="connection-list" style="margin-top:20px;">
        <% _.each(models, function(model) { %>
          <li class="connection-list--item" data-connection-id="<%- model.attributes.connectionId %>">
            <span class="glyphicon glyphicon-user"></span>
            <%- model.attributes.name %>
          </li>
        <% }); %>
      </ul>

    */}.toString().split('\n').slice(1, -1).join('')),
   
    events: {
      'click [data-connection-id]': 'selectUser'
    },


    initialize: function(options) {
      this.userCollection = options.userCollection;

      this.listenTo(this.userCollection, 'change add remove reset', this.render);
    },

    setActive: function(data) {
      if (!data.action) {
        throw 'No action supplied to UserSelectView.setActive';
      }

      this.imageModel = data.imageModel;
      this.action = data.action;
      this.nextScreen = data.nextScreen || 'start-view';
    },
   
    render: function() {
      this.$el.html(this.template(this.userCollection));
      return this;
    },

    selectUser: function(event) {
      var $target = $(event.target).closest('[data-connection-id]');
      var connectionId = $target.attr('data-connection-id');

      var user = this.userCollection.getById(connectionId);

      if (user) {
        if (this.imageModel) {
          this.imageModel.set('user', user);
        }

        this.trigger('request.action', {
          action: this.action,
          data: {
            imageModel: this.imageModel
          }
        });
        this.trigger('request.screen', {
          screen: this.nextScreen
        });
      }
    }
  });


  return UserSelectView;
});