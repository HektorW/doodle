define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$,
	_,
	Backbone
) {

	var BrushPickerView = Backbone.View.extend({
		
		template: _.template(function() {/*
			<select>
			</select>
		*/}.toString().split('\n').slice(1, -1).join('')),
	
		initialize: function() {

		}

	});

	return BrushPickerView;
});