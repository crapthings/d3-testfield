import _ from 'lodash'

import moment from 'moment'

import faker from 'faker'

import d3 from 'd3'

Template.container.onRendered(function () {

	let data = [15, 300, 167, 7, 9]

	let $container = d3.select(this.find('.container'))

	let xScale = d3.time.scale()
		.domain([new Date(1980, 1, 1), new Date(2017, 1, 1)])
		.range([40, 600])

	let xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.ticks(d3.time.day, 1)

	let zoom = d3.behavior.zoom()
		.x(xScale)
		.on('zoom', zoomed)

	let $svg = $container.append('svg')
		.attr('width', 640)
		.attr('height', 480)
		.style('background-color', 'skyblue')
		.call(zoom)

	let $x = $svg.append('g')
		.attr('class', 'x axis')
		.attr('width', 600)
		.attr('height', 440)
		.attr('transform', 'translate(0, 0)')
		.call(xAxis)

	function zoomed(a, b, c) {
		console.log(a, b, c)
		$svg.select(".x.axis").call(xAxis)
	}

})
