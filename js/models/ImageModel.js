define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
) {

	var ImageModel = Backbone.Model.extend({
		defaults: {
			dataURI: '',
			width: 0,
			height: 0,
			user: null
		}
	});

	return ImageModel;
});