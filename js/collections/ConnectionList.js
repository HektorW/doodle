define([
  'jquery',
  'underscore',
  'backbone',

  'models/Connection'
], function(
  $,
  _,
  Backbone,

  Connection
) {

  var ConnectionsList = Backbone.Collection.extend({
    model: Connection,

    initialize: function() {
      _.bindAll(this, 'setConnections');
    },

    setConnections: function(connections) {
      var models = _.map(connections, function(connection) {
        return new Connection({
          connectionId: connection.id
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


  return ConnectionsList;

});