(function() {

Raphael.fn.drawGrid = function(x, y, width, height, x_step, x_size, y_step, y_size) {
	var path,
		rowHeight,
		rowsCount,
		columnWidth;
	
	// frame border
	path = ["M", Math.round(x) + 0.5, Math.round(y) + 0.5,
			"L", Math.round(x + width) + 0.5, Math.round(y) + 0.5,
			Math.round(x + width) + 0.5, Math.round(y + height) + 0.5,
			Math.round(x) + 0.5, Math.round(y + height) + 0.5,
			Math.round(x) + 0.5, Math.round(y) + 0.5];
	
	// horizontal lines
	rowsCount = y_step ? Math.ceil(y_size / y_step) : 10;
	rowHeight = Math.ceil(height / rowsCount);
	for (var i = 0; i < rowsCount; i++) {
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

Raphael.fn.drawLineChart = function(conf) {
	var data_holder = !conf.data_holder ? '': conf.data_holder,
		mastercolor = !conf.mastercolor ? '#01A8F0': conf.mastercolor,
		spewidth = !conf.spewidth ? 500: conf.spewidth,
		showarea = !conf.showarea ? false: conf.showarea,
		linecolor1 = !conf.linecolor1 ? '#000000': conf.linecolor1,
		linecolor2 = !conf.linecolor2 ? conf.mastercolor: conf.linecolor2,
		mousecoords = !conf.mousecoords ? 'rect': conf.mousecoords,
		nogrid = !conf.nogrid ? false: conf.nogrid,
		x_labels = !conf.x_labels ? false: conf.x_labels, // either false or a step integer
		y_labels = !conf.y_labels ? false: conf.y_labels, // either false or a step integer
		datatotal = [],
		
		getAnchors = function(p1x, p1y, p2x, p2y, p3x, p3y) {
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
		
		loadTableData = function(table_id) {
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
		
		table = loadTableData(data_holder), //TODO allow passing data by array
		width = spewidth,
		height = 250,
		leftgutter = 30,
		bottomgutter = 50,
		topgutter = 20,
		colorhue = 0.6 || Math.random(),
		color = mastercolor,
		r = this,
		//TODO allow customizing of txt, txt1, txt2 styles
		txt = {
			font: '10px Helvetica, Arial',
			fill: "#000000"
		},
		txt1 = {
			font: 'bold 11px Helvetica, Arial',
			fill: "#000000"
		},
		txt2 = {
			font: 'bold 10px Helvetica, Arial',
			fill: "#000000"
		},
		X = (width - leftgutter) / table.labels.length,
		max = Math.max.apply(Math, table.data),
		Y = (height - bottomgutter - topgutter) / max,
		//TODO allow customizing
		path = r.path().attr({
			stroke: color,
			"stroke-width": 4,
			"stroke-linejoin": "round"
		}),
		//TODO allow customizing
		bgp = showarea === true ? r.path().attr({
			stroke: "none",
			opacity: 0.3,
			fill: color
		}) : r.path().attr({
			stroke: "none",
			opacity: 0,
			fill: color
		}).hide(),
		label = r.set(),
		is_label_visible = false,
		leave_timer,
		blanket = r.set(),
		
		bindHoverEvent = function(x, y, data, datatotal, lbl, line1, line2, dot, rect, frame) {
			var timer,
			i = 0;
			rect.hover(function() {
				clearTimeout(leave_timer);
				var side = "right";
				if (x + frame.getBBox().width > width) {
					side = "left";
				}
				var ppp = r.popup(x, y, label, side, 1);
				if (mousecoords == 'circle') {
					frame.attr({
						path: ppp.path,
						width: '200px'
					}).show();
					label[0].attr({
						text: line1,
						fill: linecolor1,
						translation: [ppp.dx, ppp.dy]
					}).show();
					label[1].attr({
						text: line2,
						fill: linecolor2,
						translation: [ppp.dx, ppp.dy]
					}).show();
				} else if (mousecoords == 'rect') {
					frame.show().stop().animate({
						path: ppp.path
					},
					200 * is_label_visible);
					label[0].attr({
						text: line1
					}).show().stop().animateWith(frame, {
						translation: [ppp.dx, ppp.dy]
					},
					200 * is_label_visible);
					label[1].attr({
						text: line2
					}).show().stop().animateWith(frame, {
						translation: [ppp.dx, ppp.dy]
					},
					200 * is_label_visible);
				}
				frame.toFront();
				label[0].toFront();
				label[1].toFront();
				this.toFront();
				dot.attr("r", 6);
				is_label_visible = true;
			},
			function() {
				dot.attr("r", 4);
				leave_timer = setTimeout(function() {
					frame.hide();
					label[0].hide();
					label[1].hide();
					is_label_visible = false;
				},
				1);
			});
		},
		frame,
		p,
		bgpp,
		x,
		y;
	
	// draw background grid
	if (!r.gridDrawn && nogrid === false) {
		var grid = r.drawGrid(leftgutter + X * 0.5 + 0.5, topgutter + 0.5,
					width - leftgutter - X, height - topgutter - bottomgutter,
					x_labels, table.labels.length, y_labels, max).attr({
						stroke: "#eaeaea"
					});
		
		grid.toBack();
	}
	r.gridDrawn = true;
	
	// draw y axis labels
	if (y_labels) {
		var y_labels_count = Math.round(max / y_labels),
			y_label_height = (height - topgutter - bottomgutter) / y_labels_count;
		for (var j = 0; j <= y_labels_count; j++) {
			r.text(leftgutter, height - bottomgutter - (j * y_label_height), j * y_labels).attr(txt);
		}
	}
	
	// prepare popup
	//TODO ??
	label.push(r.text(60, 12, "24 hits").attr(txt1));
	label.push(r.text(60, 27, "22 September 2008").attr(txt2).attr({
		fill: color
	}));
	label.hide();
	
	//TODO allow customizing
	frame = r.popup(100, 100, label, "right").attr({
		fill: "#ffffff",
		stroke: "#666",
		"stroke-width": 2,
		"fill-opacity": 0.8
	}).hide();
		
	for (var i = 0, ii = table.labels.length; i < ii; i++) {
		var dot, rect;
		
		// calculate current x, y
		y = Math.round(height - bottomgutter - Y * table.data[i]);
		x = Math.round(leftgutter + X * (i + 0.5));
		
		// x-axis labels
		if (x_labels && (i % x_labels === 0)) {
			r.text(x, height - bottomgutter + 18, table.labels[i]).attr(txt).toBack();
		}
		
		if (!i) {
			p = ["M", x, y, "C", x, y];
			bgpp = ["M", leftgutter + X * 0.5, height - bottomgutter, "L", x, y, "C", x, y];
		}
		else if (i < ii - 1) {
			var Y0 = Math.round(height - bottomgutter - Y * table.data[i - 1]),
			X0 = Math.round(leftgutter + X * (i - 0.5)),
			Y2 = Math.round(height - bottomgutter - Y * table.data[i + 1]),
			X2 = Math.round(leftgutter + X * (i + 1.5));
			var a = getAnchors(X0, Y0, x, y, X2, Y2);
			p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
			bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
		}
		
		//TODO allow customizing all of these
		dot = r.circle(x, y, 4).attr({
			fill: "#ffffff",
			stroke: color,
			"stroke-width": 2
		});
		if (y === 0) {
			dot.attr({
				opacity: 0
			});
		}
		if (mousecoords == 'circle') {
			blanket.push(r.circle(x, y, 14).attr({
				stroke: "none",
				fill: "#fff",
				opacity: 0
			}));
		} else if (mousecoords == 'rect') {
			blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({
				stroke: "none",
				fill: "#fff",
				opacity: 0
			}));
		}
		rect = blanket[blanket.length - 1];
		bindHoverEvent(x, y, table.data[i], datatotal[i], table.labels[i], table.lines1[i], table.lines2[i], dot, rect, frame);
	}
	
	p = p.concat([x, y, x, y]);
	bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
	path.attr({
		path: p
	});
	bgp.attr({
		path: bgpp
	});
	frame.toFront();
	label[0].toFront();
	label[1].toFront();
	blanket.toFront();
};

})();
