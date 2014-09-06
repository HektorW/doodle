define([
  'jquery',
  'underscore',
  'backbone',

  'models/UserModel'
], function(
  $,
  _,
  Backbone,

  UserModel
) {

  var UserCollection = Backbone.Collection.extend({
    model: UserModel,

    initialize: function() {
      _.bindAll(this, 'setUsers');
    },

    setUsers: function(users) {
      var models = _.map(users, function(user) {
        return new UserModel({
          connectionId: user.id
        });
      });

      this.reset(models);
    },

    getById: function(id) {
      return _.filter(this.models, function(model) {
        return model.get('connectionId') === id;
      })[0] || null;
    }
  });


  return UserCollection;

});