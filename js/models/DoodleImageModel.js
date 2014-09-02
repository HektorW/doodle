define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
) {

	var DoodleImageModel = Backbone.Model.extend({
		defaults: {
			dataURI: ''
		}
	});

	return DoodleImageModel;
});