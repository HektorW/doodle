define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
) {

	var DoodlePathModel = Backbone.Model.extend({
		defaults: function() {
			return {
				color: '#FF0000',
				thickness: 3,
				points: []
			};
		},

		addPoint: function(point) {
			this.get('points').push(point);
			this.trigger('add:point');
		}
	});

	return DoodlePathModel;
});