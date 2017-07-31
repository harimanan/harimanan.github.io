
var data = [
	{key: "East Asia & Pacific",		value: 75.1},
	{key: "Europe & Central Asia",		value: 77.2},
	{key: "Latin America & Caribbean",		value: 75.1},
	{key: "Middle East & North Africa",	value: 73},
	{key: "North America",		value: 79},
	{key: "South Asia",	value: 68.4},
	{key: "Sub-Saharan Africa", 	value: 58.9}
];
var w = 800;
var h = 450;
var margin = {
	top: 58,
	bottom: 120,
	left: 80,
	right: 40
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var x = d3.scale.ordinal()
		.domain(data.map(function(entry){
			return entry.key;
		}))
		.rangeBands([0, width]);
var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d){
			return d.value;
		})])
		.range([height, 0]);
var ordinalColorScale = d3.scale.category20();
var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width,0,0)
				.tickFormat("")
				.orient("left");
var svg = d3.select("body").append("svg")
			.attr("id", "chart")
			.attr("width", w)
			.attr("height", h);
var chart = svg.append("g")
			.classed("display", true)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var controls = d3.select("body")
				.append("div")
				.attr("id", "controls");
var sort_btn = controls.append("button")
				.html("Sort data: ascending")
				.attr("state", 0);
				
var tooltip = d3.select("#tooltip");

function drawAxis(params){

	if(params.initialize === true){
		//Draw the gridlines and axes
		//Draw the gridlines
		this.append("g")
			.call(params.gridlines)
			.classed("gridline", true)
			.attr("transform", "translate(0,0)")

		//This is the x axis
		this.append("g")
			.classed("x axis", true)
			.attr("transform", "translate(" + 0 + "," + height + ")")
			.call(params.axis.x)
				.selectAll("text")
					.classed("x-axis-label", true)
					.style("text-anchor", "end")
					.style("font-size","12px")
					.attr("dx", -8)
					.attr("dy", 8)
					.attr("transform", "translate(0,0) rotate(-45)");

		//This is the y axis
		this.append("g")
			.classed("y axis", true)
			.attr("transform", "translate(0,0)")
			.call(params.axis.y);

		//This is the y label
		this.select(".y.axis")
			.append("text")
			.attr("x", 0)
			.attr("y", 0)
			.style("text-anchor", "middle")
			.style("font-size","30px")
			.attr("transform", "translate(-50," + height/2 + ") rotate(-90)")
			.text("Life Expectancy in Years");

		//This is the x label
		this.select(".x.axis")
			.append("text")
			.attr("x", 20)
			.attr("y", 10)
			.style("text-anchor", "right")
			.style("font-size","30px")
			.attr("transform", "translate(" + (width-120)/2 + ",135)")
			.text("Region");

	} else if(params.initialize === false){
		//Update info
		this.selectAll("g.x.axis")
			.transition()
			.duration(500)
			.ease("bounce")
			.delay(500)
			.call(params.axis.x);
		this.selectAll(".x-axis-label")
			.style("text-anchor", "end")
			.style("font-size","12px")
			.attr("dx", -8)
			.attr("dy", 8)
			.attr("transform", "translate(0,0) rotate(-45)");
		this.selectAll("g.y.axis")
			.transition()
			.duration(500)
			.ease("bounce")
			.delay(500)
			.call(params.axis.y);
	}
}
function plot(params){
	x.domain(data.map(function(entry){
			return entry.key;
		}));
	y.domain([0, d3.max(data, function(d){
			return d.value;
		})]);

	//Draw the axes and axes labels
	drawAxis.call(this, params);

	//enter()
	this.selectAll(".bar")
		.data(params.data)
		.enter()
			.append("rect")
			.classed("bar", true)
			.on("mouseover", function(d,i){
				d3.select(this).style("fill", "yellow")
				tooltip.style("opacity", 1)
               .style("left",(d3.event.pageX)+"px")
               .style("top",(d3.event.pageY)+"px")
               .style("background","white")
               .style("width","auto")
               .style("height","auto")
               .style("padding","10px")
               .html("Average Life Expectancy of "+d.key+" is "+d.value);
						
				
			})
			
			
			
			.on("mousemove", function(d,i){

			})
			.on("mouseout", function(d,i){
				d3.select(this).style("fill", ordinalColorScale(i))
								tooltip.style("opacity", 0);
				
				
							
			
					
				   
			});

	this.selectAll(".bar-label")
		.data(params.data)
		.enter()
			.append("text")
			.classed("bar-label", true);

	//update
	this.selectAll(".bar")
		.transition()
		.attr("x", function(d,i){
			return x(d.key);
		})
		.attr("y", function(d,i){
			return y(d.value);
		})
		.attr("height", function(d,i){
			return height - y(d.value);
		})
		.attr("width", function(d){
			return x.rangeBand();
		})
		.style("fill", function(d,i){
			return ordinalColorScale(i);
		});

	this.selectAll(".bar-label")
		.transition()
		.attr("x", function(d,i){
			return x(d.key) + (x.rangeBand()/2)
		})
		.attr("dx", 0)
		.attr("y", function(d,i){
			return y(d.value);
		})
		.attr("dy", -6)
		.text(function(d){
			return d.value;
		})

	//exit()
	this.selectAll(".bar")
		.data(params.data)
		.exit()
		.remove();

	this.selectAll(".bar-label")
		.data(params.data)
		.exit()
		.remove();
		
	
		
}

sort_btn.on("click", function(){
	var self = d3.select(this);
	var ascending = function(a,b){
		return a.value - b.value;
	};
	var descending = function(a,b){
		return b.value - a.value;
	}
	var state = +self.attr("state");
	var txt = "Sort data: ";
	if(state === 0){
		data.sort(ascending);
		state = 1;
		txt += "descending";
	} else if(state === 1){
		data.sort(descending);
		state = 0;
		txt += "ascending";
	}
	self.attr("state", state);
	self.html(txt);

	plot.call(chart, {
		data: data,
		axis:{
			x: xAxis,
			y: yAxis
		},
		gridlines: yGridlines,
		initialize: false
	});
});

plot.call(chart, {
	data: data,
	axis:{
		x: xAxis,
		y: yAxis
	},
	gridlines: yGridlines,
	initialize: true
});
