# Raphaël Line Charts Plugin #

This plugin is a result of frustration from current client-side charting solutions.	 
I needed something simple that would draw a line chart in SVG based on a table in a page, be customizable enough and allow me to change the data set on demand. I couldn't find one.	
So here goes. 

This plugin relies heavily on the wonderful [Raphaël][1] JavaScript SVG library.	
It is also a (quite extensive) fork of [we's Beautiful Analytics Chart][2] project. 

To download and contribute (please do!), check out the [project on GitHub][3]. 

## Features ##

The concept for the code is dervied from the Raphael [Analytics example][4].	
*		Draws a line chart with custom design for a given set of data.
*		Framework agnostic (only requirement is Raphael).
*		Semantic use of the document: data is loaded from a table element.
*		Ability to change data source (updating the chart).
*		Custom display of X & Y axis labels.

## Requirements ##

*		Raphael - <http://raphaeljs.com></div> 

## Usage ##

### Include it. ###

```html
<script type="text/javascript" src="js/lib/raphael.js"></script>
<script type="text/javascript" src="js/raphael_linechart.js"></script>
```

### Give it data. ###


Future versions will allow more flexible ways of passing data, either by different types of elements or by directly passing an array. 

```html
<div id="line-chart-holder"></div>
<table id=&quot;d1&quot; style="display: none;">
	<tfoot>
		<tr>
			<th>3/02</th>
			<th>3/03</th>
			<th>3/09</th>
			<th>3/16</th>
		</tr>
	</tfoot>
	<tbody class="data">
		<tr>
			<td>70</td>
			<td>70</td>
			<td>210</td>
			<td>490</td>
		</tr>
	</tbody>
	<tbody class="line1">
		<tr>
			<td>70 Views</td>
			<td>70 Views</td>
			<td>210 Views</td>
			<td>490 Views</td>
		</tr>
	</tbody>
	<tbody class="line2">
		<tr>
			<td>Mar 2nd 2011</td>
			<td>Mar 3rd 2011</td>
			<td>Mar 9th 2011</td>
			<td>Mar 16th 2011</td>
		</tr>
	</tbody>
</table>
```

### Call it. ###

```html
<script type="text/javascript">
	window.onload = function(){
		var w = 840; // you can make this dynamic so it fits as you would like
		var paper = Raphael("line-chart", w, 250); // init the raphael obj and give it a width plus height
		paper.lineChart({ // call the lineChart function
			data_holder: "d2", // find the table data source by id
			width: w, // pass in the same width
			show_area: true, // show the area
			x_labels_step: 3, // X axis labels step
			y_labels_count: 5,	// Y axis labels count
			mouse_coords: "rect", // rect (uses blanket mode) | circle (pinpoints the points)
			colors: {
				master: "#01A8F0" // set the line color
			}
		});
	};
</script>
```

### Documentation ###

The lineChart() plugin will accept a list of arguments in a json style format.

```javascript
var opts = {
		data_holder: null, // table element holding the data to display
		width: 500,
		height: 250,
		// chart gutter dimension
		gutter: {
			top: 20,
			right: 0,
			bottom: 50,
			left: 30
	},
	// whether to fill the area below the line
	show_area: false,
	// way to capture mouse events
	mouse_coords: "rect",
	// whether to display background grid
	no_grid: false,
	// X axis: either false or a step integer
	x_labels_step: false,
	// Y axis: either false or a labels count
	y_labels_count: false,
	// animation (on data source change) settings
	animation: {
		speed: 600,
		easing: "backOut"
	},
	// color settings
	colors: {
		master: "#01A8F0",
		line1: "#000000",
		line2: "#01A8F0",
	},
	// text style settings
	text: {
		axis_labels: {
			font: "10px Helvetica, Arial",
			fill: "#000000"
		},
		popup_line1: {
			font: "bold 11px Helvetica, Arial",
			fill: "#000000"
		},
		popup_line2: {
			font: "bold 10px Helvetica, Arial",
			fill: "#000000"
		}
	}
};

r.lineChart(opts); // draw the line chart in an initiated Raphael object
```

### Enjoy. ###

[1]: http://raphaeljs.com/
[2]: https://github.com/wes/Beautiful-Analytics-Chart
[3]: https://github.com/n0nick/raphael-linechart
[4]: http://raphaeljs.com/analytics.html