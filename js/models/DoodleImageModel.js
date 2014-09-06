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
			dataURI: '',
			width: 0,
			height: 0
		}
	});

	return DoodleImageModel;
});