/*
 * Raphael Line Chart 1.2 - Raphael Line Charts plugin
 *
 * Copyright (c) 2011 Sagie Maoz (http://sagie.maoz.info)
 * Dual-licensed under the GPL (http://www.opensource.org/licenses/gpl-3.0)
 * and the MIT (http://www.opensource.org/licenses/mit-license) licenses.
 */
(function() {

// modified version of Raphael.fn.drawGrid() from the Raphael Analytics example
Raphael.fn.drawGrid = function(x, y, width, height, x_step, x_size, y_count, y_size) {
	var path,
		rowHeight,
		columnWidth;
	
	// frame border
	path = ["M", Math.round(x) + 0.5, Math.round(y) + 0.5,
			"L", Math.round(x + width) + 0.5, Math.round(y) + 0.5,
			Math.round(x + width) + 0.5, Math.round(y + height) + 0.5,
			Math.round(x) + 0.5, Math.round(y + height) + 0.5,
			Math.round(x) + 0.5, Math.round(y) + 0.5];
	
	// horizontal lines
	rowHeight = Math.ceil(height / y_count);
	for (var i = 0; i < y_count; i++) {
		path = path.concat(["M", Math.round(x) + 0.5, Math.round(y + i * rowHeight) + 0.5,
							"H", Math.round(x + width) + 0.5]);
	}
	
	// vertical lines
	if (!x_step) {
		x_step = 1;
		x_size = 10;
	}
	columnWidth = Math.ceil(width / x_size);
	for (i = 0; i < x_size; i+= x_step) {
		path = path.concat(["M", Math.round(x + i * (columnWidth + 1.1)) + 0.5, Math.round(y) + 0.5,
							"V", Math.round(y + height) + 0.5]);
	}
	
	return this.path(path.join(","));
};

Raphael.fn.popup = function(X, Y, set, position, ret) {
	var pos = String(position || "top-middle").split("-"),
		pos_x = pos[1] || "middle",
		tokenRegex = /\{([^\}]+)\}/g,
		objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
		
		replacer = function(all, key, obj) {
			var res = obj;
			key.replace(objNotationRegex,
			function(all, name, quote, quotedName, isFunc) {
				name = name || quotedName;
				if (res) {
					if (name in res) {
						res = res[name];
					}
					return (typeof res == "function") && isFunc && (res = res());
				}
			});
			res = (res === null || res == obj ? all: res) + "";
			return res;
		},
		
		fill = function(str, obj) {
			return String(str).replace(tokenRegex,
			function(all, key) {
				return replacer(all, key, obj);
			});
		},
		
		r = 5,
		bb = set.getBBox(),
		w = Math.round(bb.width),
		h = Math.round(bb.height),
		x = Math.round(bb.x) - r,
		y = Math.round(bb.y) - r,
		gap = Math.min(h / 2, w / 2, 10),
		shapes = {
			top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}l-{right},0-{gap},{gap}-{gap}-{gap}-{left},0a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
			bottom: "M{x},{y}l{left},0,{gap}-{gap},{gap},{gap},{right},0a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
			right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}l0-{bottom}-{gap}-{gap},{gap}-{gap},0-{top}a{r},{r},0,0,1,{r}-{r}z",
			left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}l0,{top},{gap},{gap}-{gap},{gap},0,{bottom}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
		},
		offset = {
			hx0: X - (x + r + w - gap * 2),
			hx1: X - (x + r + w / 2 - gap),
			hx2: X - (x + r + gap),
			vhy: Y - (y + r + h + r + gap),
			"^hy": Y - (y - gap)
		},
		mask = [{
			x: x + r,
			y: y,
			w: w,
			w4: w / 4,
			h4: h / 4,
			right: 0,
			left: w - gap * 2,
			bottom: 0,
			top: h - gap * 2,
			r: r,
			h: h,
			gap: gap
		},
		{
			x: x + r,
			y: y,
			w: w,
			w4: w / 4,
			h4: h / 4,
			left: w / 2 - gap,
			right: w / 2 - gap,
			top: h / 2 - gap,
			bottom: h / 2 - gap,
			r: r,
			h: h,
			gap: gap
		},
		{
			x: x + r,
			y: y,
			w: w,
			w4: w / 4,
			h4: h / 4,
			left: 0,
			right: w - gap * 2,
			top: 0,
			bottom: h - gap * 2,
			r: r,
			h: h,
			gap: gap
		}][pos_x == "middle" ? 1: (pos_x == "top" || pos_x == "left") * 2],
		dx = 0,
		dy = 0,
		out = this.path(fill(shapes[pos[0]], mask)).insertBefore(set);
		
	switch (pos[0]) {
		case "top":
			dx = X - (x + r + mask.left + gap);
			dy = Y - (y + r + h + r + gap);
			break;
		case "bottom":
			dx = X - (x + r + mask.left + gap);
			dy = Y - (y - gap);
			break;
		case "left":
			dx = X - (x + r + w + r + gap);
			dy = Y - (y + r + mask.top + gap);
			break;
		case "right":
			dx = X - (x - gap);
			dy = Y - (y + r + mask.top + gap);
			break;
	}
	out.translate(dx, dy);
	if (ret) {
		ret = out.attr("path");
		out.remove();
		return {
			path: ret,
			dx: dx,
			dy: dy
		};
	}
	set.translate(dx, dy);
	return out;
};

Raphael.fn.lineChart = function(method) {
	
	// public methods
	var methods = {
		
		init: function(options) {
			this.lineChart.settings = helpers.extend(this.lineChart.defaults, options);
			
			// let's go
			var element = this,
				gutter = this.lineChart.settings.gutter,
				width = this.lineChart.settings.width,
				height = this.lineChart.settings.height,
				
				table = helpers.loadTableData(this.lineChart.settings.data_holder), //TODO allow passing data by array
				size = table.labels.length,
				
				X = (width - gutter.left) / size,
				max = Math.max.apply(Math, table.data),
				Y = (height - gutter.bottom - gutter.top) / max,
				
				blanket = element.set(),
				p,
				bgpp,
				x,
				y;
			
			this.lineChart.size = size;
			this.lineChart.dots = [];
			this.lineChart.rects = [];
			this.lineChart.info = [];
			//TODO allow customizing
			this.lineChart.path = element.path().attr({
				stroke: this.lineChart.settings.colors.master,
				"stroke-width": 4,
				"stroke-linejoin": "round"
			});			
			// chart area
			//TODO allow customizing
			if (this.lineChart.settings.show_area) {
				this.lineChart.bgp = element.path().attr({
					stroke: "none",
					opacity: 0.3,
					fill: this.lineChart.settings.colors.master
				});
			}
			else {
				this.lineChart.bgp = element.path().attr({
					stroke: "none",
					opacity: 0,
					fill: this.lineChart.settings.colors.master
				}).hide();
			}
			
			// draw background grid
			if (!this.lineChart.gridDrawn && this.lineChart.settings.no_grid === false) {
				var grid = element.drawGrid(gutter.left + X * 0.5 + 0.5,
								gutter.top + 0.5,
								width - gutter.left - X,
								height - gutter.top - gutter.bottom,
								this.lineChart.settings.x_labels_step,
								size,
								this.lineChart.settings.y_labels_count,
								max)
							.attr({ stroke: "#eaeaea" });

				grid.toBack();
			}
			this.lineChart.gridDrawn = true;
			
			// draw x axis labels
			this.lineChart.XLabels = [];
			if (this.lineChart.settings.x_labels_step) {
				helpers.drawXLabels(element, X, height - gutter.bottom + 18,
						this.lineChart.settings.x_labels_step, table.labels,
						this.lineChart.settings.text.axis_labels);
			}
			
			// draw y axis labels
			this.lineChart.YLabels = [];
			if (this.lineChart.settings.y_labels_count) {
				helpers.drawYLabels(element, gutter.left, gutter.bottom,
							height, this.lineChart.settings.y_labels_count,
							max, gutter.top, this.lineChart.settings.text.axis_labels);
			}

			// prepare popup
			this.lineChart.label = element.set();
			//TODO ??
			this.lineChart.label.push(element.text(60, 12, "24 hits").attr(this.lineChart.settings.text.popup_line1));
			this.lineChart.label.push(element.text(60, 27, "22 September 2008").attr(this.lineChart.settings.text.popup_line2).attr({
				fill: this.lineChart.settings.colors.master
			}));
			this.lineChart.label.hide();

			//TODO allow customizing
			this.lineChart.frame = element.popup(100, 100, this.lineChart.label, "right").attr({
				fill: "#ffffff",
				stroke: "#666",
				"stroke-width": 2,
				"fill-opacity": 0.8
			}).hide();
			
			for (var i = 0, ii = size; i < ii; i++) {
				var dot, rect;

				// calculate current x, y
				y = Math.round(height - gutter.bottom - Y * table.data[i]);
				x = Math.round(gutter.left + X * (i + 0.5));

				if (!i) {
					p = ["M", x, y, "C", x, y];
					bgpp = ["M", gutter.left + X * 0.5, height - gutter.bottom, "L", x, y, "C", x, y];
				}
				else if (i < ii - 1) {
					var Y0 = Math.round(height - gutter.bottom - Y * table.data[i - 1]),
						X0 = Math.round(gutter.left + X * (i - 0.5)),
						Y2 = Math.round(height - gutter.bottom - Y * table.data[i + 1]),
						X2 = Math.round(gutter.left + X * (i + 1.5)),
						a = helpers.getAnchors(X0, Y0, x, y, X2, Y2);
					p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
					bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
				}

				//TODO allow customizing all of these
				dot = element.circle(x, y, 4).attr({
					fill: "#ffffff",
					stroke: this.lineChart.settings.colors.master,
					"stroke-width": 2
				});
				if (y === 0) {
					dot.attr({
						opacity: 0
					});
				}
				
				this.lineChart.dots.push(dot);
				
				if (this.lineChart.settings.mouse_coords == 'circle') {
					blanket.push(element.circle(x, y, 14).attr({
						stroke: "none",
						fill: "#fff",
						opacity: 0
					}));
				} else if (this.lineChart.settings.mouse_coords == 'rect') {
					blanket.push(element.rect(gutter.left + X * i, 0, X, height - gutter.bottom).attr({
						stroke: "none",
						fill: "#fff",
						opacity: 0
					}));
				}
				rect = blanket[blanket.length - 1];
				this.lineChart.rects.push(rect);
				
				this.lineChart.info.push({
					x: x,
					y: y,
					data: table.data[i],
					label: table.labels[i],
					line1: table.lines1[i],
					line2: table.lines2[i]
				});
				helpers.bindHoverEvent(this, i, dot, rect, this.lineChart.frame, this.lineChart.label);
			}

			p = p.concat([x, y, x, y]);
			bgpp = bgpp.concat([x, y, x, y, "L", x, height - gutter.bottom, "z"]);
			this.lineChart.path.attr({
				path: p
			});
			this.lineChart.bgp.attr({
				path: bgpp
			});
			this.lineChart.frame.toFront();
			this.lineChart.label[0].toFront();
			this.lineChart.label[1].toFront();
			blanket.toFront();
		},
		
		// Caution: this would only work for the same number of records
		setDataHolder: function(id) {
			var element = this,
				width = this.lineChart.settings.width,
				height = this.lineChart.settings.height,
				gutter = this.lineChart.settings.gutter,
				
				table = helpers.loadTableData(id),
				
				X = (width - gutter.left) / table.labels.length,
				max = Math.max.apply(Math, table.data),
				Y = (height - gutter.bottom - gutter.top) / max,
				
				p, bgpp;
			
			if (table.labels.length != this.lineChart.size) {
				if (console && console.error) {
					console.error('Error: new data source has to be of same size');
					return false;
				}
			}
			
			for (var i = 0, ii = table.labels.length; i < ii; i++) {
				var dot = this.lineChart.dots[i],
					rect = this.lineChart.rects[i];
				
				// calculate current x, y
				y = Math.round(height - gutter.bottom - Y * table.data[i]);
				x = Math.round(gutter.left + X * (i + 0.5));
				
				if (!i) {
					p = ["M", x, y, "C", x, y];
					bgpp = ["M", gutter.left + X * 0.5, height - gutter.bottom, "L", x, y, "C", x, y];
				}
				else if (i < ii - 1) {
					var Y0 = Math.round(height - gutter.bottom - Y * table.data[i - 1]),
						X0 = Math.round(gutter.left + X * (i - 0.5)),
						Y2 = Math.round(height - gutter.bottom - Y * table.data[i + 1]),
						X2 = Math.round(gutter.left + X * (i + 1.5)),
						a = helpers.getAnchors(X0, Y0, x, y, X2, Y2);
					p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
					bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
				}
				
				dot.animate({cy: y},
					this.lineChart.settings.animation.speed,
					this.lineChart.settings.animation.easing);
				
				// new popup data
				this.lineChart.info[i] = {
					x: x,
					y: y,
					data: table.data[i],
					label: table.labels[i],
					line1: table.lines1[i],
					line2: table.lines2[i]
				};
			}
			
			// animate paths
			p = p.concat([x, y, x, y]);
			bgpp = bgpp.concat([x, y, x, y, "L", x, height - gutter.bottom, "z"]);
			this.lineChart.path.animate({path: p},
					this.lineChart.settings.animation.speed,
					this.lineChart.settings.animation.easing);
			this.lineChart.bgp.animate({path: bgpp},
					this.lineChart.settings.animation.speed,
					this.lineChart.settings.animation.easing);
			
			// update x axis labels
			if (this.lineChart.settings.x_labels_step) {
				helpers.drawXLabels(element, X, height - gutter.bottom + 18,
						this.lineChart.settings.x_labels_step, table.labels,
						this.lineChart.settings.text.axis_labels);
			}

			// draw y axis labels
			if (this.lineChart.settings.y_labels_count) {
				helpers.drawYLabels(element, gutter.left, gutter.bottom,
							height, this.lineChart.settings.y_labels_count,
							max, gutter.top, this.lineChart.settings.text.axis_labels);
			}
		}
		
	};
	
	// private methods
	var helpers = {
		extend: function(from, to) {
			if (from === null || typeof from !== "object") return from;
			if (from.constructor != Object && from.constructor != Array) return from;
			if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
				from.constructor == String || from.constructor == Number || from.constructor == Boolean)
				return new from.constructor(from);
			
			to = to || new from.constructor();
			
			for (var name in from)
			{
				if (from.hasOwnProperty(name)) {
				to[name] = typeof to[name] == "undefined" ? helpers.extend(from[name], null) : to[name];
				}
			}
			return to;
		},
		
		getAnchors: function(p1x, p1y, p2x, p2y, p3x, p3y) {
			var l1 = (p2x - p1x) / 2,
				l2 = (p3x - p2x) / 2,
				a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
				b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y)),
				alpha, dx1, dy1, dx2, dy2;

			a = p1y < p2y ? Math.PI - a: a;
			b = p3y < p2y ? Math.PI - b: b;
			alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2;
			dx1 = l1 * Math.sin(alpha + a);
			dy1 = l1 * Math.cos(alpha + a);
			dx2 = l2 * Math.sin(alpha + b);
			dy2 = l2 * Math.cos(alpha + b);

			return {
				x1: p2x - dx1,
				y1: p2y + dy1,
				x2: p2x + dx2,
				y2: p2y + dy2
			};
		},
		
		loadTableData: function(table_id) {
			var table = document.getElementById(table_id),
				res = {
					labels: [],
					data: [],
					lines1: [],
					lines2: []
				},
				labels, data, lines1, lines2, j;
			
			if (table) {
				labels = table.getElementsByTagName('tfoot')[0].getElementsByTagName('th');
				for (j=0; j < labels.length; j++) {
					res.labels.push(labels[j].innerHTML);
				}
				data = table.getElementsByClassName('data')[0].getElementsByTagName('td');
				for (j=0; j < data.length; j++) {
					res.data.push(data[j].innerHTML);
				}
				lines1 = table.getElementsByClassName('line1')[0].getElementsByTagName('td');
				for (j=0; j < lines1.length; j++) {
					res.lines1.push(lines1[j].innerHTML);
				}
				lines2 = table.getElementsByClassName('line2')[0].getElementsByTagName('td');
				for (j=0; j < lines2.length; j++) {
					res.lines2.push(lines2[j].innerHTML);
				}
				return res;
			} else {
				return false;
			}
		},
		
		bindHoverEvent: function(elm, i, dot, rect, frame, label) {
			var f_in = function() {
					var side = "right",
						info = elm.lineChart.info[i],
						x = info.x,
						y = info.y;
					
					window.clearTimeout(elm.leave_timer);
					if (x + frame.getBBox().width > elm.lineChart.settings.width) {
						side = "left";
					}
					var ppp = elm.popup(x, y, label, side, 1);
					if (elm.lineChart.settings.mouse_coords == 'circle') {
						frame.attr({
							path: ppp.path,
							width: '200px'
						}).show();
						label[0].attr({
							text: info.line1,
							fill: elm.lineChart.settings.colors.line1,
							translation: [ppp.dx, ppp.dy]
						}).show();
						label[1].attr({
							text: info.line2,
							fill: elm.lineChart.settings.colors.line2,
							translation: [ppp.dx, ppp.dy]
						}).show();
					} else if (elm.lineChart.settings.mouse_coords == 'rect') {
						frame.show().stop().animate({
							path: ppp.path
						},
						200 * elm.lineChart.is_label_visible);
						label[0].attr({
							text: info.line1
						}).show().stop().animateWith(frame, {
							translation: [ppp.dx, ppp.dy]
						},
						200 * elm.lineChart.is_label_visible);
						label[1].attr({
							text: info.line2
						}).show().stop().animateWith(frame, {
							translation: [ppp.dx, ppp.dy]
						},
						200 * elm.lineChart.is_label_visible);
					}
					frame.toFront();
					label[0].toFront();
					label[1].toFront();
					this.toFront();
					dot.attr("r", 6);
					elm.lineChart.is_label_visible = true;
				},
				f_out = function() {
					dot.attr("r", 4);
				
					elm.leave_timer = window.setTimeout(function() {
						frame.hide();
						label[0].hide();
						label[1].hide();
						elm.lineChart.is_label_visible = false;
					},
					1);
				};
			
			rect.hover(f_in, f_out);
		},
		
		drawXLabels: function(elm, x, y, step, labels, style) {
			var i;
			
			// reset old labels
			if (elm.lineChart.XLabels.length) {
				for (i = 0; i < elm.lineChart.XLabels.length; i++) {
					elm.lineChart.XLabels[i].remove();
				}
			}
	
			elm.lineChart.XLabels = [];
			for (i = 0; i < elm.lineChart.size; i++) {
				var label_x = Math.round(elm.lineChart.settings.gutter.left + x * (i + 0.5));
				
				if (i % step === 0) {
					var l = elm.text(label_x, y, labels[i])
								.attr(style).toBack();
					elm.lineChart.XLabels.push(l);
				}
			}
		},
		
		drawYLabels: function(elm, x, y, height, count, max, top, style) {
			var step = Math.floor(max / count),
				labelHeight = (height - top - y) / count;
			
			// reset old labels
			if (elm.lineChart.YLabels.length) {
				for (var i = 0; i < elm.lineChart.YLabels.length; i++) {
					elm.lineChart.YLabels[i].remove();
				}
			}
			
			elm.lineChart.YLabels = [];
			for (var j = 0; j <= count; j++) {
				var l = elm.text(x,
							height - y - (j * labelHeight),
							j * step).attr(style);
				elm.lineChart.YLabels.push(l);
			}
		}
	};
	
	// go go go!
	if (methods[method]) {
		return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else if (typeof method === 'object' || !method) {
		return methods.init.apply(this, arguments);
	} else {
		if (console && console.error) {
			console.error('lineChart: Method "' + method + '" not found.');
		}
	}
};

Raphael.fn.lineChart.defaults = {
	data_holder: null,		// table element holding the data to display
	width: 500,				// chart width
	height: 250,			// chart height
	gutter: {				// gutter dimensions
		top: 20,
		right: 0,
		bottom: 50,
		left: 30
	},
	show_area: false,		// whether to fill the area below the line
	mouse_coords: 'rect',	// way to capture mouse events
	no_grid: false,			// whether to display background grid
	x_labels_step: false,	// X axis: either false or a step integer
	y_labels_count: false,	// Y axis: either false or a labels count
	animation: {			// animation (on data source change) settings
		speed: 600,
		easing: "backOut"
	},
	colors: {				// color settings
		master: '#01A8F0',
		line1: '#000000',
		line2: '#01A8F0',
	},
	text: {					// text style settings
		axis_labels: {
			font: '10px Helvetica, Arial',
			fill: "#000000"
		},
		popup_line1: {
			font: 'bold 11px Helvetica, Arial',
			fill: "#000000"
		},
		popup_line2: {
			font: 'bold 10px Helvetica, Arial',
			fill: "#000000"
		}
	}
};

})();
