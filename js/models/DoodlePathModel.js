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
		defaults: {
			color: '#ffffff',
			thickness: 3,
			points: []
		},

		addPoint: function(point) {
			this.points.push(point);
			this.trigger('add:point');
		}
	});

	return DoodlePathModel;
});