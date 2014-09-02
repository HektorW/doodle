define([
	'jquery',
	'underscore',
	'backbone',

	'models/DoodlePathModel',
	'models/DoodleImageModel',

	'collections/DoodlePathCollection',

	'views/BrushPickerView'
], function(
	$,
	_,
	Backbone,

	DoodlePathModel,
	DoodleImageModel,

	DoodlePathCollection,

	BrushPickerView
) {

	var DrawDoodleView = Backbone.View.extend({

		template: _.template(function() {/*
			<canvas width="320" height="240"></canvas>
			<button id="btn-back"><span class="glyphicon glyphicon-step-backward"></span></button>
			<button id="btn-undo" disabled><span class="glyphicon glyphicon-repeat"></span></button>
			<button id="btn-send">Send</button>
			<div id="brush-picker"></div>
		*/}.toString().split('\n').slice(1, -1).join('')),

		events: {
			'touchstart canvas': 'onTouchStart',
			'touchend canvas': 'onTouchEnd',
			'touchmove canvas': 'onTouchMove',
			'touchcancel canvas': 'onTouchCancel',
			'touchleave canvas': 'onTouchLeave',

			'mousedown canvas': 'onMouseDown',
			'mouseup canvas': 'onMouseUp',
			'mousemove canvas': 'onMouseMove',

			'click #btn-undo': 'undoStep',
			'click #btn-back': 'requestBack',
			'click #btn-send': 'requestSend'
		},

		doodleImageModel: null,
		doodleImage: null,

		canvas: null,
		ctx: null,

		activeDoodlePath: null,

		activeColor: '#FF0000',
		activeThickness: 5,

		///////////////
		// Functions //
		///////////////
		initialize: function(options) {
			if (!options.doodleImageModel) {
				throw 'No DoodleImageModel supplied to DrawDoodleView';
			}

			this.doodleImageModel = options.doodleImageModel;
			this.doodleImage = new Image();
			this.doodleImage.src = this.doodleImageModel.get('dataURI');

			this.connectionId = options.connectionId;

			_.bindAll(this,
				'render', 'drawImage', 'drawLine', 'drawPaths', 'clearCanvas',
				'startNewPath', 'endPath', 'onPathUpdate', 'getPointInElement',
				'onTouchStart', 'onTouchEnd', 'onTouchMove', 'onTouchCancel', 'onTouchLeave', 'getPointFromTouchEvent',
				'onMouseDown', 'onMouseUp', 'onMouseMove',
				'requestBack', 'requestSend'
			);

			this.doodlePaths = new DoodlePathCollection();
			this.doodlePaths.on('add change remove reset', this.drawPaths);
		},

		render: function() {
			this.$el.html(this.template());

			var canvas = this.canvas = this.$('canvas').get(0);
			var ctx = this.ctx = this.canvas.getContext('2d');

			this.drawImage();

			return this;
		},

		clearCanvas: function() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},
		drawImage: function() {
			this.ctx.drawImage(this.doodleImage, 0, 0, this.canvas.width, this.canvas.height);
		},
		getModel: function() {
			var dataURI = this.canvas.toDataURL('image/png');
			var model = new DoodleImageModel({
				dataURI: dataURI
			});
			return model;
		},

		drawPaths: function() {
			this.clearCanvas();
			this.drawImage();

			this.doodlePaths.each(function(doodlePath) {
				this.drawPoints(doodlePath.get('points'), doodlePath.get('color'), doodlePath.get('thickness'));
			}, this);

			this.$('#btn-undo').attr('disabled', this.doodlePaths.length === 0);
		},

		drawPoints: function(points, color, thickness) {
			for (var i = 0, len = points.length; i < len; ++i) {
				this.drawLine(points[i], points[i+1], color, thickness);
			}
		},

		drawLine: function(from, to, color, thickness) {
			var ctx = this.ctx;

			ctx.save();

			ctx.fillStyle = color;
			ctx.strokeStyle = color;
			ctx.lineWidth = thickness;

			ctx.beginPath();
			ctx.arc(from.x, from.y, thickness / 2, 0, Math.PI * 2, false);
			ctx.fill();

			if (to) {
				ctx.beginPath();
				ctx.moveTo(from.x, from.y);
				ctx.lineTo(to.x, to.y);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(to.x, to.y, thickness / 2, 0, Math.PI * 2, false);
				ctx.fill();
			}

			ctx.restore();
		},


		startNewPath: function(startPoint, color, thickness) {
			this.activeDoodlePath = new DoodlePathModel({
				points: [this.getPointInElement(startPoint)],
				color: color,
				thickness: thickness
			});

			this.activeDoodlePath.on('add:point', this.onPathUpdate, this);
		},
		endPath: function(endPoint) {
			if (endPoint) {
				this.activeDoodlePath.addPoint(this.getPointInElement(endPoint));
			}

			this.activeDoodlePath.off('add:point', this.onPathUpdate, this);

			this.doodlePaths.add(this.activeDoodlePath);

			this.activeDoodlePath = null;
		},
		onPathUpdate: function() {
			var points = this.activeDoodlePath.get('points');
			var len = points.length;
			this.drawLine(points[Math.max(len-2, 0)], points[len-1], this.activeDoodlePath.get('color'), this.activeDoodlePath.get('thickness'));
		},


		undoStep: function() {
			this.doodlePaths.pop();
		},

		getPointInElement: function(point) {
			point.x -= this.$el.offset().left;
			point.y -= this.$el.offset().top;
			return point;
		},


		// Touch handlers
		onTouchStart: function(event) {
			this.startNewPath(this.getPointFromTouchEvent(event), this.activeColor, this.activeThickness);
			event.preventDefault();
		},
		onTouchEnd: function(event) {
			this.endPath(this.getPointFromTouchEvent(event));
		},
		onTouchMove: function(event) {
			if (this.activeDoodlePath) {
				this.activeDoodlePath.addPoint(this.getPointInElement(this.getPointFromTouchEvent(event)));
				event.preventDefault();
			}
		},
		onTouchCancel: function(event) {
			this.endPath();
		},
		onTouchLeave: function(event) {
			this.endPath();
		},
		getPointFromTouchEvent: function(touchevent) {
			var touches = touchevent.changedTouches || touchevent.originalEvent.changedTouches;
			var touch = touches[0];
			return {
				x: touch.pageX,
				y: touch.pageY
			};
		},

		// Mouse handlers
		onMouseDown: function(event) {
			this.startNewPath(this.getPointFromMouseEvent(event), this.activeColor, this.activeThickness);
		},
		onMouseUp: function(event) {
			this.endPath(this.getPointFromMouseEvent(event));
		},
		onMouseMove: function(event) {
			if (this.activeDoodlePath) {
				this.activeDoodlePath.addPoint(this.getPointInElement(this.getPointFromMouseEvent(event)));
			}
		},
		getPointFromMouseEvent: function(mouseevent) {
			mouseevent = mouseevent.originalEvent || mouseevent;
			return {
				x: mouseevent.pageX,
				y: mouseevent.pageY
			};
		},


		requestBack: function() {
			this.trigger('request:back');
		},
		requestSend: function() {
			var model = this.getModel();
			this.trigger('request:send', {
				doodleImageModel: model,
				connectionId: this.connectionId
			});
		}

	});

	return DrawDoodleView;
});