var gridHasBeenDrawn = false;
Raphael.fn.drawGrid = function(x, y, w, h, wv, hv, color) {
	color = color || "#cacaca";
	var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
		rowHeight = h / hv,
		columnWidth = w / wv;
	for(var i = 1; i < hv; i++) {
		path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
	}
	for(i = 1; i < wv; i++) {
		path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
	}
	return this.path(path.join(",")).attr({
		stroke: color
	});
};

function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
	var l1 = (p2x - p1x) / 2,
		l2 = (p3x - p2x) / 2,
		a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
		b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
	a = p1y < p2y ? Math.PI - a : a;
	b = p3y < p2y ? Math.PI - b : b;
	var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
		dx1 = l1 * Math.sin(alpha + a),
		dy1 = l1 * Math.cos(alpha + a),
		dx2 = l2 * Math.sin(alpha + b),
		dy2 = l2 * Math.cos(alpha + b);
	return {
		x1: p2x - dx1,
		y1: p2y + dy1,
		x2: p2x + dx2,
		y2: p2y + dy2
	};
}

function drawLine(conf) {
	var holder = !conf.holder ? '' : conf.holder,
		data_holder = !conf.data_holder ? '' : conf.data_holder,
		mastercolor = !conf.mastercolor ? '#01A8F0' : conf.mastercolor,
		spewidth = !conf.spewidth ? 500 : conf.spewidth,
		showarea = !conf.showarea ? false : conf.showarea,
		linecolor1 = !conf.linecolor1 ? '#000000' : conf.linecolor1,
		linecolor2 = !conf.linecolor2 ? conf.mastercolor : conf.linecolor2,
		mousecoords = !conf.mousecoords ? 'rect' : conf.mousecoords,
		nodot = !conf.nodot ? false : conf.nodot,
		nogrid = !conf.nogrid ? false : conf.nogrid,
		gridcolor = !conf.gridcolor ? '#eeeeee' : conf.gridcolor;
		dotcolor = !conf.dotcolor ? '#ffffff' : conf.dotcolor;
	var labels = [],
		data = [],
		datatotal = [],
		lines1 = [],
		lines2 = [];
	if(!$(data_holder)) {
		return false;
	}
	$$("#" + data_holder + " tfoot th").each(function(s) {
		labels.push(s.innerHTML);
	});
	$$("#" + data_holder + " tbody.data td").each(function(s) {
		data.push(s.innerHTML);
	});
	$$("#" + data_holder + " tbody.line1 td").each(function(s) {
		lines1.push(s.innerHTML);
	});
	$$("#" + data_holder + " tbody.line2 td").each(function(s) {
		lines2.push(s.innerHTML);
	});
	var width = spewidth,
		height = 250,
		leftgutter = 0,
		bottomgutter = 50,
		topgutter = 20,
		colorhue = .6 || Math.random(),
		color = mastercolor,
		r = holder,
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
		X = (width - leftgutter) / labels.length,
		max = Math.max.apply(Math, data),
		Y = (height - bottomgutter - topgutter) / max;
	if(!r.gridDrawn && nogrid == false) {
		r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, conf.gridcolor);
	}
	r.gridDrawn = true;
	var path = r.path().attr({
		stroke: color,
		"stroke-width": 4,
		"stroke-linejoin": "round"
	}),
		bgp = showarea == true ? r.path().attr({
			stroke: "none",
			opacity: .3,
			fill: color
		}) : r.path().attr({
			stroke: "none",
			opacity: 0,
			fill: color
		}).hide(),
		label = r.set(),
		is_label_visible = false,
		leave_timer, blanket = r.set();
	label.push(r.text(60, 12, "24 hits").attr(txt1));
	label.push(r.text(60, 27, "22 September 2008").attr(txt2).attr({
		fill: color
	}));
	label.hide();
	var frame = r.popup(100, 100, label, "right").attr({
		fill: "#ffffff",
		stroke: "#666",
		"stroke-width": 2,
		"fill-opacity": .8
	}).hide();
	var p, bgpp;
	for(var i = 0, ii = labels.length; i < ii; i++) {
		var y = Math.round(height - bottomgutter - Y * data[i]),
			x = Math.round(leftgutter + X * (i + .5)),
			t = gridHasBeenDrawn[holder] == false ? labels.length > 120 ? i % 2 == 0 ? false : r.text(x, height - 25, labels[i]).attr(txt).rotate(70).toBack() : r.text(x, height - 25, labels[i]).attr(txt).rotate(70).toBack() : false;
		if(!i) {
			p = ["M", x, y, "C", x, y];
			bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
		}
		if(i && i < ii - 1) {
			var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
				X0 = Math.round(leftgutter + X * (i - .5)),
				Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
				X2 = Math.round(leftgutter + X * (i + 1.5));
			var a = getAnchors(X0, Y0, x, y, X2, Y2);
			p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
			bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
		}
		if(!conf.nodot){
			var dot = r.circle(x, y, 4).attr({
				fill: dotcolor,
				stroke: color,
				"stroke-width": 2
			});
			if(y == 0) {
				dot.attr({
					opacity: 0
				});
			}
		}else{
			var dot = false;
		}
		if(mousecoords == 'circle') {
			blanket.push(r.circle(x, y, 14).attr({
				stroke: "none",
				fill: "#fff",
				opacity: 0
			}));
		} else if(mousecoords == 'rect') {
			blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({
				stroke: "none",
				fill: "#fff",
				opacity: 0
			}));
		}
		var rect = blanket[blanket.length - 1];
		(function(x, y, data, datatotal, lbl, line1, line2, dot) {
			var timer, i = 0;
			rect.hover(function() {
				clearTimeout(leave_timer);
                var side = "right";
                if (x + frame.getBBox().width > width) {
                    side = "left";
                }
                var ppp = r.popup(x, y, label, side, 1),
                    anim = Raphael.animation({
                        path: ppp.path,
                        transform: ["t", ppp.dx, ppp.dy]
                    }, 200 * is_label_visible);
                lx = label[0].transform()[0][1] + ppp.dx;
                ly = label[0].transform()[0][2] + ppp.dy;
                frame.show().stop().animate(anim);
                 label[0].attr({text: line1 }).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);
                label[1].attr({text: line2 }).show().stop().animateWith(frame, anim, {transform: ["t", lx, ly]}, 200 * is_label_visible);                if(dot){
	                dot.attr("r", 6);
	            }
                is_label_visible = true;
            }, function() {
            	if(dot){
					dot.attr("r", 4);
				}
                leave_timer = setTimeout(function () {
                    frame.hide();
                    label[0].hide();
                    label[1].hide();
                    is_label_visible = false;
                }, 1);
			});
		})(x, y, data[i], datatotal[i], labels[i], lines1[i], lines2[i], dot);
	}
	gridHasBeenDrawn[holder] = true;
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
}
(function() {
	var tokenRegex = /\{([^\}]+)\}/g,
		objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
		replacer = function(all, key, obj) {
			var res = obj;
			key.replace(objNotationRegex, function(all, name, quote, quotedName, isFunc) {
				name = name || quotedName;
				if(res) {
					if(name in res) {
						res = res[name];
					}
					typeof res == "function" && isFunc && (res = res());
				}
			});
			res = (res == null || res == obj ? all : res) + "";
			return res;
		},
		fill = function(str, obj) {
			return String(str).replace(tokenRegex, function(all, key) {
				return replacer(all, key, obj);
			});
		};
	Raphael.fn.popup = function(X, Y, set, pos, ret) {
		pos = String(pos || "top-middle").split("-");
		pos[1] = pos[1] || "middle";
		var r = 5,
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
			}, {
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
			}, {
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
			}][pos[1] == "middle" ? 1 : (pos[1] == "top" || pos[1] == "left") * 2];
		var dx = 0,
			dy = 0,
			out = this.path(fill(shapes[pos[0]], mask)).insertBefore(set);
		switch(pos[0]) {
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
		if(ret) {
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
})();
