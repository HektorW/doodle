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
			<div class="brush-picker">
				<ul style="width:100px;">
					<% _.each(colors, function(color, name) { %>
						<li data-color="<%= color %>" class="brush-color" style="background:<%= color %>;color:<%= color %>;"></li>
					<% }); %>
				</ul>
				<!-- <input type="range" style="width:94px;"></input> -->
			</div>
		*/}.toString().split('\n').slice(1, -1).join('')),
	
		events: {
			'click [data-color]': 'colorClicked'
		},

		colors: {
			navy: '#001F3F',
			blue: '#0074D9',
			aqua: '#7FDBFF',
			teal: '#39CCCC',
			olive: '#3D9970',
			green: '#2ECC40',
			lime: '#01FF70',
			yellow: '#FFDC00',
			orange: '#FF851B',
			red: '#FF4136',
			maroon: '#85144B',
			fuchsia: '#F012BE',
			purple: '#B10DC9',
			black: '#111111',
			gray: '#AAAAAA',
			white: '#FFFFFF'
		},
	
		initialize: function() {
			_.bindAll(this, 'render', 'colorClicked', 'setColor');
		},

		render: function() {
			this.$el.html(this.template({
				colors: this.colors
			}));
			this.delegateEvents();

			this.setColor(this.colors.olive);

			return this;
		},

		setColor: function(color) {
			$('body').css('background', color);

			this.$('.brush-color.selected').removeClass('selected');
			this.$('[data-color="' + color + '"]').addClass('selected');

			this.activeColor = color;

			this.trigger('color.selected', {
				color: color
			});
		},

		colorClicked: function(event) {
			var $target = $(event.target);
			var color = $target.data('color');

			this.setColor(color);
		}

	});

	return BrushPickerView;
});