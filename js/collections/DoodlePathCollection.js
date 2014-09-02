define([
	'jquery',
	'underscore',
	'backbone',

	'models/DoodlePathModel'
], function(
	$,
	_,
	Backbone,

	DoodlePathModel
) {

	var DoodlePathCollection = Backbone.Collection.extend({
		model: DoodlePathModel
	});

	return DoodlePathCollection;
});