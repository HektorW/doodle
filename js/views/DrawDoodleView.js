define([
	'jquery',
	'underscore',
	'backbone',

	'models/DoodlePathModel',

	'collections/DoodlePathCollection'
], function(
	$,
	_,
	Backbone,

	DoodlePathModel,

	DoodlePathCollection
) {

	var DrawDoodleView = Backbone.View.extend({

		template: _.template(function() {/*
			<canvas width="320" height="240"></canvas>
		*/}.toString().split('\n').slice(1, -1).join('')),

		events: {
			'touchstart canvas': 'onTouchStart',
			'touchend canvas': 'onTouchEnd',
			'touchmove canvas': 'onTouchMove',
			'touchcancel canvas': 'onTouchCancel',
			'touchleave canvas': 'onTouchLeave',

			'mousedown canvas': 'onMouseDown',
			'mouseUp canvas': 'onMouseUp',
			'mouseMove canvas': 'onMouseMove'
		},

		doodleImageModel: null,

		canvas: null,
		ctx: null,

		activeDoodlePath: null,

		activeColor: '#FF0000',
		activeThickness: 4,

		///////////////
		// Functions //
		///////////////
		initialize: function(options) {
			if (!options.doodleImageModel) {
				throw 'No DoodleImageModel supplied to DrawDoodleView';
			}

			this.doodleImageModel = options.doodleImageModel;

			_.bindAll(this,
				'render', 'drawLine', 'drawPaths', 'clearCanvas', 'startNewPath', 'endPath', 'onPathUpdate',
				'onTouchStart', 'onTouchEnd', 'onTouchMove', 'onTouchCancel', 'onTouchLeave', 'getPointFromTouchEvent',
				'onMouseDown', 'onMouseUp', 'onMouseMove'
			);

			this.doodlePaths = new DoodlePathCollection();
			this.doodlePaths.on('add change remove reset', this.drawPaths);
		},

		render: function() {
			this.$el.html(this.template());

			var canvas = this.canvas = this.$('canvas').get(0);
			var ctx = this.ctx = this.canvas.getContext('2d');

			var img = new Image();
			img.onload = function() {
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			};
			img.src = this.doodleImageModel.dataURI;

			return this;
		},

		clearCanvas: function() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},

		drawPaths: function() {
			this.clearCanvas();

			this.doodlePaths.each(function(doodlePath) {
				this.drawPoints(doodlePath.points, doodlePath.color, doodlePath.thickness);
			}, this);
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
			ctx.arc(from.x, from.y, thickness, 0, Math.PI * 2, false);
			ctx.fill();

			if (to) {
				ctx.beginPath();
				ctx.moveTo(from.x, from.y);
				ctx.lineTo(to.x, to.y);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(to.x, to.y, thickness, 0, Math.PI * 2, false);
				ctx.fill();
			}

			ctx.restore();
		},


		startNewPath: function(startPoint, color, thickness) {
			this.activeDoodlePath = new DoodlePathModel({
				points: [point],
				color: color,
				thickness: thickness
			});

			this.activeDoodlePath.on('add:point', onPathUpdate, this);
		},
		endPath: function(endPoint) {
			if (endPoint) {
				this.activeDoodlePath.addPoint(endPoint);
			}

			this.activeDoodlePath.off('add:point', onPathUpdate, this);

			this.doodlePaths.add(this.activeDoodlePath);

			this.activeDoodlePath = null;
		},
		onPathUpdate: function() {
			var points = this.activeDoodlePath.get('points');
			var len = points.length;
			this.drawLine(points[Math.max(len-2, 0)], points[len-1], this.activeDoodlePath.get('color'), this.activeDoodlePath.get('thickness'));
		},


		// Touch handlers
		onTouchStart: function(event) {
			this.startNewPath(this.getPointFromTouchEvent(event), this.activeColor, this.activeThickness);
		},
		onTouchEnd: function(event) {
			this.endPath(this.getPointFromTouchEvent(event));
		},
		onTouchMove: function(event) {
			if (this.activeDoodlePath) {
				this.activeDoodlePath.addPoint(this.getPointFromTouchEvent(event));
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
			this.startNewPath(this.getPointFromMouseEvent(event));
		},
		onMouseUp: function(event) {
			this.endPath(this.getPointFromMouseEvent(event));
		},
		onMouseMove: function(event) {
			if (this.activeDoodlePath) {
				this.activeDoodlePath.addPoint(this.getPointFromMouseEvent(event));
			}
		},
		getPointFromMouseEvent: function(mouseevent) {
			mouseevent = mouseevent.originalEvent || mouseevent;
			return {
				x: mouseevent.pageX,
				y: mouseevent.pageY
			};
		}

	});

	return DrawDoodleView;
});